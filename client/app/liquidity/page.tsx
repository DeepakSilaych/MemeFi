'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Slider,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';

const MotionCard = motion(Card);

const tokens = [
  { symbol: 'INJ', name: 'Injective', logo: '/tokens/inj.svg' },
  { symbol: 'MEME', name: 'Memecoin', logo: '/tokens/meme.svg' },
];

export default function LiquidityPage() {
  const { address } = useWallet();
  const [token1, setToken1] = useState('INJ');
  const [token2, setToken2] = useState('MEME');
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  const handleAddLiquidity = () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    // Simulate adding liquidity
    alert(`Adding liquidity: ${amount1} ${token1} and ${amount2} ${token2}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom className="gradient-text">
        Liquidity
      </Typography>

      <Grid container spacing={4}>
        {/* Add Liquidity Card */}
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass"
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Add Liquidity
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Token 1</InputLabel>
                <Select
                  value={token1}
                  onChange={(e) => setToken1(e.target.value)}
                  label="Token 1"
                >
                  {tokens.map((token) => (
                    <MenuItem key={token.symbol} value={token.symbol}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          component="img"
                          src={token.logo}
                          alt={token.name}
                          sx={{ width: 24, height: 24 }}
                        />
                        {token.symbol}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{token1}</InputAdornment>,
                }}
                sx={{ mb: 3 }}
              />

              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                +
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Token 2</InputLabel>
                <Select
                  value={token2}
                  onChange={(e) => setToken2(e.target.value)}
                  label="Token 2"
                >
                  {tokens.map((token) => (
                    <MenuItem key={token.symbol} value={token.symbol}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          component="img"
                          src={token.logo}
                          alt={token.name}
                          sx={{ width: 24, height: 24 }}
                        />
                        {token.symbol}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount2}
                onChange={(e) => setAmount2(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{token2}</InputAdornment>,
                }}
                sx={{ mb: 3 }}
              />

              <Typography gutterBottom>
                Slippage Tolerance: {slippage}%
              </Typography>
              <Slider
                value={slippage}
                onChange={(_, value) => setSlippage(value as number)}
                min={0.1}
                max={5}
                step={0.1}
                sx={{ mb: 3 }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleAddLiquidity}
                sx={{
                  background: 'linear-gradient(135deg, #00F6FF 0%, #00D1FF 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00D1FF 0%, #00F6FF 100%)',
                  },
                }}
              >
                Add Liquidity
              </Button>
            </Box>
          </MotionCard>
        </Grid>

        {/* Pool Information Card */}
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass"
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Liquidity Positions
              </Typography>

              {address ? (
                <Stack spacing={2}>
                  <Card className="glass" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      INJ/MEME Pool
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your share: 0%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pooled INJ: 0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pooled MEME: 0
                    </Typography>
                  </Card>

                  <Typography color="text.secondary" align="center">
                    No active liquidity positions
                  </Typography>
                </Stack>
              ) : (
                <Typography color="text.secondary" align="center">
                  Connect your wallet to view your liquidity positions
                </Typography>
              )}
            </Box>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
