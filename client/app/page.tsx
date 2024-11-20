'use client';

import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Container, 
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

// Mock data for top meme coins
const topMemeCoins = [
  {
    name: 'PEPE',
    symbol: 'PEPE',
    price: 0.000001234,
    change24h: 15.67,
    volume24h: 123456789,
    marketCap: 987654321,
    chart: Array(24).fill(0).map((_, i) => ({ value: Math.random() * 100 })),
  },
  {
    name: 'Floki',
    symbol: 'FLOKI',
    price: 0.000034567,
    change24h: -5.43,
    volume24h: 98765432,
    marketCap: 876543210,
    chart: Array(24).fill(0).map((_, i) => ({ value: Math.random() * 100 })),
  },
  {
    name: 'Wojak',
    symbol: 'WOJAK',
    price: 0.000000789,
    change24h: 8.21,
    volume24h: 45678901,
    marketCap: 765432109,
    chart: Array(24).fill(0).map((_, i) => ({ value: Math.random() * 100 })),
  },
];

// Platform statistics
const platformStats = [
  { label: 'Total Trading Volume', value: '$12.5M' },
  { label: 'Active Traders', value: '5.2K' },
  { label: 'Total Trades', value: '125K' },
  { label: 'Rewards Distributed', value: '$250K' },
];

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 246, 255, 0.1) 0%, rgba(0, 209, 255, 0.05) 25%, transparent 50%)',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255, 61, 113, 0.2) 0%, transparent 70%)',
            top: '10%',
            left: '5%',
            borderRadius: '50%',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(0, 246, 255, 0.2) 0%, transparent 70%)',
            bottom: '10%',
            right: '5%',
            borderRadius: '50%',
          },
        }}
      />

      {/* Hero Section */}
      <Container>
        <Box sx={{ textAlign: 'center', py: { xs: 8, md: 12 }, position: 'relative' }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              background: 'linear-gradient(to right, #00F6FF, #FF3D71)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
            }}
          >
            Trade Meme Coins
            <br />
            Win Rewards. Join the Fun!
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
          >
            Experience the future of meme coin trading with our secure, simple, and
            gamified interval trading platform
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mb: 8 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/trade')}
              sx={{ 
                px: 4, 
                py: 1.5,
                background: 'linear-gradient(135deg, #00F6FF 0%, #00D1FF 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00D1FF 0%, #00F6FF 100%)',
                },
              }}
            >
              Start Trading
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/learn')}
              sx={{ px: 4, py: 1.5 }}
            >
              Learn More
            </Button>
          </Stack>

          {/* Platform Statistics */}
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {platformStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass">
                    <CardContent>
                      <Typography variant="h4" gutterBottom className="gradient-text">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </MotionBox>
              </Grid>
            ))}
          </Grid>

          {/* Top Meme Coins Table */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass"
            sx={{ mb: 8 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom className="gradient-text">
                Top Meme Coins
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">24h Change</TableCell>
                      <TableCell align="right">24h Volume</TableCell>
                      <TableCell align="right">Market Cap</TableCell>
                      <TableCell align="right">Last 24h</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topMemeCoins.map((coin) => (
                      <TableRow key={coin.symbol} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={`/tokens/${coin.symbol.toLowerCase()}.svg`}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Box>
                              <Typography variant="body2">{coin.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {coin.symbol}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          ${coin.price.toFixed(8)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${coin.change24h > 0 ? '+' : ''}${coin.change24h}%`}
                            size="small"
                            sx={{
                              backgroundColor: coin.change24h > 0 ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                              color: coin.change24h > 0 ? '#00FF87' : '#FF3D71',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          ${(coin.volume24h / 1000000).toFixed(2)}M
                        </TableCell>
                        <TableCell align="right">
                          ${(coin.marketCap / 1000000).toFixed(2)}M
                        </TableCell>
                        <TableCell align="right" sx={{ width: 100 }}>
                          <ResponsiveContainer width="100%" height={40}>
                            <AreaChart data={coin.chart}>
                              <defs>
                                <linearGradient id={`gradient-${coin.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop
                                    offset="5%"
                                    stopColor={coin.change24h > 0 ? '#00FF87' : '#FF3D71'}
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor={coin.change24h > 0 ? '#00FF87' : '#FF3D71'}
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke={coin.change24h > 0 ? '#00FF87' : '#FF3D71'}
                                fill={`url(#gradient-${coin.symbol})`}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </MotionCard>

          {/* Feature Cards */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <MotionCard 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="glass"
                sx={{ 
                  height: '100%',
                  background: 'rgba(0, 246, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 246, 255, 0.1)',
                }}
              >
                <CardContent>
                  <TrendingUpIcon sx={{ fontSize: 48, color: '#00F6FF', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Simple Trading
                  </Typography>
                  <Typography color="text.secondary">
                    Trade your favorite meme coins with our intuitive interface designed for both beginners and pros
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionCard 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="glass"
                sx={{ 
                  height: '100%',
                  background: 'rgba(255, 61, 113, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 61, 113, 0.1)',
                }}
              >
                <CardContent>
                  <EmojiEventsIcon sx={{ fontSize: 48, color: '#FF3D71', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Win Rewards
                  </Typography>
                  <Typography color="text.secondary">
                    Earn rewards for successful trades and climb the leaderboard to win exclusive prizes
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionCard 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="glass"
                sx={{ 
                  height: '100%',
                  background: 'rgba(0, 246, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 246, 255, 0.1)',
                }}
              >
                <CardContent>
                  <AccountBalanceIcon sx={{ fontSize: 48, color: '#00F6FF', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Secure Platform
                  </Typography>
                  <Typography color="text.secondary">
                    Trade with confidence on our secure and transparent decentralized platform
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 3,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" color="text.secondary">
              {new Date().getFullYear()} MemeFi. Built on Injective.
            </Typography>
            <Stack direction="row" spacing={3} alignItems="center">
              <Button
                href="/learn"
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Learn
              </Button>
              <Button
                href="https://docs.memefi.com"
                target="_blank"
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Docs
              </Button>
              <Button
                href="https://discord.gg/fuF2KUZN"
                target="_blank"
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Discord
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
