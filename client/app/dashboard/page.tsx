'use client';

import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useWallet } from '../context/WalletContext';

const MotionCard = motion(Card);

// Mock data for charts
const areaData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const pieData = [
  { name: 'INJ', value: 400 },
  { name: 'MEME', value: 300 },
  { name: 'USDT', value: 300 },
];

const COLORS = ['#00F6FF', '#FF3D71', '#00FF87'];

export default function DashboardPage() {
  const theme = useTheme();
  const { address } = useWallet();

  const stats = [
    { label: 'Total Value Locked', value: '$12,345' },
    { label: 'Total Trades', value: '123' },
    { label: '24h Volume', value: '$45,678' },
    { label: 'Active Positions', value: '5' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom className="gradient-text">
        Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass"
              sx={{ p: 3 }}
            >
              <Typography variant="h6" gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Trading Activity Chart */}
        <Grid item xs={12} md={8}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass"
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trading Activity
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={areaData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="name"
                      stroke={theme.palette.text.secondary}
                    />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00F6FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00F6FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#00F6FF"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </MotionCard>
        </Grid>

        {/* Portfolio Distribution */}
        <Grid item xs={12} md={4}>
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
              <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
