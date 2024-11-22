export interface Token {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
}

export interface TokenPriceHistory {
  timestamp: number;
  price: number;
}
