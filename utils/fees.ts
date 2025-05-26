/**
 * Fee tier structure for the exchange
 */
export const feeTiers = [
  { name: 'Regular', makerFee: 0.0010, takerFee: 0.0020 }, // 0.10% maker, 0.20% taker
  { name: 'VIP1', makerFee: 0.0008, takerFee: 0.0015 },    // 0.08% maker, 0.15% taker
  { name: 'VIP2', makerFee: 0.0005, takerFee: 0.0012 },    // 0.05% maker, 0.12% taker
  { name: 'VIP3', makerFee: 0.0002, takerFee: 0.0010 },    // 0.02% maker, 0.10% taker
  { name: 'VIP4', makerFee: 0.0000, takerFee: 0.0008 },    // 0.00% maker, 0.08% taker
];

/**
 * Calculates the trading fees for a given order size and fee tier
 * 
 * @param quantityUsd - The order size in USD
 * @param tierName - The fee tier name (Regular, VIP1, etc.)
 * @param makerProbability - Probability of the order being executed as maker (0-1)
 * @returns The fee amount in USD
 */
export const calculateFees = (
  quantityUsd: number, 
  tierName: string = 'Regular', 
  makerProbability: number = 0.5
): number => {
  // Find the fee tier
  const tier = feeTiers.find(t => t.name === tierName) || feeTiers[0];
  
  // Calculate weighted average fee based on maker/taker probability
  const weightedFeeRate = (tier.makerFee * makerProbability) + 
                         (tier.takerFee * (1 - makerProbability));
  
  // Calculate fee in USD
  const feeUsd = quantityUsd * weightedFeeRate;
  
  return feeUsd;
};

/**
 * Gets available fee tiers for display in UI
 * 
 * @returns Array of fee tier objects
 */
export const getFeeTiers = () => {
  return feeTiers;
};