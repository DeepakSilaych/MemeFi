'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { walletService, SupportedWallet } from '../services/wallet';
import WalletModal from '../components/WalletModal';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => Promise<void>;
  walletType: SupportedWallet | null;
  isWalletInstalled: (walletId: SupportedWallet) => boolean;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  connect: () => {},
  disconnect: async () => {},
  walletType: null,
  isWalletInstalled: () => false,
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletType, setWalletType] = useState<SupportedWallet | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWalletSelect = async (selectedWallet: SupportedWallet) => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!walletService.isWalletInstalled(selectedWallet)) {
        const walletName = selectedWallet === 'keplr' ? 'Keplr' : 'Leap';
        throw new Error(`${walletName} wallet is not installed. Please install it first.`);
      }

      const userAddress = await walletService.connectWallet(selectedWallet);
      setAddress(userAddress);
      setWalletType(selectedWallet);
      setShowWalletModal(false);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
      setAddress(null);
      setWalletType(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const connect = useCallback(() => {
    setShowWalletModal(true);
    setError(null);
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await walletService.disconnectWallet();
      setAddress(null);
      setWalletType(null);
      setError(null);
    } catch (error: any) {
      console.error('Error disconnecting wallet:', error);
      setError(error.message || 'Failed to disconnect wallet');
    }
  }, []);

  const isWalletInstalled = useCallback((walletId: SupportedWallet): boolean => {
    return walletService.isWalletInstalled(walletId);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        error,
        connect,
        disconnect,
        walletType,
        isWalletInstalled,
      }}
    >
      {children}
      <WalletModal
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleWalletSelect}
      />
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);

export default WalletContext;
