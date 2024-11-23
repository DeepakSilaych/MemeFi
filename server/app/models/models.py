from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.models.database import Base

class TokenType(enum.Enum):
    MEME = "MEME"
    STABLE = "STABLE"
    GOVERNANCE = "GOVERNANCE"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    risk_score = Column(Float, default=0.0)
    points = Column(Integer, default=0)
    trades = relationship("Trade", back_populates="user")
    achievements = relationship("UserAchievement", back_populates="user")

class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True)
    name = Column(String)
    token_type = Column(Enum(TokenType))
    contract_address = Column(String, unique=True)
    decimals = Column(Integer)
    current_price = Column(Float)
    price_change_24h = Column(Float)
    volume_24h = Column(Float)
    market_cap = Column(Float)
    total_supply = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    trades = relationship("Trade", back_populates="token")

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token_id = Column(Integer, ForeignKey("tokens.id"))
    position_size = Column(Float)
    entry_price = Column(Float)
    leverage = Column(Float)
    is_long = Column(Boolean)
    take_profit = Column(Float, nullable=True)
    stop_loss = Column(Float, nullable=True)
    pnl = Column(Float, nullable=True)
    status = Column(String)  # OPEN, CLOSED, LIQUIDATED
    created_at = Column(DateTime, default=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="trades")
    token = relationship("Token", back_populates="trades")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)
    points = Column(Integer)
    criteria = Column(String)  # JSON string containing achievement criteria
    created_at = Column(DateTime, default=datetime.utcnow)
    users = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    progress = Column(Float, default=0.0)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="users")

class MarketData(Base):
    __tablename__ = "market_data"

    id = Column(Integer, primary_key=True, index=True)
    token_id = Column(Integer, ForeignKey("tokens.id"))
    price = Column(Float)
    volume = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
