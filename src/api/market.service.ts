import { z } from 'zod';
import { apiClient } from './client';
import type {
  MarketSummaryResponse,
  OptionChainResponse,
  NewsResponse,
  StrikeAnalysisResponse,
} from './types';

// ── Zod Schemas ─────────────────────────────────────────────────────────────

const KeyLevelSchema = z.object({
  price: z.number(),
  label: z.string().optional().default(''),
  oi_strength: z.number().optional().default(0),
}).nullable().optional();

const NewsItemSchema = z.object({
  title: z.string().catch('No Title'),
  source: z.string().nullable().optional().catch('SYS'),
  published_at: z.string().nullable().optional().catch(''),
  summary: z.string().nullable().optional().catch(''),
  sentiment: z.enum(['positive', 'negative', 'neutral']).nullable().optional().catch('neutral'),
  url: z.string().nullable().optional().catch(''),
});

const OptionChainRowSchema = z.object({
  strike: z.number().catch(0),
  call_oi: z.number().nullable().optional().transform(v => v ?? 0),
  call_coi: z.number().nullable().optional().transform(v => v ?? 0),
  put_oi: z.number().nullable().optional().transform(v => v ?? 0),
  put_coi: z.number().nullable().optional().transform(v => v ?? 0),
  call_iv: z.number().nullable().optional().catch(null),
  put_iv: z.number().nullable().optional().catch(null),
  call_ltp: z.number().nullable().optional().catch(null),
  put_ltp: z.number().nullable().optional().catch(null),
});

const MarketSummarySchema = z.object({
  timestamp: z.string().optional().default(''),
  fetched_at: z.string().optional().default(''),
  index_name: z.string().optional().default('NIFTY'),
  source: z.string().optional().default('unknown'),
  market_direction: z.enum(['bullish', 'bearish', 'sideways']).optional().default('sideways'),
  insight: z.string().optional().default('Waiting for market insight...'),
  pcr: z.number().optional().default(1),
  atm_strike: z.number().nullable().optional().default(null),
  support: KeyLevelSchema,
  resistance: KeyLevelSchema,
  news_sentiment: z.enum(['positive', 'negative', 'neutral']).optional().default('neutral'),
  top_news: z.array(NewsItemSchema).optional().default([]),
  option_chain: z.array(OptionChainRowSchema).optional().default([]),
});

// ── Service ──────────────────────────────────────────────────────────────────

function validateOrFallback<T>(schema: z.ZodType<T>, raw: unknown, endpoint: string): T {
  let parsedRaw = raw;
  if (typeof raw === 'string') {
    try {
      parsedRaw = JSON.parse(raw);
    } catch (e) {
      console.warn(`[marketService] Failed to parse string payload on ${endpoint}`);
    }
  }

  const result = schema.safeParse(parsedRaw);
  if (result.success) {
    return result.data;
  }

  console.warn(`[marketService] Payload normalization warning on ${endpoint}. Falling back to safe defaults.`, result.error.issues);
  // Return a completely safe empty state matching the schema
  return schema.parse({}) as T;
}

const FullOptionChainSchema = z.object({
  symbol: z.string().default('NIFTY'),
  data: z.array(OptionChainRowSchema).default([]),
  source: z.string().optional().default('unknown'),
});

const FullNewsSchema = z.object({
  items: z.array(NewsItemSchema).default([]),
  count: z.number().default(0),
});



const FullStrikeAnalysisSchema = z.object({
  symbol: z.string().default('NIFTY'),
  strike: z.number().default(0),
  data: z.any().nullable().default(null),
  source: z.string().optional().default('unknown'),
});

export const marketService = {
  fetchMarketSummary: async (index: string = 'NIFTY'): Promise<MarketSummaryResponse> => {
    try {
      const { data } = await apiClient.get<MarketSummaryResponse>('/market-summary', {
        params: { index },
      });
      return validateOrFallback(MarketSummarySchema, data, '/market-summary') as unknown as MarketSummaryResponse;
    } catch (e: any) {
      console.warn("API Fetch Failed:", e.message);
      throw e;
    }
  },

  fetchOptionChain: async (symbol: string = 'NIFTY'): Promise<OptionChainResponse> => {
    const { data } = await apiClient.get<OptionChainResponse>(`/option-chain/${symbol}`);
    return validateOrFallback(FullOptionChainSchema, data, `/option-chain/${symbol}`) as unknown as OptionChainResponse;
  },

  fetchNews: async (sentiment?: string, limit: number = 20): Promise<NewsResponse> => {
    const { data } = await apiClient.get<NewsResponse>('/news', {
      params: { sentiment, limit },
    });
    return validateOrFallback(FullNewsSchema, data, '/news') as unknown as NewsResponse;
  },



  fetchStrikeAnalysis: async (
    symbol: string = 'NIFTY',
    strike: number,
  ): Promise<StrikeAnalysisResponse> => {
    const { data } = await apiClient.get<StrikeAnalysisResponse>(`/strike/${symbol}/${strike}`);
    return validateOrFallback(FullStrikeAnalysisSchema, data, `/strike/${symbol}/${strike}`) as unknown as StrikeAnalysisResponse;
  },
};
