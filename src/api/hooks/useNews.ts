import { useQuery } from '@tanstack/react-query';
import { marketService } from '../market.service';
import type { NewsResponse } from '../types';

export const useNews = (sentiment?: string) => {
  return useQuery<NewsResponse>({
    queryKey: ['news', sentiment ?? 'all'],
    queryFn: () => marketService.fetchNews(sentiment),
    // Backend news job runs every 20 min; match that cadence exactly
    refetchInterval: 1000 * 60 * 20,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
    // Keep showing old articles while background-fetching new ones
    placeholderData: (prev) => prev,
  });
};
