import express from 'express';
import { MarketService } from '../services/marketService';

const router = express.Router();
const marketService = MarketService.getInstance();

// Get market data for all tracked meme coins
router.get('/memecoins', async (req, res) => {
  try {
    const marketData = await marketService.getMemeCoinMarketData();
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meme coin market data' });
  }
});

// Get historical price data for a specific coin
router.get('/history/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const days = req.query.days ? parseInt(req.query.days as string) : 1;
    const priceHistory = await marketService.getCoinPriceHistory(coinId, days);
    res.json(priceHistory);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch price history for ${req.params.coinId}` });
  }
});

// Get detailed information about a specific coin
router.get('/info/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const coinInfo = await marketService.getCoinInfo(coinId);
    res.json(coinInfo);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch coin info for ${req.params.coinId}` });
  }
});

// Search for coins
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const searchResults = await marketService.searchCoins(query);
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search coins' });
  }
});

export default router;
