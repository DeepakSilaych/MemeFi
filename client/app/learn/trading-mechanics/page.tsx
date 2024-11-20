'use client';

import React, { useEffect } from 'react';
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
  Chip,
  Stack,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Timeline,
  SwapHoriz,
  Timer,
  LocalOffer,
  Analytics,
  AccountBalance,
  Speed,
  Layers,
} from '@mui/icons-material';
import LearnLayout from '../components/LearnLayout';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

const MotionCard = motion(Card);

const tradingTypes = [
  {
    id: 'direction',
    title: 'UP Trading',
    description: 'Predict and profit from price increases',
    icon: TrendingUp,
    details: [
      'Set your position size and timeframe',
      'Profit when price rises above entry',
      'Limited downside risk',
      'Automatic position closure',
    ],
  },
  {
    id: 'direction',
    title: 'DOWN Trading',
    description: 'Predict and profit from price decreases',
    icon: TrendingDown,
    details: [
      'Similar to UP trading but inverse',
      'Profit when price falls below entry',
      'Protected against unlimited losses',
      'Time-based position expiry',
    ],
  },
];

const timeframes = [
  {
    duration: '5 Minutes',
    description: 'Quick trades for active traders',
    multiplier: '1.8x',
    risk: 'High',
    details: [
      'Best for scalping strategies',
      'Requires active monitoring',
      'Higher potential returns',
      'Increased market volatility',
    ],
    color: '#4ECDC4',
  },
  {
    duration: '15 Minutes',
    description: 'Balanced short-term positions',
    multiplier: '2.2x',
    risk: 'Medium-High',
    details: [
      'Popular among day traders',
      'Good for trend following',
      'Moderate market noise',
      'Better price action signals',
    ],
    color: '#FFD93D',
  },
  {
    duration: '1 Hour',
    description: 'Extended trading window',
    multiplier: '2.5x',
    risk: 'Medium',
    details: [
      'Suitable for swing trading',
      'Reduced market noise',
      'Clear trend identification',
      'Lower monitoring frequency',
    ],
    color: '#6C63FF',
  },
  {
    duration: '4 Hours',
    description: 'Long-term position taking',
    multiplier: '3.0x',
    risk: 'Low',
    details: [
      'Strategic position taking',
      'Minimal market noise',
      'Higher probability setups',
      'Best for major trends',
    ],
    color: '#FF6B6B',
  },
];

const features = [
  {
    id: 'amount',
    title: 'Position Sizing',
    description: 'Learn how to size your positions effectively',
    icon: Layers,
    tips: [
      'Start with 1-2% of your portfolio per trade',
      'Consider potential losses before entering',
      'Use the position calculator for optimal sizing',
      'Scale positions based on conviction',
    ],
  },
  {
    id: 'settlement',
    title: 'Settlement & Execution',
    description: 'Understanding how trades are executed and settled',
    icon: AccountBalance,
    tips: [
      'Positions settle automatically at expiry',
      'Profits are instantly credited to your wallet',
      'Execution price is based on oracle feeds',
      'Keep enough INJ for gas fees',
    ],
  },
];

const MotionBox = motion(Box);

export default function TradingMechanicsPage() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const section = searchParams.get('section');

  useEffect(() => {
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [section]);

  return (
    <LearnLayout
      title="Trading Mechanics"
      description="Deep dive into MemeFi's trading mechanics and features"
      category="Trading"
    >
      <Box>
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Trading Mechanics Overview</strong>
          </Typography>
          <Typography variant="body2">
            MemeFi offers a unique UP/DOWN trading system with predefined timeframes and position sizes. Learn how each component works to trade effectively.
          </Typography>
        </Alert>

        <Box id="direction">
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Trading Direction
          </Typography>

          <Grid container spacing={4}>
            {tradingTypes.map((type, index) => (
              <Grid item xs={12} md={6} key={type.title}>
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
                            <SwapHoriz sx={{ color: theme.palette.success.main, fontSize: 16 }} />
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
        </Box>

        <Box id="duration" sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Trading Timeframes
          </Typography>

          <Grid container spacing={3}>
            {timeframes.map((timeframe, index) => (
              <Grid item xs={12} sm={6} key={timeframe.duration}>
                <MotionBox
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, transparent, ${timeframe.color}, transparent)`,
                      },
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Timer sx={{ color: timeframe.color }} />
                          <Box>
                            <Typography variant="h6" sx={{ color: timeframe.color }}>
                              {timeframe.duration}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {timeframe.description}
                            </Typography>
                          </Box>
                        </Box>

                        <Box 
                          sx={{ 
                            display: 'flex', 
                            gap: 1,
                            '& > div': {
                              flex: 1,
                              p: 1,
                              borderRadius: 1,
                              background: 'rgba(255, 255, 255, 0.03)',
                              textAlign: 'center',
                            }
                          }}
                        >
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Multiplier
                            </Typography>
                            <Typography variant="body2" sx={{ color: timeframe.color, fontWeight: 600 }}>
                              {timeframe.multiplier}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Risk Level
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 
                                  timeframe.risk === 'High' ? '#FF4842' :
                                  timeframe.risk === 'Medium-High' ? '#FFB74D' :
                                  timeframe.risk === 'Medium' ? '#4ECDC4' : '#54D62C',
                                fontWeight: 600 
                              }}
                            >
                              {timeframe.risk}
                            </Typography>
                          </Box>
                        </Box>

                        <List dense disablePadding>
                          {timeframe.details.map((detail, idx) => (
                            <ListItem key={idx} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <Speed sx={{ color: timeframe.color, fontSize: 16 }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={detail}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  sx: { color: 'text.secondary' }
                                }}
                              />
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
        </Box>

        <Box id="amount" sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Key Features
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={feature.title}>
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
                      <feature.icon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                      <Box>
                        <Typography variant="h6">{feature.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                    <List dense>
                      {feature.tips.map((tip, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon>
                            <Speed sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Alert severity="warning" sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Important Trading Notes:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <LocalOffer sx={{ color: theme.palette.warning.main }} />
              </ListItemIcon>
              <ListItemText primary="Always start with small positions to understand the mechanics" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocalOffer sx={{ color: theme.palette.warning.main }} />
              </ListItemIcon>
              <ListItemText primary="Monitor your positions closely as they approach expiry" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocalOffer sx={{ color: theme.palette.warning.main }} />
              </ListItemIcon>
              <ListItemText primary="Keep enough INJ in your wallet for gas fees" />
            </ListItem>
          </List>
        </Alert>
      </Box>
    </LearnLayout>
  );
}
