import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface MemeToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
  volume_24h: number;
}

export interface MarketOverview {
  total_market_cap: number;
  total_volume_24h: number;
  average_price_change_24h: number;
  top_tokens: MemeToken[];
}

export interface TokenDetails extends MemeToken {
  description: string;
  market_data: {
    current_price: number;
    market_cap: number;
    total_volume: number;
    price_change_24h: number;
    price_change_7d: number;
    price_change_30d: number;
    ath: number;
    ath_date: string;
    atl: number;
    atl_date: string;
  };
  community: {
    twitter_followers: number;
    reddit_subscribers: number;
    telegram_channel_user_count: number;
  };
  dex_data?: {
    price: number;
    chain: string;
    timestamp: string;
  };
}

export interface PriceHistory {
  timestamp: number;
  price: number;
}

class ApiService {
  private async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getMarketOverview(): Promise<MarketOverview> {
    return this.get<MarketOverview>('/trading/market/overview');
  }

  async getTokenList(limit: number = 50): Promise<MemeToken[]> {
    return this.get<MemeToken[]>('/trading/tokens', { limit });
  }

  async getTokenDetails(tokenId: string): Promise<TokenDetails> {
    return this.get<TokenDetails>(`/trading/tokens/${tokenId}`);
  }

  async getTokenPriceHistory(tokenId: string, days: number = 7): Promise<PriceHistory[]> {
    return this.get<PriceHistory[]>(`/trading/tokens/${tokenId}/price-history`, { days });
  }

  async getSwapQuote(fromToken: string, toToken: string, amount: number) {
    return this.get('/trading/tokens/swap-quote', {
      from_token: fromToken,
      to_token: toToken,
      amount,
    });
  }
}

export const apiService = new ApiService();
