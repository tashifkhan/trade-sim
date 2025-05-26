'use client';

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  trend?: 'up' | 'down' | 'neutral';
}

export default function MetricCard({ 
  title, 
  value, 
  description,
  color = 'primary',
  trend = 'neutral' 
}: MetricCardProps) {
  const getColorStyles = () => {
    const colors = {
      primary: { light: 'rgba(25, 118, 210, 0.08)', main: '#1976d2' },
      secondary: { light: 'rgba(156, 39, 176, 0.08)', main: '#9c27b0' },
      success: { light: 'rgba(76, 175, 80, 0.08)', main: '#4caf50' },
      error: { light: 'rgba(244, 67, 54, 0.08)', main: '#f44336' },
      info: { light: 'rgba(33, 150, 243, 0.08)', main: '#2196f3' },
      warning: { light: 'rgba(255, 152, 0, 0.08)', main: '#ff9800' }
    };
    
    return {
      backgroundColor: colors[color].light,
      color: colors[color].main,
      borderLeft: `4px solid ${colors[color].main}`
    };
  };
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp fontSize="small" color="success" />;
      case 'down':
        return <TrendingDown fontSize="small" color="error" />;
      default:
        return null;
    }
  };
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2,
        height: '100%',
        ...getColorStyles(),
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {getTrendIcon()}
      </Box>
      <Typography variant="h5" component="div" fontWeight="bold">
        {value}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Paper>
  );
}