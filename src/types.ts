export type CoinSymbol = 'BTC' | 'ETC' | 'DOGE' | 'HAMSTER' | 'TON' | 'USDT';

export interface CryptoAddressMap {
  BTC: string;
  ETC: string;
  DOGE: string;
  HAMSTER: string;
  TON: string;
  USDT: string;
}

export interface BankCard {
  cardNumber: string; // e.g. "4276 8840 9102 3341"
  cardholderName: string;
  expiryDate: string; // e.g. "08/29"
  cvv: string; // e.g. "742"
  tier: 'Standard' | 'Gold' | 'Platinum' | 'Diamond Mining Edition';
  colorTheme: string;
  pin: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  avatar: string;
  createdAt: number;
  bankBalanceUSD: number;
  maxBalanceReachedUSD?: number; // Tracks the all-time peak bank balance
  bankCard: BankCard;
  cryptoAddresses: CryptoAddressMap;
  cryptoBalances: {
    BTC: number;
    ETC: number;
    DOGE: number;
    HAMSTER: number;
    TON: number;
    USDT: number;
  };
  inventory: {
    racks: string[];
    motherboards: string[];
    cpus: string[];
    gpus: string[];
    psus: string[];
  };
  businesses: UserBusiness[];
  createdPoolIds: string[];
  hackerPcs?: UserHackerPc[];
  isBanned?: boolean;
  bannedAt?: number;
}

export interface UserHackerPc {
  id: string; // instance ID
  templateId: number; // 1 to 60
  name: string;
  cpu: string;
  gpu: string;
  ram: string;
  priceUSD: number;
  bruteForceSeconds: number; // 3600 down to 5
  targetCardNumber?: string;
  targetUsername?: string;
  jobStartedAt?: number;
  status: 'idle' | 'cracking' | 'completed';
  crackedPin?: string;
}

export type ComponentCategory = 'rack' | 'motherboard' | 'cpu' | 'gpu' | 'psu';

export interface HardwareItem {
  id: string;
  category: ComponentCategory;
  name: string;
  brand: string;
  year: number;
  priceUSD: number;
  powerWatts: number; // Consumption or Capacity (for PSU)
  specs: {
    maxGpus?: number; // for racks & motherboards
    socket?: string; // for cpu & mb
    cores?: number; // for cpu
    baseGhz?: number; // for cpu
    vramGB?: number; // for gpu
    efficiencyRating?: string; // for psu (80+ Gold, etc)
    modular?: boolean; // for psu
    hashrates: {
      BTC: number; // MH/s or GH/s (scaled for simulation)
      ETC: number; // MH/s
      DOGE: number; // MH/s
      HAMSTER: number; // MH/s
      TON: number; // GH/s
    };
  };
  imageUrl?: string;
  description: string;
}

export type RigStatus = 'mining' | 'stopped' | 'paused' | 'overheated';

export interface MiningRig {
  id: string;
  ownerId: string;
  ownerUsername: string;
  name: string;
  rackId: string;
  motherboardId: string;
  cpuId: string;
  psuIds: string[];
  gpuIds: string[]; // 1 to maxGpus
  status: RigStatus;
  targetWalletAddress: string; // whose wallet receives rewards
  targetCoin: CoinSymbol; // BTC, ETC, DOGE, HAMSTER, TON
  poolId: string; // pool identifier (e.g. "us.fixms.mine")
  overclockPercent: number; // 0 to 30%
  temperature: number; // Celsius 45 - 85
  fanSpeed?: number; // percentage
  fanSpeedRPM?: number;
  totalPowerWatts: number;
  psuCapacityWatts?: number;
  totalHashrate: number; // effective MH/s for current coin
  createdAt: number;
  lastPayoutTime: number;
}

export interface PoolBotMiner {
  id: string;
  poolId: string;
  username: string; // Realistic player username, e.g. "CryptoVlad_88"
  workerName: string; // e.g. "Antminer-S21-Rig1"
  name?: string; // fallback alias
  avatar: string; // avatar identifier, e.g. 'cat', 'terminal', 'flagship_gpu', 'node'
  coin: CoinSymbol;
  hashrate: number; // MH/s
  walletAddress: string; // realistic crypto address
  pingMs: number; // e.g. 18 ms
  sharesAccepted: number; // e.g. 240
  sharesRejected: number; // e.g. 0
  createdAt: number;
  lastPayoutTime: number;
}

export interface MiningPool {
  id: string; // e.g. "us.fixms.mine"
  name: string;
  host: string;
  feePercent: number; // e.g. 5
  creatorId: string; // "system" or userId
  creatorUsername: string;
  creatorWalletAddress: string;
  totalHashrate: number;
  activeMinersCount: number;
  totalFeesEarnedUSDT: number;
  createdAt: number;
  isSystem: boolean;
  bots?: PoolBotMiner[];
}

export interface BusinessTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  baseCostUSD: number;
  baseIncomePerHourUSD: number;
  icon: string;
  image: string;
  maxLevel: number;
}

export interface UserBusiness {
  businessId: string;
  level: number;
  staffCount: number;
  marketingLevel: number;
  automationUnlocked: boolean;
  lastCollectedAt?: number;
  lastCollectedTime?: number;
  purchasedAt?: number;
}

export interface MarketPrice {
  coin: CoinSymbol;
  name: string;
  priceUSDT: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  history: number[]; // price points for mini sparkline
}

export type TransactionType =
  | 'bank_transfer'
  | 'crypto_transfer'
  | 'business_income'
  | 'hardware_purchase'
  | 'mining_payout'
  | 'pool_fee_income'
  | 'exchange_swap'
  | 'cashout_usdt'
  | 'currency_exchange'
  | 'suspicious_expense'
  | 'hacker_pc_purchase';

export interface TransactionRecord {
  id: string;
  userId?: string; // Owner of this journal entry
  timestamp: number;
  type: TransactionType;
  amount: number;
  currency: string; // 'USD' or CoinSymbol
  from?: string;
  to?: string;
  description: string;
  status?: 'completed' | 'pending';
}

export interface PlayerPublicProfile {
  id: string;
  username: string;
  avatar: string;
  cardNumber: string;
  cryptoAddresses: CryptoAddressMap;
  totalHashrate: number;
  activeRigsCount: number;
  businessesCount: number;
  netWorthUSD: number;
  isOnline: boolean;
}
