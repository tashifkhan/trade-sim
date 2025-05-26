// WebSocket and Orderbook Types
export interface OrderbookEntry {
  price: number;
  size: number;
  total?: number;
  percentage?: number;
}

export interface OrderbookData {
  timestamp: number;
  asks: [number, number][]; // [price, size]
  bids: [number, number][]; // [price, size]
  processedAsks?: OrderbookEntry[];
  processedBids?: OrderbookEntry[];
  spread?: number;
  spreadPercentage?: number;
}

export type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'ERROR';

// Simulation Parameters
export interface SimulationParams {
  symbol: string;
  quantityUsd: number;
  volatility: number;
  feeTier: string;
  run: boolean;
}

// Simulation Results
export interface SimulationResults {
  timestamp: string;
  topBid: number;
  topAsk: number;
  quantityCrypto: number;
  slippageBps: number;
  feesUsd: number;
  feesBps: number;
  impactBps: number;
  makerProb: number;
  netCostBps: number;
  latency: number;
}

// Fee Tiers
export interface FeeTier {
  name: string;
  makerFee: number;
  takerFee: number;
  volumeRequired?: string;
}