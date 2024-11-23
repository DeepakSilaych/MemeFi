import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { Box, useTheme } from '@mui/material';

interface PriceData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface PriceChartProps {
  data: PriceData[];
  symbol: string;
  containerWidth?: number;
  containerHeight?: number;
  onCrosshairMove?: (price: number | null) => void;
}

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  symbol,
  containerWidth = 1000,
  containerHeight = 600,
  onCrosshairMove
}) => {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: containerWidth,
      height: containerHeight,
      layout: {
        background: { color: theme.palette.background.paper },
        textColor: theme.palette.text.primary,
      },
      grid: {
        vertLines: { color: theme.palette.divider },
        horzLines: { color: theme.palette.divider },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: theme.palette.primary.main,
          style: 2,
        },
        horzLine: {
          width: 1,
          color: theme.palette.primary.main,
          style: 2,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: theme.palette.divider,
      },
      rightPriceScale: {
        borderColor: theme.palette.divider,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: theme.palette.success.main,
      downColor: theme.palette.error.main,
      borderVisible: false,
      wickUpColor: theme.palette.success.main,
      wickDownColor: theme.palette.error.main,
    });

    // Create volume series
    const volumeSeries = chart.addHistogramSeries({
      color: theme.palette.primary.main,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Set up crosshair move handler
    chart.subscribeCrosshairMove((param) => {
      if (onCrosshairMove) {
        const price = param.seriesPrices.get(candlestickSeries)?.close;
        onCrosshairMove(price || null);
      }
    });

    // Store references
    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Set initial data
    candlestickSeries.setData(data);
    volumeSeries.setData(
      data.map(d => ({
        time: d.time,
        value: d.volume || 0,
        color: d.close >= d.open ? theme.palette.success.main : theme.palette.error.main,
      }))
    );

    // Fit content
    chart.timeScale().fitContent();

    // Cleanup
    return () => {
      chart.remove();
    };
  }, [theme]); // Only recreate chart on theme changes

  // Update data when it changes
  useEffect(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current || !chartRef.current) return;

    candlestickSeriesRef.current.setData(data);
    volumeSeriesRef.current.setData(
      data.map(d => ({
        time: d.time,
        value: d.volume || 0,
        color: d.close >= d.open ? theme.palette.success.main : theme.palette.error.main,
      }))
    );

    // Fit content after data update
    chartRef.current.timeScale().fitContent();
  }, [data, theme]);

  // Update size when dimensions change
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions({
      width: containerWidth,
      height: containerHeight,
    });
    chartRef.current.timeScale().fitContent();
  }, [containerWidth, containerHeight]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        minHeight: containerHeight,
      }}
    >
      <Box
        ref={chartContainerRef}
        sx={{
          width: containerWidth,
          height: containerHeight,
          position: 'absolute',
          '& .tv-lightweight-charts': {
            borderRadius: 1,
            overflow: 'hidden',
          },
        }}
      />
    </Box>
  );
};

export default PriceChart;
