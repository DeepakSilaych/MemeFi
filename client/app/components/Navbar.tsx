'use client';

import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletButton from './WalletButton';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Trade', path: '/trade' },
  { name: 'Liquidity', path: '/liquidity' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Learn', path: '/learn' },
];

const Navbar = () => {
  const theme = useTheme();
  const pathname = usePathname();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        height: '80px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #00F6FF 0%, #00D1FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              MemeFi
            </Typography>
          </Link>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path} passHref style={{ textDecoration: 'none' }}>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      color: isActive ? theme.palette.primary.main : 'white',
                      position: 'relative',
                      '&:after': isActive ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '10%',
                        width: '80%',
                        height: '2px',
                        background: theme.palette.primary.main,
                      } : {},
                    }}
                  >
                    {item.name}
                  </Button>
                </Link>
              );
            })}
            <WalletButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
