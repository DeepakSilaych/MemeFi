'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

interface Token {
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
  price?: string;
}

interface TokenSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedToken: string;
}

const tokens: Token[] = [
  { 
    symbol: 'INJ', 
    name: 'Injective', 
    logo: '/tokens/inj.svg',
    balance: '1,234.56',
    price: '$12.34'
  },
  { 
    symbol: 'MEME', 
    name: 'Memecoin', 
    logo: '/tokens/meme.svg',
    balance: '10,000.00',
    price: '$0.0001234'
  },
  { 
    symbol: 'PEPE', 
    name: 'Pepe', 
    logo: '/tokens/pepe.svg',
    balance: '1,000,000.00',
    price: '$0.00000123'
  },
  { 
    symbol: 'DOGE', 
    name: 'Dogecoin', 
    logo: '/tokens/doge.svg',
    balance: '5,000.00',
    price: '$0.0789'
  },
];

const MotionBox = motion(Box);

export default function TokenSelector({ open, onClose, onSelect, selectedToken }: TokenSelectorProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (token: Token) => {
    onSelect(token);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Select Token</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by name or symbol"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              background: 'rgba(255,255,255,0.05)',
              '&:hover': {
                background: 'rgba(255,255,255,0.08)',
              },
              '&.Mui-focused': {
                background: 'rgba(255,255,255,0.08)',
              }
            }
          }}
        />

        <AnimatePresence>
          {filteredTokens.map((token, index) => (
            <MotionBox
              key={token.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Box
                onClick={() => handleSelect(token)}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedToken === token.symbol 
                    ? 'primary.main' 
                    : 'transparent',
                  background: selectedToken === token.symbol
                    ? 'rgba(255,255,255,0.05)'
                    : 'transparent',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    component="img"
                    src={token.logo}
                    alt={token.name}
                    sx={{ width: 36, height: 36 }}
                  />
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {token.symbol}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {token.name}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle2">
                      {token.balance}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {token.price}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </MotionBox>
          ))}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
