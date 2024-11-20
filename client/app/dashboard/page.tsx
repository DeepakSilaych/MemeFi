'use client';

import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  useTheme,
  Stack,
  LinearProgress,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useWallet } from '../context/WalletContext';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Link from 'next/link';

const MotionCard = motion(Card);

// Mock data for charts
const areaData = [
  { name: '00:00', up: 4000, down: 2400 },
  { name: '04:00', up: 3000, down: 1398 },
  { name: '08:00', up: 2000, down: 9800 },
  { name: '12:00', up: 2780, down: 3908 },
  { name: '16:00', up: 1890, down: 4800 },
  { name: '20:00', up: 2390, down: 3800 },
  { name: '24:00', up: 3490, down: 4300 },
];

const pieData = [
  { name: 'INJ', value: 400, color: '#00F6FF' },
  { name: 'MEME', value: 300, color: '#FF3D71' },
  { name: 'USDT', value: 300, color: '#00FF87' },
];

const performanceData = [
  { name: 'INJ', win: 65, loss: 35 },
  { name: 'MEME', win: 45, loss: 55 },
  { name: 'USDT', win: 80, loss: 20 },
];

export default function DashboardPage() {
  const theme = useTheme();
  const { address } = useWallet();

  const stats = [
    {
      label: 'Total Value Locked',
      value: '$12,345',
      change: '+15.3%',
      positive: true,
      info: 'Total value of assets locked in trading positions',
    },
    {
      label: 'Total Trades',
      value: '123',
      change: '+23.5%',
      positive: true,
      info: 'Number of trades executed in the last 24 hours',
    },
    {
      label: '24h Volume',
      value: '$45,678',
      change: '-5.2%',
      positive: false,
      info: 'Total trading volume in the last 24 hours',
    },
    {
      label: 'Win Rate',
      value: '67.5%',
      change: '+2.1%',
      positive: true,
      info: 'Percentage of profitable trades in the last 24 hours',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          background: 'rgba(0, 0, 0, 0.8)',
          p: 1.5,
          borderRadius: 1,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: ${entry.value.toLocaleString()}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" className="gradient-text">
          Dashboard
        </Typography>
        <Button
          component={Link}
          href="/learn/trading-strategies"
          variant="outlined"
          sx={{
            borderColor: 'rgba(255,255,255,0.1)',
            '&:hover': { borderColor: 'rgba(255,255,255,0.2)' },
          }}
        >
          Trading Guide
        </Button>
      </Stack>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass"
              sx={{ p: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Tooltip title={stat.info}>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5">
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: stat.positive ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {stat.positive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  {stat.change}
                </Typography>
              </Stack>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Trading Activity Chart */}
        <Grid item xs={12} lg={8}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass"
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trading Activity (24h)
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={areaData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <defs>
                      <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF87" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00FF87" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF3D71" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF3D71" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="up"
                      stackId="1"
                      stroke="#00FF87"
                      fill="url(#colorUp)"
                      name="Up Trades"
                    />
                    <Area
                      type="monotone"
                      dataKey="down"
                      stackId="1"
                      stroke="#FF3D71"
                      fill="url(#colorDown)"
                      name="Down Trades"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </MotionCard>
        </Grid>

        {/* Portfolio and Performance */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Portfolio Distribution */}
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass"
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Portfolio Distribution
                </Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </MotionCard>

            {/* Win/Loss Ratio */}
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass"
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Performance by Token
                </Typography>
                <Stack spacing={2}>
                  {performanceData.map((item) => (
                    <Box key={item.name}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.win}% Win Rate
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={item.win}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,61,113,0.2)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: 'linear-gradient(90deg, #00FF87 0%, #00F6FF 100%)',
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </MotionCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
