import { useQuery } from '@tanstack/react-query';
import { marketService } from '../market.service';
import type { OptionChainResponse } from '../types';
import { getAdaptiveInterval } from '../../utils/marketHours';

export const useOptionChain = (symbol: string = 'NIFTY') => {
  return useQuery<OptionChainResponse>({
    queryKey: ['optionChain', symbol],
    queryFn: () => marketService.fetchOptionChain(symbol),
    // Realtime refresh — 30s during market, 5min outside
    refetchInterval: getAdaptiveInterval(30_000),
    staleTime: 5000,
    placeholderData: (prev) => prev,
  });
};
