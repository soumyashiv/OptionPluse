import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useMarketSocket } from '../hooks/useMarketSocket';
import type { MarketSummaryResponse } from '../api/types';

type Market = 'NIFTY' | 'BANKNIFTY' | 'FINNIFTY';

type MarketContextType = {
  market: Market;
  setMarket: (market: Market) => void;
  isLive: boolean;
};

const MarketContext = createContext<MarketContextType>({
  market: 'NIFTY',
  setMarket: () => {},
  isLive: false,
});

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [market, setMarketState] = useState<Market>('NIFTY');
  const queryClient = useQueryClient();
  
  // Connect WebSocket global listener based on selected market
  const { data: wsData, isLive } = useMarketSocket(market);

  // When push data arrives, hydrate React Query caches so all screens update seamlessly
  useEffect(() => {
    if (wsData) {
      const summaryKey = ['marketSummary', market];
      const chainKey = ['optionChain', market];

      // Type-check: If the backend sent a full snapshot, update the cache entirely.
      if ((wsData as any).pcr !== undefined) { 
        queryClient.setQueryData(summaryKey, wsData);
        // Also populate option chain cache with the snapshot's chain
        if ((wsData as any).option_chain) {
          queryClient.setQueryData(chainKey, {
            symbol: market,
            data: (wsData as any).option_chain,
            source: 'websocket'
          });
        }
      } 
      // Else if it's a lightweight direction update
      else if ((wsData as any).direction) {
        queryClient.setQueryData<MarketSummaryResponse>(summaryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            market_direction: (wsData as any).direction,
            fetched_at: (wsData as any).ts,
            timestamp: (wsData as any).ts,
            source: 'websocket_push'
          };
        });
      }
    }
  }, [wsData, market, queryClient]);

  // Sync with profile's default_index when it's loaded
  useEffect(() => {
    if (profile?.default_index && ['NIFTY', 'BANKNIFTY', 'FINNIFTY'].includes(profile.default_index)) {
      setMarketState(profile.default_index as Market);
    }
  }, [profile?.default_index]);

  const setMarket = (newMarket: Market) => {
    setMarketState(newMarket);
  };

  return (
    <MarketContext.Provider value={{ market, setMarket, isLive }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => useContext(MarketContext);
