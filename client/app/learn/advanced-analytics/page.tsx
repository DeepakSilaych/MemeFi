'use client';

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  AutoGraph,
  ShowChart,
  Timeline,
  TrendingUp,
  Analytics,
  Assessment,
} from '@mui/icons-material';

export default function AdvancedAnalyticsGuide() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #00BCD4, #B2EBF2)',
            backgroundClip: 'text',
            color: 'transparent',
            mb: 2,
          }}
        >
          Advanced Analytics
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Master technical analysis and advanced trading indicators
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 4 }}>
        <Card className="glass" sx={{ background: 'rgba(23, 25, 35, 0.7)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#00BCD4' }}>
              Technical Indicators
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ShowChart sx={{ color: '#00BCD4' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Moving Averages"
                  secondary="Understanding SMA, EMA, and their trading applications"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Timeline sx={{ color: '#00BCD4' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Momentum Indicators"
                  secondary="RSI, MACD, and Stochastic Oscillator analysis"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AutoGraph sx={{ color: '#00BCD4' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Volume Analysis"
                  secondary="Understanding volume indicators and their significance"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card className="glass" sx={{ background: 'rgba(23, 25, 35, 0.7)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#00BCD4' }}>
              Chart Patterns
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp sx={{ color: '#00BCD4' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trend Patterns"
                  secondary="Identifying and trading with trends, channels, and breakouts"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Analytics sx={{ color: '#00BCD4' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Reversal Patterns"
                  secondary="Head and Shoulders, Double Tops/Bottoms, and other reversal signals"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Assessment sx={{ color: '#00BCD4' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Continuation Patterns"
                  secondary="Flags, Pennants, and Triangle patterns analysis"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card className="glass" sx={{ background: 'rgba(23, 25, 35, 0.7)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#00BCD4' }}>
              Advanced Concepts
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ShowChart sx={{ color: '#00BCD4' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Fibonacci Analysis"
                  secondary="Using Fibonacci retracements and extensions in trading"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Timeline sx={{ color: '#00BCD4' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Elliott Wave Theory"
                  secondary="Understanding market cycles and wave patterns"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AutoGraph sx={{ color: '#00BCD4' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Risk Analysis"
                  secondary="Advanced position sizing and risk management techniques"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
