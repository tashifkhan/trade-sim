/**
 * Calculates the market impact cost in basis points
 * 
 * Market impact is the effect that a market participant has when buying or selling an asset.
 * It is the extent to which the buying or selling moves the price against the buyer or seller.
 * 
 * This implementation uses a simplified version of the Almgren-Chriss model:
 * 
 * Impact = σ * √(Q/V) * C
 * 
 * Where:
 * - σ (sigma): Asset volatility
 * - Q: Order size in base currency
 * - V: Market daily volume in base currency
 * - C: Constant factor (typically 0.5-1.0)
 * 
 * @param quantity - Order quantity in base currency (e.g., BTC)
 * @param volume - Daily trading volume in base currency
 * @param volatility - Asset volatility (decimal, e.g., 0.05 for 5%)
 * @param impactFactor - Impact constant (typically 0.5-1.0)
 * @returns Market impact in basis points
 */
export const calculateImpact = (
  quantity: number, 
  volume: number, 
  volatility: number, 
  impactFactor: number = 0.75
): number => {
  // Safety checks
  if (quantity <= 0 || volume <= 0 || volatility <= 0) {
    return 0;
  }
  
  // Calculate impact based on the formula
  const impact = volatility * Math.sqrt(quantity / volume) * impactFactor;
  
  // Convert to basis points (1 bps = 0.01%)
  const impactBps = impact * 10000;
  
  return impactBps;
};