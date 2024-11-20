'use client';

import React from 'react';
import { Box, Typography, useTheme, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface TimeOption {
  value: string;
  label: string;
  color: string;
  multiplier: string;
  risk: 'High' | 'Medium-High' | 'Medium' | 'Low';
}

const timeOptions: TimeOption[] = [
  { 
    value: '5', 
    label: '5m', 
    color: '#4ECDC4',
    multiplier: '1.8x',
    risk: 'High'
  },
  { 
    value: '15', 
    label: '15m', 
    color: '#FFD93D',
    multiplier: '2.2x',
    risk: 'Medium-High'
  },
  { 
    value: '60', 
    label: '1h', 
    color: '#6C63FF',
    multiplier: '2.5x',
    risk: 'Medium'
  },
  { 
    value: '240', 
    label: '4h', 
    color: '#FF6B6B',
    multiplier: '3.0x',
    risk: 'Low'
  },
];

const getRiskColor = (risk: TimeOption['risk']) => {
  switch (risk) {
    case 'High':
      return '#FF4842';
    case 'Medium-High':
      return '#FFB74D';
    case 'Medium':
      return '#4ECDC4';
    case 'Low':
      return '#54D62C';
    default:
      return '#4ECDC4';
  }
};

export default function TimeSelector({ value, onChange }: TimeSelectorProps) {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1,
          width: '100%',
        }}
      >
        {timeOptions.map((option) => {
          const isSelected = value === option.value;
          const riskColor = getRiskColor(option.risk);
          
          return (
            <Tooltip
              key={option.value}
              title={
                <Box sx={{ p: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {option.label} Trading
                  </Typography>
                  <Typography variant="caption" display="block">
                    Multiplier: {option.multiplier}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    display="block"
                    sx={{ color: riskColor }}
                  >
                    Risk Level: {option.risk}
                  </Typography>
                </Box>
              }
              arrow
            >
              <Box sx={{ flex: 1 }}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Box
                    onClick={() => onChange(option.value)}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid',
                      borderColor: isSelected ? option.color : 'rgba(255,255,255,0.1)',
                      background: isSelected 
                        ? `linear-gradient(135deg, ${option.color}20 0%, ${option.color}10 100%)`
                        : 'rgba(255,255,255,0.02)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: option.color,
                        background: `linear-gradient(135deg, ${option.color}15 0%, ${option.color}05 100%)`,
                      },
                      overflow: 'hidden',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: isSelected ? option.color : 'text.secondary',
                        fontWeight: isSelected ? 600 : 400,
                        transition: 'all 0.2s ease-in-out',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {option.label}
                    </Typography>
                    
                    {isSelected && (
                      <>
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: 2,
                            background: `linear-gradient(90deg, transparent 0%, ${option.color} 50%, transparent 100%)`,
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: `radial-gradient(circle at center, ${option.color}10 0%, transparent 70%)`,
                          }}
                        />
                      </>
                    )}
                  </Box>
                </motion.div>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
