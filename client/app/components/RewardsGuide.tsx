import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  Timer,
  EmojiEvents,
  LocalAtm,
  GroupAdd,
  VerifiedUser,
  ExpandMore,
  Casino,
  AccountBalance,
  Speed,
} from '@mui/icons-material';

const rewardCategories = [
  {
    title: 'Trading Rewards',
    icon: TrendingUp,
    items: [
      'Earn 10 points for each completed trade',
      'Get 50 bonus points for winning trades',
      'Receive 100 points for achieving a daily win streak of 5 trades',
      'Earn 500 points for reaching $10,000 in trading volume'
    ]
  },
  {
    title: 'Time-Based Rewards',
    icon: Timer,
    items: [
      'Daily login bonus: 5 points',
      'Weekly active trader bonus: 50 points',
      'Monthly loyalty bonus: 200 points',
      'Seasonal trading competition participation: 1000 points'
    ]
  },
  {
    title: 'Achievement Rewards',
    icon: EmojiEvents,
    items: [
      'First trade completion: 100 points',
      'First profitable trade: 150 points',
      'First liquidity provision: 300 points',
      'Trading milestone achievements: up to 1000 points'
    ]
  },
  {
    title: 'Liquidity Provider Rewards',
    icon: LocalAtm,
    items: [
      'Earn 20 points per day for active liquidity provision',
      'Bonus points based on liquidity pool share',
      'Special rewards for long-term liquidity providers',
      'Extra points for providing liquidity to new pairs'
    ]
  },
  {
    title: 'Community Rewards',
    icon: GroupAdd,
    items: [
      'Referral bonus: 200 points per active referral',
      'Community event participation: 50-500 points',
      'Bug reporting and feedback: 100-1000 points',
      'Social media engagement: 10-50 points per action'
    ]
  }
];

const tradingTips = [
  {
    title: 'Risk Management',
    icon: Casino,
    content: 'Never invest more than you can afford to lose. Start with smaller trades to understand the platform.'
  },
  {
    title: 'Market Analysis',
    icon: TrendingUp,
    content: 'Use our built-in charts and indicators to make informed trading decisions.'
  },
  {
    title: 'Portfolio Diversification',
    icon: AccountBalance,
    content: 'Don\'t put all your eggs in one basket. Trade different meme coins to spread risk.'
  },
  {
    title: 'Trading Speed',
    icon: Speed,
    content: 'Our platform processes trades quickly, but always double-check your orders before confirming.'
  }
];

export default function RewardsGuide() {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', 
        backgroundClip: 'text', color: 'transparent' }}>
        How to Earn Rewards
      </Typography>

      {rewardCategories.map((category, index) => (
        <Card key={index} sx={{ mb: 2, background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <category.icon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6">{category.title}</Typography>
            </Box>
            <List dense>
              {category.items.map((item, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    <VerifiedUser sx={{ color: theme.palette.secondary.main, fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}

      <Typography variant="h5" sx={{ mt: 4, mb: 3, background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', 
        backgroundClip: 'text', color: 'transparent' }}>
        Trading Tips
      </Typography>

      {tradingTips.map((tip, index) => (
        <Accordion 
          key={index} 
          sx={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mb: 1,
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <tip.icon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography>{tip.title}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              {tip.content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
