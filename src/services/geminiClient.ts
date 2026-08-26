/**
 * Gemini Client for EduPath AI
 * Supports both secure serverless proxy (/api/gemini) and direct client-side fallback.
 * Includes timeout protection, error normalization, and resilient JSON extraction.
 */

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

/**
 * Resolves active API key with priority:
 * 1. Runtime user-provided key in Settings Modal
 * 2. Environment variable VITE_GEMINI_API_KEY
 */
export function getActiveApiKey(userProvidedKey?: string): string {
  if (userProvidedKey && userProvidedKey.trim().length > 5) {
    return userProvidedKey.trim();
  }

  try {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim().length > 5) {
      return envKey.trim();
    }
  } catch (e) {
    // Environment variable not available
  }

  return '';
}

/**
 * Checks if a valid API key is currently available
 */
export function hasActiveApiKey(userProvidedKey?: string): boolean {
  return getActiveApiKey(userProvidedKey).length > 5;
}

/**
 * Executes a structured prompt against Google Gemini 1.5 Flash
 */
export async function callGemini(
  prompt: string,
  userProvidedKey?: string,
  systemInstruction?: string,
  temperature: number = 0.7,
  maxOutputTokens: number = 2048,
  timeoutMs: number = 15000
): Promise<string> {
  const apiKey = getActiveApiKey(userProvidedKey);

  // 1. If running on Vercel deployment with serverless proxy and no client key
  if (!apiKey && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    try {
      const proxyRes = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction,
          temperature,
          maxOutputTokens
        })
      });

      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        if (proxyData?.text) {
          return proxyData.text;
        }
      }
    } catch (e) {
      // Fallback to client-side
    }
  }

  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const model = import.meta.env.VITE_AI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const bodyPayload: any = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature,
      maxOutputTokens,
      topP: 0.95
    }
  };

  if (systemInstruction) {
    bodyPayload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyPayload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP error ${response.status}: ${response.statusText}`;
      console.warn('Gemini API Error:', msg);
      throw new Error(`GEMINI_API_ERROR: ${msg}`);
    }

    const data: GeminiResponse = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('EMPTY_GEMINI_RESPONSE');
    }

    return generatedText;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('GEMINI_TIMEOUT');
    }
    throw error;
  }
}

/**
 * Extracts and safely parses JSON from raw markdown or fenced response
 */
export function extractJsonFromText<T>(rawText: string): T | null {
  if (!rawText || typeof rawText !== 'string') return null;

  try {
    // 1. Direct parse attempt
    return JSON.parse(rawText.trim()) as T;
  } catch (e) {
    // 2. Extract from markdown ```json ... ``` codeblock
    const codeBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      try {
        return JSON.parse(codeBlockMatch[1].trim()) as T;
      } catch (err) {
        // Fallthrough
      }
    }

    // 3. Extract between first { and last }
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(rawText.substring(firstBrace, lastBrace + 1)) as T;
      } catch (err) {
        // Fallthrough
      }
    }

    // 4. Extract between first [ and last ]
    const firstBracket = rawText.indexOf('[');
    const lastBracket = rawText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(rawText.substring(firstBracket, lastBracket + 1)) as T;
      } catch (err) {
        // Fallthrough
      }
    }

    return null;
  }
}
