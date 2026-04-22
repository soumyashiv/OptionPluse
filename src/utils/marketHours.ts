/**
 * Market Hours Utility — Clinical Precisionist Edition
 * Handles NSE (National Stock Exchange of India) session tracking.
 */

export const MARKET_HOURS = {
  OPEN_HOUR: 9,
  OPEN_MINUTE: 15,
  CLOSE_HOUR: 15,
  CLOSE_MINUTE: 30,
  TIMEZONE: 'Asia/Kolkata',
};

/**
 * Checks if the current time is within Indian market hours (9:15 AM - 3:30 PM IST).
 * Excludes weekends.
 */
export function isMarketOpen(): boolean {
  // Get time in IST regardless of user's device locale
  const now = new Date();
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: MARKET_HOURS.TIMEZONE }));
  
  const day = istTime.getDay();
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();

  // 0 = Sunday, 6 = Saturday
  if (day === 0 || day === 6) {
    return false;
  }

  const currentTimeInMinutes = hours * 60 + minutes;
  const openTimeInMinutes = MARKET_HOURS.OPEN_HOUR * 60 + MARKET_HOURS.OPEN_MINUTE;
  const closeTimeInMinutes = MARKET_HOURS.CLOSE_HOUR * 60 + MARKET_HOURS.CLOSE_MINUTE;

  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
}

/**
 * Returns the recommended polling interval based on market state.
 * @param activeInterval Interval in ms when market is open (default 30s)
 */
export function getAdaptiveInterval(activeInterval: number = 30000): number | false {
  if (isMarketOpen()) {
    return activeInterval;
  }
  
  // When market is closed, we poll very infrequently (5 mins) 
  // or return false to disable it entirely if news isn't critical.
  return 1000 * 60 * 5; 
}
