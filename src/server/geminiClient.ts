import { GoogleGenAI } from '@google/genai';

// Singleton lazy client
let geminiClientInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClientInstance && process.env.GEMINI_API_KEY) {
    geminiClientInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClientInstance;
}

export interface ResilientGenerateOptions {
  contents: string | any;
  config?: any;
  preferredModel?: string;
  maxRetriesPerModel?: number;
  initialBackoffMs?: number;
}

const FALLBACK_MODEL_CHAIN = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
];

function isTransientError(error: any): boolean {
  if (!error) return false;
  const status = error.status || error.code || error.statusCode;
  const msg = String(error.message || error.toString() || '').toLowerCase();

  // Check HTTP 503, 429, 500, or UNAVAILABLE / RESOURCE_EXHAUSTED messages
  if (status === 503 || status === 'UNAVAILABLE' || status === 429 || status === 'RESOURCE_EXHAUSTED') {
    return true;
  }
  if (
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('overloaded') ||
    msg.includes('rate limit') ||
    msg.includes('resource_exhausted') ||
    msg.includes('temporarily unavailable')
  ) {
    return true;
  }
  return false;
}

/**
 * Execute Gemini generateContent with exponential backoff and automatic model fallback
 * across allowed production models (gemini-3.8-flash -> gemini-flash-latest -> gemini-3.1-flash-lite).
 */
export async function generateContentWithResilience(
  options: ResilientGenerateOptions
): Promise<{ text: string; modelUsed: string } | null> {
  const client = getGeminiClient();
  if (!client || !process.env.GEMINI_API_KEY) {
    return null;
  }

  const primaryModel = options.preferredModel || 'gemini-3.8-flash';
  const modelsToTry = [
    primaryModel,
    ...FALLBACK_MODEL_CHAIN.filter((m) => m !== primaryModel),
  ];

  const maxRetries = options.maxRetriesPerModel ?? 2;
  const initialBackoff = options.initialBackoffMs ?? 400;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        });

        const text = response.text || '';
        if (text) {
          return { text, modelUsed: model };
        }
      } catch (err: any) {
        const isTransient = isTransientError(err);
        if (isTransient && attempt < maxRetries) {
          const delay = initialBackoff * Math.pow(2, attempt) + Math.random() * 200;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        // If non-transient or retries exhausted for this model, break and try next fallback model
        break;
      }
    }
  }

  return null;
}

/**
 * Execute Gemini streaming with model fallback
 */
export async function generateContentStreamWithResilience(
  options: ResilientGenerateOptions
): Promise<{ stream: any; modelUsed: string } | null> {
  const client = getGeminiClient();
  if (!client || !process.env.GEMINI_API_KEY) {
    return null;
  }

  const primaryModel = options.preferredModel || 'gemini-3.8-flash';
  const modelsToTry = [
    primaryModel,
    ...FALLBACK_MODEL_CHAIN.filter((m) => m !== primaryModel),
  ];

  for (const model of modelsToTry) {
    try {
      const stream = await client.models.generateContentStream({
        model,
        contents: options.contents,
        config: options.config,
      });
      return { stream, modelUsed: model };
    } catch (err: any) {
      // If failed, try next model in chain
      continue;
    }
  }

  return null;
}
