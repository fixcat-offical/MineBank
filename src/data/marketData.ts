import { MarketPrice } from '../types';

export const INITIAL_MARKET_PRICES: MarketPrice[] = [
  {
    coin: 'BTC',
    name: 'Bitcoin',
    priceUSDT: 94850.0,
    change24h: 3.42,
    high24h: 96200.0,
    low24h: 92400.0,
    volume24h: 42850900000,
    history: [92400, 93100, 92900, 93800, 94200, 93900, 94500, 94850]
  },
  {
    coin: 'ETC',
    name: 'Ethereum Classic',
    priceUSDT: 28.75,
    change24h: 5.18,
    high24h: 29.80,
    low24h: 26.90,
    volume24h: 685000000,
    history: [26.9, 27.2, 27.8, 27.5, 28.1, 28.4, 28.3, 28.75]
  },
  {
    coin: 'DOGE',
    name: 'Dogecoin',
    priceUSDT: 0.245,
    change24h: -1.85,
    high24h: 0.262,
    low24h: 0.238,
    volume24h: 1980000000,
    history: [0.252, 0.258, 0.262, 0.249, 0.244, 0.241, 0.247, 0.245]
  },
  {
    coin: 'HAMSTER',
    name: 'Hamster Kombat',
    priceUSDT: 0.00385,
    change24h: 14.8,
    high24h: 0.0042,
    low24h: 0.0032,
    volume24h: 345000000,
    history: [0.0032, 0.0033, 0.0036, 0.0035, 0.0037, 0.0039, 0.0041, 0.00385]
  },
  {
    coin: 'TON',
    name: 'Toncoin',
    priceUSDT: 6.45,
    change24h: 4.62,
    high24h: 6.70,
    low24h: 6.12,
    volume24h: 890000000,
    history: [6.12, 6.25, 6.20, 6.38, 6.42, 6.39, 6.51, 6.45]
  },
  {
    coin: 'USDT',
    name: 'Tether USD',
    priceUSDT: 1.00,
    change24h: 0.01,
    high24h: 1.001,
    low24h: 0.999,
    volume24h: 95000000000,
    history: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
  }
];

// Difficulty and base reward multipliers per minute per MH/s
export const COIN_MINING_CONFIG = {
  BTC: {
    rewardPerMhsPerMinute: 0.000000028,
    unit: 'BTC',
    color: '#F7931A',
    iconText: '₿',
    networkHashrateDesc: '680 EH/s'
  },
  ETC: {
    rewardPerMhsPerMinute: 0.000085,
    unit: 'ETC',
    color: '#345D9D',
    iconText: 'Ξ',
    networkHashrateDesc: '185 TH/s'
  },
  DOGE: {
    rewardPerMhsPerMinute: 0.082,
    unit: 'DOGE',
    color: '#C2A633',
    iconText: 'Ð',
    networkHashrateDesc: '1.2 PH/s'
  },
  HAMSTER: {
    rewardPerMhsPerMinute: 5.45,
    unit: 'HMSTR',
    color: '#F59E0B',
    iconText: '🐹',
    networkHashrateDesc: '450 GH/s'
  },
  TON: {
    rewardPerMhsPerMinute: 0.00042,
    unit: 'TON',
    color: '#0088CC',
    iconText: '💎',
    networkHashrateDesc: '85 TH/s'
  }
};
