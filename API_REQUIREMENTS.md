# MemeFi API Requirements

## Overview
This document outlines the API requirements for the MemeFi trading platform. All API endpoints should be RESTful and return JSON responses. WebSocket connections should be used for real-time data updates.

## Base URL Structure
- Development: `https://api.dev.memefi.com/v1`
- Production: `https://api.memefi.com/v1`

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### 1. Trading API

#### Price Data
```http
GET /market/price/{token_pair}
```
- Real-time price data for trading pairs
- Parameters:
  - `interval`: Timeframe (1m, 5m, 15m, 1h, 4h, 1d)
  - `limit`: Number of candles (default: 100)
- WebSocket endpoint: `ws://api.memefi.com/ws/market/price/{token_pair}`

#### Order Management
```http
POST /orders/create
GET /orders/active
GET /orders/history
POST /orders/cancel/{order_id}
```
- Create, retrieve, and manage trading orders
- Support for market and limit orders
- Order status updates via WebSocket

#### Token Information
```http
GET /tokens/list
GET /tokens/{token_id}/info
GET /tokens/{token_id}/stats
```
- List available tokens
- Token metadata and statistics
- Trading volume, market cap, etc.

### 2. Wallet Integration

#### Wallet Operations
```http
POST /wallet/connect
GET /wallet/balance
GET /wallet/transactions
```
- Wallet connection and authentication
- Balance checking across multiple tokens
- Transaction history

#### Smart Contract Interactions
```http
POST /contracts/approve
POST /contracts/execute
GET /contracts/allowance
```
- Token approvals
- Contract execution
- Allowance checking

### 3. Rewards System

#### User Rewards
```http
GET /rewards/summary
GET /rewards/history
GET /rewards/active
POST /rewards/claim/{reward_id}
```
- Current rewards status
- Historical rewards data
- Claim available rewards

#### Achievements
```http
GET /achievements/list
GET /achievements/progress
POST /achievements/{achievement_id}/claim
```
- List all achievements
- Track achievement progress
- Claim achievement rewards

#### Seasonal Rewards
```http
GET /seasons/current
GET /seasons/rewards
GET /seasons/progress
```
- Current season information
- Season-specific rewards
- Progress tracking

### 4. Leaderboard

#### Rankings
```http
GET /leaderboard/rankings
```
- Parameters:
  - `timeframe`: daily, weekly, monthly, all-time
  - `page`: pagination
  - `limit`: results per page
- Returns trader rankings with stats

#### User Statistics
```http
GET /users/{address}/stats
GET /users/{address}/history
```
- Detailed user statistics
- Trading history and performance

### 5. Analytics

#### Platform Statistics
```http
GET /analytics/platform
GET /analytics/volume
GET /analytics/users
```
- Platform-wide statistics
- Trading volume analytics
- User engagement metrics

#### User Analytics
```http
GET /analytics/user/{address}/performance
GET /analytics/user/{address}/trades
```
- Individual user performance
- Detailed trade analytics

## WebSocket Events

### Market Data
```javascript
{
  "type": "price_update",
  "data": {
    "pair": "TOKEN/USDT",
    "price": "0.12345",
    "timestamp": "2024-02-20T12:00:00Z"
  }
}
```

### Order Updates
```javascript
{
  "type": "order_update",
  "data": {
    "order_id": "123",
    "status": "filled",
    "filled_amount": "100",
    "timestamp": "2024-02-20T12:00:00Z"
  }
}
```

### User Events
```javascript
{
  "type": "reward_earned",
  "data": {
    "reward_id": "456",
    "points": 100,
    "reason": "Successful trade"
  }
}
```

## Data Models

### Order
```typescript
interface Order {
  id: string;
  user_address: string;
  token_pair: string;
  type: 'UP' | 'DOWN';
  amount: string;
  duration: number;
  entry_price: string;
  exit_price?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  result?: 'win' | 'loss';
  created_at: string;
  updated_at: string;
}
```

### User Stats
```typescript
interface UserStats {
  address: string;
  points: number;
  trades_count: number;
  win_rate: number;
  volume_24h: string;
  volume_total: string;
  rank: number;
  badge: 'bronze' | 'silver' | 'gold' | 'diamond';
  achievements: Achievement[];
  rewards: Reward[];
}
```

### Token
```typescript
interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  price_usd: string;
  change_24h: number;
  volume_24h: string;
  market_cap: string;
  logo_url: string;
}
```

## Error Handling
All API endpoints should return appropriate HTTP status codes and error messages:

```javascript
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient balance for trade",
    "details": {
      "required": "100 USDT",
      "available": "50 USDT"
    }
  }
}
```

## Rate Limiting
- Public endpoints: 100 requests per minute
- Authenticated endpoints: 300 requests per minute
- WebSocket connections: 5 concurrent connections per user

## Security Requirements
1. All endpoints must use HTTPS
2. JWT tokens must expire after 24 hours
3. Implement CORS policies
4. Rate limiting per IP and user
5. Input validation for all parameters
6. Sanitize all responses
7. Implement request signing for critical operations

## Monitoring Requirements
1. API uptime and latency tracking
2. Error rate monitoring
3. WebSocket connection status
4. Rate limit usage
5. User activity metrics

## Development Considerations
1. Implement comprehensive logging
2. Provide detailed error messages in development
3. Maintain API versioning
4. Document all changes in changelog
5. Provide SDK for common operations
