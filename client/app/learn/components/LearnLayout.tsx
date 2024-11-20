'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LearnLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  category: string;
}

const MotionContainer = motion(Container);

export default function LearnLayout({
  children,
  title,
  description,
  category,
}: LearnLayoutProps) {
  const theme = useTheme();

  return (
    <MotionContainer
      maxWidth="lg"
      sx={{ py: 8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumbs sx={{ mb: 4 }}>
        <MuiLink component={Link} href="/learn" color="inherit">
          Learn
        </MuiLink>
        <Typography color="text.primary">{category}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            backgroundClip: 'text',
            color: 'transparent',
            mb: 2,
          }}
        >
          {title}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          {description}
        </Typography>
      </Box>

      <Paper
        sx={{
          p: { xs: 3, md: 6 },
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {children}
      </Paper>
    </MotionContainer>
  );
}
