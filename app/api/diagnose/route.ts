import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import {
  DetectionSchema,
  DIAGNOSIS_PROMPT,
  validateDetections,
  type ValidatedDetection,
} from "@/lib/diagnosisSchema";

const MODEL = "gemini-3.7-flash";
const TIMEOUT_MS = 25000;
const MAX_IMAGE_BASE64_LENGTH = 2 * 1024 * 1024; // ~1.5MB binary

const RequestSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
});

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), ms);
  });
}

function mockDetectionResponse(): { detections: ValidatedDetection[] } {
  const categories = [
    "furniture",
    "glass",
    "escape-route",
    "fall-object",
  ] as const;
  const shuffled = [...categories].sort(() => Math.random() - 0.5);
  const count = 2 + Math.floor(Math.random() * 2);
  return {
    detections: shuffled.slice(0, count).map((category) => {
      const cy = 150 + Math.random() * 700;
      const cx = 150 + Math.random() * 700;
      return {
        category,
        box_2d: [cy - 80, cx - 80, cy + 80, cx + 80],
        observation: "サンプル診断（AI未接続）",
        observationEasy: "サンプルの けっか（AIは まだ つながっていません）",
        confidence: "high",
      };
    }),
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const { imageBase64, mimeType } = parsed.data;

  if (imageBase64.length > MAX_IMAGE_BASE64_LENGTH) {
    return Response.json({ error: "image_too_large" }, { status: 413 });
  }

  if (process.env.USE_MOCK_DIAGNOSIS === "1") {
    return Response.json({
      detections: validateDetections(mockDetectionResponse()),
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "no_api_key" }, { status: 503 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await Promise.race([
      ai.models.generateContent({
        model: MODEL,
        contents: [
          { text: DIAGNOSIS_PROMPT },
          { inlineData: { data: imageBase64, mimeType } },
        ],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: z.toJSONSchema(DetectionSchema),
        },
      }),
      timeout(TIMEOUT_MS),
    ]);

    const text = response.text;
    if (!text) {
      return Response.json({ error: "empty_response" }, { status: 502 });
    }

    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      return Response.json({ error: "invalid_ai_response" }, { status: 502 });
    }

    return Response.json({ detections: validateDetections(raw) });
  } catch (error) {
    console.error("[api/diagnose] Gemini request failed:", error);
    const message = error instanceof Error ? error.message : "unknown_error";
    return Response.json(
      { error: message === "timeout" ? "timeout" : "diagnosis_failed" },
      { status: 502 }
    );
  }
}
