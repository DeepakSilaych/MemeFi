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

const MotionCard = motion(Card);

const tradingTypes = [
  {
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
  },
  {
    duration: '15 Minutes',
    description: 'Balanced short-term positions',
    multiplier: '2.2x',
    risk: 'Medium-High',
  },
  {
    duration: '1 Hour',
    description: 'Extended trading window',
    multiplier: '2.5x',
    risk: 'Medium',
  },
  {
    duration: '4 Hours',
    description: 'Long-term position taking',
    multiplier: '3.0x',
    risk: 'Medium-Low',
  },
];

const features = [
  {
    title: 'Position Sizing',
    description: 'Flexible position sizes from 10 to 1000 INJ',
    icon: Layers,
    tips: [
      'Start small to learn the mechanics',
      'Use position sizing calculator',
      'Consider your risk tolerance',
      'Account for potential losses',
    ],
  },
  {
    title: 'Price Feeds',
    description: 'Real-time oracle price data from multiple sources',
    icon: Analytics,
    tips: [
      'Monitor price movements closely',
      'Understand price feed delays',
      'Check multiple timeframes',
      'Watch for high volatility periods',
    ],
  },
  {
    title: 'Settlement',
    description: 'Automatic position settlement at expiry',
    icon: AccountBalance,
    tips: [
      'Positions settle instantly at expiry',
      'Profits auto-credited to wallet',
      'No manual intervention needed',
      'Keep enough INJ for gas fees',
    ],
  },
];

const MotionBox = motion(Box);

export default function TradingMechanicsPage() {
  const theme = useTheme();

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
            MemeFi offers a unique UP/DOWN trading system on the Injective blockchain, allowing you to profit from both rising and falling markets with limited risk.
          </Typography>
        </Alert>

        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Trading Types
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

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
          Trading Timeframes
        </Typography>

        <Grid container spacing={3}>
          {timeframes.map((timeframe, index) => (
            <Grid item xs={12} sm={6} md={3} key={timeframe.duration}>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Timer sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography variant="h6">{timeframe.duration}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {timeframe.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={`Multiplier: ${timeframe.multiplier}`}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={`Risk: ${timeframe.risk}`}
                          color={
                            timeframe.risk === 'High' ? 'error' :
                            timeframe.risk === 'Medium-High' ? 'warning' :
                            timeframe.risk === 'Medium' ? 'info' : 'success'
                          }
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
          Key Features
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={feature.title}>
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
