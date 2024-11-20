export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  image?: string;
}

export interface Trade {
  id: string;
  tokenId: string;
  direction: 'up' | 'down';
  timeframe: number;
  amount: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  result?: 'win' | 'loss';
  pnl?: number;
}

export interface CreateTradeRequest {
  tokenId: string;
  direction: 'up' | 'down';
  timeframe: number;
  amount: number;
}

export interface LiquidityPool {
  id: string;
  name: string;
  totalLiquidity: number;
  apr: number;
  userLiquidity?: number;
  riskLevel: 'low' | 'medium' | 'high';
  performanceHistory: {
    date: string;
    value: number;
  }[];
}

export interface UserStats {
  totalTrades: number;
  winRate: number;
  totalVolume: number;
  points: number;
  rank: number;
  badges: Badge[];
  performanceHistory: {
    date: string;
    pnl: number;
  }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  points: number;
  trades: number;
  winRate: number;
  badges?: Badge[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  image: string;
  pointsCost: number;
  type: 'nft' | 'discount' | 'boost';
  value: number; // Percentage for discounts/boosts, NFT token ID for NFTs
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  rewards: Reward[];
  requirements: {
    trades?: number;
    volume?: number;
    winRate?: number;
  };
}
