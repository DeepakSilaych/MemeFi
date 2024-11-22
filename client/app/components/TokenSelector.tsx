'use client';

import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { TokenInfo, useTokenRegistry } from '../config/tokens';

interface TokenSelectorProps {
  value?: TokenInfo | null;
  onChange?: (token: TokenInfo | null) => void;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  showTags?: boolean;
  showVerified?: boolean;
  showTrending?: boolean;
  disabled?: boolean;
}

export default function TokenSelector({
  value,
  onChange,
  label = 'Select Token',
  placeholder = 'Search tokens...',
  multiple = false,
  showTags = true,
  showVerified = true,
  showTrending = true,
  disabled = false,
}: TokenSelectorProps) {
  const tokenRegistry = useTokenRegistry();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<TokenInfo[]>([]);

  useEffect(() => {
    // Initial tokens load
    setTokens(tokenRegistry.getAllTokens());

    // Subscribe to token updates
    const unsubscribe = tokenRegistry.subscribe((updatedTokens) => {
      setTokens(updatedTokens);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: TokenInfo | TokenInfo[] | null
  ) => {
    if (multiple) {
      const tokens = newValue as TokenInfo[];
      setSelectedTokens(tokens);
      onChange?.(tokens as any);
    } else {
      const token = newValue as TokenInfo;
      onChange?.(token);
    }
  };

  return (
    <Autocomplete
      multiple={multiple}
      options={tokens}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              background: 'rgba(23, 25, 35, 0.7)',
              backdropFilter: 'blur(20px)',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00FF87',
              },
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            '&:hover': {
              background: 'rgba(23, 25, 35, 0.7) !important',
            },
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" width="100%">
            {option.logoURI && (
              <Avatar
                src={option.logoURI}
                alt={option.name}
                sx={{ width: 24, height: 24 }}
              />
            )}
            <Box flex={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body1">{option.symbol}</Typography>
                {showVerified && option.isVerified && (
                  <Tooltip title="Verified Token">
                    <VerifiedIcon
                      sx={{ fontSize: 16, color: '#00FF87' }}
                    />
                  </Tooltip>
                )}
                {showTrending && option.tags?.includes('trending') && (
                  <Tooltip title="Trending">
                    <TrendingUpIcon
                      sx={{ fontSize: 16, color: '#FF6B6B' }}
                    />
                  </Tooltip>
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {option.name}
              </Typography>
            </Box>
            {option.website && (
              <Tooltip title="Visit Website">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(option.website, '_blank');
                  }}
                >
                  <LinkIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          {showTags && option.tags && (
            <Stack direction="row" spacing={0.5} mt={1}>
              {option.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    height: '20px',
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>
      )}
    />
  );
}
