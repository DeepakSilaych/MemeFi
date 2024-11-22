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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token-related endpoints
export const getTokens = async (): Promise<Token[]> => {
  try {
    const response = await api.get('/meme-tokens');
    return response.data.map((token: any) => ({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      price: token.currentPrice,
      description: token.description,
      imageUrl: token.imageUrl,
      totalSupply: token.totalSupply,
      priceChange24h: 0, // To be implemented
      volume24h: 0, // To be implemented
      marketCap: token.currentPrice * token.totalSupply,
    }));
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

export const getTokenDetails = async (id: string): Promise<Token> => {
  try {
    const response = await api.get(`/meme-tokens/${id}`);
    const token = response.data;
    return {
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      price: token.currentPrice,
      description: token.description,
      imageUrl: token.imageUrl,
      totalSupply: token.totalSupply,
      priceChange24h: 0, // To be implemented
      volume24h: 0, // To be implemented
      marketCap: token.currentPrice * token.totalSupply,
      trades: token.trades,
      liquidityProvisions: token.liquidityProvisions,
    };
  } catch (error) {
    console.error('Error fetching token details:', error);
    throw error;
  }
};

export const getTokenPriceHistory = async (id: string, period: string = '24h'): Promise<{ timestamp: string; price: number; }[]> => {
  try {
    const response = await api.get(`/meme-tokens/${id}/price-history?period=${period}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token price history:', error);
    throw error;
  }
};

// Trade-related endpoints
export const getTrades = async (userId: string): Promise<Trade[]> => {
  try {
    const response = await api.get(`/trading/positions/${userId}`);
    const { active, history } = response.data;
    
    const mapPosition = (position: any): Trade => ({
      id: position.id,
      tokenId: position.token,
      direction: position.direction.toLowerCase(),
      timeframe: position.duration,
      amount: position.amount,
      status: position.status === 'open' ? 'active' : 'completed',
      createdAt: position.entry_time,
      completedAt: position.exit_time,
      result: position.pnl > 0 ? 'win' : 'loss',
      pnl: position.pnl,
    });

    return [...active.map(mapPosition), ...history.map(mapPosition)];
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};

export const createTrade = async (trade: CreateTradeRequest): Promise<Trade> => {
  try {
    const response = await api.post('/trading/position/open', {
      user_id: 'default-user', // TODO: Replace with actual user ID
      token: trade.tokenId,
      amount: trade.amount,
      direction: trade.direction.toUpperCase(),
      duration: trade.timeframe,
    });
    
    return {
      id: response.data.id,
      tokenId: response.data.token,
      direction: response.data.direction.toLowerCase(),
      timeframe: response.data.duration,
      amount: response.data.amount,
      status: 'active',
      createdAt: response.data.entry_time,
    };
  } catch (error) {
    console.error('Error creating trade:', error);
    throw error;
  }
};

export const closeTrade = async (tradeId: string): Promise<Trade> => {
  try {
    const response = await api.post(`/trading/position/${tradeId}/close`);
    
    return {
      id: response.data.id,
      tokenId: response.data.token,
      direction: response.data.direction.toLowerCase(),
      timeframe: response.data.duration,
      amount: response.data.amount,
      status: 'completed',
      createdAt: response.data.entry_time,
      completedAt: response.data.exit_time,
      result: response.data.pnl > 0 ? 'win' : 'loss',
      pnl: response.data.pnl,
    };
  } catch (error) {
    console.error('Error closing trade:', error);
    throw error;
  }
};

// Liquidity-related endpoints
export const getPools = async (): Promise<LiquidityPool[]> => {
  try {
    const response = await api.get('/liquidity/pools');
    return response.data.map((pool: any) => ({
      id: pool.id,
      tokenId: pool.token,
      liquidity: pool.liquidity,
      apr: pool.apr,
    }));
  } catch (error) {
    console.error('Error fetching pools:', error);
    throw error;
  }
};

export const addLiquidity = async (poolId: string, amount: number): Promise<void> => {
  try {
    await api.post(`/liquidity/pools/${poolId}/add`, { amount });
  } catch (error) {
    console.error('Error adding liquidity:', error);
    throw error;
  }
};

export const removeLiquidity = async (poolId: string, amount: number): Promise<void> => {
  try {
    await api.post(`/liquidity/pools/${poolId}/remove`, { amount });
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
