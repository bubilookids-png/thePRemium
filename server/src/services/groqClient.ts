import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// Additional fallback providers
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY || '';
const CEREBRAS_MODEL =
  process.env.CEREBRAS_READING_MODEL || 'gpt-oss-120b';

const GROQ_READING_API_KEY = process.env.GROQ_READING_API_KEY || '';
const GROQ_READING_MODEL =
  process.env.GROQ_READING_MODEL || 'openai/gpt-oss-120b';

type ChatParams = {
  system: string;
  user: string;
  temperature?: number;
};

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export function hasGroqKey(): boolean {
  return Boolean(
    GROQ_API_KEY ||
      CEREBRAS_API_KEY ||
      GROQ_READING_API_KEY
  );
}

export function hasGeminiKey(): boolean {
  return Boolean(GEMINI_API_KEY);
}

/**
 * Main AI function.
 *
 * Priority:
 * 1. Gemini
 * 2. Existing Groq
 * 3. Cerebras
 * 4. Additional Groq key
 *
 * If every provider fails, analyzeService.ts
 * falls back to mockAnalyze().
 */
export async function groqChatJSON(params: ChatParams): Promise<any> {
  // ---------------------------------------------------------
  // 1. GEMINI — PRIMARY
  // ---------------------------------------------------------
  if (GEMINI_API_KEY) {
    try {
      logger.info('Trying Gemini provider.');
      return await geminiChatJSON(params);
    } catch (error) {
      logger.warn('Gemini failed, switching to existing Groq.', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // ---------------------------------------------------------
  // 2. EXISTING GROQ — FIRST FALLBACK
  // ---------------------------------------------------------
  if (GROQ_API_KEY) {
    try {
      logger.info('Trying existing Groq provider.');
      return await groqChatJSONInternal(
        params,
        GROQ_API_KEY,
        GROQ_MODEL,
        'Groq'
      );
    } catch (error) {
      logger.warn('Existing Groq failed, switching to Cerebras.', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // ---------------------------------------------------------
  // 3. CEREBRAS — SECOND FALLBACK
  // ---------------------------------------------------------
  if (CEREBRAS_API_KEY) {
    try {
      logger.info('Trying Cerebras provider.');
      return await openAICompatibleChatJSON(
        params,
        CEREBRAS_API_KEY,
        CEREBRAS_MODEL,
        'https://api.cerebras.ai/v1/chat/completions',
        'Cerebras'
      );
    } catch (error) {
      logger.warn('Cerebras failed, switching to additional Groq.', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // ---------------------------------------------------------
  // 4. SECOND GROQ KEY — THIRD FALLBACK
  // ---------------------------------------------------------
  if (GROQ_READING_API_KEY) {
    try {
      logger.info('Trying additional Groq provider.');
      return await groqChatJSONInternal(
        params,
        GROQ_READING_API_KEY,
        GROQ_READING_MODEL,
        'Groq secondary'
      );
    } catch (error) {
      logger.warn('Additional Groq failed. All AI providers failed.', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  throw new Error(
    'All AI providers failed or no AI API key is configured.'
  );
}

/**
 * Gemini API
 */
async function geminiChatJSON(params: ChatParams): Promise<any> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const prompt = [
    'SYSTEM INSTRUCTIONS:',
    params.system,
    '',
    'USER INPUT:',
    params.user
  ].join('\n');

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: params.temperature ?? 0.3,
        responseMimeType: 'application/json'
      }
    })
  });

  const raw = await res.text();

  if (!res.ok) {
    logger.error('Gemini API error', {
      status: res.status,
      raw
    });

    throw new Error(`Gemini request failed (${res.status}).`);
  }

  let data: any;

  try {
    data = JSON.parse(raw);
  } catch {
    logger.error('Invalid HTTP JSON response from Gemini', { raw });
    throw new Error('Gemini returned an invalid response.');
  }

  const content =
    data?.candidates?.[0]?.content?.parts
      ?.map((part: any) => part?.text)
      .filter(Boolean)
      .join('');

  if (!content || typeof content !== 'string') {
    logger.error('Missing content in Gemini response', data);
    throw new Error('Gemini returned an unexpected response.');
  }

  try {
    return JSON.parse(content);
  } catch {
    logger.error('Gemini content was not valid JSON', {
      content
    });

    throw new Error('Gemini did not return valid JSON.');
  }
}

/**
 * Groq API
 *
 * Used for both:
 * - GROQ_API_KEY
 * - GROQ_READING_API_KEY
 */
async function groqChatJSONInternal(
  params: ChatParams,
  apiKey: string,
  model: string,
  providerName: string
): Promise<any> {
  if (!apiKey) {
    throw new Error(`${providerName} API key is not configured.`);
  }

  return openAICompatibleChatJSON(
    params,
    apiKey,
    model,
    'https://api.groq.com/openai/v1/chat/completions',
    providerName
  );
}

/**
 * OpenAI-compatible chat completion API.
 *
 * Used by:
 * - Groq
 * - Cerebras
 */
async function openAICompatibleChatJSON(
  params: ChatParams,
  apiKey: string,
  model: string,
  endpoint: string,
  providerName: string
): Promise<any> {
  if (!apiKey) {
    throw new Error(`${providerName} API key is not configured.`);
  }

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: params.system
    },
    {
      role: 'user',
      content: params.user
    }
  ];

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: params.temperature ?? 0.3,
      response_format: {
        type: 'json_object'
      }
    })
  });

  const raw = await res.text();

  if (!res.ok) {
    logger.error(`${providerName} API error`, {
      status: res.status,
      raw
    });

    throw new Error(
      `${providerName} request failed (${res.status}).`
    );
  }

  let data: any;

  try {
    data = JSON.parse(raw);
  } catch {
    logger.error(`Non-JSON HTTP response from ${providerName}`, {
      raw
    });

    throw new Error(
      `${providerName} returned an invalid response.`
    );
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    logger.error(`Missing content in ${providerName} response`, data);

    throw new Error(
      `${providerName} returned an unexpected response.`
    );
  }

  try {
    return JSON.parse(content);
  } catch {
    logger.error(`Assistant content from ${providerName} was not JSON`, {
      content
    });

    throw new Error(
      `${providerName} did not return valid JSON.`
    );
  }
}