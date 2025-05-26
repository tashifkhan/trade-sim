/**
 * Format a number with thousands separators and specified decimal places
 * 
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @param prefix - Optional prefix (e.g., '$')
 * @param suffix - Optional suffix (e.g., '%')
 * @returns Formatted string
 */
export const formatNumber = (
  value: number, 
  decimals: number = 2, 
  prefix: string = '', 
  suffix: string = ''
): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return 'N/A';
  }
  
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return `${prefix}${formatted}${suffix}`;
};

/**
 * Format currency values (USD)
 * 
 * @param value - Value in USD
 * @param decimals - Number of decimal places
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, decimals: number = 2): string => {
  return formatNumber(value, decimals, '$');
};

/**
 * Format percentage values
 * 
 * @param value - Value as decimal (e.g., 0.05 for 5%)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return formatNumber(value * 100, decimals, '', '%');
};

/**
 * Format basis points
 * 
 * @param bps - Value in basis points (1 bps = 0.01%)
 * @param decimals - Number of decimal places
 * @returns Formatted basis points string
 */
export const formatBps = (bps: number, decimals: number = 2): string => {
  return formatNumber(bps, decimals, '', ' bps');
};

/**
 * Format latency in milliseconds
 * 
 * @param ms - Latency in milliseconds
 * @returns Formatted latency string
 */
export const formatLatency = (ms: number): string => {
  return formatNumber(ms, 2, '', ' ms');
};

/**
 * Format crypto quantity with appropriate decimals based on asset
 * 
 * @param quantity - Quantity of the asset
 * @param asset - Asset symbol (e.g., 'BTC')
 * @returns Formatted quantity string
 */
export const formatCryptoQuantity = (quantity: number, asset: string): string => {
  // Different assets have different precision requirements
  const decimalsMap: { [key: string]: number } = {
    'BTC': 8,
    'ETH': 6,
    'SOL': 4,
    'USDT': 2,
    'USDC': 2,
  };
  
  const decimals = decimalsMap[asset] || 4;
  return formatNumber(quantity, decimals, '', ` ${asset}`);
};