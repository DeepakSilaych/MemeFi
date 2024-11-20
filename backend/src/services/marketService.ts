import axios from 'axios';
import { TokenMarketData, TokenPriceHistory, TokenInfo } from '../types/market';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// List of popular meme coins to track
const MEME_COINS = [
  'pepe',
  'dogecoin',
  'shiba-inu',
  'floki',
  'bonk',
  'wojak',
  'memecoin',
  'dogelon-mars',
  'catecoin',
  'hoge-finance'
];

export class MarketService {
  private static instance: MarketService;
  private cachedMarketData: TokenMarketData[] = [];
  private lastUpdate: number = 0;
  private readonly CACHE_DURATION = 60 * 1000; // 1 minute cache

  private constructor() {}

  public static getInstance(): MarketService {
    if (!MarketService.instance) {
      MarketService.instance = new MarketService();
    }
    return MarketService.instance;
  }

  /**
   * Fetch market data for all tracked meme coins
   */
  public async getMemeCoinMarketData(): Promise<TokenMarketData[]> {
    const now = Date.now();
    if (this.cachedMarketData.length > 0 && now - this.lastUpdate < this.CACHE_DURATION) {
      return this.cachedMarketData;
    }

    try {
      const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: MEME_COINS.join(','),
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false
        }
      });

      this.cachedMarketData = response.data;
      this.lastUpdate = now;
      return response.data;
    } catch (error) {
      console.error('Error fetching meme coin market data:', error);
      throw error;
    }
  }

  /**
   * Get historical price data for a specific coin
   */
  public async getCoinPriceHistory(
    coinId: string,
    days: number = 1
  ): Promise<TokenPriceHistory> {
    try {
      const response = await axios.get(
        `${COINGECKO_API_BASE}/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: days
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching price history for ${coinId}:`, error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific coin
   */
  public async getCoinInfo(coinId: string): Promise<TokenInfo> {
    try {
      const response = await axios.get(
        `${COINGECKO_API_BASE}/coins/${coinId}`,
        {
          params: {
            localization: false,
            tickers: false,
            market_data: false,
            community_data: false,
            developer_data: false,
            sparkline: false
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching coin info for ${coinId}:`, error);
      throw error;
    }
  }

  /**
   * Search for coins by query
   */
  public async searchCoins(query: string): Promise<any> {
    try {
      const response = await axios.get(`${COINGECKO_API_BASE}/search`, {
        params: {
          query: query
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching coins:', error);
      throw error;
    }
  }
}
