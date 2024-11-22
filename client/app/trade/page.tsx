'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography, TextField, Button, useTheme, InputAdornment,
  Stack, IconButton, Tooltip, CircularProgress, Card, Tabs, Tab, Divider, Link, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';

import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import TimeSelector from '@/components/TimeSelector';
import TokenSelector from '@/components/TokenSelector';
import TradeForm from '@/components/TradeForm';
import PriceChart from '@/components/PriceChart';
import PositionManager from '@/components/trading/PositionManager';
import TradeHistory from '@/components/trading/TradeHistory';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ display: value === index ? 'block' : 'none' }}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const tokens = [
  { 
    symbol: 'INJ', 
    name: 'Injective', 
    logo: '/tokens/inj.svg', 
    price: 100.0, 
    priceChange24h: 2.5, 
    marketCap: 1000000000, 
    volume24h: 100000000
  },
  { 
    symbol: 'MEME', 
    name: 'Memecoin', 
    logo: '/tokens/meme.svg', 
    price: 50.0, 
    priceChange24h: -1.2, 
    marketCap: 500000000, 
    volume24h: 50000000
  },
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

const mockPositions = [
  { token: 'INJ', direction: 'UP', amount: 100, entryPrice: 100, currentPrice: 120, pnl: 20, timeLeft: 60 },
  { token: 'MEME', direction: 'DOWN', amount: 50, entryPrice: 50, currentPrice: 40, pnl: -10, timeLeft: 30 },
  { token: 'INJ', direction: 'UP', amount: 200, entryPrice: 100, currentPrice: 150, pnl: 50, timeLeft: 90 },
];

const mockHistory = [
  { time: '1h ago', token: 'INJ', direction: 'UP', amount: 100, result: 'WIN', points: 20 },
  { time: '2h ago', token: 'MEME', direction: 'DOWN', amount: 50, result: 'LOSS', points: -10 },
  { time: '3h ago', token: 'INJ', direction: 'UP', amount: 200, result: 'WIN', points: 50 },
];

const MotionCard = motion(Card);

// Helper component for documentation links
const DocLink = ({ section, children }: { section: string; children: React.ReactNode }) => (
  <Tooltip 
    title={
      <Box>
        {children}
        <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'primary.main' }}>
          Click to learn more
        </Typography>
      </Box>
    }
    arrow
  >
    <IconButton 
      component={Link}
      href={`/learn/trading-mechanics?section=${section}`}
      size="small"
      sx={{ 
        ml: 1,
        color: 'text.secondary',
        '&:hover': {
          color: 'primary.main',
        }
      }}
    >
      <HelpOutlineIcon sx={{ fontSize: 16 }} />
    </IconButton>
  </Tooltip>
);

export default function TradePage() {
  const theme = useTheme();
  const { address, isConnected, isConnecting, connect } = useWallet();
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(5);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [priceData, setPriceData] = useState(generateMockPriceData());
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (!isConnected) return;
    // Simulate loading new price data when token changes
    setLoading(true);
    const timer = setTimeout(() => {
      setPriceData(generateMockPriceData());
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedToken, isConnected]);

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
          Connect Your Wallet to Trade
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
          Connect your wallet to start trading meme coins with leverage. 
          Access advanced trading features and manage your positions in real-time.
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
        <DocLink section="amount">
          <Typography variant="body2">
            Learn about position sizing and risk management
          </Typography>
        </DocLink>
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
                    <AccountBalanceWalletOutlined sx={{ fontSize: 16 }} />
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Left Division: Map and Tabs */}
          <Grid item xs={12} md={8} sx={{ height: '100%' }}>
            <Box 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              {/* Chart Box */}
              <Box 
                sx={{ 
                  flex: '1 0 auto',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2,
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" color="text.secondary">
                      Price Chart
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {['1H', '4H', '1D', '1W'].map((timeframe) => (
                        <Button
                          key={timeframe}
                          size="small"
                          variant={selectedTimeframe === timeframe ? "contained" : "outlined"}
                          onClick={() => setSelectedTimeframe(timeframe)}
                          sx={{
                            minWidth: '48px',
                            height: '24px',
                            fontSize: '0.75rem',
                          }}
                        >
                          {timeframe}
                        </Button>
                      ))}
                    </Stack>
                  </Stack>
                </Box>

                {/* Chart */}
                <Box 
                  sx={{ 
                    flex: 1,
                    minHeight: '350px',
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  <PriceChart data={priceData} height="100%" />
                </Box>
              </Box>

              {/* Tabs Section */}
              <Box sx={{ p: 2 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  sx={{
                    minHeight: '40px',
                    '& .MuiTabs-indicator': {
                      height: '2px',
                    },
                  }}
                >
                  <Tab 
                    label="Positions" 
                    sx={{ 
                      minHeight: '40px',
                      textTransform: 'none',
                      fontSize: '0.85rem',
                    }} 
                  />
                  <Tab 
                    label="History" 
                    sx={{ 
                      minHeight: '40px',
                      textTransform: 'none',
                      fontSize: '0.85rem',
                    }} 
                  />
                  <Tab 
                    label="Analytics" 
                    sx={{ 
                      minHeight: '40px',
                      textTransform: 'none',
                      fontSize: '0.85rem',
                    }} 
                  />
                  <Tab 
                    label="Swap" 
                    sx={{ 
                      minHeight: '40px',
                      textTransform: 'none',
                      fontSize: '0.85rem',
                    }} 
                  />
                </Tabs>

                {/* Positions Tab */}
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ height: '200px', overflowY: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Token</TableCell>
                          <TableCell>Direction</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Entry</TableCell>
                          <TableCell>Current</TableCell>
                          <TableCell>PnL</TableCell>
                          <TableCell>Time Left</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockPositions.map((position, index) => (
                          <TableRow key={index}>
                            <TableCell>{position.token}</TableCell>
                            <TableCell>
                              <Typography 
                                color={position.direction === 'UP' ? 'success.main' : 'error.main'}
                              >
                                {position.direction}
                              </Typography>
                            </TableCell>
                            <TableCell>${position.amount}</TableCell>
                            <TableCell>${position.entryPrice}</TableCell>
                            <TableCell>${position.currentPrice}</TableCell>
                            <TableCell>
                              <Typography 
                                color={position.pnl > 0 ? 'success.main' : 'error.main'}
                              >
                                {position.pnl > 0 ? '+' : ''}{position.pnl}%
                              </Typography>
                            </TableCell>
                            <TableCell>{position.timeLeft}s</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </TabPanel>

                {/* History Tab */}
                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ height: '200px', overflowY: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Time</TableCell>
                          <TableCell>Token</TableCell>
                          <TableCell>Direction</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Result</TableCell>
                          <TableCell>Points</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockHistory.map((trade, index) => (
                          <TableRow key={index}>
                            <TableCell>{trade.time}</TableCell>
                            <TableCell>{trade.token}</TableCell>
                            <TableCell>
                              <Typography 
                                color={trade.direction === 'UP' ? 'success.main' : 'error.main'}
                              >
                                {trade.direction}
                              </Typography>
                            </TableCell>
                            <TableCell>${trade.amount}</TableCell>
                            <TableCell>
                              <Typography 
                                color={trade.result === 'WIN' ? 'success.main' : 'error.main'}
                              >
                                {trade.result}
                              </Typography>
                            </TableCell>
                            <TableCell>+{trade.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </TabPanel>

                {/* Analytics Tab */}
                <TabPanel value={tabValue} index={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 1,
                        background: 'rgba(255,255,255,0.02)',
                      }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Performance Overview
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">
                              Win Rate
                            </Typography>
                            <Typography variant="subtitle1" color="success.main">
                              65.3%
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">
                              Avg. Return
                            </Typography>
                            <Typography variant="subtitle1" color="success.main">
                              +12.4%
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">
                              Best Trade
                            </Typography>
                            <Typography variant="subtitle1" color="success.main">
                              +45.2%
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Swap Tab */}
                <TabPanel value={tabValue} index={3}>
                  <Box sx={{ p: 2, background: 'rgba(255,255,255,0.02)', borderRadius: 1 }}>
                    <Stack spacing={2}>
                      {/* From Token */}
                      <Box>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          From
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          p: 1.5,
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 1,
                        }}>
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              fullWidth
                              variant="standard"
                              placeholder="0.0"
                              InputProps={{
                                disableUnderline: true,
                                type: 'number',
                                sx: { fontSize: '1.2rem' }
                              }}
                            />
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ 
                              borderRadius: 1,
                              textTransform: 'none',
                              minWidth: '120px',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box 
                                component="img" 
                                src={selectedToken.logo} 
                                alt={selectedToken.name}
                                sx={{ width: 20, height: 20 }}
                              />
                              <Typography>{selectedToken.symbol}</Typography>
                            </Stack>
                          </Button>
                        </Box>
                      </Box>

                      {/* Swap Icon */}
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton 
                          size="small"
                          sx={{ 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            p: 1
                          }}
                        >
                          <KeyboardArrowDownIcon />
                        </IconButton>
                      </Box>

                      {/* To Token */}
                      <Box>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          To
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          p: 1.5,
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 1,
                        }}>
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              fullWidth
                              variant="standard"
                              placeholder="0.0"
                              InputProps={{
                                disableUnderline: true,
                                type: 'number',
                                sx: { fontSize: '1.2rem' }
                              }}
                            />
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ 
                              borderRadius: 1,
                              textTransform: 'none',
                              minWidth: '120px',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Typography>Select token</Typography>
                          </Button>
                        </Box>
                      </Box>

                      {/* Swap Details */}
                      <Box sx={{ 
                        mt: 1,
                        p: 1.5,
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: 1,
                      }}>
                        <Stack spacing={1}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Rate
                            </Typography>
                            <Typography variant="caption">
                              1 {selectedToken.symbol} = 0.00234 ETH
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Fee
                            </Typography>
                            <Typography variant="caption">
                              0.3%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Slippage Tolerance
                            </Typography>
                            <Typography variant="caption">
                              0.5%
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Swap Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ 
                          mt: 2,
                          height: '48px',
                          borderRadius: 1,
                          textTransform: 'none',
                          fontSize: '1rem'
                        }}
                      >
                        Swap Tokens
                      </Button>
                    </Stack>
                  </Box>
                </TabPanel>
              </Box>
            </Box>
          </Grid>

          {/* Right Division: Trade Navigation and Form */}
          <Grid item xs={12} md={4} sx={{ height: '100%' }}>
            <Box 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                background: 'rgba(255,255,255,0.01)',
                borderRadius: 1,
                p: 2
              }}
            >
              {/* Analytics Container */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 1.5
              }}>
                {/* Token Selector with Balance */}
                <Box sx={{ 
                  gridColumn: 'span 5',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 1,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}>
                  {/* Token Info */}
                  <Box 
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flex: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                    onClick={() => setTokenDialogOpen(true)}
                  >
                    <Box component="img" src={selectedToken.logo} alt={selectedToken.name} sx={{ width: 24, height: 24 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">{selectedToken.symbol}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">${selectedToken.price.toLocaleString()}</Typography>
                        <Typography 
                          variant="caption" 
                          color={selectedToken.priceChange24h >= 0 ? 'success.main' : 'error.main'}
                        >
                          {selectedToken.priceChange24h >= 0 ? '+' : ''}{selectedToken.priceChange24h}%
                        </Typography>
                      </Stack>
                    </Box>
                    <KeyboardArrowDownIcon sx={{ color: 'text.secondary' }} />
                  </Box>

                  {/* Divider */}
                  <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                  {/* Balance */}
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Available Balance
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      $1,000.00
                    </Typography>
                  </Box>
                </Box>

                {/* Trade Stats */}
                <Box sx={{ 
                  gridColumn: 'span 5',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 1.5
                }}>
                  {/* Active Trades */}
                  <Box sx={{ 
                    p: 1.5,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Active Trades
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      3
                    </Typography>
                  </Box>

                  {/* Win Rate */}
                  <Box sx={{ 
                    p: 1.5,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Win Rate
                    </Typography>
                    <Typography variant="subtitle1" color="success.main" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      65.3%
                    </Typography>
                  </Box>

                  {/* Total PnL */}
                  <Box sx={{ 
                    p: 1.5,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Total PnL
                    </Typography>
                    <Typography variant="subtitle1" color="success.main" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      +$2,345.67
                    </Typography>
                  </Box>
                </Box>

                {/* Additional Trade Analytics */}
                <Box sx={{ 
                  gridColumn: 'span 5',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 1.5
                }}>
                  {/* Best Trade */}
                  <Box sx={{ 
                    p: 1.5,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Best Trade
                    </Typography>
                    <Typography variant="subtitle1" color="success.main" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      +$125.50
                    </Typography>
                  </Box>

                  {/* Average Trade */}
                  <Box sx={{ 
                    p: 1.5,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Avg Trade
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      $75.40
                    </Typography>
                  </Box>

                  {/* Win Streak */}
                  <Box sx={{ 
                    p: 1.5,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Win Streak
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      8
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Trading Form */}
              <Box sx={{ flex: 1 }}>
                <TradeForm
                  token={selectedToken}
                  amount={amount}
                  duration={duration}
                  onTrade={handleTrade}
                  isValidTrade={isValidTrade}
                  onAmountChange={setAmount}
                  onDurationChange={setDuration}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

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
