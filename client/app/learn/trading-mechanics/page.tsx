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
    multiplier: '2.5x',
    risk: 'High',
    details: [
      'Best for scalping and momentum trading',
      'Requires constant market monitoring',
      'Suitable for volatile market conditions',
      'Higher potential returns but increased risk',
      'Perfect for news-based trading',
    ],
    color: '#FF6B6B',
  },
  {
    duration: '15 Minutes',
    description: 'Short-term position taking',
    multiplier: '2.2x',
    risk: 'Medium-High',
    details: [
      'Ideal for short-term trend following',
      'Allows time for pattern confirmation',
      'Good for range trading strategies',
      'Balance of risk and opportunity',
      'Popular among day traders',
    ],
    color: '#4ECDC4',
  },
  {
    duration: '30 Minutes',
    description: 'Medium-term trading window',
    multiplier: '2.0x',
    risk: 'Medium',
    details: [
      'Suitable for trend continuation trades',
      'Time for thorough technical analysis',
      'Reduced impact of market noise',
      'Better for systematic trading',
      'Good for breakout strategies',
    ],
    color: '#45B7D1',
  },
  {
    duration: '1 Hour',
    description: 'Standard trading timeframe',
    multiplier: '1.8x',
    risk: 'Medium-Low',
    details: [
      'Popular among professional traders',
      'Clear trend identification',
      'Ideal for swing trading setups',
      'Good for position building',
      'Balanced risk-reward ratio',
    ],
    color: '#96CEB4',
  },
  {
    duration: '4 Hours',
    description: 'Extended market analysis',
    multiplier: '1.5x',
    risk: 'Low',
    details: [
      'Perfect for major trend trades',
      'Reduced daily monitoring needed',
      'Higher probability setups',
      'Great for position trading',
      'Lower trading frequency required',
    ],
    color: '#88D8B0',
  },
  {
    duration: '1 Day',
    description: 'Daily trend capturing',
    multiplier: '1.3x',
    risk: 'Very Low',
    details: [
      'Capture daily market cycles',
      'Best for strong trend following',
      'Minimal time commitment needed',
      'Ideal for part-time traders',
      'Focus on major support/resistance',
    ],
    color: '#7B6CF6',
  },
  {
    duration: '1 Week',
    description: 'Long-term position taking',
    multiplier: '1.2x',
    risk: 'Ultra Low',
    details: [
      'Strategic position building',
      'Perfect for macro trends',
      'Lowest monitoring requirement',
      'Best for portfolio strategies',
      'Maximum trend capture potential',
    ],
    color: '#6C5CE7',
  },
];

const features = [
  {
    id: 'amount',
    title: 'Position Sizing',
    description: 'Master the art of position sizing',
    icon: Layers,
    tips: [
      'Start with 1-2% of portfolio per trade',
      'Scale position size with confidence',
      'Consider volatility when sizing',
      'Use leverage appropriately',
      'Always plan your exit strategy',
    ],
    advanced: [
      'Kelly Criterion for optimal sizing',
      'Risk-adjusted position scaling',
      'Correlation-based portfolio sizing',
      'Dynamic risk management',
    ],
  },
  {
    id: 'analysis',
    title: 'Market Analysis',
    description: 'Tools and techniques for market analysis',
    icon: Analytics,
    tips: [
      'Combine multiple timeframes',
      'Use volume for confirmation',
      'Watch key support/resistance',
      'Monitor market sentiment',
      'Track correlated assets',
    ],
    advanced: [
      'Advanced chart patterns',
      'Momentum indicators',
      'Volatility analysis',
      'Order flow reading',
    ],
  },
  {
    id: 'settlement',
    title: 'Settlement & Execution',
    description: 'Understanding trade mechanics',
    icon: AccountBalance,
    tips: [
      'Automatic position settlement',
      'Oracle-based price feeds',
      'Instant profit distribution',
      'Gas fee optimization',
      'Slippage protection',
    ],
    advanced: [
      'Settlement mechanisms',
      'Oracle redundancy',
      'MEV protection',
      'Network optimization',
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
                    {feature.advanced && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Advanced Tips
                        </Typography>
                        <List dense>
                          {feature.advanced.map((tip, idx) => (
                            <ListItem key={idx}>
                              <ListItemIcon>
                                <Speed sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                              </ListItemIcon>
                              <ListItemText primary={tip} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
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
