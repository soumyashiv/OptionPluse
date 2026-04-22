/**
 * errors.ts — Typed error taxonomy for OptionPluse
 *
 * 4-tier classification derived from SRD:
 *  Tier 1 - Network (transport down, timeout)
 *  Tier 2 - Server  (5xx, 503 data unavailable)
 *  Tier 3 - Auth    (401, 429 rate-limit)
 *  Tier 4 - Integrity (schema mismatch, null required field)
 */

export enum ErrorCode {
  NETWORK          = 'NETWORK',
  SERVER_ERROR     = 'SERVER_ERROR',
  DATA_UNAVAILABLE = 'DATA_UNAVAILABLE',
  UNAUTHORIZED     = 'UNAUTHORIZED',
  RATE_LIMITED     = 'RATE_LIMITED',
  SCHEMA_MISMATCH  = 'SCHEMA_MISMATCH',
  UNKNOWN          = 'UNKNOWN',
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly httpStatus?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }

  /**
   * True if the caller should retry after a backoff.
   * Auth and rate-limit errors are NOT retryable — retrying makes them worse.
   */
  get isRetryable(): boolean {
    return [ErrorCode.NETWORK, ErrorCode.SERVER_ERROR, ErrorCode.DATA_UNAVAILABLE].includes(
      this.code,
    );
  }

  /**
   * Safe user-facing message — never exposes internal detail.
   * SRD §10: "Never expose stack traces to users. Return generic errors."
   */
  get userMessage(): string {
    switch (this.code) {
      case ErrorCode.NETWORK:
        return 'No internet connection. Showing last known data.';
      case ErrorCode.SERVER_ERROR:
        return 'Service temporarily unavailable.';
      case ErrorCode.DATA_UNAVAILABLE:
        return 'Market data unavailable. Last known state shown.';
      case ErrorCode.RATE_LIMITED:
        return 'Too many requests. Please wait a moment.';
      case ErrorCode.UNAUTHORIZED:
        return 'Authentication error. Please restart the app.';
      default:
        return 'Something went wrong. Retrying automatically.';
    }
  }
}

/**
 * Type guard — is this error an AppError (optionally with a specific code)?
 * Use this in screens to distinguish AppError from raw JS errors.
 */
export function isAppError(err: unknown, code?: ErrorCode): err is AppError {
  if (!(err instanceof AppError)) return false;
  return code ? err.code === code : true;
}

/**
 * Extract a safe user message from any thrown value.
 * Screens should call this instead of `error.message` directly.
 */
export function getUserMessage(err: unknown): string {
  if (isAppError(err)) return err.userMessage;
  return 'Something went wrong.';
}
