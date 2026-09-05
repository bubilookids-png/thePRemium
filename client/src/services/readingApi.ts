import { apiFetch } from './apiClient';
import type { ReadingResponse } from '../types/reading';

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