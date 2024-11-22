'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Switch,
  FormControlLabel,
  Autocomplete,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { TokenInfo, useTokenRegistry } from '../config/tokens';

interface TokenFormData extends Omit<TokenInfo, 'id'> {
  id?: string;
}

const defaultCategories = ['meme', 'community', 'defi', 'gaming', 'nft'];

export default function TokenManager() {
  const tokenRegistry = useTokenRegistry();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingToken, setEditingToken] = useState<TokenInfo | null>(null);
  const [formData, setFormData] = useState<TokenFormData>({
    symbol: '',
    name: '',
    decimals: 18,
    address: '',
    description: '',
    website: '',
    twitter: '',
    telegram: '',
    isVerified: false,
    category: [],
    tags: [],
  });

  useEffect(() => {
    setTokens(tokenRegistry.getAllTokens());
    const unsubscribe = tokenRegistry.subscribe(setTokens);
    return () => unsubscribe();
  }, []);

  const handleOpenDialog = (token?: TokenInfo) => {
    if (token) {
      setEditingToken(token);
      setFormData(token);
    } else {
      setEditingToken(null);
      setFormData({
        symbol: '',
        name: '',
        decimals: 18,
        address: '',
        description: '',
        website: '',
        twitter: '',
        telegram: '',
        isVerified: false,
        category: [],
        tags: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingToken(null);
  };

  const handleSubmit = () => {
    try {
      if (editingToken) {
        tokenRegistry.updateToken(editingToken.id, formData);
      } else {
        const newToken: TokenInfo = {
          ...formData,
          id: formData.symbol.toLowerCase(),
        };
        tokenRegistry.addToken(newToken);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving token:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handleDeleteToken = (id: string) => {
    if (window.confirm('Are you sure you want to delete this token?')) {
      try {
        tokenRegistry.removeToken(id);
      } catch (error) {
        console.error('Error deleting token:', error);
        // Handle error (show notification, etc.)
      }
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Token Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'rgba(0, 255, 135, 0.1)',
            border: '1px solid rgba(0, 255, 135, 0.2)',
            color: '#00FF87',
            '&:hover': {
              background: 'rgba(0, 255, 135, 0.2)',
              border: '1px solid rgba(0, 255, 135, 0.3)',
            },
          }}
        >
          Add Token
        </Button>
      </Stack>

      <Stack spacing={2}>
        {tokens.map((token) => (
          <Box
            key={token.id}
            sx={{
              p: 2,
              borderRadius: 1,
              background: 'rgba(23, 25, 35, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6">{token.symbol}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {token.name}
                </Typography>
                {token.isVerified && (
                  <Chip
                    label="Verified"
                    size="small"
                    sx={{ background: 'rgba(0, 255, 135, 0.1)', color: '#00FF87' }}
                  />
                )}
              </Stack>
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(token)}
                  sx={{ color: 'primary.main' }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteToken(token.id)}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(23, 25, 35, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle>
          {editingToken ? 'Edit Token' : 'Add New Token'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Symbol"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              fullWidth
            />
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Contract Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              fullWidth
            />
            <TextField
              label="Twitter"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              fullWidth
            />
            <TextField
              label="Telegram"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              fullWidth
            />
            <Autocomplete
              multiple
              options={defaultCategories}
              value={formData.category || []}
              onChange={(_, newValue) => setFormData({ ...formData, category: newValue })}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Categories" placeholder="Add category" />
              )}
            />
            <Autocomplete
              multiple
              options={[]}
              value={formData.tags || []}
              onChange={(_, newValue) => setFormData({ ...formData, tags: newValue })}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Add tags" />
              )}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                />
              }
              label="Verified Token"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'rgba(0, 255, 135, 0.1)',
              border: '1px solid rgba(0, 255, 135, 0.2)',
              color: '#00FF87',
              '&:hover': {
                background: 'rgba(0, 255, 135, 0.2)',
                border: '1px solid rgba(0, 255, 135, 0.3)',
              },
            }}
          >
            {editingToken ? 'Save Changes' : 'Add Token'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
