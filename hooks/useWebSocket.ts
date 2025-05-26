'use client';

import { useState, useEffect, useRef } from 'react';
import { OrderbookData, WebSocketStatus } from '@/types/types';

// Process raw orderbook data to make it easier to work with
const processOrderbook = (data: OrderbookData): OrderbookData => {
  const processedData = { ...data };
  
  // Calculate total volume and percentage for visualization
  let bidTotal = 0;
  let askTotal = 0;
  
  // Process bids (buy orders)
  const processedBids = data.bids.map(([price, size]) => {
    bidTotal += size;
    return { price, size, total: bidTotal };
  });
  
  // Process asks (sell orders)
  const processedAsks = data.asks.map(([price, size]) => {
    askTotal += size;
    return { price, size, total: askTotal };
  });
  
  // Calculate percentage of total volume
  const maxTotal = Math.max(bidTotal, askTotal);
  processedBids.forEach(bid => {
    bid.percentage = (bid.total! / maxTotal) * 100;
  });
  
  processedAsks.forEach(ask => {
    ask.percentage = (ask.total! / maxTotal) * 100;
  });
  
  // Calculate spread
  const topBid = processedBids[0]?.price || 0;
  const topAsk = processedAsks[0]?.price || 0;
  const spread = topAsk - topBid;
  const spreadPercentage = (spread / topBid) * 100;
  
  return {
    ...processedData,
    processedBids,
    processedAsks,
    spread,
    spreadPercentage
  };
};

/**
 * Hook to connect to a WebSocket and stream orderbook data
 * 
 * @param url WebSocket URL
 * @param symbol Trading pair symbol (e.g., 'BTC-USDT')
 * @returns Object containing orderbook data, connection status, and latency
 */
export default function useWebSocket(url: string, symbol: string) {
  const [data, setData] = useState<OrderbookData | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>('CLOSED');
  const [latency, setLatency] = useState<number>(0);
  const socketRef = useRef<WebSocket | null>(null);
  const messageTimestampRef = useRef<number>(0);
  
  useEffect(() => {
    // Mock data for development
    // In a real app, replace with actual WebSocket connection
    const mockOrderbook: OrderbookData = {
      timestamp: Date.now(),
      asks: [
        [27500.5, 0.5],
        [27501.2, 1.2],
        [27502.8, 0.8],
        [27505.1, 2.3],
        [27507.0, 1.7],
        [27510.3, 3.1],
        [27512.5, 2.5],
        [27515.0, 1.8],
        [27518.2, 2.0],
        [27520.0, 5.0]
      ],
      bids: [
        [27499.8, 0.6],
        [27498.5, 1.5],
        [27497.0, 1.0],
        [27495.5, 2.5],
        [27494.2, 1.8],
        [27492.1, 2.2],
        [27490.0, 3.0],
        [27485.5, 4.5],
        [27480.0, 3.2],
        [27475.0, 6.0]
      ]
    };

    // For a real implementation, uncomment this code:
    /*
    const connectWebSocket = () => {
      setStatus('CONNECTING');
      
      const socket = new WebSocket(url);
      socketRef.current = socket;
      
      socket.onopen = () => {
        setStatus('OPEN');
        
        // Subscribe to orderbook updates for the specified symbol
        const subscribeMsg = JSON.stringify({
          op: 'subscribe',
          args: [{
            channel: 'books',
            instId: symbol
          }]
        });
        socket.send(subscribeMsg);
      };
      
      socket.onmessage = (event) => {
        const receivedTime = performance.now();
        const message = JSON.parse(event.data);
        
        // Handle different message types (ping, subscription confirmation, data)
        if (message.event === 'subscribe' || message.event === 'error') {
          // Handle subscription confirmation or error
          console.log(message);
        } else if (message.data && message.arg && message.arg.channel === 'books') {
          // This is orderbook data
          messageTimestampRef.current = message.data[0].ts;
          
          const orderbookData: OrderbookData = {
            timestamp: message.data[0].ts,
            asks: message.data[0].asks.map((ask: string[]) => [parseFloat(ask[0]), parseFloat(ask[1])]),
            bids: message.data[0].bids.map((bid: string[]) => [parseFloat(bid[0]), parseFloat(bid[1])])
          };
          
          // Calculate latency
          const messageLatency = receivedTime - messageTimestampRef.current;
          setLatency(messageLatency);
          
          // Process the orderbook data
          setData(processOrderbook(orderbookData));
        }
      };
      
      socket.onclose = () => {
        setStatus('CLOSED');
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('ERROR');
      };
      
      return socket;
    };
    
    const socket = connectWebSocket();
    
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
    */
    
    // For development, use mock data with simulated updates
    setStatus('OPEN');
    
    const mockLatency = Math.random() * 20 + 5; // 5-25ms latency
    setLatency(mockLatency);
    
    // Process the mock orderbook data
    setData(processOrderbook(mockOrderbook));
    
    // Simulate orderbook updates
    const interval = setInterval(() => {
      // Generate some random changes to the orderbook
      const newMockOrderbook = { ...mockOrderbook };
      newMockOrderbook.timestamp = Date.now();
      
      // Update some prices and sizes randomly
      newMockOrderbook.asks = newMockOrderbook.asks.map(([price, size]) => {
        const priceDelta = (Math.random() - 0.5) * 0.5;
        const sizeDelta = (Math.random() - 0.5) * 0.2;
        return [price + priceDelta, Math.max(0.1, size + sizeDelta)];
      });
      
      newMockOrderbook.bids = newMockOrderbook.bids.map(([price, size]) => {
        const priceDelta = (Math.random() - 0.5) * 0.5;
        const sizeDelta = (Math.random() - 0.5) * 0.2;
        return [price + priceDelta, Math.max(0.1, size + sizeDelta)];
      });
      
      // Sort asks (lowest first) and bids (highest first)
      newMockOrderbook.asks.sort((a, b) => a[0] - b[0]);
      newMockOrderbook.bids.sort((a, b) => b[0] - a[0]);
      
      // Update latency
      const newLatency = Math.random() * 20 + 5; // 5-25ms
      setLatency(newLatency);
      
      // Process and update orderbook
      setData(processOrderbook(newMockOrderbook));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [url, symbol]);
  
  return {
    data,
    status,
    latency
  };
}