from fastapi import APIRouter, HTTPException, Query, Path
from typing import List, Dict, Optional
from pydantic import BaseModel, Field
from datetime import datetime

router = APIRouter()

# Models
class OpenPositionRequest(BaseModel):
    token: str = Field(..., description="Token symbol to trade")
    amount: float = Field(..., gt=0, description="Amount to trade")
    direction: str = Field(..., regex="^(UP|DOWN)$", description="Trading direction")
    duration: int = Field(..., ge=1, le=5, description="Trading duration in minutes")

class TokenSwapRequest(BaseModel):
    from_token: str = Field(..., description="Token to swap from")
    to_token: str = Field(..., description="Token to swap to")
    amount: float = Field(..., gt=0, description="Amount to swap")

# Market Data Endpoints
@router.get("/market/overview")
async def get_market_overview() -> Dict:
    """Get meme token market overview with analytics"""
    from ...services.trading import TradingService
    trading_service = TradingService()
    return await trading_service.get_market_overview()

@router.get("/tokens")
async def get_tokens(limit: int = Query(50, ge=1, le=100)) -> List[Dict]:
    """Get list of tradeable tokens with current prices"""
    from ...services.trading import TradingService
    trading_service = TradingService()
    return await trading_service.get_token_list(limit)

@router.get("/tokens/{token_id}")
async def get_token_details(
    token_id: str = Path(..., description="Token ID")
) -> Dict:
    """Get detailed information about a specific token"""
    from ...services.market_data import MarketDataService
    market_service = MarketDataService()
    
    price_data = await market_service.get_token_price(token_id)
    if not price_data:
        raise HTTPException(status_code=404, detail="Token not found")
        
    metrics = await market_service.get_token_metrics(token_id)
    liquidity = await market_service.get_liquidity_data(token_id)
    
    return {
        "price_data": price_data,
        "metrics": metrics,
        "liquidity": liquidity
    }

@router.get("/tokens/{token_id}/price-history")
async def get_token_price_history(
    token_id: str = Path(..., description="Token ID"),
    timeframe: str = Query("1d", regex="^(1d|1w)$")
) -> List[Dict]:
    """Get historical price data for a token"""
    from ...services.market_data import MarketDataService
    market_service = MarketDataService()
    return await market_service.get_price_history(token_id, timeframe)

@router.get("/tokens/{token_id}/analytics")
async def get_token_analytics(
    token_id: str = Path(..., description="Token ID")
) -> Dict:
    """Get detailed analytics for a token"""
    from ...services.analytics import AnalyticsService
    analytics_service = AnalyticsService()
    return await analytics_service.get_token_analytics(token_id)

# Trading Endpoints
@router.post("/positions/open")
async def open_position(
    position: OpenPositionRequest,
    user_id: str = Query(..., description="User ID")
) -> Dict:
    """Open a new trading position"""
    from ...services.trading import TradingService
    trading_service = TradingService()
    
    try:
        return await trading_service.open_position(
            user_id,
            position.token,
            position.amount,
            position.direction,
            position.duration
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/positions/{position_id}/close")
async def close_position(
    position_id: str = Path(..., description="Position ID")
) -> Dict:
    """Close an existing position"""
    from ...services.trading import TradingService
    trading_service = TradingService()
    
    try:
        return await trading_service.close_position(position_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/positions/user/{user_id}")
async def get_user_positions(
    user_id: str = Path(..., description="User ID")
) -> Dict:
    """Get all positions and analytics for a user"""
    from ...services.trading import TradingService
    trading_service = TradingService()
    return await trading_service.get_user_positions(user_id)

# Risk Management Endpoints
@router.get("/risk/metrics/{token_id}")
async def get_risk_metrics(
    token_id: str = Path(..., description="Token ID")
) -> Dict:
    """Get risk metrics for a token"""
    from ...services.risk_management import RiskManagementService
    risk_service = RiskManagementService()
    return await risk_service.get_risk_metrics(token_id)

# Rewards Endpoints
@router.get("/rewards/leaderboard")
async def get_leaderboard(
    timeframe: str = Query("weekly", regex="^(daily|weekly|monthly)$")
) -> List[Dict]:
    """Get points leaderboard"""
    from ...services.rewards import RewardsService
    rewards_service = RewardsService()
    return await rewards_service.get_leaderboard(timeframe)

@router.get("/rewards/user/{user_id}")
async def get_user_rewards(
    user_id: str = Path(..., description="User ID")
) -> Dict:
    """Get user's rewards and achievements"""
    from ...services.rewards import RewardsService
    rewards_service = RewardsService()
    
    stats = await rewards_service.get_user_stats(user_id)
    achievements = await rewards_service.get_user_achievements(user_id)
    
    return {
        "stats": stats,
        "achievements": achievements
    }

# Market Analysis Endpoints
@router.get("/analytics/sentiment")
async def get_market_sentiment() -> Dict:
    """Get overall market sentiment analysis"""
    from ...services.analytics import AnalyticsService
    analytics_service = AnalyticsService()
    return await analytics_service.get_market_sentiment()

@router.get("/analytics/user/{user_id}/patterns")
async def get_user_patterns(
    user_id: str = Path(..., description="User ID")
) -> Dict:
    """Get user's trading patterns analysis"""
    from ...services.analytics import AnalyticsService
    analytics_service = AnalyticsService()
    return await analytics_service.get_trading_patterns(user_id)
