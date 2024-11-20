'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Stack,
  useTheme,
  Slide,
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    threshold: 100, // Start hiding after 100px of scroll
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const pages = [
  { name: 'Trade', href: '/trade' },
  { name: 'Learn', href: '/learn' },
  { name: 'Rewards', href: '/rewards' },
];

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const theme = useTheme();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <HideOnScroll>
      <AppBar 
        sx={{ 
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo - Desktop */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Space Grotesk',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MemeFi
            </Typography>

            {/* Mobile menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    background: 'rgba(0,0,0,0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    mt: 1,
                  }
                }}
              >
                {pages.map((page) => (
                  <MenuItem 
                    key={page.name} 
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href={page.href}
                    sx={{
                      color: isActive(page.href) ? theme.palette.primary.main : 'inherit',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      }
                    }}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Logo - Mobile */}
            <Typography
              variant="h5"
              noWrap
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'Space Grotesk',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MemeFi
            </Typography>

            {/* Desktop menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  href={page.href}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    mx: 1,
                    color: isActive(page.href) ? theme.palette.primary.main : 'white',
                    display: 'block',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Connect Wallet Button */}
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                px: { xs: 2, md: 4 },
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  opacity: 0.9,
                }
              }}
            >
              Connect
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}
