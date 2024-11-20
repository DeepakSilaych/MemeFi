from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
from datetime import datetime, timedelta

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy data models
class Token(BaseModel):
    symbol: str
    name: str
    price: float
    change_24h: float
    volume_24h: float
    market_cap: float
    logo: str

class Trade(BaseModel):
    id: str
    token: str
    type: str
    amount: float
    price: float
    timestamp: datetime
    status: str
    profit_loss: Optional[float] = None

class UserStats(BaseModel):
    total_trades: int
    win_rate: float
    total_profit_loss: float
    best_trade: float
    portfolio_value: float
    rank: int

# Dummy data
dummy_tokens = [
    Token(
        symbol="INJ",
        name="Injective",
        price=random.uniform(30, 40),
        change_24h=random.uniform(-5, 5),
        volume_24h=random.uniform(1000000, 5000000),
        market_cap=random.uniform(1000000000, 2000000000),
        logo="/tokens/inj.png"
    ),
    Token(
        symbol="MEME",
        name="Memecoin",
        price=random.uniform(0.01, 0.1),
        change_24h=random.uniform(-10, 10),
        volume_24h=random.uniform(100000, 1000000),
        market_cap=random.uniform(10000000, 50000000),
        logo="/tokens/meme.png"
    ),
]

def generate_dummy_trade():
    token = random.choice(dummy_tokens)
    trade_type = random.choice(["BUY", "SELL"])
    amount = random.uniform(100, 1000)
    price = token.price * (1 + random.uniform(-0.02, 0.02))
    timestamp = datetime.now() - timedelta(hours=random.randint(1, 24))
    profit_loss = random.uniform(-100, 100) if trade_type == "SELL" else None
    
    return Trade(
        id=f"trade_{random.randint(1000, 9999)}",
        token=token.symbol,
        type=trade_type,
        amount=amount,
        price=price,
        timestamp=timestamp,
        status="COMPLETED",
        profit_loss=profit_loss
    )

@app.get("/api/tokens", response_model=List[Token])
async def get_tokens():
    # Update prices randomly
    for token in dummy_tokens:
        token.price *= (1 + random.uniform(-0.01, 0.01))
        token.change_24h = random.uniform(-5, 5)
    return dummy_tokens

@app.get("/api/trades", response_model=List[Trade])
async def get_trades():
    return [generate_dummy_trade() for _ in range(10)]

@app.get("/api/stats/{address}")
async def get_user_stats(address: str):
    return UserStats(
        total_trades=random.randint(50, 200),
        win_rate=random.uniform(40, 70),
        total_profit_loss=random.uniform(1000, 5000),
        best_trade=random.uniform(500, 1000),
        portfolio_value=random.uniform(5000, 20000),
        rank=random.randint(1, 1000)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
