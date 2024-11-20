'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  useTheme,
} from '@mui/material';
import {
  AccountBalanceWallet,
  SwapHoriz,
  LocalAtm,
  Security,
  CheckCircleOutline,
  Info,
} from '@mui/icons-material';
import LearnLayout from '../components/LearnLayout';
import { motion } from 'framer-motion';

const steps = [
  {
    label: 'Connect Your Wallet',
    icon: AccountBalanceWallet,
    content: (
      <>
        <Typography paragraph>
          To start trading on MemeFi, you'll need a Web3 wallet. We recommend using:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutline color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="MetaMask"
              secondary="Most popular and widely supported"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutline color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="WalletConnect"
              secondary="Connect with many different wallets"
            />
          </ListItem>
        </List>
        <Alert severity="info" sx={{ mt: 2 }}>
          Make sure your wallet is funded with some INJ (Injective) tokens for gas fees.
        </Alert>
      </>
    ),
  },
  {
    label: 'Understand Trading Basics',
    icon: SwapHoriz,
    content: (
      <>
        <Typography paragraph>
          MemeFi offers a unique UP/DOWN trading mechanism for meme coins:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Info color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="UP Trading"
              secondary="Predict the price will rise within the time period"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Info color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="DOWN Trading"
              secondary="Predict the price will fall within the time period"
            />
          </ListItem>
        </List>
        <Typography paragraph sx={{ mt: 2 }}>
          Each trade requires:
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="• Trade Amount (minimum 10 INJ)"
              secondary="The amount you want to trade with"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="• Time Period"
              secondary="Duration of your trade (1min to 1hour)"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="• Direction"
              secondary="Your price movement prediction (UP or DOWN)"
            />
          </ListItem>
        </List>
      </>
    ),
  },
  {
    label: 'Start Small',
    icon: LocalAtm,
    content: (
      <>
        <Typography paragraph>
          We recommend starting with smaller trades to get familiar with the platform:
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="• Start with minimum trade amounts"
              secondary="Begin with 10 INJ trades to understand the mechanics"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="• Use shorter time periods"
              secondary="1-minute trades are good for learning"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="• Track your results"
              secondary="Use the dashboard to monitor your performance"
            />
          </ListItem>
        </List>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Never trade more than you can afford to lose. Meme coin trading can be highly volatile.
        </Alert>
      </>
    ),
  },
  {
    label: 'Stay Secure',
    icon: Security,
    content: (
      <>
        <Typography paragraph>
          Security is crucial when trading cryptocurrencies. Follow these best practices:
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="• Never share your private keys"
              secondary="Keep your wallet credentials secure"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="• Verify transactions"
              secondary="Always double-check transaction details"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="• Use hardware wallets"
              secondary="For storing larger amounts"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="• Enable additional security"
              secondary="Use 2FA where available"
            />
          </ListItem>
        </List>
      </>
    ),
  },
];

const MotionBox = motion(Box);

export default function GettingStartedPage() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <LearnLayout
      title="Getting Started with MemeFi"
      description="Learn the basics of trading meme coins on our platform"
      category="Getting Started"
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={() => (
                <step.icon
                  sx={{
                    color: activeStep >= index ? theme.palette.primary.main : 'grey.500',
                    fontSize: 28,
                  }}
                />
              )}
            >
              <Typography variant="h6">{step.label}</Typography>
            </StepLabel>
            <StepContent>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {step.content}
                <Box sx={{ mb: 2, mt: 4 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        mr: 1,
                        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </MotionBox>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <MotionBox
          sx={{ p: 3 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography paragraph>
            Congratulations! You've completed the getting started guide. 
            You're now ready to start trading on MemeFi.
          </Typography>
          <Button
            onClick={handleReset}
            variant="outlined"
            sx={{ mr: 1, mt: 1 }}
          >
            Review Guide Again
          </Button>
          <Button
            variant="contained"
            href="/trade"
            sx={{
              mt: 1,
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            }}
          >
            Start Trading
          </Button>
        </MotionBox>
      )}
    </LearnLayout>
  );
}
