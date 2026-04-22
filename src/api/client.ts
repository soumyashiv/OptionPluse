import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { AppError, ErrorCode } from './errors';
import { supabase } from '../lib/supabase';

/**
 * Resolve the API base URL.
 * Priority:
 *   1. Expo config extra.apiBaseUrl  (set via app.json / eas.json)
 *   2. EXPO_PUBLIC_API_URL           (set in .env — preferred for dev)
 *   3. Production server fallback (guarantees the app always reaches backend)
 */
// ── Production server — always works as last-resort fallback ──────────────
const PROD_API_URL = 'http://65.0.29.22/api/v1';
const PROD_API_KEY = 'OptionPluseSecretKey123';

const BASE_URL: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_API_URL ??
  PROD_API_URL;

const API_KEY: string =
  (Constants.expoConfig?.extra?.apiKey as string | undefined) ??
  process.env.EXPO_PUBLIC_API_KEY ??
  PROD_API_KEY;

// ── Debug: log resolved URL so you can verify in Metro console ────────────
console.log('[apiClient] BASE_URL resolved to:', BASE_URL);

// ── Factory (testable) ──────────────────────────────────────────────────────
export function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10_000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // SG-2: x-api-key is the primary auth for the mobile app.
      // This satisfies the auth gate on all /api/* routes.
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
    },
  });

  // ── Request interceptor: inject Supabase Bearer token or API key ─────────
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Fix Axios path resolution that removes "/api/v1" if a path starts with "/"
      if (config.baseURL && !config.baseURL.endsWith('/')) {
        config.baseURL += '/';
      }
      if (config.url && config.url.startsWith('/')) {
        config.url = config.url.substring(1);
      }

      try {
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        // Only forward REAL Supabase JWTs (they start with 'eyJ').
        // Skip dummy dev tokens like 'guest-token' to avoid 401s on the backend.
        if (token && token.startsWith('eyJ')) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Supabase unavailable during cold start — fall through
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // ── Response interceptor: normalise errors ───────────────────────────────
  instance.interceptors.response.use(
    (res: AxiosResponse) => {
      // React Native Axios adapter sometimes returns unparsed string data (e.g. gzip issues)
      if (typeof res.data === 'string') {
        try {
          res.data = JSON.parse(res.data);
        } catch (e) {
          console.warn('[apiClient] Failed to parse string response data as JSON');
        }
      }
      return res;
    },
    (err: AxiosError) => {
      // Create context for logging
      const method = err.config?.method?.toUpperCase() || 'UNKNOWN';
      const url = err.config?.url || 'UNKNOWN_URL';
      
      // Network error (no response at all — server down, wrong IP, etc.)
      if (!err.response) {
        console.error(`[API Network Error] ${method} ${url}: Server unreachable. Details: ${err.message}`);
        throw new AppError(
          ErrorCode.SERVER_ERROR,
          `Cannot reach API at ${BASE_URL}. Check backend is running and EXPO_PUBLIC_API_URL in .env.`,
          0,
        );
      }

      const status = err.response.status;
      const detail = (err.response.data as any)?.detail ?? err.message;

      // Log specific failure modes with context
      console.warn(`[API Failure Mode] ${status} on ${method} ${url}: ${detail}`);

      if (status >= 500) {
        throw new AppError(ErrorCode.SERVER_ERROR, 'Service temporarily unavailable', status);
      }
      if (status === 401) {
        throw new AppError(ErrorCode.UNAUTHORIZED, 'Authentication required', 401);
      }
      if (status === 429) {
        throw new AppError(ErrorCode.RATE_LIMITED, 'Too many requests', 429);
      }
      if (status === 503) {
        throw new AppError(ErrorCode.DATA_UNAVAILABLE, detail, 503);
      }
      throw new AppError(ErrorCode.UNKNOWN, detail ?? 'Request failed', status);
    },
  );

  return instance;
}

export const apiClient = createApiClient();
