'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  LinearProgress,
  Stack,
  useTheme,
} from '@mui/material';
import {
  EmojiEvents,
  Stars,
  Loyalty,
  Timeline,
  WorkspacePremium,
  LocalActivity,
  Diamond,
  Leaderboard,
  Redeem,
  Verified,
} from '@mui/icons-material';
import LearnLayout from '../components/LearnLayout';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const rewardTypes = [
  {
    title: 'Trading Rewards',
    description: 'Earn rewards for active trading',
    icon: EmojiEvents,
    details: [
      'Daily trading volume rewards',
      'Winning streak bonuses',
      'Monthly trading competitions',
      'Special event multipliers',
    ],
  },
  {
    title: 'Loyalty Points',
    description: 'Long-term engagement rewards',
    icon: Loyalty,
    details: [
      'Daily login streaks',
      'Platform activity points',
      'Community participation',
      'Referral bonuses',
    ],
  },
  {
    title: 'Achievement Badges',
    description: 'Unlock special achievements',
    icon: WorkspacePremium,
    details: [
      'Trading milestones',
      'Learning completion badges',
      'Community contribution awards',
      'Special event participation',
    ],
  },
];

const tiers = [
  {
    name: 'Bronze',
    requirements: '0-1000 Points',
    benefits: [
      'Basic trading features',
      '1x reward multiplier',
      'Standard support',
      'Basic analytics',
    ],
    color: '#CD7F32',
    progress: 30,
  },
  {
    name: 'Silver',
    requirements: '1001-5000 Points',
    benefits: [
      'Advanced trading features',
      '1.5x reward multiplier',
      'Priority support',
      'Enhanced analytics',
    ],
    color: '#C0C0C0',
    progress: 60,
  },
  {
    name: 'Gold',
    requirements: '5001-20000 Points',
    benefits: [
      'Premium trading features',
      '2x reward multiplier',
      'VIP support',
      'Premium analytics',
    ],
    color: '#FFD700',
    progress: 80,
  },
  {
    name: 'Diamond',
    requirements: '20001+ Points',
    benefits: [
      'Exclusive trading features',
      '3x reward multiplier',
      'Dedicated support',
      'Real-time analytics',
    ],
    color: '#B9F2FF',
    progress: 100,
  },
];

const specialEvents = [
  {
    title: 'Trading Tournaments',
    description: 'Compete in weekly and monthly trading competitions',
    icon: Leaderboard,
    rewards: [
      'Prize pool distribution',
      'Special badges and titles',
      'Exclusive features access',
      'Community recognition',
    ],
  },
  {
    title: 'Community Challenges',
    description: 'Participate in community-driven events',
    icon: LocalActivity,
    rewards: [
      'Bonus reward points',
      'Limited edition badges',
      'Special mentions',
      'Exclusive content access',
    ],
  },
  {
    title: 'Seasonal Events',
    description: 'Special holiday and seasonal promotions',
    icon: Redeem,
    rewards: [
      'Increased reward rates',
      'Themed collectibles',
      'Bonus trading features',
      'Special event rewards',
    ],
  },
];

const MotionBox = motion(Box);

export default function RewardsPage() {
  const theme = useTheme();

  return (
    <LearnLayout
      title="Rewards System"
      description="Explore how to earn and maximize your rewards"
      category="Rewards"
    >
      <Box>
        <Alert severity="success" sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Rewards System Overview</strong>
          </Typography>
          <Typography variant="body2">
            MemeFi offers a comprehensive rewards system that incentivizes active trading, community participation, and long-term engagement.
          </Typography>
        </Alert>

        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Reward Types
        </Typography>

        <Grid container spacing={4}>
          {rewardTypes.map((type, index) => (
            <Grid item xs={12} md={4} key={type.title}>
              <MotionCard
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <type.icon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{type.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </Box>
                  <List dense>
                    {type.details.map((detail, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <Stars sx={{ color: theme.palette.warning.main, fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary={detail} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
          Reward Tiers
        </Typography>

        <Grid container spacing={3}>
          {tiers.map((tier, index) => (
            <Grid item xs={12} sm={6} key={tier.name}>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Diamond sx={{ color: tier.color, mr: 1 }} />
                        <Typography variant="h6" sx={{ color: tier.color }}>
                          {tier.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {tier.requirements}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={tier.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: tier.color,
                          },
                        }}
                      />
                      <List dense>
                        {tier.benefits.map((benefit, idx) => (
                          <ListItem key={idx}>
                            <ListItemIcon>
                              <Verified sx={{ color: tier.color, fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText primary={benefit} />
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
          Special Events
        </Typography>

        <Grid container spacing={4}>
          {specialEvents.map((event, index) => (
            <Grid item xs={12} md={4} key={event.title}>
              <MotionCard
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <event.icon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{event.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                    </Box>
                  </Box>
                  <List dense>
                    {event.rewards.map((reward, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <Stars sx={{ color: theme.palette.warning.main, fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary={reward} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tips to Maximize Rewards:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Timeline sx={{ color: theme.palette.info.main }} />
              </ListItemIcon>
              <ListItemText primary="Maintain consistent trading activity to climb reward tiers" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Timeline sx={{ color: theme.palette.info.main }} />
              </ListItemIcon>
              <ListItemText primary="Participate in special events and tournaments" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Timeline sx={{ color: theme.palette.info.main }} />
              </ListItemIcon>
              <ListItemText primary="Engage with the community through various activities" />
            </ListItem>
          </List>
        </Alert>
      </Box>
    </LearnLayout>
  );
}
