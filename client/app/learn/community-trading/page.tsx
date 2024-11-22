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
  Diversity3,
  Forum,
  TrendingUp,
  Groups,
  Share,
  Analytics,
} from '@mui/icons-material';

export default function CommunityTradingGuide() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #3F51B5, #9FA8DA)',
            backgroundClip: 'text',
            color: 'transparent',
            mb: 2,
          }}
        >
          Community Trading
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Harness the power of social trading and community-driven strategies
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 4 }}>
        <Card className="glass" sx={{ background: 'rgba(23, 25, 35, 0.7)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#3F51B5' }}>
              Social Trading Basics
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Diversity3 sx={{ color: '#3F51B5' }} />
                </ListItemIcon>
                <ListItemText
                  primary="What is Social Trading?"
                  secondary="Understanding the concept and benefits of community-based trading"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Forum sx={{ color: '#3F51B5' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Community Analysis"
                  secondary="Learning from community discussions and sentiment analysis"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp sx={{ color: '#3F51B5' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Copy Trading"
                  secondary="Following and learning from successful traders"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card className="glass" sx={{ background: 'rgba(23, 25, 35, 0.7)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#3F51B5' }}>
              Community Strategies
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Groups sx={{ color: '#3F51B5' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Group Analysis"
                  secondary="Collaborating with other traders for better market insights"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Share sx={{ color: '#3F51B5' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Signal Sharing"
                  secondary="Understanding and utilizing community trading signals"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Analytics sx={{ color: '#3F51B5' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Crowd Wisdom"
                  secondary="Leveraging collective intelligence for trading decisions"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card className="glass" sx={{ background: 'rgba(23, 25, 35, 0.7)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#3F51B5' }}>
              Best Practices
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Diversity3 sx={{ color: '#3F51B5' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Risk Management"
                  secondary="Setting proper limits when following community trades"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Forum sx={{ color: '#3F51B5' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Communication"
                  secondary="Effective participation in trading communities"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp sx={{ color: '#3F51B5' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Portfolio Balance"
                  secondary="Maintaining independence while leveraging community insights"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
