import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY || '';
const CEREBRAS_MODEL =
  process.env.CEREBRAS_READING_MODEL || 'gpt-oss-120b';

const GROQ_READING_API_KEY =
  process.env.GROQ_READING_API_KEY || '';

const GROQ_READING_MODEL =
  process.env.GROQ_READING_MODEL || 'openai/gpt-oss-120b';

type ChatParams = {
  system: string;
  user: string;
  temperature?: number;
};

type ChatMessage = {
  role: 'system' | 'user';
  content: string;
};

async function requestJSON(
  url: string,
  apiKey: string,
  model: string,
  params: ChatParams
): Promise<any> {
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

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: params.temperature ?? 0,
      response_format: {
        type: 'json_object'
      }
    })
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(
      `AI request failed (${response.status}): ${rawText.slice(0, 500)}`
    );
  }

  let payload: any;

  try {
    payload = JSON.parse(rawText);
  } catch {
    throw new Error('AI provider returned invalid JSON response.');
  }

  const content =
    payload?.choices?.[0]?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error(
      'AI provider returned an empty response.'
    );
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error(
      'AI provider returned content that is not valid JSON.'
    );
  }
}

export function hasCerebrasReadingKey(): boolean {
  return Boolean(CEREBRAS_API_KEY);
}

export function hasGroqReadingKey(): boolean {
  return Boolean(GROQ_READING_API_KEY);
}

export async function cerebrasReadingChatJSON(
  params: ChatParams
): Promise<any> {
  if (!CEREBRAS_API_KEY) {
    throw new Error('Cerebras Reading API key is not configured.');
  }

  return requestJSON(
    'https://api.cerebras.ai/v1/chat/completions',
    CEREBRAS_API_KEY,
    CEREBRAS_MODEL,
    params
  );
}

export async function groqReadingChatJSON(
  params: ChatParams
): Promise<any> {
  if (!GROQ_READING_API_KEY) {
    throw new Error('Groq Reading API key is not configured.');
  }

  return requestJSON(
    'https://api.groq.com/openai/v1/chat/completions',
    GROQ_READING_API_KEY,
    GROQ_READING_MODEL,
    params
  );
}

export async function runReadingAI(
  params: ChatParams
): Promise<any> {
  if (CEREBRAS_API_KEY) {
    try {
      logger.info('Reading AI: trying Cerebras.');

      return await cerebrasReadingChatJSON(params);
    } catch (error) {
      logger.warn(
        'Cerebras Reading failed. Trying Groq fallback.',
        {
          error:
            error instanceof Error
              ? error.message
              : String(error)
        }
      );
    }
  }

  if (GROQ_READING_API_KEY) {
    logger.info('Reading AI: using Groq fallback.');

    return await groqReadingChatJSON(params);
  }

  throw new Error(
    'No Reading AI provider is configured.'
  );
}