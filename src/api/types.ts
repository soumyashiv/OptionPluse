/**
 * Canonical TypeScript definitions — exactly mirrors nsewfapi /api/v1/* responses.
 * Single source of truth. Do NOT duplicate these in service files.
 */

// ── Primitives ───────────────────────────────────────────────────────────────

export type MarketDirection = 'bullish' | 'bearish' | 'sideways';
export type SentimentType   = 'positive' | 'negative' | 'neutral';
// Backend can return 'cache' | 'db_fallback' | 'nsepython_live' | 'nsepython'
export type ResponseSource  = 'cache' | 'db_fallback' | 'nsepython_live' | 'nsepython' | string;

// ── /api/v1/market-summary ───────────────────────────────────────────────────

export interface KeyLevel {
  price:        number;
  label:        string;
  oi_strength?: number;
}

export interface NewsItem {
  title:        string;
  source?:      string;
  published_at?: string;
  summary?:      string;
  sentiment?:   SentimentType;
  url?:         string;
}

export interface OptionChainRow {
  strike:    number;
  call_oi:   number;
  call_coi:  number;  // change in OI
  put_oi:    number;
  put_coi:   number;  // change in OI
  call_iv?:  number | null;
  put_iv?:   number | null;
  call_ltp?: number | null;
  put_ltp?:  number | null;
}

export interface MarketSummaryResponse {
  timestamp?:        string;
  fetched_at?:       string;
  index_name?:       string;
  source?:           ResponseSource;
  market_direction?: MarketDirection;
  insight?:          string;
  pcr?:              number;
  atm_strike?:       number | null;
  support?:          KeyLevel | null;
  resistance?:       KeyLevel | null;
  news_sentiment?:   SentimentType;
  top_news?:         NewsItem[];
  option_chain?:     OptionChainRow[];
}

// ── /api/v1/option-chain/{symbol} ────────────────────────────────────────────

export interface OptionChainResponse {
  symbol: string;
  data:   OptionChainRow[];
  source?: ResponseSource;
}

// ── /api/v1/news ─────────────────────────────────────────────────────────────

export interface NewsResponse {
  items: NewsItem[];
  count: number;
}

// ── /api/v1/strike/{symbol}/{strike} ─────────────────────────────────────────

export interface StrikeAnalysisRow {
  timestamp:  string;
  call_oi:    number;
  call_coi:   number;
  put_oi:     number;
  put_coi:    number;
  volatility: number;
  call_ltp?:  number;
  put_ltp?:   number;
  call_iv?:   number;
  put_iv?:    number;
}

export interface StrikeAnalysisResponse {
  symbol: string;
  strike: number;
  data:   StrikeAnalysisRow;
  source?: ResponseSource;
}
