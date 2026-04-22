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
// ── Constants & Fallbacks ────────────────────────────────────────────────────

const PROD_API_URL = 'https://optionpluse.in/api/v1';
const PROD_API_KEY = 'OptionPluseSecretKey123';

/**
 * Robustly resolve the API Base URL.
 * Priority: 
 * 1. Expo config (extra.apiBaseUrl) - Injected during EAS build from app.json
 * 2. .env (EXPO_PUBLIC_API_URL) - Local development
 * 3. Hardcoded fallback - Production IP
 */
const resolveBaseUrl = (): string => {
  const url = Constants.expoConfig?.extra?.apiBaseUrl ||
              process.env.EXPO_PUBLIC_API_URL ||
              PROD_API_URL;
  
  // Ensure we have a trailing slash for consistent joining
  return url.endsWith('/') ? url : `${url}/`;
};

/**
 * Robustly resolve the API Key.
 */
const resolveApiKey = (): string => {
  return Constants.expoConfig?.extra?.apiKey ||
         process.env.EXPO_PUBLIC_API_KEY ||
         PROD_API_KEY;
};

const BASE_URL = resolveBaseUrl();
const API_KEY  = resolveApiKey();

console.log('[apiClient] BASE_URL:', BASE_URL);

// ── Factory (testable) ──────────────────────────────────────────────────────
export function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 15_000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
    },
  });

  // ── Request interceptor: inject Supabase Bearer token or API key ─────────
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Diagnostic logging in development
      if (__DEV__) {
        console.log(`[apiClient] Call: ${config.method?.toUpperCase()} ${config.url}`);
      }

      // Ensure request URL doesn't have a leading slash if baseURL already ends with one
      if (config.baseURL?.endsWith('/') && config.url?.startsWith('/')) {
        config.url = config.url.substring(1);
      } else if (!config.baseURL?.endsWith('/') && !config.url?.startsWith('/')) {
        // Ensure there is at least one slash between baseURL and url
        config.url = '/' + config.url;
      }

      try {
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        if (token && token.startsWith('eyJ')) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Silent fail
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
      
      // Network error (no response at all — server down, wrong IP, SSL/Cleartext block, etc.)
      if (!err.response) {
        const errorDetail = err.code ? `${err.message} (${err.code})` : err.message;
        console.error(`[API Network Error] ${method} ${url}: Server unreachable. Details: ${errorDetail}`);
        throw new AppError(
          ErrorCode.SERVER_ERROR,
          `Cannot reach API at ${BASE_URL}. Reason: ${errorDetail}. Check server status.`,
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
