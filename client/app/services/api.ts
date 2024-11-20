import axios from 'axios';
import {
  Token,
  Trade,
  CreateTradeRequest,
  LiquidityPool,
  UserStats,
  LeaderboardEntry,
  Reward,
  Campaign,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token-related endpoints
export const getTokens = async (): Promise<Token[]> => {
  try {
    const response = await api.get('/tokens');
    return response.data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

export const getTokenPrice = async (tokenId: string): Promise<number> => {
  try {
    const response = await api.get(`/tokens/${tokenId}/price`);
    return response.data.price;
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
};

// Trade-related endpoints
export const getTrades = async (): Promise<Trade[]> => {
  try {
    const response = await api.get('/trades');
    return response.data;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};

export const createTrade = async (trade: CreateTradeRequest): Promise<Trade> => {
  try {
    const response = await api.post('/trades', trade);
    return response.data;
  } catch (error) {
    console.error('Error creating trade:', error);
    throw error;
  }
};

// Liquidity-related endpoints
export const getPools = async (): Promise<LiquidityPool[]> => {
  try {
    const response = await api.get('/pools');
    return response.data;
  } catch (error) {
    console.error('Error fetching pools:', error);
    throw error;
  }
};

export const addLiquidity = async (poolId: string, amount: number): Promise<void> => {
  try {
    await api.post(`/pools/${poolId}/add`, { amount });
  } catch (error) {
    console.error('Error adding liquidity:', error);
    throw error;
  }
};

export const removeLiquidity = async (poolId: string, amount: number): Promise<void> => {
  try {
    await api.post(`/pools/${poolId}/remove`, { amount });
  } catch (error) {
    console.error('Error removing liquidity:', error);
    throw error;
  }
};

// User stats and rewards
export const getUserStats = async (address: string): Promise<UserStats> => {
  try {
    const response = await api.get(`/users/${address}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

export const getLeaderboard = async (timeframe: 'daily' | 'weekly' | 'monthly' | 'all'): Promise<LeaderboardEntry[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaderboard/${timeframe}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

export const getRewards = async (): Promise<Reward[]> => {
  try {
    const response = await api.get('/rewards');
    return response.data;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw error;
  }
};

export const claimReward = async (rewardId: string): Promise<void> => {
  try {
    await api.post(`/rewards/${rewardId}/claim`);
  } catch (error) {
    console.error('Error claiming reward:', error);
    throw error;
  }
};

// Campaigns
export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await api.get('/campaigns');
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

// Token swapping
export const getSwapQuote = async (
  fromTokenId: string,
  toTokenId: string,
  amount: number
): Promise<{
  quote: number;
  priceImpact: number;
  path: string[];
}> => {
  try {
    const response = await api.get('/swap/quote', {
      params: { fromTokenId, toTokenId, amount },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting swap quote:', error);
    throw error;
  }
};

export const executeSwap = async (
  fromTokenId: string,
  toTokenId: string,
  amount: number,
  minAmountOut: number
): Promise<void> => {
  try {
    await api.post('/swap/execute', {
      fromTokenId,
      toTokenId,
      amount,
      minAmountOut,
    });
  } catch (error) {
    console.error('Error executing swap:', error);
    throw error;
  }
};
