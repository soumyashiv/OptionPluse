import { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// Derive WebSocket base URL from the API base URL
const DEFAULT_API_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8000/api/v1'
  : 'http://127.0.0.1:8000/api/v1';

const BASE_URL: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_API_URL ??
  DEFAULT_API_URL;

const API_KEY: string =
  (Constants.expoConfig?.extra?.apiKey as string | undefined) ??
  process.env.EXPO_PUBLIC_API_KEY ??
  '';

// Convert http://host/api/v1 to ws://host/ws/market
const WS_BASE_URL = BASE_URL.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '/ws/market');

export interface WSMarketData {
  symbol: string;
  ts?: string;
  direction?: string;
  data?: any; // the actual snapshot payload
}

export function useMarketSocket(symbol: string) {
  const [data, setData] = useState<WSMarketData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const maxRetries = 5;

  useEffect(() => {
    let isMounted = true;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = async () => {
      // 1. Get Auth Token
      let token = API_KEY;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const jwt = sessionData?.session?.access_token;
        if (jwt && jwt.startsWith('eyJ')) {
          token = jwt;
        }
      } catch {
        // Fall back to API_KEY
      }

      const wsUrl = `${WS_BASE_URL}/${symbol}?token=${token}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) return;
        setIsConnected(true);
        setIsLive(true);
        reconnectCountRef.current = 0; // reset on success
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'ping') {
            ws.send('pong');
            return;
          }
          if (msg.type === 'snapshot') {
            // initial full load
            setData(msg.data);
          } else if (msg.type === 'update') {
            // incremental or just a ping with direction
            setData(prev => ({
              ...prev,
              symbol: msg.symbol,
              direction: msg.direction,
              ts: msg.ts,
              timestamp: msg.ts, // align with normal data
              market_direction: msg.direction // for dashboard mapping
            } as any));
          }
        } catch (err) {
          console.warn('[useMarketSocket] Failed to parse msg', err);
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setIsConnected(false);
        setIsLive(false);
        
        // Attempt reconnect with backoff
        if (reconnectCountRef.current < maxRetries) {
          const backoff = Math.min(1000 * Math.pow(2, reconnectCountRef.current), 30000);
          reconnectCountRef.current += 1;
          reconnectTimeout = setTimeout(connect, backoff);
        }
      };

      ws.onerror = (err) => {
        // console.error('[useMarketSocket] Error', err);
        // Will trigger onclose next
      };
    };

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol]);

  return { data, isLive, isConnected };
}
