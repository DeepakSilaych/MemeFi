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
  TrendingUp,
  Psychology,
  Group,
  Timeline,
  Warning,
  Lightbulb,
} from '@mui/icons-material';

export default function MarketPsychologyGuide() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #9C27B0, #E1BEE7)',
            backgroundClip: 'text',
            color: 'transparent',
            mb: 2,
          }}
        >
          Market Psychology
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Understanding the psychological aspects of meme coin trading
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 4 }}>
        <Card className="glass" sx={{ background: 'rgba(23, 25, 35, 0.7)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#9C27B0' }}>
              Understanding Market Sentiment
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Psychology sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="FOMO and FUD"
                  secondary="Learn to recognize and manage Fear Of Missing Out and Fear, Uncertainty, and Doubt"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Group sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Crowd Psychology"
                  secondary="Understanding how group behavior influences meme coin prices"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Timeline sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Market Cycles"
                  secondary="Identifying different phases of market psychology"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card className="glass" sx={{ background: 'rgba(23, 25, 35, 0.7)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#9C27B0' }}>
              Common Psychological Traps
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Warning sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Confirmation Bias"
                  secondary="How to avoid seeking only information that confirms your beliefs"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Anchoring"
                  secondary="Understanding how previous prices influence your decisions"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Loss Aversion"
                  secondary="Managing the tendency to feel losses more strongly than gains"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card className="glass" sx={{ background: 'rgba(23, 25, 35, 0.7)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#9C27B0' }}>
              Building Mental Resilience
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Lightbulb sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trading Journal"
                  secondary="Keeping track of your decisions and emotions"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Lightbulb sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Risk Management"
                  secondary="Setting clear rules and sticking to them"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Lightbulb sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Emotional Control"
                  secondary="Techniques for maintaining objectivity in trading"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
