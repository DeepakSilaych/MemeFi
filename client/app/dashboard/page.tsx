'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  useTheme,
  Stack,
  LinearProgress,
  IconButton,
  Button,
  Tooltip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Badge,
  Link as MuiLink,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Slider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useWallet } from '../context/WalletContext';
import { getTokens, getTrades, createTrade, closeTrade } from '../services/api';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShareIcon from '@mui/icons-material/Share';
import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import TimelineIcon from '@mui/icons-material/Timeline';
import Info from '@mui/icons-material/Info';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Link from 'next/link';

const MotionCard = motion(Card);

// Mock data for charts
const areaData = [
  { name: '00:00', up: 4000, down: 2400 },
  { name: '04:00', up: 3000, down: 1398 },
  { name: '08:00', up: 2000, down: 9800 },
  { name: '12:00', up: 2780, down: 3908 },
  { name: '16:00', up: 1890, down: 4800 },
  { name: '20:00', up: 2390, down: 3800 },
  { name: '24:00', up: 3490, down: 4300 },
];

const pieData = [
  { name: 'INJ', value: 400, color: '#00F6FF' },
  { name: 'MEME', value: 300, color: '#FF3D71' },
  { name: 'USDT', value: 300, color: '#00FF87' },
];

const performanceData = [
  { name: 'INJ', win: 65, loss: 35 },
  { name: 'MEME', win: 45, loss: 55 },
  { name: 'USDT', win: 80, loss: 20 },
];

// Mock data for achievements
const achievements = [
  { id: 1, title: 'First Trade', description: 'Complete your first trade', progress: 100, reward: '10 MEME' },
  { id: 2, title: 'Volume Master', description: 'Trade $10,000 in volume', progress: 75, reward: '50 MEME' },
  { id: 3, title: 'Winning Streak', description: 'Win 5 trades in a row', progress: 60, reward: '25 MEME' },
  { id: 4, title: 'Liquidity Provider', description: 'Provide liquidity for 7 days', progress: 40, reward: '100 MEME' },
];

// Mock data for referrals
const referralStats = {
  totalReferrals: 12,
  activeReferrals: 8,
  totalEarnings: '$1,234',
  referralLink: 'https://memefi.com/ref/user123',
};

// Mock data for transaction history
const transactions = [
  { id: 1, type: 'Long', token: 'MEME/INJ', amount: '$500', result: 'Win', pnl: '+$50', timestamp: '2024-01-20 14:30' },
  { id: 2, type: 'Short', token: 'PEPE/INJ', amount: '$300', result: 'Loss', pnl: '-$30', timestamp: '2024-01-20 13:15' },
  { id: 3, type: 'Add Liquidity', token: 'MEME/INJ', amount: '$1000', result: '-', pnl: '-', timestamp: '2024-01-20 12:00' },
];

// Mock data for rewards
const rewards = {
  tradingRewards: '150 MEME',
  referralRewards: '50 MEME',
  liquidityRewards: '200 MEME',
  achievementRewards: '100 MEME',
  totalRewards: '500 MEME',
  claimable: '300 MEME',
};

const vaultData = [
  {
    id: 1,
    name: 'Blue Chip Memes',
    description: 'Diversified portfolio of established meme tokens',
    apy: '12.5',
    tvl: '$2.4M',
    risk: 'Low',
    lockPeriod: '7 days',
    userDeposit: '1,200 USDC',
    rewards: '150 MEME',
    strategy: 'Automated market making and yield farming across top meme tokens',
    tokens: ['DOGE', 'SHIB', 'PEPE'],
  },
  {
    id: 2,
    name: 'Emerging Memes',
    description: 'High potential new meme tokens',
    apy: '45.2',
    tvl: '$800K',
    risk: 'High',
    lockPeriod: '14 days',
    userDeposit: '500 USDC',
    rewards: '225 MEME',
    strategy: 'Active trading and liquidity provision for emerging meme tokens',
    tokens: ['WOJAK', 'PEPE', 'FLOKI'],
  },
  {
    id: 3,
    name: 'Stable Yield',
    description: 'Conservative yield farming strategy',
    apy: '8.5',
    tvl: '$5.1M',
    risk: 'Very Low',
    lockPeriod: '3 days',
    userDeposit: '3,000 USDC',
    rewards: '255 MEME',
    strategy: 'Stablecoin LP provision and yield optimization',
    tokens: ['USDC', 'USDT', 'DAI'],
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ 
        background: 'rgba(0, 0, 0, 0.8)',
        p: 1.5,
        borderRadius: 1,
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
        {payload.map((entry, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ color: entry.color }}
          >
            {entry.name}: ${entry.value.toLocaleString()}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const walletBalances = {
  USDC: 5000,
  USDT: 3000,
  DAI: 2000,
};

const [tokens, setTokens] = useState<MemeToken[]>([]);
const [overview, setOverview] = useState<MarketOverview | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const [tokenList, marketOverview] = await Promise.all([
        apiService.getTokenList(),
        apiService.getMarketOverview(),
      ]);
      setTokens(tokenList);
      setOverview(marketOverview);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

if (loading) {
  return (<div className="flex items-center justify-center min-h-screen">Loading...</div>);
}

export default function DashboardPage() {
  const theme = useTheme();
  const { address, isConnected, isConnecting, connect } = useWallet();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVault, setSelectedVault] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [isAutoCompound, setIsAutoCompound] = useState(true);
  const [lockDuration, setLockDuration] = useState(7);
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected) return;
      
      try {
        setIsLoading(true);
        const [tradesData] = await Promise.all([
          getTrades(address || 'default-user'),
        ]);
        setTrades(tradesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isConnected, address]);

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
          Connect Your Wallet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
          Connect your wallet to access the dashboard and start trading meme coins.
          You'll be able to view your portfolio, trade history, and participate in the community.
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

  // Calculate stats from real data
  const calculateStats = () => {
    const last24Hours = trades.filter(trade => {
      const tradeTime = new Date(trade.createdAt).getTime();
      const now = Date.now();
      return now - tradeTime <= 24 * 60 * 60 * 1000;
    });

    const totalTrades = last24Hours.length;
    const totalVolume = last24Hours.reduce((sum, trade) => sum + trade.amount, 0);
    const winningTrades = last24Hours.filter(trade => trade.result === 'win').length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    return [
      {
        label: 'Total Value Locked',
        value: `$${totalVolume.toLocaleString()}`,
        change: '+15.3%', // TODO: Calculate actual change
        positive: true,
        info: 'Total value of assets locked in trading positions',
      },
      {
        label: 'Total Trades',
        value: totalTrades.toString(),
        change: '+23.5%', // TODO: Calculate actual change
        positive: true,
        info: 'Number of trades executed in the last 24 hours',
      },
      {
        label: '24h Volume',
        value: `$${totalVolume.toLocaleString()}`,
        change: '-5.2%', // TODO: Calculate actual change
        positive: false,
        info: 'Total trading volume in the last 24 hours',
      },
      {
        label: 'Win Rate',
        value: `${winRate.toFixed(1)}%`,
        change: '+2.1%', // TODO: Calculate actual change
        positive: true,
        info: 'Percentage of profitable trades in the last 24 hours',
      },
    ];
  };

  const stats = calculateStats();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDeposit = (vault) => {
    setSelectedVault(vault);
  };

  const handleCloseDeposit = () => {
    setSelectedVault(null);
    setDepositAmount('');
    setIsAutoCompound(true);
    setLockDuration(7);
  };

  const handleDepositSubmit = () => {
    // TODO: Implement deposit logic
    console.log('Deposit:', {
      vault: selectedVault?.name,
      amount: depositAmount,
      autoCompound: isAutoCompound,
      lockDuration,
    });
    handleCloseDeposit();
  };

  const calculateProjectedReturns = () => {
    if (!depositAmount || !selectedVault) return 0;
    const amount = parseFloat(depositAmount);
    const apy = parseFloat(selectedVault.apy);
    const years = lockDuration / 365;
    const compoundFrequency = isAutoCompound ? 365 : 1;
    
    // Compound interest formula: A = P(1 + r/n)^(nt)
    const projectedAmount = amount * Math.pow(1 + (apy/100)/compoundFrequency, compoundFrequency * years);
    return projectedAmount - amount;
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'very low':
        return 'success';
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" className="gradient-text">
          Dashboard
        </Typography>
        <Button
          component={Link}
          href="/learn/trading-strategies"
          variant="outlined"
          sx={{
            borderColor: 'rgba(255,255,255,0.1)',
            '&:hover': { borderColor: 'rgba(255,255,255,0.2)' },
          }}
        >
          Trading Guide
        </Button>
      </Stack>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass"
              sx={{ p: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Tooltip title={stat.info}>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5">
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: stat.positive ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {stat.positive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  {stat.change}
                </Typography>
              </Stack>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #00FF87 0%, #00F6FF 100%)',
            },
            '& .MuiTab-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
          }}
        >
          <Tab label="Trading" />
          <Tab label="Vaults" />
          <Tab label="Rewards" />
          <Tab label="Tokens" />
        </Tabs>
      </Box>

      {/* Trading Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* Trading Activity Chart */}
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass"
              sx={{ mb: 3 }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Trading Activity (24h)
                </Typography>
                {isLoading ? (
                  <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LinearProgress sx={{ width: '50%' }} />
                  </Box>
                ) : (
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={trades.map(trade => ({
                          name: new Date(trade.createdAt).toLocaleTimeString(),
                          value: trade.amount,
                          result: trade.result,
                        }))}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                        <YAxis stroke={theme.palette.text.secondary} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <defs>
                          <linearGradient id="colorWin" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00F6FF" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#00F6FF" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF3D71" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FF3D71" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#00F6FF"
                          fillOpacity={1}
                          fill="url(#colorWin)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </Box>
            </MotionCard>

            {/* Recent Transactions */}
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass"
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Transactions
                </Typography>
                {isLoading ? (
                  <LinearProgress />
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Token</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Result</TableCell>
                          <TableCell align="right">PnL</TableCell>
                          <TableCell align="right">Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trades.slice(0, 5).map((trade) => (
                          <TableRow key={trade.id}>
                            <TableCell>
                              <Chip
                                label={trade.direction.toUpperCase()}
                                color={trade.direction === 'up' ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{trade.tokenId}</TableCell>
                            <TableCell align="right">${trade.amount.toLocaleString()}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={trade.result?.toUpperCase() || 'PENDING'}
                                color={
                                  trade.result === 'win' ? 'success' :
                                  trade.result === 'loss' ? 'error' : 'default'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: trade.pnl > 0 ? 'success.main' :
                                       trade.pnl < 0 ? 'error.main' : 'text.primary'
                              }}
                            >
                              {trade.pnl ? `${trade.pnl > 0 ? '+' : ''}$${Math.abs(trade.pnl).toLocaleString()}` : '-'}
                            </TableCell>
                            <TableCell align="right">
                              {new Date(trade.createdAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </MotionCard>
          </Grid>

          {/* Token Portfolio */}
          <Grid item xs={12} lg={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass"
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Token Portfolio</Typography>
                <Box sx={{ height: 200, mb: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Typography variant="h6" gutterBottom>Performance by Token</Typography>
                <Stack spacing={2}>
                  {performanceData.map((item) => (
                    <Box key={item.name}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.win}% Win Rate
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={item.win}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,61,113,0.2)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: 'linear-gradient(90deg, #00FF87 0%, #00F6FF 100%)',
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </MotionCard>
          </Grid>
        </Grid>
      )}

      {/* Vaults Tab Content */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {vaultData.map((vault) => (
            <Grid item xs={12} key={vault.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass"
                sx={{
                  background: 'rgba(23, 25, 35, 0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(23, 25, 35, 0.8)',
                  }
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Vault Header */}
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              background: 'linear-gradient(90deg, #00FF87 0%, #00F6FF 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              fontWeight: 600
                            }}
                          >
                            {vault.name}
                          </Typography>
                          <Chip
                            label={`Risk: ${vault.risk}`}
                            color={getRiskColor(vault.risk)}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              bgcolor: (theme) => 
                                vault.risk.toLowerCase() === 'very low' ? 'rgba(0, 255, 135, 0.15)' :
                                vault.risk.toLowerCase() === 'low' ? 'rgba(0, 246, 255, 0.15)' :
                                vault.risk.toLowerCase() === 'medium' ? 'rgba(255, 171, 0, 0.15)' :
                                'rgba(255, 61, 113, 0.15)',
                              color: (theme) =>
                                vault.risk.toLowerCase() === 'very low' ? '#00FF87' :
                                vault.risk.toLowerCase() === 'low' ? '#00F6FF' :
                                vault.risk.toLowerCase() === 'medium' ? '#FFAB00' :
                                '#FF3D71',
                              border: '1px solid',
                              borderColor: (theme) =>
                                vault.risk.toLowerCase() === 'very low' ? 'rgba(0, 255, 135, 0.3)' :
                                vault.risk.toLowerCase() === 'low' ? 'rgba(0, 246, 255, 0.3)' :
                                vault.risk.toLowerCase() === 'medium' ? 'rgba(255, 171, 0, 0.3)' :
                                'rgba(255, 61, 113, 0.3)',
                            }}
                          />
                        </Stack>
                        <Button
                          variant="contained"
                          onClick={() => handleOpenDeposit(vault)}
                          sx={{
                            background: 'rgba(0, 255, 135, 0.1)',
                            border: '1px solid rgba(0, 255, 135, 0.2)',
                            color: '#00FF87',
                            '&:hover': {
                              background: 'rgba(0, 255, 135, 0.2)',
                              border: '1px solid rgba(0, 255, 135, 0.3)',
                            }
                          }}
                        >
                          Deposit
                        </Button>
                      </Stack>
                    </Grid>

                    {/* Vault Stats */}
                    <Grid item xs={12} md={8}>
                      <Stack spacing={2}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {vault.description}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Strategy: </strong>
                          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{vault.strategy}</span>
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          {vault.tokens.map((token) => (
                            <Chip
                              key={token}
                              label={token}
                              variant="outlined"
                              size="small"
                              sx={{
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                }
                              }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </Grid>

                    {/* Vault Metrics */}
                    <Grid item xs={12} md={4}>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>APY</Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              background: 'linear-gradient(90deg, #00FF87 0%, #00F6FF 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              fontWeight: 600
                            }}
                          >
                            {vault.apy}%
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>TVL</Typography>
                          <Typography variant="body1">{vault.tvl}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Lock Period</Typography>
                          <Typography variant="body1">{vault.lockPeriod}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Your Deposit</Typography>
                          <Typography variant="body1">{vault.userDeposit}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Rewards</Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              background: 'linear-gradient(90deg, #00FF87 0%, #00F6FF 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              fontWeight: 600
                            }}
                          >
                            {vault.rewards}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tokens Tab Content */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Token</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">24h Change</TableCell>
                    <TableCell align="right">Volume (24h)</TableCell>
                    <TableCell align="right">Market Cap</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <LinearProgress />
                      </TableCell>
                    </TableRow>
                  ) : tokens.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No tokens available
                      </TableCell>
                    </TableRow>
                  ) : (
                    tokens.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {token.imageUrl ? (
                              <Avatar src={token.imageUrl} alt={token.name} />
                            ) : (
                              <Avatar>{token.symbol[0]}</Avatar>
                            )}
                            <Stack>
                              <Typography variant="subtitle2">{token.name}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                {token.symbol}
                              </Typography>
                            </Stack>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            color={token.priceChange24h >= 0 ? 'success.main' : 'error.main'}
                          >
                            {token.priceChange24h >= 0 ? '+' : ''}
                            {token.priceChange24h.toFixed(2)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          ${token.volume24h.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ${token.marketCap.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {/* Handle trade action */}}
                          >
                            Trade
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {/* Deposit Dialog */}
      <Dialog
        open={Boolean(selectedVault)}
        onClose={handleCloseDeposit}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: 'glass',
          sx: {
            background: 'rgba(23, 25, 35, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="h6" 
              className="gradient-text"
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 600
              }}
            >
              Deposit to {selectedVault?.name}
            </Typography>
            <Chip
              label={`APY: ${selectedVault?.apy}%`}
              sx={{
                background: 'linear-gradient(90deg, #00FF87 0%, #00F6FF 100%)',
                color: 'black',
                fontWeight: 600
              }}
              size="small"
            />
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Amount Input */}
            <TextField
              label="Deposit Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              fullWidth
              type="number"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00FF87',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00FF87',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      sx={{
                        color: '#00FF87',
                        mr: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 135, 0.1)',
                        },
                      }}
                      onClick={() => setDepositAmount(walletBalances.USDC.toString())}
                    >
                      MAX
                    </Button>
                    <Typography color="text.secondary">USDC</Typography>
                  </InputAdornment>
                ),
              }}
              helperText={
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Balance: {walletBalances.USDC} USDC
                </Typography>
              }
            />

            {/* Lock Duration Slider */}
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 1,
                  fontWeight: 600
                }}
              >
                Lock Duration
              </Typography>
              <Slider
                value={lockDuration}
                onChange={(e, newValue) => setLockDuration(newValue)}
                min={1}
                max={365}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} days`}
                sx={{
                  color: '#00FF87',
                  '& .MuiSlider-rail': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(90deg, #00FF87 0%, #00F6FF 100%)',
                  },
                  '& .MuiSlider-thumb': {
                    background: '#00FF87',
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(0, 255, 135, 0.16)',
                    },
                  },
                  '& .MuiSlider-valueLabel': {
                    background: 'rgba(23, 25, 35, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.75rem',
                  },
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  display: 'block',
                  mt: 1
                }}
              >
                Longer lock duration = Higher rewards
              </Typography>
            </Box>

            {/* Auto-compound Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={isAutoCompound}
                  onChange={(e) => setIsAutoCompound(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase': {
                      '&.Mui-checked': {
                        color: '#00FF87',
                        '& + .MuiSwitch-track': {
                          backgroundColor: 'rgba(0, 255, 135, 0.5)',
                          opacity: 1,
                        },
                      },
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                />
              }
              label={
                <Stack>
                  <Typography 
                    variant="subtitle2"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 600
                    }}
                  >
                    Auto-compound Rewards
                  </Typography>
                  <Typography 
                    variant="caption"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Automatically reinvest earned rewards
                  </Typography>
                </Stack>
              }
            />

            {/* Projected Returns */}
            {depositAmount && (
              <Box 
                sx={{ 
                  p: 2.5,
                  background: 'linear-gradient(145deg, rgba(0, 255, 135, 0.1), rgba(0, 246, 255, 0.1))',
                  borderRadius: 2,
                  border: '1px solid rgba(0, 255, 135, 0.2)',
                }}
              >
                <Stack spacing={2}>
                  <Typography 
                    variant="subtitle2"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    Projected Returns
                  </Typography>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography 
                      variant="body2" 
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      Initial Deposit
                    </Typography>
                    <Typography variant="body2">
                      {depositAmount} USDC
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography 
                      variant="body2" 
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      Estimated Earnings
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        background: 'linear-gradient(90deg, #00FF87 0%, #00F6FF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 600
                      }}
                    >
                      +{calculateProjectedReturns().toFixed(2)} USDC
                    </Typography>
                  </Stack>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontStyle: 'italic'
                    }}
                  >
                    *Projections are estimates and not guaranteed
                  </Typography>
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions 
          sx={{ 
            p: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Button 
            onClick={handleCloseDeposit} 
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDepositSubmit}
            variant="contained"
            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
            sx={{
              background: 'rgba(0, 255, 135, 0.1)',
              border: '1px solid rgba(0, 255, 135, 0.2)',
              color: '#00FF87',
              fontWeight: 600,
              '&:hover': {
                background: 'rgba(0, 255, 135, 0.2)',
                border: '1px solid rgba(0, 255, 135, 0.3)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Confirm Deposit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rewards Tab Content */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* Rewards Card */}
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass"
              sx={{ mb: 3 }}
            >
              <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">Rewards</Typography>
                  <MuiLink href="/learn/rewards" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Info sx={{ mr: 0.5, fontSize: 16 }} />
                    <Typography variant="body2">Rewards Guide</Typography>
                  </MuiLink>
                </Stack>
                <Stack spacing={2}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">Trading Rewards</Typography>
                      <Typography>{rewards.tradingRewards}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">Referral Rewards</Typography>
                      <Typography>{rewards.referralRewards}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">Liquidity Rewards</Typography>
                      <Typography>{rewards.liquidityRewards}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">Achievement Rewards</Typography>
                      <Typography>{rewards.achievementRewards}</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle1">Total Rewards</Typography>
                      <Typography variant="subtitle1">{rewards.totalRewards}</Typography>
                    </Stack>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      disabled={rewards.claimable === '0 MEME'}
                    >
                      Claim {rewards.claimable}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </MotionCard>

            {/* Achievements */}
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass"
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Achievements</Typography>
                <Stack spacing={2}>
                  {achievements.map((achievement) => (
                    <Box key={achievement.id}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <Avatar
                          sx={{
                            bgcolor: achievement.progress === 100 ? 'success.main' : 'primary.main',
                            width: 32,
                            height: 32,
                          }}
                        >
                          <EmojiEventsIcon fontSize="small" />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="subtitle2">{achievement.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {achievement.description}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="success.main">
                          {achievement.reward}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={achievement.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: 'linear-gradient(90deg, #00FF87 0%, #00F6FF 100%)',
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </MotionCard>
          </Grid>

          {/* Referral Stats */}
          <Grid item xs={12} lg={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass"
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Referral Program</Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Total Referrals</Typography>
                    <Typography variant="h6">{referralStats.totalReferrals}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Active Referrals</Typography>
                    <Typography variant="h6">{referralStats.activeReferrals}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Total Earnings</Typography>
                    <Typography variant="h6">{referralStats.totalEarnings}</Typography>
                  </Grid>
                </Grid>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() => navigator.clipboard.writeText(referralStats.referralLink)}
                >
                  Copy Referral Link
                </Button>
              </Box>
            </MotionCard>
          </Grid>
        </Grid>
      )}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total Market Cap</h3>
              <p className="text-2xl font-bold">${formatNumber(overview.total_market_cap)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">24h Volume</h3>
              <p className="text-2xl font-bold">${formatNumber(overview.total_volume_24h)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Average 24h Change</h3>
              <p className={`text-2xl font-bold ${overview.average_price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(overview.average_price_change_24h)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Top Meme Tokens</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                  <TableHead className="text-right">Volume (24h)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell>{token.market_cap_rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <img src={token.image} alt={token.name} className="w-6 h-6 rounded-full" />
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-sm text-muted-foreground">{token.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${formatNumber(token.current_price)}</TableCell>
                    <TableCell className={`text-right ${token.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercent(token.price_change_24h)}
                    </TableCell>
                    <TableCell className="text-right">${formatNumber(token.market_cap)}</TableCell>
                    <TableCell className="text-right">${formatNumber(token.volume_24h)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
