// ─── News / Sentiment Types ───────────────────────────────────────────────

export type SentimentTag = 'positive' | 'negative' | 'neutral';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string; // ISO string
  sentiment: SentimentTag;
  summary: string;
  url?: string;
  relatedIndex?: string; // e.g. 'NIFTY', 'BANKNIFTY'
}

export type SentimentFilter = 'all' | SentimentTag;

export interface SentimentFilterOption {
  label: string;
  value: SentimentFilter;
}
