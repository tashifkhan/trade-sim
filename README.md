# Crypto Trade Simulator

A high-performance crypto trade simulator for analyzing execution costs of large orders using real-time orderbook data.

## Features

- **Real-time L2 Orderbook Data**: Streams market depth data via WebSocket connection
- **Advanced Market Models**: Implementations of slippage calculation, fee structure, market impact (Almgren-Chriss model), and maker/taker probability
- **Interactive UI**: Adjust order parameters and see results in real-time
- **Visualizations**: View the orderbook, cost breakdowns, and maker/taker probabilities

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_WS_URL=wss://ws.okx.com:8443/ws/v5/public
   ```

### Development

Start the development server:

```bash
npm run dev
```

### Building for Production

Build the application:

```bash
npm run build
```

## Model Descriptions

### Slippage Model

Slippage is calculated by walking the orderbook and determining the effective average execution price compared to the best available price.

### Fee Model

Fees are calculated based on the exchange's tier structure, with different rates for maker and taker orders.

### Market Impact Model

The market impact model is based on a simplified version of the Almgren-Chriss model:

```
Impact = σ * √(Q/V) * C
```

Where:
- σ (sigma): Asset volatility
- Q: Order size in base currency
- V: Market daily volume in base currency
- C: Constant factor (typically 0.5-1.0)

### Maker/Taker Probability Model

The probability of an order being executed as a maker order (vs. taker) is modeled using a logistic function based on order size:

```
P(maker) = 1 / (1 + e^((x-midpoint)/steepness))
```

Where:
- x: Order size
- midpoint: Order size where probability = 0.5
- steepness: How quickly the probability changes with order size

## Limitations

- The current implementation uses mock data for development purposes
- For production use, replace the mock data with an actual WebSocket connection
- The market impact model is a simplified version and may need calibration for specific markets

## License

MIT