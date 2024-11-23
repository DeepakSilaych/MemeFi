import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.models.database import engine, SessionLocal
from app.models.models import Base, Token, Achievement, TokenType
import json

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Add initial tokens
    initial_tokens = [
        {
            "symbol": "INJ",
            "name": "Injective Protocol",
            "token_type": TokenType.GOVERNANCE,
            "contract_address": "0x1234....",  # Replace with actual contract address
            "decimals": 18,
            "current_price": 0.0,  # Will be updated by price feed
            "price_change_24h": 0.0,
            "volume_24h": 0.0,
            "market_cap": 0.0,
            "total_supply": 100000000
        },
        {
            "symbol": "PEPE",
            "name": "Pepe",
            "token_type": TokenType.MEME,
            "contract_address": "0x5678....",  # Replace with actual contract address
            "decimals": 18,
            "current_price": 0.0,
            "price_change_24h": 0.0,
            "volume_24h": 0.0,
            "market_cap": 0.0,
            "total_supply": 420690000000000
        },
        {
            "symbol": "DOGE",
            "name": "Dogecoin",
            "token_type": TokenType.MEME,
            "contract_address": "0x9012....",  # Replace with actual contract address
            "decimals": 18,
            "current_price": 0.0,
            "price_change_24h": 0.0,
            "volume_24h": 0.0,
            "market_cap": 0.0,
            "total_supply": 132670764300
        }
    ]

    # Add initial achievements
    initial_achievements = [
        {
            "name": "First Trade",
            "description": "Complete your first trade",
            "points": 10,
            "criteria": json.dumps({"trades_count": 1})
        },
        {
            "name": "Volume Master",
            "description": "Trade $10,000 in volume",
            "points": 50,
            "criteria": json.dumps({"total_volume": 10000})
        },
        {
            "name": "Winning Streak",
            "description": "Win 5 trades in a row",
            "points": 100,
            "criteria": json.dumps({"consecutive_wins": 5})
        },
        {
            "name": "Risk Manager",
            "description": "Maintain a positive PnL for 7 days",
            "points": 200,
            "criteria": json.dumps({"days_profitable": 7})
        }
    ]

    # Add tokens if they don't exist
    for token_data in initial_tokens:
        token = db.query(Token).filter(Token.symbol == token_data["symbol"]).first()
        if not token:
            token = Token(**token_data)
            db.add(token)

    # Add achievements if they don't exist
    for achievement_data in initial_achievements:
        achievement = db.query(Achievement).filter(Achievement.name == achievement_data["name"]).first()
        if not achievement:
            achievement = Achievement(**achievement_data)
            db.add(achievement)

    db.commit()
    db.close()

if __name__ == "__main__":
    init_db()
