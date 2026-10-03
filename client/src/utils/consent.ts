import { SupportedLanguageCode } from '../types/vocab';

export const CONSENT_KEY = 'vacabbro_consent';
export const CONSENT_VERSION = '1.0';

export interface ConsentState {
  version: string;
  essential: boolean; // always true if accepted
  analytics: boolean; // if we ever add analytics
  timestamp: number; // when accepted
}

/**
 * Get current consent from localStorage
 */
export function getCookieConsent(): ConsentState | null {
  try {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // Validate structure
    if (
      parsed &&
      typeof parsed.version === 'string' &&
      typeof parsed.essential === 'boolean' &&
      typeof parsed.analytics === 'boolean' &&
      typeof parsed.timestamp === 'number'
    ) {
      return parsed;
    }
    return null;
  } catch (e) {
    console.warn('Failed to parse consent', e);
    return null;
  }
}

/**
 * Check if consent is valid and matches current version
 */
export function hasValidCookieConsent(): boolean {
  const consent = getCookieConsent();
  if (!consent) return false;
  return consent.version === CONSENT_VERSION && consent.essential;
}

/**
 * Accept consent and store it
 */
export function acceptCookieConsent(analytics: boolean = false): void {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    essential: true,
    analytics,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save consent', e);
  }
}

/**
 * Clear consent (for testing or policy changes)
 */
export function clearCookieConsent(): void {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch (e) {
    console.warn('Failed to clear consent', e);
  }
}