import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

type ChatParams = {
  system: string;
  user: string;
  temperature?: number;
};

type GroqChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export function hasGroqKey(): boolean {
  return Boolean(GROQ_API_KEY);
}

export function hasGeminiKey(): boolean {
  return Boolean(GEMINI_API_KEY);
}

/**
 * Main AI function.
 *
 * Priority:
 * 1. Gemini
 * 2. Groq fallback if Gemini fails
 *
 * analyzeService.ts does not need to change.
 */
export async function groqChatJSON(params: ChatParams): Promise<any> {
  // Gemini is the primary provider.
  if (GEMINI_API_KEY) {
    try {
      return await geminiChatJSON(params);
    } catch (error) {
      logger.warn('Gemini failed, switching to Groq fallback.', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Groq is the fallback provider.
  if (GROQ_API_KEY) {
    return await groqChatJSONInternal(params);
  }

  throw new Error(
    'No AI API key is configured. Please configure GEMINI_API_KEY or GROQ_API_KEY.'
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
 * Groq fallback API
 */
async function groqChatJSONInternal(params: ChatParams): Promise<any> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured.');
  }

  const messages: GroqChatMessage[] = [
    {
      role: 'system',
      content: params.system
    },
    {
      role: 'user',
      content: params.user
    }
  ];

  const res = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: params.temperature ?? 0.3,
        response_format: {
          type: 'json_object'
        }
      })
    }
  );

  const raw = await res.text();

  if (!res.ok) {
    logger.error('Groq API error', {
      status: res.status,
      raw
    });

    throw new Error(`AI request failed (${res.status}).`);
  }

  let data: any;

  try {
    data = JSON.parse(raw);
  } catch {
    logger.error('Non-JSON response from Groq', { raw });
    throw new Error('AI returned an invalid response.');
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    logger.error('Missing content in Groq response', data);
    throw new Error('AI returned an unexpected response.');
  }

  try {
    return JSON.parse(content);
  } catch {
    logger.error('Assistant content was not JSON', {
      content
    });

    throw new Error('AI did not return valid JSON.');
  }
}