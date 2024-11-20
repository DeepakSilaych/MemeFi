'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { Box, useTheme } from '@mui/material';

interface PriceChartProps {
  data: { time: string; open: number; high: number; low: number; close: number }[];
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, height = 400 }) => {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: theme.palette.text.secondary,
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: theme.palette.primary.main,
          width: 1,
          style: 3,
          labelBackgroundColor: theme.palette.primary.main,
        },
        horzLine: {
          color: theme.palette.primary.main,
          width: 1,
          style: 3,
          labelBackgroundColor: theme.palette.primary.main,
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    });

    const candlestickSeries = chartRef.current.addCandlestickSeries({
      upColor: '#4CAF50',
      downColor: '#f44336',
      borderVisible: false,
      wickUpColor: '#4CAF50',
      wickDownColor: '#f44336',
    });

    candlestickSeries.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [theme, height]);

  return (
    <Box 
      ref={chartContainerRef} 
      sx={{ 
        width: '100%',
        height: height,
        '.tv-lightweight-charts': {
          borderRadius: 2,
          background: 'rgba(255,255,255,0.03)',
        }
      }} 
    />
  );
};

export default PriceChart;
