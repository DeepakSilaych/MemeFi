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
  Divider,
  useTheme,
} from '@mui/material';
import {
  Security,
  Lock,
  PhishingOutlined,
  VpnKey,
  Shield,
  Warning,
  CheckCircle,
  ErrorOutline,
  VerifiedUser,
  AccountBalanceWallet,
} from '@mui/icons-material';
import LearnLayout from '../components/LearnLayout';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const securityPrinciples = [
  {
    title: 'Private Key Security',
    description: 'Your private keys are the most important security element',
    icon: VpnKey,
    tips: [
      'Never share your private keys or seed phrase',
      'Store backup copies in secure, offline locations',
      'Use hardware wallets for large amounts',
      'Never store keys in plain text on your devices',
    ],
  },
  {
    title: 'Wallet Safety',
    description: 'Protect your wallet from unauthorized access',
    icon: AccountBalanceWallet,
    tips: [
      'Use strong, unique passwords',
      'Enable two-factor authentication',
      'Regular security audits of connected sites',
      'Keep your recovery phrase secure',
    ],
  },
  {
    title: 'Phishing Prevention',
    description: 'Avoid common scams and fraudulent attempts',
    icon: PhishingOutlined,
    tips: [
      'Verify website URLs carefully',
      'Never click suspicious links',
      'Don\'t trust unsolicited messages',
      'Be wary of too-good-to-be-true offers',
    ],
  },
  {
    title: 'Smart Contract Safety',
    description: 'Understand and verify smart contract interactions',
    icon: Shield,
    tips: [
      'Review transaction details thoroughly',
      'Verify contract addresses',
      'Set appropriate gas limits',
      'Use hardware wallet for confirmation',
    ],
  },
];

const commonScams = [
  {
    type: 'Fake Websites',
    description: 'Scammers create identical-looking websites to steal your credentials.',
    prevention: 'Always verify the URL and bookmark official sites.',
  },
  {
    type: 'Impersonation Scams',
    description: 'Fraudsters pose as support staff or team members.',
    prevention: 'Official team members will never ask for your private keys or funds.',
  },
  {
    type: 'Fake Tokens',
    description: 'Scammers create tokens with names similar to popular ones.',
    prevention: 'Verify token contracts on block explorers before trading.',
  },
  {
    type: 'Pump and Dump',
    description: 'Coordinated buying to artificially inflate prices before selling.',
    prevention: 'Be skeptical of sudden price increases without fundamental backing.',
  },
];

const bestPractices = [
  'Use hardware wallets for storing large amounts',
  'Enable all available security features',
  'Keep software and firmware updated',
  'Use unique passwords for each platform',
  'Regular security audits of connected apps',
  'Monitor your account activity',
  'Use secure internet connections',
  'Enable transaction notifications',
];

const MotionBox = motion(Box);

export default function SecurityPage() {
  const theme = useTheme();

  return (
    <LearnLayout
      title="Security Guide"
      description="Learn how to keep your assets safe while trading"
      category="Security"
    >
      <Box>
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Important:</strong> Security should be your top priority when trading cryptocurrencies.
          </Typography>
          <Typography variant="body2">
            The cryptocurrency space attracts many scammers. Always be vigilant and follow security best practices.
          </Typography>
        </Alert>

        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Security Principles
        </Typography>

        <Grid container spacing={4}>
          {securityPrinciples.map((principle, index) => (
            <Grid item xs={12} md={6} key={principle.title}>
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
                    <principle.icon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{principle.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {principle.description}
                      </Typography>
                    </Box>
                  </Box>
                  <List dense>
                    {principle.tips.map((tip, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 16 }} />
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

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
          Common Scams to Avoid
        </Typography>

        <Grid container spacing={3}>
          {commonScams.map((scam, index) => (
            <Grid item xs={12} key={scam.type}>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ErrorOutline sx={{ color: theme.palette.error.main, mr: 2 }} />
                      <Typography variant="h6">{scam.type}</Typography>
                    </Box>
                    <Typography color="text.secondary" paragraph>
                      {scam.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <VerifiedUser sx={{ color: theme.palette.success.main, mr: 1 }} />
                      <Typography variant="subtitle2">
                        Prevention: {scam.prevention}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
          Security Best Practices
        </Typography>

        <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
          <CardContent>
            <Grid container spacing={2}>
              {bestPractices.map((practice, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <Lock sx={{ color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText primary={practice} />
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Alert severity="error" sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Red Flags to Watch Out For:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Warning sx={{ color: theme.palette.error.main }} />
              </ListItemIcon>
              <ListItemText primary="Requests for private keys or seed phrases" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Warning sx={{ color: theme.palette.error.main }} />
              </ListItemIcon>
              <ListItemText primary="Promises of guaranteed returns or profits" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Warning sx={{ color: theme.palette.error.main }} />
              </ListItemIcon>
              <ListItemText primary="Pressure to act quickly or FOMO-inducing messages" />
            </ListItem>
          </List>
        </Alert>
      </Box>
    </LearnLayout>
  );
}
