import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export interface UserSessionPayload {
  telegram_id: number;
  first_name: string;
  username?: string | null;
  is_admin: boolean;
  is_premium: boolean;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: UserSessionPayload;
}

// Secret key for HMAC-SHA256 signature
const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.TELEGRAM_BOT_TOKEN ||
  'univebooster_secure_jwt_secret_2026_default';

/**
 * Generate a cryptographically signed HMAC-SHA256 JWT token.
 * Token expires in 30 days.
 */
export function generateAuthToken(payload: Omit<UserSessionPayload, 'exp'>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

/**
 * Verify HMAC-SHA256 JWT signature using constant-time comparison (prevents timing attacks).
 */
export function verifyAuthToken(token: string): UserSessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.trim().split('.');
  if (parts.length !== 3) return null;

  const header = parts[0];
  const body = parts[1];
  const signature = parts[2];

  if (!header || !body || !signature) return null;

  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as UserSessionPayload;
    if (data.exp && Date.now() > data.exp) {
      return null; // Expired
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Express middleware requiring a valid Bearer token.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in.'
    });
  }

  const token = authHeader.slice(7).trim();
  const user = verifyAuthToken(token);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session token. Please sign in again.'
    });
  }

  req.user = user;
  next();
}

/**
 * Express middleware that attaches user if a valid Bearer token is provided,
 * but allows the request to continue if no token is provided.
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    const user = verifyAuthToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}
