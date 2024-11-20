'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Button,
  useTheme,
  InputAdornment,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import TimeSelector from '@/components/TimeSelector';
import TokenSelector from '@/components/TokenSelector';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const tokens = [
  { symbol: 'INJ', name: 'Injective', logo: '/tokens/inj.svg' },
  { symbol: 'MEME', name: 'Memecoin', logo: '/tokens/meme.svg' },
];

const MotionCard = motion(Card);

export default function TradePage() {
  const theme = useTheme();
  const { address } = useWallet();
  const [selectedToken, setSelectedToken] = useState('INJ');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('5');
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  const handleTrade = (type: 'UP' | 'DOWN') => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    // Simulate trade
    alert(`${type} trade placed for ${amount} ${selectedToken} for ${duration} minutes`);
  };

  const currentToken = tokens.find(t => t.symbol === selectedToken);

  return (
    <Box>
      <Typography variant="h4" gutterBottom className="gradient-text">
        Trade
      </Typography>

      <Grid container spacing={4}>
        {/* Trading Card */}
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass"
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Place Trade
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Token
                </Typography>
                <Button
                  onClick={() => setTokenDialogOpen(true)}
                  fullWidth
                  sx={{
                    p: 1.5,
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 1.5,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.08)',
                    }
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      component="img"
                      src={currentToken?.logo}
                      alt={currentToken?.name}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography>
                      {currentToken?.symbol}
                    </Typography>
                  </Stack>
                  <KeyboardArrowDownIcon />
                </Button>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Amount
                </Typography>
                <TextField
                  fullWidth
                  placeholder="0.0"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{selectedToken}</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.08)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,0.08)',
                      }
                    }
                  }}
                />
              </Box>

              <TimeSelector
                value={duration}
                onChange={setDuration}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleTrade('UP')}
                    sx={{
                      background: 'linear-gradient(135deg, #00FF87 0%, #00F6FF 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #00F6FF 0%, #00FF87 100%)',
                      },
                    }}
                  >
                    UP
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleTrade('DOWN')}
                    sx={{
                      background: 'linear-gradient(135deg, #FF3D71 0%, #FF8A65 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF8A65 0%, #FF3D71 100%)',
                      },
                    }}
                  >
                    DOWN
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </MotionCard>
        </Grid>

        {/* Price Chart Card */}
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass"
          >
            <Box sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Price Chart
              </Typography>
              {/* Add chart component here */}
            </Box>
          </MotionCard>
        </Grid>
      </Grid>

      <TokenSelector
        open={tokenDialogOpen}
        onClose={() => setTokenDialogOpen(false)}
        onSelect={(token) => setSelectedToken(token.symbol)}
        selectedToken={selectedToken}
      />
    </Box>
  );
}
