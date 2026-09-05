import { apiFetch } from './apiClient';

import type {
  ReadingResponse,
  ReadingSubmitResponse,
  ReadingAnswer
} from '../types/reading';

type CreateReadingParams = {
  title?: string;
  passage: string;
  questions: string;
};

export async function createReading(
  params: CreateReadingParams
): Promise<ReadingResponse> {
  return apiFetch<ReadingResponse>(
    '/api/reading/create',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }
  );
}

type SubmitReadingParams = {
  title?: string;
  passage: string;
  groups: ReadingResponse['groups'];
  answers: ReadingAnswer[];
};

export async function submitReading(
  params: SubmitReadingParams
): Promise<ReadingSubmitResponse> {
  return apiFetch<ReadingSubmitResponse>(
    '/api/reading/submit',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
      timeoutMs: 120000
    }
  );
}