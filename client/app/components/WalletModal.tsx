'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { SUPPORTED_WALLETS, SupportedWallet } from '../services/wallet';
import { useWallet } from '../context/WalletContext';

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: SupportedWallet) => void;
}

export default function WalletModal({ open, onClose, onSelectWallet }: WalletModalProps) {
  const { error, isConnecting, isWalletInstalled } = useWallet();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, rgba(0,0,0,0.9) 0%, rgba(10,10,20,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, color: 'white' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Connect Wallet
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <List sx={{ width: '100%', bgcolor: 'transparent' }}>
          {SUPPORTED_WALLETS.map((wallet) => {
            const isInstalled = isWalletInstalled(wallet.id);
            return (
              <ListItem key={wallet.id} disablePadding>
                <ListItemButton
                  onClick={() => onSelectWallet(wallet.id)}
                  disabled={isConnecting || !isInstalled}
                  sx={{
                    py: 2,
                    borderRadius: 1,
                    opacity: isInstalled ? 1 : 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        src={wallet.icon}
                        alt={wallet.name}
                        width={32}
                        height={32}
                        style={{ objectFit: 'contain' }}
                      />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={wallet.name}
                    secondary={!isInstalled ? 'Not installed' : ''}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'white',
                        fontWeight: 500,
                      },
                      '& .MuiListItemText-secondary': {
                        color: 'rgba(255,255,255,0.7)',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}
