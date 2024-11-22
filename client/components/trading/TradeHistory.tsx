import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface Trade {
  timestamp: string;
  type: 'UP' | 'DOWN';
  amount: number;
  outcome: 'WIN' | 'LOSS';
  pnl: number;
}

const mockTrades: Trade[] = [
  { timestamp: '2024-01-20 14:30', type: 'UP', amount: 100, outcome: 'WIN', pnl: 95 },
  { timestamp: '2024-01-20 14:25', type: 'DOWN', amount: 150, outcome: 'LOSS', pnl: -150 },
  { timestamp: '2024-01-20 14:20', type: 'UP', amount: 200, outcome: 'WIN', pnl: 190 },
  { timestamp: '2024-01-20 14:15', type: 'DOWN', amount: 100, outcome: 'WIN', pnl: 95 },
];

const TradeHistory: React.FC = () => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">P&L</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockTrades.map((trade, index) => (
            <TableRow key={index}>
              <TableCell>{trade.timestamp}</TableCell>
              <TableCell>
                <Typography 
                  color={trade.type === 'UP' ? 'success.main' : 'error.main'}
                >
                  {trade.type}
                </Typography>
              </TableCell>
              <TableCell align="right">${trade.amount}</TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  color: trade.pnl >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 'medium'
                }}
              >
                {trade.pnl >= 0 ? '+' : ''}{trade.pnl}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TradeHistory;
