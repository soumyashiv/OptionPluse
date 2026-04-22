import { useQuery } from '@tanstack/react-query';
import { marketService } from '../market.service';
import type { MarketSummaryResponse } from '../types';
import { getAdaptiveInterval } from '../../utils/marketHours';
import { useMarket } from '../../context/MarketContext';

export const useMarketSummary = (index: string = 'NIFTY') => {
  const { isLive } = useMarket();

  return useQuery<MarketSummaryResponse>({
    queryKey: ['marketSummary', index],
    queryFn: () => marketService.fetchMarketSummary(index),
    // Disable REST polling if WebSocket is live
    refetchInterval: isLive ? false : getAdaptiveInterval(30_000),
    // Data is fresh for 5s, reducing redundant hits on screen focus/tab switch
    staleTime: 5000,
    //Override global defaults: retry 2× so transient network blips self-heal
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15_000),
    // Keep stale data visible while refetching in background
    placeholderData: (prev) => prev,
  });
};
