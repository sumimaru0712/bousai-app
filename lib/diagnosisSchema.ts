import { z } from "zod";
import type { DangerCategory } from "./types";

export const DETECTION_CATEGORIES = [
  "furniture",
  "glass",
  "escape-route",
  "fall-object",
] as const;

export const DetectionSchema = z.object({
  detections: z
    .array(
      z.object({
        category: z.enum(DETECTION_CATEGORIES),
        box_2d: z
          .array(z.number())
          .length(4)
          .describe("[ymin, xmin, ymax, xmax] normalized to 0-1000"),
        observation: z.string().describe("短い一言（漢字あり、祖父母向け）"),
        observationEasy: z.string().describe("同じ内容をひらがな中心で（孫向け）"),
        confidence: z.enum(["high", "low"]),
      })
    )
    .max(5),
});

export type Detection = z.infer<typeof DetectionSchema>["detections"][number];
export type DetectionResult = z.infer<typeof DetectionSchema>;

export interface ValidatedDetection {
  category: DangerCategory;
  box_2d: [number, number, number, number];
  observation: string;
  observationEasy: string;
  confidence: "high" | "low";
}

const MAX_DETECTIONS = 5;
const DEDUPE_CENTER_THRESHOLD = 100; // out of 1000 (~10%)
const MAX_OBSERVATION_LENGTH = 60;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readBoxCenter(box: [number, number, number, number]): {
  cy: number;
  cx: number;
} {
  const [ymin, xmin, ymax, xmax] = box;
  return { cy: (ymin + ymax) / 2, cx: (xmin + xmax) / 2 };
}

/**
 * Validates and sanitizes raw (untrusted) model output into detections we
 * can trust to render. Invalid individual items are discarded rather than
 * failing the whole batch, since the model may get a few fields wrong while
 * the rest of the response is still useful.
 */
export function validateDetections(raw: unknown): ValidatedDetection[] {
  if (!raw || typeof raw !== "object" || !("detections" in raw)) return [];
  const list = (raw as { detections: unknown }).detections;
  if (!Array.isArray(list)) return [];

  const result: ValidatedDetection[] = [];

  for (const item of list) {
    if (result.length >= MAX_DETECTIONS) break;
    if (!item || typeof item !== "object") continue;

    const { category, box_2d, observation, observationEasy, confidence } =
      item as Record<string, unknown>;

    if (
      typeof category !== "string" ||
      !DETECTION_CATEGORIES.includes(category as (typeof DETECTION_CATEGORIES)[number])
    ) {
      continue;
    }
    if (
      !Array.isArray(box_2d) ||
      box_2d.length !== 4 ||
      box_2d.some((n) => typeof n !== "number" || !Number.isFinite(n))
    ) {
      continue;
    }

    const [ymin, xmin, rawYmax, rawXmax] = (box_2d as number[]).map((n) =>
      clamp(n, 0, 1000)
    );
    const ymax = ymin >= rawYmax ? Math.min(1000, ymin + 1) : rawYmax;
    const xmax = xmin >= rawXmax ? Math.min(1000, xmin + 1) : rawXmax;
    const box: [number, number, number, number] = [ymin, xmin, ymax, xmax];

    const obs =
      typeof observation === "string" && observation.trim()
        ? observation.trim().slice(0, MAX_OBSERVATION_LENGTH)
        : "";
    const obsEasy =
      typeof observationEasy === "string" && observationEasy.trim()
        ? observationEasy.trim().slice(0, MAX_OBSERVATION_LENGTH)
        : obs;
    const conf: "high" | "low" = confidence === "low" ? "low" : "high";

    const { cy, cx } = readBoxCenter(box);
    const isDuplicate = result.some((existing) => {
      if (existing.category !== category) return false;
      const existingCenter = readBoxCenter(existing.box_2d);
      return (
        Math.abs(existingCenter.cy - cy) < DEDUPE_CENTER_THRESHOLD &&
        Math.abs(existingCenter.cx - cx) < DEDUPE_CENTER_THRESHOLD
      );
    });
    if (isDuplicate) continue;

    result.push({
      category: category as DangerCategory,
      box_2d: box,
      observation: obs,
      observationEasy: obsEasy,
      confidence: conf,
    });
  }

  return result;
}

export const DIAGNOSIS_PROMPT = `あなたは日本の住宅の地震対策アドバイザーです。
この部屋の写真から、地震のときに危険になりそうな箇所を探してください。

カテゴリは次の4つのみ：
- furniture       : 背の高い家具で、固定されているように見えないもの
- glass           : 窓・ガラス戸・食器棚のガラス
- escape-route    : 出入口や通り道をふさいでいる物
- fall-object     : 高い場所に置かれていて落ちてきそうな物

ルール：
- box_2d は [ymin, xmin, ymax, xmax] を 0-1000 に正規化した整数で返すこと
- 写真に写っていないものを推測しないこと
- 確信が持てないものは confidence を "low" にすること
- 最大5件まで。危険が見当たらなければ detections は空配列にすること
- observation は「棚の上の段ボール箱」のように、見えた物を15文字程度で書くこと
- observationEasy は同じ内容を、小学校低学年でも読めるひらがな中心の表記で書くこと
  （例：「たなの うえの だんボールばこ」）`;
