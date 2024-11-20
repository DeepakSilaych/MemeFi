'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Card, Grid, Typography, TextField, Button, useTheme, InputAdornment,
  Stack, IconButton, Tooltip, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import TimeSelector from '@/components/TimeSelector';
import TokenSelector from '@/components/TokenSelector';
import PriceChart from '@/components/PriceChart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Link from 'next/link';

const tokens = [
  { symbol: 'INJ', name: 'Injective', logo: '/tokens/inj.svg' },
  { symbol: 'MEME', name: 'Memecoin', logo: '/tokens/meme.svg' },
];

// Mock price data - replace with real API data
const generateMockPriceData = (days = 30) => {
  const data = [];
  let price = 100;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02;
    const change = price * volatility * (Math.random() - 0.5);
    const open = price;
    price = open + change;
    const high = Math.max(open, price) * (1 + Math.random() * 0.01);
    const low = Math.min(open, price) * (1 - Math.random() * 0.01);
    
    data.push({
      time: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close: price,
    });
  }
  
  return data;
};

const MotionCard = motion(Card);

export default function TradePage() {
  const theme = useTheme();
  const { address } = useWallet();
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('5');
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [priceData, setPriceData] = useState(generateMockPriceData());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading new price data when token changes
    setLoading(true);
    const timer = setTimeout(() => {
      setPriceData(generateMockPriceData());
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedToken]);

  const handleTrade = (type: 'UP' | 'DOWN') => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    alert(`${type} trade placed for ${amount} ${selectedToken.symbol} for ${duration} minutes`);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input
    if (value === '') {
      setAmount('');
      return;
    }
    // Only allow numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      // Limit decimal places to 6
      const parts = value.split('.');
      if (parts.length === 2 && parts[1].length > 6) {
        setAmount(parts[0] + '.' + parts[1].slice(0, 6));
      } else {
        setAmount(value);
      }
    }
  };

  const AmountInput = () => (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Amount</Typography>
        <Tooltip title="Enter the amount you want to trade">
          <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
        </Tooltip>
      </Stack>
      <TextField
        fullWidth
        placeholder="0.0"
        value={amount}
        onChange={handleAmountChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255,255,255,0.03)',
            '&:hover': { background: 'rgba(255,255,255,0.05)' },
            '&.Mui-focused': { background: 'rgba(255,255,255,0.05)' }
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Use max balance">
                  <IconButton size="small" onClick={() => setAmount('1000')} sx={{ color: 'text.secondary' }}>
                    <AccountBalanceWalletOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography color="text.secondary" sx={{ minWidth: 45 }}>{selectedToken.symbol}</Typography>
              </Stack>
            </InputAdornment>
          ),
          sx: { '& input': { fontSize: '1.1rem', fontWeight: 500 } },
        }}
      />
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}>
        Balance: 1000.00 {selectedToken.symbol}
      </Typography>
    </Box>
  );

  const isValidTrade = address && amount && parseFloat(amount) > 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
      <Typography variant="h4" gutterBottom className="gradient-text">Trade</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass"
          >
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h6">Place Trade</Typography>
                <Tooltip title="Trade tokens by predicting price movement">
                  <HelpOutlineIcon sx={{ fontSize: 20, color: 'text.secondary', cursor: 'help' }} />
                </Tooltip>
              </Stack>

              <Box sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Token</Typography>
                  <Tooltip title="Select the token you want to trade">
                    <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
                  </Tooltip>
                </Stack>
                <Button
                  onClick={() => setTokenDialogOpen(true)}
                  fullWidth
                  sx={{
                    py: 1, px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    background: 'rgba(255,255,255,0.05)',
                    '&:hover': { background: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  <Box component="img" src={selectedToken.logo} alt={selectedToken.name} sx={{ width: 24, height: 24 }} />
                  <Typography>{selectedToken.symbol}</Typography>
                  <KeyboardArrowDownIcon sx={{ ml: 'auto' }} />
                </Button>
              </Box>

              <AmountInput />

              <Box sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Duration</Typography>
                  <Tooltip title="Select how long you want to hold the trade">
                    <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
                  </Tooltip>
                </Stack>
                <TimeSelector value={duration} onChange={setDuration} />
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleTrade('UP')}
                  disabled={!isValidTrade}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #45A049 0%, #4CAF50 100%)',
                    },
                  }}
                >
                  Trade Up
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleTrade('DOWN')}
                  disabled={!isValidTrade}
                  sx={{
                    background: 'linear-gradient(135deg, #f44336 0%, #e31b0c 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e31b0c 0%, #f44336 100%)',
                    },
                  }}
                >
                  Trade Down
                </Button>
              </Stack>
            </Box>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass"
          >
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h6">{selectedToken.symbol} Price Chart</Typography>
                {loading && <CircularProgress size={20} />}
              </Stack>
              <PriceChart data={priceData} height={400} />
            </Box>
          </MotionCard>
        </Grid>
      </Grid>

      <TokenSelector
        open={tokenDialogOpen}
        onClose={() => setTokenDialogOpen(false)}
        onSelect={setSelectedToken}
        selectedToken={selectedToken.symbol}
        tokens={tokens}
      />
    </Box>
  );
}
