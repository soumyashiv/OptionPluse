// src/hooks/useLoadingState.ts

export type LoadState = 'idle' | 'loading' | 'success' | 'stale' | 'partial' | 'error';

export interface LoadingState {
  state:    LoadState;
  isReady:  boolean;            // true when screen can render useful content
  isBusy:   boolean;            // true when a request is in-flight
  isStale:  boolean;            // true to show stale badge
}

export function resolveLoadingState<T>(
  data:       T | undefined,
  isLoading:  boolean,
  isFetching: boolean,
  isError:    boolean,
): LoadingState {
  const hasData = data !== undefined && data !== null;

  if (!hasData && isLoading)  return { state: 'loading',  isReady: false, isBusy: true,  isStale: false };
  if (!hasData && isError)    return { state: 'error',    isReady: false, isBusy: false, isStale: false };
  if (hasData  && isFetching) return { state: 'stale',   isReady: true,  isBusy: true,  isStale: true  };
  if (hasData  && isError)    return { state: 'partial',  isReady: true,  isBusy: false, isStale: true  };
  if (hasData)                return { state: 'success',  isReady: true,  isBusy: false, isStale: false };
  return                             { state: 'idle',     isReady: false, isBusy: false, isStale: false };
}
