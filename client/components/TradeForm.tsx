import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface TradeFormProps {
  onSubmit?: (values: any) => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ onSubmit }) => {
  const [direction, setDirection] = useState<'UP' | 'DOWN'>('UP');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [duration, setDuration] = useState(5);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const maxLeverage = 100;

  // Duration options with details
  const durationOptions = [
    { 
      value: 5, 
      label: '5m',
      color: '#FF6B6B',
      details: {
        title: 'Quick Trade',
        description: 'Short-term momentum trading',
        risk: 'High Risk',
        multiplier: '2.5x'
      }
    },
    { 
      value: 15, 
      label: '15m',
      color: '#4ECDC4',
      details: {
        title: 'Short Term',
        description: 'Capture quick market movements',
        risk: 'Medium-High Risk',
        multiplier: '2.2x'
      }
    },
    { 
      value: 30, 
      label: '30m',
      color: '#45B7D1',
      details: {
        title: 'Medium Term',
        description: 'Balance of volatility and trend',
        risk: 'Medium Risk',
        multiplier: '2.0x'
      }
    },
    { 
      value: 60, 
      label: '1h',
      color: '#96CEB4',
      details: {
        title: 'Standard',
        description: 'Popular timeframe for day trading',
        risk: 'Medium-Low Risk',
        multiplier: '1.8x'
      }
    },
    { 
      value: 240, 
      label: '4h',
      color: '#88D8B0',
      details: {
        title: 'Extended',
        description: 'Catch major intraday moves',
        risk: 'Low Risk',
        multiplier: '1.5x'
      }
    },
    { 
      value: 1440, 
      label: '1d',
      color: '#7B6CF6',
      details: {
        title: 'Daily',
        description: 'Ride daily market trends',
        risk: 'Very Low Risk',
        multiplier: '1.3x'
      }
    },
    { 
      value: 10080, 
      label: '1w',
      color: '#6C5CE7',
      details: {
        title: 'Swing Trade',
        description: 'Capture weekly market cycles',
        risk: 'Ultra Low Risk',
        multiplier: '1.2x'
      }
    }
  ];

  const leveragePresets = [
    { value: 1, label: '1x', color: '#4ECDC4', risk: 'No Leverage' },
    { value: 5, label: '5x', color: '#45B7D1', risk: 'Low' },
    { value: 10, label: '10x', color: '#96CEB4', risk: 'Medium' },
    { value: 25, label: '25x', color: '#FFD93D', risk: 'High' },
    { value: 50, label: '50x', color: '#FF9F43', risk: 'Very High' },
    { value: 100, label: '100x', color: '#FF6B6B', risk: 'Extreme' },
  ];

  const getLeverageColor = (value: number) => {
    const preset = leveragePresets.reduce((prev, curr) => 
      Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
    );
    return preset.color;
  };

  const getLeverageRisk = (value: number) => {
    const preset = leveragePresets.reduce((prev, curr) => 
      Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
    );
    return preset.risk;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        direction,
        amount,
        leverage,
        duration,
      });
    }
  };

  const calculateEstimatedReturn = () => {
    const baseReturn = parseFloat(amount) || 0;
    const leveragedReturn = baseReturn * leverage;
    const potentialProfit = direction === 'UP' ? leveragedReturn * 0.95 : leveragedReturn * 0.92;
    return potentialProfit.toFixed(2);
  };

  const calculateLiquidationPrice = () => {
    const currentPrice = 0.0234; // Mock price, should come from props
    const liquidationThreshold = 0.8; // 80% of margin
    const priceDelta = (currentPrice * (1 - liquidationThreshold)) * leverage;
    const liquidationPrice = direction === 'UP' 
      ? currentPrice - priceDelta
      : currentPrice + priceDelta;
    return liquidationPrice.toFixed(6);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newValue = Math.round(percentage * (maxLeverage - 1) + 1);
    setLeverage(Math.max(1, Math.min(maxLeverage, newValue)));
  }, [isDragging, maxLeverage]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  }, [handleDrag]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDrag]);

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        height: '100%',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 1,
      }}
    >
      {/* Direction Buttons */}
      <ToggleButtonGroup
        value={direction}
        exclusive
        onChange={(e, value) => value && setDirection(value)}
        fullWidth
        sx={{ height: '48px' }}
      >
        <ToggleButton 
          value="UP"
          sx={{
            flex: 1,
            gap: 1,
            color: 'success.main',
            '&.Mui-selected': {
              background: 'rgba(46, 125, 50, 0.1)',
              color: 'success.main',
            },
          }}
        >
          <TrendingUpIcon />
          <Typography variant="button" sx={{ fontSize: '0.9rem' }}>UP</Typography>
        </ToggleButton>
        <ToggleButton 
          value="DOWN"
          sx={{
            flex: 1,
            gap: 1,
            color: 'error.main',
            '&.Mui-selected': {
              background: 'rgba(211, 47, 47, 0.1)',
              color: 'error.main',
            },
          }}
        >
          <TrendingDownIcon />
          <Typography variant="button" sx={{ fontSize: '0.9rem' }}>DOWN</Typography>
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Amount Input */}
      <TextField
        fullWidth
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '48px',
          }
        }}
      />

      {/* Leverage Control */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Leverage
          </Typography>
          <Tooltip title="Leverage multiplies both potential profits and losses">
            <IconButton size="small">
              <InfoOutlinedIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Leverage Presets */}
        <Stack direction="row" spacing={1}>
          {leveragePresets.map((preset) => (
            <Button
              key={preset.value}
              size="small"
              variant={leverage === preset.value ? "contained" : "outlined"}
              onClick={() => setLeverage(preset.value)}
              sx={{
                minWidth: 0,
                flex: 1,
                height: '32px',
                fontSize: '0.75rem',
                background: leverage === preset.value ? `${preset.color}20` : 'transparent',
                borderColor: leverage === preset.value ? preset.color : 'rgba(255,255,255,0.1)',
                color: leverage === preset.value ? preset.color : 'text.secondary',
                '&:hover': {
                  background: `${preset.color}30`,
                  borderColor: preset.color,
                },
              }}
            >
              {preset.label}
            </Button>
          ))}
        </Stack>

        {/* Custom Leverage Slider */}
        <Box sx={{ px: 1, pt:2 }}>
          <Box
            ref={sliderRef}
            sx={{
              height: '2px',
              width: '100%',
              position: 'relative',
              background: 'rgba(255,255,255,0.1)',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              const newValue = Math.round(percentage * (maxLeverage - 1) + 1);
              setLeverage(Math.max(1, Math.min(maxLeverage, newValue)));
            }}
          >
            {/* Progress Bar */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${((leverage - 1) / (maxLeverage - 1)) * 100}%`,
                background: getLeverageColor(leverage),
                transition: isDragging ? 'none' : 'width 0.2s ease',
              }}
            />

            {/* Leverage Marker */}
            <Box
              onMouseDown={handleDragStart}
              sx={{
                position: 'absolute',
                left: `${((leverage - 1) / (maxLeverage - 1)) * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                borderRadius: '10px',
                background: getLeverageColor(leverage),
                border: '2px solid rgba(255,255,255,0.9)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: isDragging ? 'none' : 'all 0.2s ease',
                cursor: isDragging ? 'grabbing' : 'grab',
                '&:hover': {
                  transform: 'translate(-50%, -50%) scale(1.1)',
                },
                zIndex: 1,
              }}
            />

            {/* Tick Marks */}
            {leveragePresets.map((preset) => (
              <Box
                key={preset.value}
                sx={{
                  position: 'absolute',
                  left: `${((preset.value - 1) / (maxLeverage - 1)) * 100}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '2px',
                  height: '8px',
                  background: 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </Box>

          {/* Leverage Info */}
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: getLeverageColor(leverage),
                transition: 'color 0.2s ease',
              }}
            >
              {leverage}x
            </Typography>
            <Chip
              label={getLeverageRisk(leverage)}
              size="small"
              sx={{
                backgroundColor: `${getLeverageColor(leverage)}20`,
                color: getLeverageColor(leverage),
                borderColor: getLeverageColor(leverage),
                fontSize: '0.7rem',
                height: '20px',
              }}
            />
          </Stack>
        </Box>
      </Box>

      {/* Duration Selection */}
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1 }}>
          Duration
        </Typography>
        <Stack direction="row" spacing={1}>
          {durationOptions.map((option) => (
            <Tooltip
              key={option.value}
              title={
                <Box sx={{ p: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ color: option.color, mb: 0.5 }}>
                    {option.details.title}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                    {option.details.description}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: option.details.risk.includes('High') ? 'error.light' : 'success.light'
                      }}
                    >
                      {option.details.risk}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'primary.light' }}>
                      {option.details.multiplier} Multiplier
                    </Typography>
                  </Stack>
                </Box>
              }
              arrow
              placement="top"
            >
              <Button
                onClick={() => setDuration(option.value)}
                variant={duration === option.value ? "contained" : "outlined"}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  height: '36px',
                  fontSize: '0.75rem',
                  background: duration === option.value ? `${option.color}20` : 'transparent',
                  borderColor: duration === option.value ? option.color : 'rgba(255,255,255,0.1)',
                  color: duration === option.value ? option.color : 'text.secondary',
                  '&:hover': {
                    background: `${option.color}30`,
                    borderColor: option.color,
                  },
                }}
              >
                {option.label}
              </Button>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {/* Trade Info */}
      <Box sx={{ 
        p: 1.5,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 1,
        mt: 'auto'
      }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Est. Return
            </Typography>
            <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}>
              ${calculateEstimatedReturn()}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Liquidation Price
            </Typography>
            <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}>
              ${calculateLiquidationPrice()}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Trading Fee
            </Typography>
            <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}>
              0.1%
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          height: '48px',
          background: direction === 'UP' ? 'success.main' : 'error.main',
          '&:hover': {
            background: direction === 'UP' ? 'success.dark' : 'error.dark',
          }
        }}
      >
        Place {direction} Trade
      </Button>
    </Box>
  );
};

export default TradeForm;
