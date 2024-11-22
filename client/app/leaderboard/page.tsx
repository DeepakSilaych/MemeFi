'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Card,
} from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useWallet } from '../context/WalletContext';

const MotionCard = motion(Card);

// Mock data - replace with real API data
const mockLeaderboardData = [
  {
    id: 1,
    rank: 1,
    address: '0x1234...5678',
    points: 15000,
    trades: 150,
    winRate: '68%',
    volume: '$250,000',
    badge: 'diamond',
  },
  {
    id: 2,
    rank: 2,
    address: '0x8765...4321',
    points: 12000,
    trades: 120,
    winRate: '65%',
    volume: '$180,000',
    badge: 'gold',
  },
  {
    id: 3,
    rank: 3,
    address: '0x9876...1234',
    points: 10000,
    trades: 100,
    winRate: '62%',
    volume: '$150,000',
    badge: 'gold',
  },
  // Add more mock data...
];

const timeRanges = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'all-time', label: 'All Time' },
];

export default function LeaderboardPage() {
  const { address } = useWallet();
  const [timeRange, setTimeRange] = useState('weekly');

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'diamond':
        return '#B9F2FF';
      case 'gold':
        return '#FFD700';
      case 'silver':
        return '#C0C0C0';
      default:
        return '#CD7F32';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
      case 2:
        return 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)';
      case 3:
        return 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)';
      default:
        return undefined;
    }
  };

  const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newTimeRange: string) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" className="gradient-text">
          Leaderboard
        </Typography>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="time range"
          sx={{
            '& .MuiToggleButton-root': {
              color: 'text.secondary',
              borderColor: 'rgba(255,255,255,0.1)',
              '&.Mui-selected': {
                color: 'primary.main',
                background: 'rgba(255,255,255,0.05)',
              },
              '&:hover': {
                background: 'rgba(255,255,255,0.05)',
              },
            },
          }}
        >
          {timeRanges.map((range) => (
            <ToggleButton key={range.value} value={range.value}>
              {range.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass"
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Trader</TableCell>
                <TableCell align="right">Points</TableCell>
                <TableCell align="right">Trades</TableCell>
                <TableCell align="right">Win Rate</TableCell>
                <TableCell align="right">Volume</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockLeaderboardData.map((trader) => {
                const isCurrentUser = address && trader.address.toLowerCase() === address.toLowerCase();
                return (
                  <TableRow
                    key={trader.id}
                    sx={{
                      background: isCurrentUser ? 'rgba(0, 246, 255, 0.05)' : undefined,
                      '&:hover': { background: 'rgba(255,255,255,0.05)' },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            background: getRankColor(trader.rank) || 'rgba(255,255,255,0.1)',
                            fontWeight: 600,
                          }}
                        >
                          {trader.rank}
                        </Avatar>
                        <Chip
                          size="small"
                          label={trader.badge.toUpperCase()}
                          sx={{
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            color: getBadgeColor(trader.badge),
                            borderColor: getBadgeColor(trader.badge),
                            border: '1px solid',
                          }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {trader.address}
                        {isCurrentUser && (
                          <Chip
                            size="small"
                            label="YOU"
                            color="primary"
                            sx={{ height: 20 }}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="primary" fontWeight={500}>
                        {trader.points.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{trader.trades}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                        <TrendingUpIcon
                          sx={{
                            fontSize: 16,
                            color: parseFloat(trader.winRate) >= 50 ? 'success.main' : 'error.main',
                          }}
                        />
                        {trader.winRate}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{trader.volume}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </MotionCard>
    </Box>
  );
}
