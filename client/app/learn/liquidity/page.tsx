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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import {
  AccountBalance,
  Paid,
  ExpandMore,
  MonetizationOn,
  Warning,
  Info,
  CheckCircle,
  LocalAtm,
} from '@mui/icons-material';
import LearnLayout from '../components/LearnLayout';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const liquidityBasics = [
  {
    title: 'What is Liquidity Provision?',
    content: 'Liquidity provision involves adding your tokens to a trading pool, enabling other users to trade. In return, you earn fees from trades.',
    icon: AccountBalance,
  },
  {
    title: 'How Do You Earn?',
    content: 'Earn a share of trading fees proportional to your pool contribution. The more liquidity you provide, the more fees you can earn.',
    icon: Paid,
  },
  {
    title: 'Risks and Rewards',
    content: 'While you earn trading fees, be aware of impermanent loss - when token price changes affect your holdings value.',
    icon: MonetizationOn,
  },
];

const faqs = [
  {
    question: 'What is Impermanent Loss?',
    answer: 'Impermanent loss occurs when the price ratio of your provided tokens changes compared to when you deposited them. This can result in having less value than if you had simply held the tokens.',
  },
  {
    question: 'How are Fees Calculated?',
    answer: 'Trading fees are typically 0.3% of each trade, distributed proportionally to liquidity providers based on their share of the pool.',
  },
  {
    question: 'Can I Withdraw Anytime?',
    answer: 'Yes, you can withdraw your liquidity at any time, but consider gas fees and potential impermanent loss before doing so.',
  },
  {
    question: 'What Pairs Can I Provide Liquidity For?',
    answer: 'You can provide liquidity for any available trading pair on MemeFi. Popular pairs include MEME/INJ and other meme coins paired with INJ.',
  },
];

const steps = [
  {
    title: 'Choose a Trading Pair',
    content: 'Select which tokens you want to provide liquidity for. You need equal values of both tokens.',
    icon: LocalAtm,
  },
  {
    title: 'Calculate Amounts',
    content: 'Determine how much of each token to provide. The ratio must match the current pool ratio.',
    icon: MonetizationOn,
  },
  {
    title: 'Approve Tokens',
    content: 'Approve the smart contract to access your tokens. This requires a one-time transaction.',
    icon: CheckCircle,
  },
  {
    title: 'Add Liquidity',
    content: 'Confirm the transaction to add your tokens to the pool. You\'ll receive LP tokens in return.',
    icon: AccountBalance,
  },
];

const MotionBox = motion(Box);

export default function LiquidityPage() {
  const theme = useTheme();

  return (
    <LearnLayout
      title="Liquidity Provision"
      description="Learn how to provide liquidity and earn passive income"
      category="Liquidity"
    >
      <Box>
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            Providing liquidity can be a great way to earn passive income, but it comes with risks. Make sure you understand the concept of impermanent loss before starting.
          </Typography>
        </Alert>

        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Understanding Liquidity
        </Typography>

        <Grid container spacing={4}>
          {liquidityBasics.map((item, index) => (
            <Grid item xs={12} md={4} key={item.title}>
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
                    <item.icon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
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

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
          How to Provide Liquidity
        </Typography>

        <Grid container spacing={3}>
          {steps.map((step, index) => (
            <Grid item xs={12} key={step.title}>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {index + 1}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6">{step.title}</Typography>
                    <Typography color="text.secondary">{step.content}</Typography>
                  </Box>
                </Box>
              </MotionBox>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
          Frequently Asked Questions
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion
            key={faq.question}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              mb: 2,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Info sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1">{faq.question}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Alert severity="warning" sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Important Considerations:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Warning sx={{ color: theme.palette.warning.main }} />
              </ListItemIcon>
              <ListItemText primary="Monitor your positions regularly to assess impermanent loss" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Warning sx={{ color: theme.palette.warning.main }} />
              </ListItemIcon>
              <ListItemText primary="Consider gas fees when adding or removing liquidity" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Warning sx={{ color: theme.palette.warning.main }} />
              </ListItemIcon>
              <ListItemText primary="Start with smaller amounts to understand the mechanics" />
            </ListItem>
          </List>
        </Alert>
      </Box>
    </LearnLayout>
  );
}
