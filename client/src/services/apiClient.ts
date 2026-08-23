 const API_BASE =
  import.meta.env.VITE_API_BASE?.toString().trim() ||
  'https://thepremium-production.up.railway.app';

type ApiErrorDetails = {
  status: number;
  message: string;
};

export class ApiError extends Error {
  status: number;
  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = 'ApiError';
    this.status = details.status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const { timeoutMs = 20000, ...rest } = options;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(rest.headers || {})
      },
      signal: controller.signal
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '');

    if (!res.ok) {
      const message =
        (body && typeof body === 'object' && 'error' in body && (body as any).error) ||
        (body && typeof body === 'object' && 'message' in body && (body as any).message) ||
        `Request failed (${res.status})`;
      throw new ApiError({ status: res.status, message: String(message) });
    }

    return body as T;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('The request timed out. Please try again.');
    }
    throw err;
  } finally {
    window.clearTimeout(timer);
  }
}
