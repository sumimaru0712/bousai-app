import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import {
  DetectionSchema,
  DIAGNOSIS_PROMPT,
  validateDetections,
  type ValidatedDetection,
} from "@/lib/diagnosisSchema";

// gemini-3.7-flash is the preferred model, but as a newly released model it
// occasionally returns 503 "high demand" errors. Retry it a couple of times,
// then fall back to the more established gemini-2.5-flash so a live demo
// doesn't stall on a transient Gemini outage.
const PRIMARY_MODEL = "gemini-3.7-flash";
const FALLBACK_MODEL = "gemini-3.6-flash";
const ATTEMPTS_PER_MODEL = 2;
const ATTEMPT_TIMEOUT_MS = 12000;
const RETRY_DELAY_MS = 1000;
const MAX_IMAGE_BASE64_LENGTH = 2 * 1024 * 1024; // ~1.5MB binary

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

const RequestSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
});

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), ms);
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error: unknown): boolean {
  if (error instanceof Error && error.message === "timeout") return true;
  const status = (error as { status?: unknown } | undefined)?.status;
  return typeof status === "number" && RETRYABLE_STATUS_CODES.has(status);
}

async function callModel(
  ai: GoogleGenAI,
  model: string,
  imageBase64: string,
  mimeType: string
) {
  return Promise.race([
    ai.models.generateContent({
      model,
      contents: [
        { text: DIAGNOSIS_PROMPT },
        { inlineData: { data: imageBase64, mimeType } },
      ],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(DetectionSchema),
      },
    }),
    timeout(ATTEMPT_TIMEOUT_MS),
  ]);
}

async function generateWithFallback(
  ai: GoogleGenAI,
  imageBase64: string,
  mimeType: string
) {
  let lastError: unknown;

  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
      try {
        return await callModel(ai, model, imageBase64, mimeType);
      } catch (error) {
        lastError = error;
        console.error(
          `[api/diagnose] ${model} attempt ${attempt} failed:`,
          error
        );
        if (!isRetryable(error)) {
          throw error;
        }
        if (attempt < ATTEMPTS_PER_MODEL) {
          await sleep(RETRY_DELAY_MS);
        }
      }
    }
  }

  throw lastError;
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
    const response = await generateWithFallback(ai, imageBase64, mimeType);

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
