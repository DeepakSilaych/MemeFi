import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { motion } from 'framer-motion';

// Types for positions
interface Position {
  id: string;
  token: string;
  type: 'UP' | 'DOWN';
  amount: number;
  entryPrice: number;
  currentPrice: number;
  duration: number;
  timeLeft: number;
  pnl: number;
  status: 'active' | 'pending' | 'completed';
}

// Mock data for positions
const mockPositions: Position[] = [
  {
    id: '1',
    token: 'DOGE',
    type: 'UP',
    amount: 100,
    entryPrice: 0.15,
    currentPrice: 0.16,
    duration: 300, // 5 minutes in seconds
    timeLeft: 180,
    pnl: 6.67,
    status: 'active',
  },
  {
    id: '2',
    token: 'PEPE',
    type: 'DOWN',
    amount: 50,
    entryPrice: 0.000001,
    currentPrice: 0.0000009,
    duration: 180,
    timeLeft: 120,
    pnl: 10,
    status: 'active',
  },
  {
    id: '3',
    token: 'SHIB',
    type: 'UP',
    amount: 75,
    entryPrice: 0.00001,
    currentPrice: 0.00001,
    duration: 60,
    timeLeft: 0,
    pnl: 0,
    status: 'pending',
  },
];

const PositionManager: React.FC = () => {
  const getTimeLeftString = (seconds: number): string => {
    if (seconds === 0) return 'Pending';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `\\${minutes}:\${remainingSeconds.toString().padStart(2, '0')}\\`;
  };

  const getPnLColor = (pnl: number): string => {
    if (pnl > 0) return 'success.main';
    if (pnl < 0) return 'error.main';
    return 'text.secondary';
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 2,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
        Active Positions
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Entry Price</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="center">Time Left</TableCell>
              <TableCell align="right">PnL (%)</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPositions.map((position) => (
              <TableRow
                key={position.id}
                component={motion.tr}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: position.status === 'pending' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {position.token}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {position.type === 'UP' ? (
                    <TrendingUpIcon color="success" />
                  ) : (
                    <TrendingDownIcon color="error" />
                  )}
                </TableCell>
                <TableCell align="right">${position.amount}</TableCell>
                <TableCell align="right">${position.entryPrice}</TableCell>
                <TableCell align="right">${position.currentPrice}</TableCell>
                <TableCell align="center">
                  {getTimeLeftString(position.timeLeft)}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{ color: getPnLColor(position.pnl) }}
                  >
                    {position.pnl > 0 ? '+' : ''}{position.pnl}%
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={position.status}
                    size="small"
                    color={position.status === 'active' ? 'primary' : 'default'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Close Position">
                    <IconButton
                      size="small"
                      color="error"
                      disabled={position.status === 'pending'}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PositionManager;
