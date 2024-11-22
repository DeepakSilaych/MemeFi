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
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: theme.palette.primary.main,
          width: 1,
          style: 3,
          labelBackgroundColor: theme.palette.background.paper,
        },
        horzLine: {
          color: theme.palette.primary.main,
          width: 1,
          style: 3,
          labelBackgroundColor: theme.palette.background.paper,
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 12,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
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
    handleResize(); // Initial resize

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [theme, height, data]);

  return (
    <Box 
      ref={chartContainerRef} 
      sx={{ 
        width: '100%',
        height: '100%',
        minHeight: height,
        '.tv-lightweight-charts': {
          borderRadius: 1,
          background: 'rgba(255,255,255,0.02)',
        }
      }} 
    />
  );
};

export default PriceChart;
