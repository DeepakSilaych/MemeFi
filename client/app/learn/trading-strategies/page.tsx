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
  Chip,
  Alert,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  ShowChart,
  Timeline,
  Psychology,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import LearnLayout from '../components/LearnLayout';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const strategies = [
  {
    title: 'Trend Following',
    icon: TrendingUp,
    description: 'Follow established price trends for potential gains',
    difficulty: 'Beginner',
    timeFrame: 'Medium-term',
    steps: [
      'Identify the current trend using moving averages',
      'Look for trend continuation patterns',
      'Enter trades in the direction of the trend',
      'Set stop-loss orders to protect capital',
    ],
    tips: 'The trend is your friend until it bends. Always confirm trends with multiple indicators.',
  },
  {
    title: 'Momentum Trading',
    icon: ShowChart,
    description: 'Capitalize on strong price movements and market sentiment',
    difficulty: 'Intermediate',
    timeFrame: 'Short-term',
    steps: [
      'Monitor trading volume and price action',
      'Look for breakout patterns',
      'Enter early in strong price movements',
      'Take profits quickly as momentum can shift',
    ],
    tips: 'Use volume as a confirmation of momentum. Be prepared for quick reversals.',
  },
  {
    title: 'Mean Reversion',
    icon: Timeline,
    description: 'Trade on the assumption that prices will return to the average',
    difficulty: 'Advanced',
    timeFrame: 'Short to Medium-term',
    steps: [
      'Identify overbought or oversold conditions',
      'Wait for price to deviate significantly from moving averages',
      'Enter counter-trend positions',
      'Set tight stop-losses for protection',
    ],
    tips: 'This strategy requires patience and precise entry/exit timing.',
  },
  {
    title: 'Sentiment Trading',
    icon: Psychology,
    description: 'Trade based on market sentiment and social media trends',
    difficulty: 'Intermediate',
    timeFrame: 'Variable',
    steps: [
      'Monitor social media trends and mentions',
      'Analyze trading volume and price action',
      'Enter early during sentiment shifts',
      'Maintain strict risk management',
    ],
    tips: 'Meme coins are heavily influenced by social sentiment. Stay updated with community news.',
  },
];

const riskManagement = [
  {
    title: 'Position Sizing',
    content: 'Never risk more than 1-2% of your trading capital on a single trade.',
  },
  {
    title: 'Stop-Loss Orders',
    content: 'Always set stop-loss orders to protect your capital from significant losses.',
  },
  {
    title: 'Take Profit Levels',
    content: 'Set realistic profit targets and stick to your exit strategy.',
  },
  {
    title: 'Risk-Reward Ratio',
    content: 'Aim for a minimum risk-reward ratio of 1:2 for each trade.',
  },
];

export default function TradingStrategiesPage() {
  const theme = useTheme();

  return (
    <LearnLayout
      title="Trading Strategies"
      description="Master different approaches to meme coin trading"
      category="Trading Strategies"
    >
      <Box>
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="body1">
            Trading meme coins involves high risk. Always do your own research and never trade more than you can afford to lose.
          </Typography>
        </Alert>

        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Popular Trading Strategies
        </Typography>

        <Grid container spacing={4}>
          {strategies.map((strategy, index) => (
            <Grid item xs={12} md={6} key={strategy.title}>
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
                    <strategy.icon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        {strategy.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={strategy.difficulty}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={strategy.timeFrame}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography color="text.secondary" paragraph>
                    {strategy.description}
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Key Steps:
                  </Typography>
                  <List dense>
                    {strategy.steps.map((step, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary={step} />
                      </ListItem>
                    ))}
                  </List>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Pro Tip:</strong> {strategy.tips}
                    </Typography>
                  </Alert>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
          Risk Management
        </Typography>

        <Grid container spacing={3}>
          {riskManagement.map((item, index) => (
            <Grid item xs={12} sm={6} key={item.title}>
              <MotionCard
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Warning sx={{ color: theme.palette.warning.main, mr: 1 }} />
                    <Typography variant="h6">{item.title}</Typography>
                  </Box>
                  <Typography color="text.secondary">
                    {item.content}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </LearnLayout>
  );
}
