'use client';

import React from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import { useWallet } from '../context/WalletContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { motion } from 'framer-motion';

const WalletButton: React.FC = () => {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  if (isConnecting) {
    return (
      <Button
        variant="contained"
        disabled
        sx={{
          minWidth: 180,
          background: 'linear-gradient(135deg, rgba(0, 246, 255, 0.2), rgba(0, 209, 255, 0.2))',
          borderRadius: '12px',
          padding: '10px 20px',
        }}
      >
        <CircularProgress size={24} sx={{ color: '#00F6FF' }} />
      </Button>
    );
  }

  const StyledButton = motion(Button);

  if (isConnected && address) {
    return (
      <StyledButton
        component={motion.button}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        variant="contained"
        onClick={disconnect}
        sx={{
          background: 'linear-gradient(135deg, rgba(0, 246, 255, 0.2), rgba(0, 209, 255, 0.2))',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '10px 20px',
          border: '1px solid rgba(0, 246, 255, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(0, 246, 255, 0.3), rgba(0, 209, 255, 0.3))',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalanceWalletIcon />
          <Typography
            sx={{
              background: 'linear-gradient(90deg, #00F6FF 0%, #00D1FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
            }}
          >
            {formatAddress(address)}
          </Typography>
        </Box>
      </StyledButton>
    );
  }

  return (
    <StyledButton
      component={motion.button}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      variant="contained"
      onClick={connect}
      sx={{
        background: 'linear-gradient(135deg, #00F6FF, #00D1FF)',
        borderRadius: '12px',
        padding: '10px 20px',
        boxShadow: '0 8px 32px rgba(0, 246, 255, 0.2)',
        '&:hover': {
          background: 'linear-gradient(135deg, #00D1FF, #00F6FF)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountBalanceWalletIcon />
        <Typography sx={{ fontWeight: 600 }}>
          Connect Wallet
        </Typography>
      </Box>
    </StyledButton>
  );
};

export default WalletButton;
