'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: async () => {},
});

// Dummy address generator
const generateDummyAddress = () => {
  const chars = '0123456789abcdef';
  let address = 'inj1';
  for (let i = 0; i < 38; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    try {
      setIsConnecting(true);
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dummyAddress = generateDummyAddress();
      setAddress(dummyAddress);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      // Simulate disconnection delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setAddress(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);

export default WalletContext;
