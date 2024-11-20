'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Stack,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import Image from 'next/image';
import Link from 'next/link';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HistoryIcon from '@mui/icons-material/History';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DiamondIcon from '@mui/icons-material/Diamond';

const MotionCard = motion(Card);

// Mock data - replace with actual API calls
const rewardHistory = [
  {
    id: '1',
    date: '2024-01-15',
    reward: 'Top Trader NFT',
    reason: 'Weekly Top 3 Trader',
    points: 5000,
    status: 'claimed',
  },
  {
    id: '2',
    date: '2024-01-10',
    reward: 'Trading Fee Discount',
    reason: 'Volume Achievement',
    points: 2000,
    status: 'active',
    expiresIn: '15 days',
  },
  {
    id: '3',
    date: '2024-01-05',
    reward: 'Points Multiplier',
    reason: 'Win Streak Bonus',
    points: 1000,
    status: 'expired',
  },
];

const seasonalRewards = [
  {
    id: '1',
    name: 'Top Trader NFT',
    description: 'Exclusive NFT for top 3 traders this season',
    requirement: 'Top 3 on Leaderboard',
    image: '/rewards/top-trader-nft.png',
    tier: 'diamond',
  },
  {
    id: '2',
    name: 'Trading Fee Discount',
    description: '50% off trading fees for 30 days',
    requirement: 'Top 10 on Leaderboard',
    image: '/rewards/trading-discount.png',
    tier: 'gold',
  },
  {
    id: '3',
    name: 'Points Multiplier',
    description: '2x points for all trades next season',
    requirement: 'Top 20 on Leaderboard',
    image: '/rewards/points-boost.png',
    tier: 'silver',
  },
];

const achievements = [
  {
    id: '1',
    name: 'Volume Master',
    description: 'Trade over $100K in volume',
    points: 5000,
    progress: 75,
    current: '$75K',
    target: '$100K',
    icon: <TrendingUpIcon />,
  },
  {
    id: '2',
    name: 'Win Streak',
    description: 'Win 10 trades in a row',
    points: 2000,
    progress: 40,
    current: '4',
    target: '10',
    icon: <LocalFireDepartmentIcon />,
  },
  {
    id: '3',
    name: 'Diamond Hands',
    description: 'Hold position for over 1 hour',
    points: 1000,
    progress: 100,
    completed: true,
    icon: <DiamondIcon />,
  },
];

export default function RewardsPage() {
  const theme = useTheme();
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [userStats] = useState({
    points: 8500,
    volume: '$250K',
    winRate: '64%',
    rank: 8,
  });

  if (!address) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom className="gradient-text">
            Connect Your Wallet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Connect your wallet to view and claim rewards
          </Typography>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" className="gradient-text">
          Season 1 Rewards
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            href="/learn/rewards"
            variant="outlined"
            startIcon={<InfoOutlinedIcon />}
            sx={{
              borderColor: 'rgba(255,255,255,0.1)',
              '&:hover': { borderColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            How Rewards Work
          </Button>
          <Button
            component={Link}
            href="/leaderboard"
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.1)',
              '&:hover': { borderColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            View Leaderboard
          </Button>
        </Stack>
      </Stack>

      {/* User Stats */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass"
        sx={{ p: 3, mb: 4 }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  background: 'linear-gradient(135deg, #00F6FF 0%, #00FF87 100%)',
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6">Total Points: {userStats.points.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Keep trading to earn more rewards!
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Chip
                label={`Volume: ${userStats.volume}`}
                color="primary"
                sx={{ px: 2 }}
              />
              <Chip
                label={`Win Rate: ${userStats.winRate}`}
                color="secondary"
                sx={{ px: 2 }}
              />
            </Stack>
          </Grid>
        </Grid>
      </MotionCard>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{ mb: 3 }}
        variant="fullWidth"
      >
        <Tab label="Rewards History" icon={<HistoryIcon />} />
        <Tab label="Seasonal Rewards" icon={<EmojiEventsIcon />} />
        <Tab label="Achievements" icon={<WorkspacePremiumIcon />} />
      </Tabs>

      {/* Rewards History */}
      {tab === 0 && (
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
                  <TableCell>Date</TableCell>
                  <TableCell>Reward</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell align="right">Points</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rewardHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>{new Date(history.date).toLocaleDateString()}</TableCell>
                    <TableCell>{history.reward}</TableCell>
                    <TableCell>{history.reason}</TableCell>
                    <TableCell align="right">+{history.points.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={history.status === 'active' ? `Active (${history.expiresIn})` : history.status}
                        color={
                          history.status === 'claimed' ? 'success' :
                          history.status === 'active' ? 'primary' :
                          'default'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MotionCard>
      )}

      {/* Seasonal Rewards */}
      {tab === 1 && (
        <Grid container spacing={3}>
          {seasonalRewards.map((reward, index) => (
            <Grid item xs={12} md={4} key={reward.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass"
              >
                <Box sx={{ position: 'relative', pt: '75%' }}>
                  <Image
                    src={reward.image}
                    alt={reward.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(0,0,0,0.6)',
                      borderRadius: '12px',
                      px: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: reward.tier === 'diamond' ? '#B9F2FF' :
                          reward.tier === 'gold' ? '#FFD700' :
                            reward.tier === 'silver' ? '#C0C0C0' : '#CD7F32'
                      }}
                    >
                      {reward.tier.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {reward.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {reward.description}
                  </Typography>
                  <Typography variant="subtitle2" color="primary">
                    Requirement: {reward.requirement}
                  </Typography>
                </Box>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Achievements */}
      {tab === 2 && (
        <Grid container spacing={3}>
          {achievements.map((achievement, index) => (
            <Grid item xs={12} md={4} key={achievement.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass"
                sx={{ p: 2 }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: achievement.completed ? 'success.main' : 'primary.main',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {achievement.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {achievement.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </Box>
                  </Stack>

                  {!achievement.completed && (
                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Progress: {achievement.current} / {achievement.target}
                        </Typography>
                        <Typography variant="caption" color="primary">
                          {achievement.points} Points
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={achievement.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: 'linear-gradient(90deg, #00F6FF 0%, #00FF87 100%)',
                          },
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
