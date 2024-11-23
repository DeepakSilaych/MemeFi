import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useWebSocket } from '../hooks/useWebSocket';
import { formatCurrency, formatPercent } from '../utils/formatters';
import PriceChart from './PriceChart'; // Assuming PriceChart is a separate component

interface PriceData {
  symbol: string;
  price: number;
  price_change_24h: number;
  volume_24h: number;
  market_cap: number;
  timestamp: string;
}

interface RiskAlert {
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  score?: number;
  details?: any;
}

interface Position {
  trade_id: string;
  token: string;
  size: number;
  leverage: number;
  pnl: number;
  risk_score: number;
}

const TradingDashboard: React.FC = () => {
  const theme = useTheme();
  const [priceData, setPriceData] = useState<Record<string, PriceData[]>>({});
  const [positions, setPositions] = useState<Position[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const userId = 'user123'; // Replace with actual user ID from auth

  // WebSocket connections
  const priceSocket = useWebSocket(`ws://localhost:8000/ws/price-feed`);
  const tradesSocket = useWebSocket(`ws://localhost:8000/ws/trades/${userId}`);
  const positionsSocket = useWebSocket(`ws://localhost:8000/ws/positions/${userId}`);
  const riskSocket = useWebSocket(`ws://localhost:8000/ws/risk/${userId}`);

  // Handle price updates
  const handlePriceUpdate = useCallback((data: PriceData) => {
    setPriceData(prev => ({
      ...prev,
      [data.symbol]: [...(prev[data.symbol] || []).slice(-30), data]
    }));
  }, []);

  // Handle position updates
  const handlePositionUpdate = useCallback((data: Position) => {
    setPositions(prev => {
      const index = prev.findIndex(p => p.trade_id === data.trade_id);
      if (index >= 0) {
        const newPositions = [...prev];
        newPositions[index] = data;
        return newPositions;
      }
      return [...prev, data];
    });
  }, []);

  // Handle risk alerts
  const handleRiskAlert = useCallback((alert: RiskAlert) => {
    setRiskAlerts(prev => [alert, ...prev].slice(0, 5));
  }, []);

  // Set up WebSocket listeners
  useEffect(() => {
    if (priceSocket) {
      priceSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handlePriceUpdate(data);
      };
    }

    if (positionsSocket) {
      positionsSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handlePositionUpdate(data);
      };
    }

    if (riskSocket) {
      riskSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleRiskAlert(data);
      };
    }
  }, [priceSocket, positionsSocket, riskSocket]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Price Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%', minHeight: 700 }}>
            <Typography variant="h6" gutterBottom>
              Live Price Charts
            </Typography>
            {Object.entries(priceData).map(([symbol, data]) => (
              <Box key={symbol} sx={{ mt: 2, height: 'calc(100% - 40px)' }}>
                <Typography variant="subtitle1">{symbol}</Typography>
                <PriceChart
                  data={data.map(d => ({
                    time: new Date(d.timestamp).getTime() / 1000 as UTCTimestamp,
                    open: d.price,
                    high: d.price * 1.001, // Simulated for demo
                    low: d.price * 0.999,  // Simulated for demo
                    close: d.price,
                    volume: d.volume_24h
                  }))}
                  symbol={symbol}
                  containerWidth={800}
                  containerHeight={600}
                  onCrosshairMove={(price) => {
                    // Handle price hover
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Risk Alerts */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Risk Alerts
            </Typography>
            {riskAlerts.map((alert, index) => (
              <Alert
                key={index}
                severity={
                  alert.level === 'critical' ? 'error' :
                  alert.level === 'high' ? 'warning' :
                  alert.level === 'medium' ? 'info' : 'success'
                }
                sx={{ mb: 1 }}
              >
                {alert.message}
                {alert.score && (
                  <Typography variant="body2">
                    Risk Score: {alert.score}
                  </Typography>
                )}
              </Alert>
            ))}
          </Paper>
        </Grid>

        {/* Active Positions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Positions
            </Typography>
            <Grid container spacing={2}>
              {positions.map((position) => (
                <Grid item xs={12} sm={6} md={4} key={position.trade_id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      bgcolor: position.risk_score > 70 ? 'warning.light' : 'background.paper'
                    }}
                  >
                    <Typography variant="h6">{position.token}</Typography>
                    <Typography>
                      Size: {formatCurrency(position.size)}
                    </Typography>
                    <Typography>
                      Leverage: {position.leverage}x
                    </Typography>
                    <Typography>
                      PnL: {formatPercent(position.pnl)}
                    </Typography>
                    <Typography>
                      Risk Score: {position.risk_score}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TradingDashboard;
