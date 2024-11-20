'use client';

import React, { useState } from 'react';
import {
  Box, Card, Grid, Typography, TextField, Button, InputAdornment,
  Slider, Stack, IconButton, Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import TokenSelector from '@/components/TokenSelector';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Link from 'next/link';

const MotionCard = motion(Card);
const tokens = [
  { symbol: 'INJ', name: 'Injective', logo: '/tokens/inj.svg' },
  { symbol: 'MEME', name: 'Memecoin', logo: '/tokens/meme.svg' },
];

const formatNumber = (value: string) => {
  const cleanValue = value.replace(/[^\d.]/g, '');
  const parts = cleanValue.split('.');
  return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') :
    parts[1]?.length > 6 ? parts[0] + '.' + parts[1].slice(0, 6) : cleanValue;
};

export default function LiquidityPage() {
  const { address } = useWallet();
  const [token1DialogOpen, setToken1DialogOpen] = useState(false);
  const [token2DialogOpen, setToken2DialogOpen] = useState(false);
  const [token1, setToken1] = useState(tokens[0]);
  const [token2, setToken2] = useState(tokens[1]);
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  const handleAddLiquidity = () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    alert(`Adding liquidity: ${amount1} ${token1.symbol} and ${amount2} ${token2.symbol}`);
  };

  const TokenInput = ({ token, amount, setAmount, openDialog }) => (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{token.name}</Typography>
      </Stack>
      <Button
        onClick={openDialog}
        fullWidth
        sx={{
          py: 1, px: 2, display: 'flex', alignItems: 'center', gap: 1,
          background: 'rgba(255,255,255,0.05)',
          '&:hover': { background: 'rgba(255,255,255,0.08)' },
        }}
      >
        <Box component="img" src={token.logo} alt={token.name} sx={{ width: 24, height: 24 }} />
        <Typography>{token.symbol}</Typography>
      </Button>
      <TextField
        fullWidth
        placeholder="0.0"
        value={amount}
        onChange={(e) => setAmount(formatNumber(e.target.value))}
        sx={{ mt: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Use max balance">
                  <IconButton size="small" onClick={() => setAmount('1000')} sx={{ color: 'text.secondary' }}>
                    <AccountBalanceWalletOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography color="text.secondary" sx={{ minWidth: 45 }}>{token.symbol}</Typography>
              </Stack>
            </InputAdornment>
          ),
          sx: { '& input': { fontSize: '1.1rem', fontWeight: 500 } },
        }}
      />
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}>
        Balance: 1000.00 {token.symbol}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
      <Typography variant="h4" gutterBottom className="gradient-text">Liquidity</Typography>
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
                <Typography variant="h6">Add Liquidity</Typography>
                <Tooltip title="Learn about liquidity">
                  <Link href="/learn/liquidity" passHref>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Link>
                </Tooltip>
              </Stack>
              <TokenInput token={token1} amount={amount1} setAmount={setAmount1} openDialog={() => setToken1DialogOpen(true)} />
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                <IconButton
                  sx={{
                    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark}20, ${theme.palette.primary.main}40)`,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: (theme) => `${theme.palette.primary.main}40`,
                    '&:hover': {
                      background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark}30, ${theme.palette.primary.main}60)`,
                      borderColor: (theme) => `${theme.palette.primary.main}60`,
                    },
                  }}
                  onClick={() => {
                    setToken1(token2);
                    setToken2(token1);
                    setAmount1(amount2);
                    setAmount2(amount1);
                  }}
                >
                  <SwapVertIcon />
                </IconButton>
              </Box>
              <TokenInput token={token2} amount={amount2} setAmount={setAmount2} openDialog={() => setToken2DialogOpen(true)} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>Slippage Tolerance</Typography>
                <Slider
                  value={slippage}
                  onChange={(_, newValue) => setSlippage(newValue as number)}
                  min={0.1}
                  max={5}
                  step={0.1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                />
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAddLiquidity}
                disabled={!address || !amount1 || !amount2}
              >
                {address ? 'Add Liquidity' : 'Connect Wallet'}
              </Button>
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
              <Typography variant="h6" gutterBottom>Your Liquidity</Typography>
              <Typography color="text.secondary">Your active liquidity positions will appear here</Typography>
            </Box>
          </MotionCard>
        </Grid>
      </Grid>
      <TokenSelector
        open={token1DialogOpen}
        onClose={() => setToken1DialogOpen(false)}
        onSelect={setToken1}
        selectedToken={token1.symbol}
      />
      <TokenSelector
        open={token2DialogOpen}
        onClose={() => setToken2DialogOpen(false)}
        onSelect={setToken2}
        selectedToken={token2.symbol}
      />
    </Box>
  );
}
