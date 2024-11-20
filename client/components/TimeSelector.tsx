'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface TimeOption {
  value: string;
  label: string;
  color: string;
}

const timeOptions: TimeOption[] = [
  { value: '1', label: '1m', color: '#FF6B6B' },
  { value: '5', label: '5m', color: '#4ECDC4' },
  { value: '15', label: '15m', color: '#FFD93D' },
  { value: '60', label: '1h', color: '#6C63FF' },
];

export default function TimeSelector({ value, onChange }: TimeSelectorProps) {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 2 }}>
      <Typography 
        variant="subtitle2" 
        sx={{ mb: 1, color: 'text.secondary' }}
      >
        Duration
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1,
          width: '100%',
        }}
      >
        {timeOptions.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ flex: 1 }}
          >
            <Box
              onClick={() => onChange(option.value)}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                height: 60,
                borderRadius: 1.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: value === option.value ? option.color : 'rgba(255,255,255,0.1)',
                background: value === option.value 
                  ? `linear-gradient(135deg, ${option.color}20 0%, ${option.color}10 100%)`
                  : 'transparent',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: option.color,
                  background: `linear-gradient(135deg, ${option.color}15 0%, ${option.color}05 100%)`,
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: value === option.value ? option.color : 'text.primary',
                  fontWeight: value === option.value ? 600 : 400,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {option.label}
              </Typography>
              
              {value === option.value && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -1,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 30,
                    height: 2,
                    background: option.color,
                    borderRadius: '2px 2px 0 0',
                  }}
                />
              )}
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
