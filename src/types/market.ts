// ─── Market / Trading Types ───────────────────────────────────────────────

export type Sentiment = 'BULLISH' | 'BEARISH' | 'SIDEWAYS';

export interface MarketLevel {
  price: number;
  label: string;
}

export interface MarketStat {
  key: string;
  label: string;
  value: string;
  barWidth?: number; // 0–1
  barColor?: 'primary' | 'secondary';
}

export interface ExecutionInsight {
  title: string;
  body: string;
}

export interface VolumeDeltaBar {
  strike: number;
  callOI: number; // 0–100 relative height units
  putOI: number;
}

export interface MarketOverview {
  sentiment: Sentiment;
  intradayChangePercent: number;
  vix: number;
  resistance: MarketLevel;
  support: MarketLevel;
  insights: ExecutionInsight[];
  volumeDelta: VolumeDeltaBar[];
  stats: MarketStat[];
}

// ─── Option Chain Types ────────────────────────────────────────────────────

export interface OptionChainRow {
  strike: number;
  callOI: number;
  callOIChange: number;
  putOI: number;
  putOIChange: number;
  isHighlighted?: boolean;
  highlightSide?: 'call' | 'put';
}

export interface ExpiryFilter {
  label: string;
  value: string;
  isActive: boolean;
}

export interface OptionChainData {
  index: string;
  expiry: string;
  atmStrike: number;
  rows: OptionChainRow[];
}

// ─── Strike Analysis Types ─────────────────────────────────────────────────

export interface StrikeAnalysis {
  strike: number;
  callOI: number;
  putOI: number;
  callOIChange: number;
  putOIChange: number;
  ivCall: number;
  ivPut: number;
  deltaCall: number;
  deltaPut: number;
  signal: Sentiment;
  summary: string;
}


