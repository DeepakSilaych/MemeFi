from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
from ...services.token_service import TokenService
from ...services.trading import TradingService

router = APIRouter()
token_service = TokenService()
trading_service = TradingService()

@router.get("/market/overview")
async def get_market_overview() -> Dict:
    """Get meme token market overview"""
    return await token_service.get_market_overview()

@router.get("/tokens")
async def get_tokens(limit: int = Query(50, ge=1, le=100)) -> List[Dict]:
    """Get list of tradeable tokens with current prices"""
    return await token_service.get_token_list(limit)

@router.get("/tokens/{token_id}")
async def get_token_details(token_id: str) -> Dict:
    """Get detailed information about a specific token"""
    try:
        return await token_service.get_token_details(token_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/tokens/{token_id}/price-history")
async def get_token_price_history(
    token_id: str, 
    days: int = Query(7, ge=1, le=365)
) -> List[Dict]:
    """Get historical price data for a token"""
    try:
        return await token_service.get_token_price_history(token_id, days)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/tokens/swap-quote")
async def get_swap_quote(
    from_token: str,
    to_token: str,
    amount: float = Query(..., gt=0),
) -> Optional[Dict]:
    """Get swap quote if DEX integration is available"""
    quote = await token_service.get_token_swapping_options(from_token, to_token, amount)
    if quote is None:
        raise HTTPException(
            status_code=503,
            detail="DEX integration not available. Please try again later."
        )
    return quote

@router.post("/position/open")
async def open_position(user_id: str, token: str, amount: float, direction: str, duration: int):
    """Open a new trading position"""
    try:
        position = await trading_service.open_position(
            user_id=user_id,
            token=token,
            amount=amount,
            direction=direction,
            duration=duration
        )
        return position
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/position/{position_id}/close")
async def close_position(position_id: str):
    """Close an existing position"""
    try:
        position = await trading_service.close_position(position_id)
        return position
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/positions/{user_id}")
async def get_user_positions(user_id: str):
    """Get all positions for a user"""
    return await trading_service.get_user_positions(user_id)
