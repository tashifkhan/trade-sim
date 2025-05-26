import { OrderbookData } from '@/types/types';

/**
 * Calculates price slippage in basis points for a market order of given size
 * 
 * Slippage is the difference between the expected price of a trade and the actual price
 * at which the trade is executed. It occurs when a large order cannot be filled at the
 * current market price because there isn't enough liquidity at that price level.
 * 
 * @param orderbook - The current orderbook data
 * @param quantityUsd - The order size in USD
 * @returns Slippage in basis points (1 bps = 0.01%)
 */
export const calculateSlippage = (orderbook: OrderbookData, quantityUsd: number): number => {
  if (!orderbook || orderbook.asks.length === 0) {
    return 0;
  }
  
  // For a buy order, we walk up the ask side of the book
  const asks = orderbook.asks;
  
  // Get the best ask price (lowest sell price)
  const bestAskPrice = asks[0][0];
  
  let remainingQuantity = quantityUsd;
  let totalCost = 0;
  
  // Walk through the orderbook and calculate the effective average price
  for (let i = 0; i < asks.length && remainingQuantity > 0; i++) {
    const [price, size] = asks[i];
    
    // Calculate the USD value of this level
    const levelValueUsd = price * size;
    
    // Determine how much we can take from this level
    const takenFromLevel = Math.min(remainingQuantity, levelValueUsd);
    
    // Add to total cost
    totalCost += takenFromLevel / price * price; // Convert USD to crypto and back to price
    
    // Reduce remaining quantity
    remainingQuantity -= takenFromLevel;
  }
  
  // If we couldn't fill the entire order, assume worst case slippage
  if (remainingQuantity > 0) {
    // Use the last available price with a penalty
    const worstPrice = asks[asks.length - 1][0] * 1.1; // 10% worse than last price
    totalCost += remainingQuantity / worstPrice * worstPrice;
  }
  
  // Calculate average execution price
  const avgExecutionPrice = totalCost / (quantityUsd / bestAskPrice);
  
  // Calculate slippage in basis points (1 bps = 0.01%)
  const slippageBps = ((avgExecutionPrice / bestAskPrice) - 1) * 10000;
  
  return Math.max(0, slippageBps); // Ensure non-negative result
};