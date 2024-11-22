import { StaticImageData } from 'next/image';

export interface TokenInfo {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI?: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  marketCap?: number;
  price?: number;
  priceChange24h?: number;
  volume24h?: number;
  isVerified?: boolean;
  launchDate?: string;
  category?: string[];
  tags?: string[];
}

// Initial meme tokens list
export const defaultTokens: TokenInfo[] = [
  {
    id: 'pepe',
    symbol: 'PEPE',
    name: 'Pepe',
    decimals: 18,
    address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
    description: 'The most memeable memecoin in existence',
    website: 'https://pepe.vip',
    twitter: 'https://twitter.com/pepecoineth',
    telegram: 'https://t.me/pepeeth',
    category: ['meme', 'community'],
    tags: ['frog', 'pepe', 'trending'],
    isVerified: true,
  },
  {
    id: 'wojak',
    symbol: 'WOJAK',
    name: 'Wojak Coin',
    decimals: 18,
    address: '0x89e0262ec34311564b4e43d416218d38d4db879c',
    description: 'Community-driven meme token based on the Wojak meme',
    category: ['meme', 'community'],
    tags: ['wojak', 'trending'],
    isVerified: true,
  },
  {
    id: 'doge',
    symbol: 'DOGE',
    name: 'Dogecoin',
    decimals: 8,
    address: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
    description: 'The original meme coin that started it all',
    website: 'https://dogecoin.com',
    twitter: 'https://twitter.com/dogecoin',
    category: ['meme', 'community'],
    tags: ['doge', 'classic'],
    isVerified: true,
  },
];

class TokenRegistry {
  private tokens: Map<string, TokenInfo>;
  private listeners: Set<(tokens: TokenInfo[]) => void>;

  constructor(initialTokens: TokenInfo[] = defaultTokens) {
    this.tokens = new Map(initialTokens.map(token => [token.id, token]));
    this.listeners = new Set();
  }

  // Get all tokens
  getAllTokens(): TokenInfo[] {
    return Array.from(this.tokens.values());
  }

  // Get token by ID
  getToken(id: string): TokenInfo | undefined {
    return this.tokens.get(id);
  }

  // Add new token
  addToken(token: TokenInfo): void {
    if (this.tokens.has(token.id)) {
      throw new Error(`Token with ID ${token.id} already exists`);
    }
    this.tokens.set(token.id, token);
    this.notifyListeners();
  }

  // Update existing token
  updateToken(id: string, updates: Partial<TokenInfo>): void {
    const token = this.tokens.get(id);
    if (!token) {
      throw new Error(`Token with ID ${id} not found`);
    }
    this.tokens.set(id, { ...token, ...updates });
    this.notifyListeners();
  }

  // Remove token
  removeToken(id: string): void {
    if (!this.tokens.delete(id)) {
      throw new Error(`Token with ID ${id} not found`);
    }
    this.notifyListeners();
  }

  // Filter tokens by category
  getTokensByCategory(category: string): TokenInfo[] {
    return this.getAllTokens().filter(token => 
      token.category?.includes(category)
    );
  }

  // Filter tokens by tag
  getTokensByTag(tag: string): TokenInfo[] {
    return this.getAllTokens().filter(token => 
      token.tags?.includes(tag)
    );
  }

  // Search tokens
  searchTokens(query: string): TokenInfo[] {
    const searchQuery = query.toLowerCase();
    return this.getAllTokens().filter(token => 
      token.name.toLowerCase().includes(searchQuery) ||
      token.symbol.toLowerCase().includes(searchQuery) ||
      token.description?.toLowerCase().includes(searchQuery) ||
      token.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  }

  // Subscribe to token updates
  subscribe(callback: (tokens: TokenInfo[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of changes
  private notifyListeners(): void {
    const tokens = this.getAllTokens();
    this.listeners.forEach(listener => listener(tokens));
  }
}

export const tokenRegistry = new TokenRegistry();

// Export a hook for React components
export const useTokenRegistry = () => {
  return tokenRegistry;
};
