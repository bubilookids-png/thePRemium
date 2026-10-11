import { load, BotDetectionResult, BotKind } from '@fingerprintjs/botd';

export type BotDetectorInstance = Awaited<ReturnType<typeof load>>;

export interface BotCheckResult {
  bot: boolean;
  botKind?: BotKind | string;
  error?: string;
  timestamp: number;
}

/**
 * Cached detector promise to ensure BotD is only initialized once per page session.
 * We pass monitoring: false to prevent unpersonalized AJAX installation stats.
 */
let detectorPromise: Promise<BotDetectorInstance> | null = null;

/**
 * Initializes and retrieves the singleton BotDetector instance.
 * If initialization fails, the memoized promise is cleared so subsequent
 * calls can re-attempt initialization if appropriate.
 */
export function getBotDetector(): Promise<BotDetectorInstance> {
  if (!detectorPromise) {
    detectorPromise = load({ monitoring: false }).catch((err) => {
      // Clear cache on failure to allow retry on transient network/load errors
      detectorPromise = null;
      throw err;
    });
  }
  return detectorPromise;
}

/**
 * Runs client-side bot detection using FingerprintJS BotD.
 * 
 * Production considerations & Graceful Degradation:
 * - If BotD succeeds and detects automation/headless browser, returns { bot: true, botKind }.
 * - If BotD succeeds and detects a human, returns { bot: false }.
 * - If BotD fails, throws an error, or is blocked by an ad-blocker/privacy extension,
 *   it logs a warning and returns { bot: false, error: ... } rather than rejecting.
 *   This ensures legitimate users are never locked out of the service due to client-side detection failure.
 */
export async function detectBot(): Promise<BotCheckResult> {
  try {
    const detector = await getBotDetector();
    const result: BotDetectionResult = detector.detect();

    if (result.bot) {
      return {
        bot: true,
        botKind: result.botKind,
        timestamp: Date.now()
      };
    }

    return {
      bot: false,
      timestamp: Date.now()
    };
  } catch (error: any) {
    console.warn('[BotD] Client-side bot detection encountered an error; gracefully falling back to human:', error);
    return {
      bot: false,
      error: error?.message || 'Detection failed',
      timestamp: Date.now()
    };
  }
}
