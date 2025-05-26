/**
 * Calculates the probability of an order being executed as a maker order
 * 
 * A maker order adds liquidity to the order book and typically has lower fees.
 * A taker order removes liquidity from the order book and typically has higher fees.
 * 
 * This function uses a logistic function to model the probability of an order
 * being filled as a maker order based on its size.
 * 
 * @param quantityUsd - Order size in USD
 * @param midpoint - Midpoint of the logistic curve (order size where probability = 0.5)
 * @param steepness - Steepness of the logistic curve (how quickly probability changes)
 * @returns Probability (0-1) of the order being executed as a maker order
 */
export const makerProbability = (
  quantityUsd: number, 
  midpoint: number = 50000, 
  steepness: number = 5
): number => {
  // Logistic function: P(maker) = 1 / (1 + e^((x-midpoint)/steepness))
  // As order size increases, maker probability decreases
  
  // We invert the probability because larger orders are more likely to be taker orders
  // (they consume liquidity rather than provide it)
  const probability = 1 / (1 + Math.exp((quantityUsd - midpoint) / (midpoint / steepness)));
  
  return probability;
};