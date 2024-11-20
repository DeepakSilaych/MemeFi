'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { getLeaderboard } from '../services/api';
import { LeaderboardEntry } from '../types';
import { useWallet } from '../context/WalletContext';

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'all';

export default function LeaderboardPage() {
  const theme = useTheme();
  const { address } = useWallet();
  const [timeframe, setTimeframe] = useState<TimeFrame>('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard(timeframe);
      setEntries(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    if (addr === address) {
      return 'You';
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4">Leaderboard</Typography>
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={(_, value) => value && setTimeframe(value)}
            aria-label="timeframe"
          >
            <ToggleButton value="daily">Daily</ToggleButton>
            <ToggleButton value="weekly">Weekly</ToggleButton>
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="all">All Time</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            background: theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.primary.main}25`,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">Points</TableCell>
                <TableCell align="right">Trades</TableCell>
                <TableCell align="right">Win Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow
                  key={entry.address}
                  sx={{
                    backgroundColor:
                      entry.address === address
                        ? `${theme.palette.primary.main}10`
                        : 'inherit',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}20`,
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {entry.rank <= 3 ? (
                        <Typography
                          component="span"
                          sx={{
                            color:
                              entry.rank === 1
                                ? '#FFD700'
                                : entry.rank === 2
                                ? '#C0C0C0'
                                : '#CD7F32',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                          }}
                        >
                          #{entry.rank}
                        </Typography>
                      ) : (
                        `#${entry.rank}`
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{formatAddress(entry.address)}</TableCell>
                  <TableCell align="right">
                    {entry.points.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {entry.trades.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">{entry.winRate.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Rankings are updated every hour. Keep trading to climb the leaderboard!
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
