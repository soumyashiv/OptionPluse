import { useQuery } from '@tanstack/react-query';
import { marketService } from '../market.service';
import type { StrikeAnalysisResponse } from '../types';
import { getAdaptiveInterval } from '../../utils/marketHours';

export const useStrikeAnalysis = (symbol: string = 'NIFTY', strike: number) => {
  return useQuery<StrikeAnalysisResponse>({
    queryKey: ['strikeAnalysis', symbol, strike],
    queryFn: () => marketService.fetchStrikeAnalysis(symbol, strike),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: getAdaptiveInterval(1000 * 60), // Auto-refresh based on market state
    enabled: !!strike, // Don't fetch if strike is 0 or undefined
  });
};
