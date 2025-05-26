'use client';

import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Grid,
  Typography, 
  Box,
  Divider,
  Paper, 
  LinearProgress,
  Fade
} from '@mui/material';
import { 
  ResponsiveContainer,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { formatCurrency, formatBps, formatPercent, formatLatency, formatCryptoQuantity } from '@/utils/formatters';
import { OrderbookData, SimulationResults, OrderbookEntry } from '@/types/types';
import OrderbookVisualizer from './OrderbookVisualizer';
import MetricCard from './MetricCard';

interface OutputPanelProps {
  results: SimulationResults | null;
  orderbook: OrderbookData | null;
  isLoading: boolean;
}

export default function OutputPanel({ results, orderbook, isLoading }: OutputPanelProps) {
  // Prepare data for cost breakdown chart
  const getCostBreakdownData = () => {
    if (!results) return [];
    
    return [
      {
        name: 'Slippage',
        value: results.slippageBps,
        fill: '#ff9800', // orange
      },
      {
        name: 'Market Impact',
        value: results.impactBps,
        fill: '#f44336', // red
      },
      {
        name: 'Fees',
        value: results.feesBps,
        fill: '#2196f3', // blue
      }
    ];
  };

  // Prepare data for maker/taker probability
  const getMakerTakerData = () => {
    if (!results) return [];
    
    return [
      {
        name: 'Maker',
        value: results.makerProb * 100,
        fill: '#4caf50', // green
      },
      {
        name: 'Taker',
        value: (1 - results.makerProb) * 100,
        fill: '#f44336', // red
      }
    ];
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
      }}
    >
      <CardHeader 
        title="Simulation Results" 
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      />
      
      <CardContent sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {isLoading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <LinearProgress 
              sx={{ width: '50%', mb: 2 }} 
            />
            <Typography variant="body1" color="text.secondary">
              {!orderbook ? 'Connecting to order book...' : 'Run a simulation to see results'}
            </Typography>
          </Box>
        ) : (
          <Fade in={!isLoading}>
            <Grid container spacing={3}>
              {/* Top row: Key metrics */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard 
                      title="Net Cost" 
                      value={results ? formatBps(results.netCostBps) : 'N/A'} 
                      description="Total execution cost"
                      color="error"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard 
                      title="Slippage" 
                      value={results ? formatBps(results.slippageBps) : 'N/A'} 
                      description="Price slippage"
                      color="warning" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard 
                      title="Market Impact" 
                      value={results ? formatBps(results.impactBps) : 'N/A'}
                      description="Price impact" 
                      color="error"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard 
                      title="Fees" 
                      value={results ? formatCurrency(results.feesUsd) : 'N/A'}
                      description="Trading fees" 
                      color="info"
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              {/* Second row: Order details */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>Order Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Symbol</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {results?.topBid ? results.topBid.toString().split('-')[0] : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Quantity</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {results ? formatCryptoQuantity(results.quantityCrypto, 'BTC') : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Best Bid</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {results ? formatCurrency(results.topBid) : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Best Ask</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {results ? formatCurrency(results.topAsk) : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              {/* Third row: Orderbook visualization */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>Order Book</Typography>
                  <Box sx={{ height: 250 }}>
                    {orderbook && (
                      <OrderbookVisualizer orderbook={orderbook} />
                    )}
                  </Box>
                </Paper>
              </Grid>
              
              {/* Fourth row: Charts */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, borderRadius: 1, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Cost Breakdown</Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getCostBreakdownData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis 
                          tickFormatter={(value) => `${value} bps`}
                          domain={[0, 'dataMax * 1.2']}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value} bps`, 'Cost']}
                        />
                        <Bar dataKey="value" nameKey="name" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, borderRadius: 1, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Maker/Taker Probability</Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getMakerTakerData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis 
                          tickFormatter={(value) => `${value}%`}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Probability']}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          nameKey="name" 
                          stackId="1"
                          fillOpacity={0.8}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              
              {/* Footer: Latency information */}
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Last updated: {results ? new Date(results.timestamp).toLocaleTimeString() : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latency: {results ? formatLatency(results.latency) : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Fade>
        )}
      </CardContent>
    </Card>
  );
}