'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Card, Grid, Typography, TextField, Button, InputAdornment,
  Slider, Stack, IconButton, Tooltip, Link as MuiLink, Paper,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import TokenSelector from '@/components/TokenSelector';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Link from 'next/link';
import Info from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();
  const { address, isConnected, isConnecting, connect } = useWallet();
  const [token1DialogOpen, setToken1DialogOpen] = useState(false);
  const [token2DialogOpen, setToken2DialogOpen] = useState(false);
  const [token1, setToken1] = useState(tokens[0]);
  const [token2, setToken2] = useState(tokens[1]);
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [isAutoCompoundEnabled, setIsAutoCompoundEnabled] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('1000');
  const [timePeriod, setTimePeriod] = useState('365');
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (!isConnected) return;
    // Add any initialization logic here
  }, [isConnected]);

  if (!isConnected) {
    return (
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AccountBalanceWalletIcon sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
        </motion.div>
        <Typography variant="h4" className="gradient-text" gutterBottom>
          Connect Your Wallet to Provide Liquidity
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
          Connect your wallet to provide liquidity to meme coin pools.
          Earn fees and rewards by becoming a liquidity provider in our decentralized exchange.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={connect}
          disabled={isConnecting}
          sx={{
            background: 'linear-gradient(45deg, #00FF87 0%, #00F6FF 100%)',
            color: 'black',
            px: 4,
            py: 1.5,
            '&:hover': {
              background: 'linear-gradient(45deg, #00F6FF 0%, #00FF87 100%)',
            },
          }}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </Box>
    );
  }

  const handleAddLiquidity = () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    alert(`Adding liquidity: ${amount1} ${token1.symbol} and ${amount2} ${token2.symbol}`);
  };

  const handleAutoCompoundToggle = () => {
    setIsAutoCompoundEnabled(!isAutoCompoundEnabled);
  };

  const calculateEstimatedReturns = () => {
    const principal = parseFloat(investmentAmount) || 0;
    const days = parseFloat(timePeriod) || 0;
    const apy = 24.6; // Current APY

    // Compound interest formula: A = P(1 + r/n)^(nt)
    // Where: A = Final amount, P = Principal, r = APY (as decimal), n = compounds per year, t = time in years
    const compoundsPerYear = isAutoCompoundEnabled ? 365 : 12; // Daily vs Monthly compounding
    const timeInYears = days / 365;
    const rate = apy / 100;

    const finalAmount = principal * Math.pow(1 + (rate / compoundsPerYear), compoundsPerYear * timeInYears);
    return (finalAmount - principal).toFixed(2);
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
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
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" gutterBottom>Provide Liquidity</Typography>
                  <MuiLink href="/learn/liquidity" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Info sx={{ mr: 0.5, fontSize: 16 }} />
                    <Typography variant="body2">Learn More</Typography>
                  </MuiLink>
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  Add liquidity to earn fees from trades and maximize returns with auto-compounding
                </Typography>
              </Box>
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
              <Typography variant="h6" gutterBottom>Your Liquidity Positions</Typography>
              {/* Active Positions */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: 1,
                  mb: 2 
                }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1}>
                      <Box component="img" src={token1.logo} alt={token1.name} sx={{ width: 24, height: 24 }} />
                      <Box component="img" src={token2.logo} alt={token2.name} sx={{ width: 24, height: 24 }} />
                    </Stack>
                    <Typography variant="subtitle1">{token1.symbol}/{token2.symbol}</Typography>
                  </Stack>

                  {/* Vault Performance Metrics */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Total Value Locked</Typography>
                      <Typography variant="subtitle1">$123,456</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Your Share</Typography>
                      <Typography variant="subtitle1">2.5%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">APY</Typography>
                      <Typography variant="subtitle1" color="success.main">24.6%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Earned Fees</Typography>
                      <Typography variant="subtitle1">$345.67</Typography>
                    </Grid>
                  </Grid>

                  {/* Risk-Reward Metrics */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Risk-Reward Profile</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Box sx={{
                          p: 1,
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 1,
                          textAlign: 'center'
                        }}>
                          <Typography variant="caption" color="success.main">Low</Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Impermanent Loss
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{
                          p: 1,
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 1,
                          textAlign: 'center'
                        }}>
                          <Typography variant="caption" color="primary.main">Medium</Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Volume
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{
                          p: 1,
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 1,
                          textAlign: 'center'
                        }}>
                          <Typography variant="caption" color="success.main">High</Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            APY Stability
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Auto-compound Controls */}
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Auto-compound</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleAutoCompoundToggle}
                        sx={{ 
                          textTransform: 'none',
                          borderColor: isAutoCompoundEnabled ? 'success.main' : 'text.secondary',
                          color: isAutoCompoundEnabled ? 'success.main' : 'text.secondary'
                        }}
                      >
                        {isAutoCompoundEnabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {isAutoCompoundEnabled 
                        ? 'Automatically reinvesting earned fees daily to maximize returns'
                        : 'Manual reinvestment of earned fees on a monthly basis'}
                    </Typography>
                  </Box>

                  {/* ROI Calculator */}
                  <Accordion 
                    sx={{ 
                      mb: 2,
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      '&:before': { display: 'none' },
                      boxShadow: 'none',
                      borderRadius: 1
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        minHeight: 48,
                        '& .MuiAccordionSummary-content': {
                          margin: '12px 0'
                        }
                      }}
                    >
                      <Typography variant="subtitle2">ROI Calculator</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Investment Amount"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Time Period"
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">days</InputAdornment>,
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2, p: 1.5, background: 'rgba(255,255,255,0.02)', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>Estimated Returns</Typography>
                        <Typography variant="h6" color="success.main">
                          ${calculateEstimatedReturns()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Based on current APY of 24.6% with {isAutoCompoundEnabled ? 'daily' : 'monthly'} compounding
                        </Typography>
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ textTransform: 'none' }}
                    >
                      Add More
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      sx={{ textTransform: 'none' }}
                    >
                      Withdraw
                    </Button>
                  </Stack>
                </Box>
              </Box>
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
