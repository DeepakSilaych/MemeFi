'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { getRewards, getCampaigns, getUserStats, claimReward } from '../services/api';
import { Reward, Campaign, UserStats } from '../types';
import { useWallet } from '../context/WalletContext';
import Image from 'next/image';
import RewardsGuide from '../components/RewardsGuide';

export default function RewardsPage() {
  const theme = useTheme();
  const { address } = useWallet();
  const [tab, setTab] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      loadData();
    }
  }, [address]);

  const loadData = async () => {
    try {
      const [rewardsData, campaignsData, stats] = await Promise.all([
        getRewards(),
        getCampaigns(),
        getUserStats(address!),
      ]);
      setRewards(rewardsData);
      setCampaigns(campaignsData);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (rewardId: string) => {
    if (!address || claiming) return;

    setClaiming(rewardId);
    try {
      await claimReward(rewardId);
      await loadData(); // Refresh data after claiming
    } catch (error) {
      console.error('Error claiming reward:', error);
    } finally {
      setClaiming(null);
    }
  };

  if (!address) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
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
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" sx={{
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            Rewards & Trading
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip
              label={`${userStats?.points.toLocaleString()} Points`}
              color="primary"
              sx={{ fontSize: '1.1rem', py: 2.5 }}
            />
            <Chip
              label={`Level ${Math.floor((userStats?.points || 0) / 1000) + 1}`}
              color="secondary"
              sx={{ fontSize: '1.1rem', py: 2.5 }}
            />
          </Box>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          sx={{ mb: 4 }}
          variant="fullWidth"
        >
          <Tab label="Available Rewards" />
          <Tab label="Active Campaigns" />
          <Tab label="Rewards Guide" />
        </Tabs>

        {tab === 0 ? (
          <Grid container spacing={3}>
            {rewards.map((reward) => (
              <Grid item xs={12} sm={6} md={4} key={reward.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '75%' }}>
                    <Image
                      src={reward.image}
                      alt={reward.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {reward.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {reward.description}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="h6" color="primary">
                        {reward.pointsCost.toLocaleString()} Points
                      </Typography>
                      <Button
                        variant="contained"
                        disabled={
                          claiming === reward.id ||
                          (userStats?.points || 0) < reward.pointsCost
                        }
                        onClick={() => handleClaimReward(reward.id)}
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                          },
                        }}
                      >
                        {claiming === reward.id ? 'Claiming...' : 'Claim'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : tab === 1 ? (
          <Grid container spacing={3}>
            {campaigns.map((campaign) => (
              <Grid item xs={12} key={campaign.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{campaign.name}</Typography>
                      <Chip
                        label={
                          new Date() > new Date(campaign.endDate)
                            ? 'Ended'
                            : 'Active'
                        }
                        color={
                          new Date() > new Date(campaign.endDate)
                            ? 'default'
                            : 'success'
                        }
                      />
                    </Box>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {campaign.description}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Requirements:
                      </Typography>
                      <Grid container spacing={2}>
                        {campaign.requirements.trades && (
                          <Grid item>
                            <Chip
                              label={`${campaign.requirements.trades} Trades`}
                              color="primary"
                              variant="outlined"
                            />
                          </Grid>
                        )}
                        {campaign.requirements.volume && (
                          <Grid item>
                            <Chip
                              label={`$${campaign.requirements.volume.toLocaleString()} Volume`}
                              color="primary"
                              variant="outlined"
                            />
                          </Grid>
                        )}
                        {campaign.requirements.winRate && (
                          <Grid item>
                            <Chip
                              label={`${campaign.requirements.winRate}% Win Rate`}
                              color="primary"
                              variant="outlined"
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Rewards:
                      </Typography>
                      <Grid container spacing={2}>
                        {campaign.rewards.map((reward) => (
                          <Grid item key={reward.id}>
                            <Chip
                              label={`${reward.name} (${reward.pointsCost} Points)`}
                              color="secondary"
                              variant="outlined"
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <RewardsGuide />
        )}
      </Box>
    </Container>
  );
}
