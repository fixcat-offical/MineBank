import {
  UserAccount,
  MiningRig,
  MiningPool,
  PoolBotMiner,
  TransactionRecord,
  MarketPrice,
  CoinSymbol,
  BankCard,
  CryptoAddressMap,
  UserBusiness,
  PlayerPublicProfile,
  UserHackerPc,
} from '../types';
import { INITIAL_MARKET_PRICES, COIN_MINING_CONFIG } from '../data/marketData';
import { BUSINESS_TEMPLATES, calculateBusinessIncomePerHour } from '../data/businessData';
import { getHardwareById } from '../data/hardwareData';
import { HACKER_PC_TEMPLATES } from '../data/hackerPcData';

export const SYSTEM_STRATUM_POOLS: MiningPool[] = [
  {
    id: 'pool-apex-global',
    name: 'Apex Global Stratum',
    host: 'us.fixms.mine:3333',
    feePercent: 1.0,
    creatorId: 'system',
    creatorUsername: 'Apex System',
    creatorWalletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    totalHashrate: 1450.0,
    activeMinersCount: 1,
    totalFeesEarnedUSDT: 0,
    createdAt: Date.now(),
    isSystem: true,
  },
  {
    id: 'pool-fixms-europe',
    name: 'FixMS High-Speed EU',
    host: 'eu.fixms.mine:3333',
    feePercent: 1.5,
    creatorId: 'system',
    creatorUsername: 'FixMS Network',
    creatorWalletAddress: '1FixMSStratumServerRewardNode9999',
    totalHashrate: 980.0,
    activeMinersCount: 1,
    totalFeesEarnedUSDT: 0,
    createdAt: Date.now(),
    isSystem: true,
  },
  {
    id: 'pool-solo-node',
    name: 'Solo Direct Local Node (0% Fee)',
    host: '127.0.0.1:8332',
    feePercent: 0.0,
    creatorId: 'system',
    creatorUsername: 'Solo Node Engine',
    creatorWalletAddress: '1SoloLocalMiningNodeDirectPayoutX',
    totalHashrate: 420.0,
    activeMinersCount: 1,
    totalFeesEarnedUSDT: 0,
    createdAt: Date.now(),
    isSystem: true,
  },
];

const USERS_KEY = 'crypto_mining_users_v2';
const CURRENT_USER_ID_KEY = 'crypto_mining_current_user_id_v2';
const RIGS_KEY = 'crypto_mining_rigs_v2';
const POOLS_KEY = 'crypto_mining_pools_v2';
const TRANSACTIONS_KEY = 'crypto_mining_transactions_v2';
const MARKET_PRICES_KEY = 'crypto_mining_market_prices_v2';
const LAST_MINING_TICK_KEY = 'crypto_mining_last_tick_v2';

// Helper random string generator for realistic addresses
function randomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function randomAlphanumeric(length: number): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function generateUniqueCardPin(): string {
  const users = getAllUsers();
  const existingPins = new Set(users.map((u) => u.bankCard?.pin).filter(Boolean));

  let pin = '';
  let attempts = 0;
  do {
    const num = Math.floor(1000 + Math.random() * 9000);
    pin = num.toString().padStart(4, '0');
    attempts++;
  } while (existingPins.has(pin) && attempts < 10000);

  return pin;
}

export function generateRealisticCardNumber(): string {
  const p1 = '4276';
  const p2 = Math.floor(1000 + Math.random() * 9000).toString();
  const p3 = Math.floor(1000 + Math.random() * 9000).toString();
  const p4 = Math.floor(1000 + Math.random() * 9000).toString();
  return `${p1} ${p2} ${p3} ${p4}`;
}

export function generateRealisticCryptoAddresses(username: string): CryptoAddressMap {
  const cleanUser = username.toLowerCase().replace(/[^a-z0-9]/g, '');
  const prefix = cleanUser.slice(0, 4);

  return {
    BTC: `bc1q${prefix}${randomHex(32)}`,
    ETC: `0x${randomHex(40)}`,
    DOGE: `D${prefix.toUpperCase()}${randomAlphanumeric(28)}`,
    HAMSTER: `HMSTR_0x${randomHex(36)}`,
    TON: `EQ${randomAlphanumeric(4)}${randomAlphanumeric(40)}`,
    USDT: `TX${randomAlphanumeric(32)}`,
  };
}

export function createInitialUser(username: string, password?: string): UserAccount {
  const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const addresses = generateRealisticCryptoAddresses(username);
  const cardNumber = generateRealisticCardNumber();

  const card: BankCard = {
    cardNumber,
    cardholderName: username.toUpperCase(),
    expiryDate: '08/30',
    cvv: Math.floor(100 + Math.random() * 900).toString(),
    tier: 'Diamond Mining Edition',
    colorTheme: 'from-green-600 via-emerald-500 to-green-700',
    pin: generateUniqueCardPin(),
  };

  return {
    id,
    username,
    password: password || '',
    avatar: '💎',
    createdAt: Date.now(),
    bankBalanceUSD: 10000.0, // $10,000 USD Starter Balance on debit card
    maxBalanceReachedUSD: 10000.0, // Initial max balance is $10k
    bankCard: card,
    cryptoAddresses: addresses,
    cryptoBalances: {
      BTC: 0,
      ETC: 0,
      DOGE: 0,
      HAMSTER: 0,
      TON: 0,
      USDT: 0,
    },
    inventory: {
      racks: [],
      motherboards: [],
      cpus: [],
      gpus: [],
      psus: [],
    },
    businesses: [],
    createdPoolIds: [],
  };
}

// Convert real UserAccount to PlayerPublicProfile with calculated net worth and hashrate
export function userToPlayerProfile(user: UserAccount, rigs: MiningRig[], prices: MarketPrice[]): PlayerPublicProfile {
  const userRigs = rigs.filter((r) => r.ownerId === user.id);
  const activeRigs = userRigs.filter((r) => r.status === 'mining');
  const totalHashrate = activeRigs.reduce((sum, r) => sum + r.totalHashrate * (1 + r.overclockPercent / 100), 0);

  let netWorth = user.bankBalanceUSD;
  prices.forEach((p) => {
    const bal = user.cryptoBalances[p.coin] || 0;
    netWorth += bal * p.priceUSDT;
  });

  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar || '💎',
    cardNumber: user.bankCard.cardNumber,
    cryptoAddresses: user.cryptoAddresses,
    totalHashrate: Math.round(totalHashrate * 10) / 10,
    activeRigsCount: activeRigs.length,
    businessesCount: user.businesses?.length || 0,
    netWorthUSD: Math.round(netWorth),
    isOnline: true,
  };
}

// Storage operations
export function getAllUsers(): UserAccount[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const users: UserAccount[] = JSON.parse(raw);
    const seenPins = new Set<string>();
    let modified = false;

    users.forEach((u) => {
      if (!u.bankCard) return;
      if (!u.bankCard.pin || seenPins.has(u.bankCard.pin)) {
        let newPin = '';
        let attempts = 0;
        do {
          const num = Math.floor(1000 + Math.random() * 9000);
          newPin = num.toString().padStart(4, '0');
          attempts++;
        } while (seenPins.has(newPin) && attempts < 10000);

        u.bankCard.pin = newPin;
        modified = true;
      }
      seenPins.add(u.bankCard.pin);
    });

    if (modified) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    return users;
  } catch {
    return [];
  }
}

export function saveUser(user: UserAccount): void {
  // Update all-time peak balance if current balance is higher
  const currentMax = user.maxBalanceReachedUSD || 10000;
  if (user.bankBalanceUSD > currentMax) {
    user.maxBalanceReachedUSD = user.bankBalanceUSD;
  }

  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): UserAccount | null {
  const users = getAllUsers();
  if (users.length === 0) return null;
  const currentId = localStorage.getItem(CURRENT_USER_ID_KEY);
  const found = users.find((u) => u.id === currentId);
  if (found) return found;
  localStorage.setItem(CURRENT_USER_ID_KEY, users[0].id);
  return users[0];
}

export function setCurrentUserId(userId: string): void {
  localStorage.setItem(CURRENT_USER_ID_KEY, userId);
}

export function resetAllData(): void {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(CURRENT_USER_ID_KEY);
  localStorage.removeItem(RIGS_KEY);
  localStorage.removeItem(POOLS_KEY);
  localStorage.removeItem(TRANSACTIONS_KEY);
  localStorage.removeItem(LAST_MINING_TICK_KEY);
}


// Rigs Management
export function getAllRigs(): MiningRig[] {
  const raw = localStorage.getItem(RIGS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRigs(rigs: MiningRig[]): void {
  localStorage.setItem(RIGS_KEY, JSON.stringify(rigs));
}

export function saveSingleRig(rig: MiningRig): void {
  const rigs = getAllRigs();
  const index = rigs.findIndex((r) => r.id === rig.id);
  if (index >= 0) {
    rigs[index] = rig;
  } else {
    rigs.push(rig);
  }
  saveRigs(rigs);
}

export function deleteRig(rigId: string): void {
  const rigs = getAllRigs().filter((r) => r.id !== rigId);
  saveRigs(rigs);
}

// Mining Pools
export function getAllPools(): MiningPool[] {
  const raw = localStorage.getItem(POOLS_KEY);
  if (!raw) {
    localStorage.setItem(POOLS_KEY, JSON.stringify(SYSTEM_STRATUM_POOLS));
    return SYSTEM_STRATUM_POOLS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return SYSTEM_STRATUM_POOLS;
  }
}

export function savePool(pool: MiningPool): void {
  const pools = getAllPools();
  const index = pools.findIndex((p) => p.id === pool.id);
  if (index >= 0) {
    pools[index] = pool;
  } else {
    pools.push(pool);
  }
  localStorage.setItem(POOLS_KEY, JSON.stringify(pools));
}

const RANDOM_PERSONA_USERNAMES = [
  'Alex_Miner', 'CryptoVlad_88', 'Dmitry_Hash', 'Satoshi_Pro', 'Elena_Crypto',
  'Max_Stratum', 'Nordic_Miner', 'Quantum_Byte', 'Viking_Hash', 'Ivan_Node',
  'CyberWolf_99', 'BitHunter_77', 'MegaMiner_x', 'Anton_Geforce', 'Roman_CryptoLab',
  'Neon_Miner', 'AeroHash_91', 'Starlight_Rig'
];

const RANDOM_WORKER_NAMES = [
  'Antminer-S21-Pro', 'RTX-4090-x8-Rig', 'WhatsMiner-M50S', 'Hydro-Server-01',
  'Bitaxe-Ultra-Array', 'DragonMint-T1-Rack', 'Geforce-Farm-03', 'IceRiver-KS3M',
  'Avalon-1466-Rig', 'Titan-X-Cluster'
];

const RANDOM_AVATARS = ['cat', 'gold_bar', 'flagship_gpu', 'terminal', 'node', 'quantum_chip', 'core', 'blockchain'];

export function addBotToPool(
  poolId: string,
  botName: string,
  coin: CoinSymbol,
  hashrate: number,
  customWorkerName?: string,
  customAvatar?: string,
  customWallet?: string
): MiningPool | null {
  const pools = getAllPools();
  const pool = pools.find((p) => p.id === poolId);
  if (!pool) return null;

  if (!pool.bots) {
    pool.bots = [];
  }

  const randomUser = RANDOM_PERSONA_USERNAMES[Math.floor(Math.random() * RANDOM_PERSONA_USERNAMES.length)];
  const randomWorker = RANDOM_WORKER_NAMES[Math.floor(Math.random() * RANDOM_WORKER_NAMES.length)];
  const randomAvatar = RANDOM_AVATARS[Math.floor(Math.random() * RANDOM_AVATARS.length)];
  const generatedAddress = generateRealisticCryptoAddresses(botName || randomUser)[coin];

  const assignedUsername = botName.trim() || `${randomUser}_${Math.floor(Math.random() * 90 + 10)}`;
  const assignedWorker = customWorkerName?.trim() || `${randomWorker}#${pool.bots.length + 1}`;
  const assignedAvatar = customAvatar || randomAvatar;

  const newBot: PoolBotMiner = {
    id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    poolId,
    username: assignedUsername,
    workerName: assignedWorker,
    name: `${assignedUsername} (${assignedWorker})`,
    avatar: assignedAvatar,
    coin,
    hashrate: Math.max(1, Number(hashrate)),
    walletAddress: customWallet || generatedAddress,
    pingMs: Math.floor(Math.random() * 25 + 8), // 8 - 33 ms
    sharesAccepted: Math.floor(Math.random() * 80 + 20),
    sharesRejected: 0,
    createdAt: Date.now(),
    lastPayoutTime: Date.now(),
  };

  pool.bots.push(newBot);
  savePool(pool);
  return pool;
}

export function removeBotFromPool(poolId: string, botId: string): MiningPool | null {
  const pools = getAllPools();
  const pool = pools.find((p) => p.id === poolId);
  if (!pool || !pool.bots) return null;

  pool.bots = pool.bots.filter((b) => b.id !== botId);
  savePool(pool);
  return pool;
}

export function updateBotHashrate(poolId: string, botId: string, newHashrate: number): MiningPool | null {
  const pools = getAllPools();
  const pool = pools.find((p) => p.id === poolId);
  if (!pool || !pool.bots) return null;

  const bot = pool.bots.find((b) => b.id === botId);
  if (bot) {
    bot.hashrate = Math.max(1, Number(newHashrate));
    savePool(pool);
  }
  return pool;
}

// Compute live combined pool stats (Base + Real Rigs + Bots)
export function getPoolComputedStats(
  pool: MiningPool,
  rigs: MiningRig[],
  marketPrices: MarketPrice[]
): {
  totalHashrate: number;
  activeMinersCount: number;
  estimatedIncomePerMinuteUSDT: number;
  estimatedIncomePerHourUSDT: number;
  estimatedIncomePerDayUSDT: number;
  activeRigs: MiningRig[];
  activeBots: PoolBotMiner[];
} {
  const activeRigs = rigs.filter(
    (r) => r.status === 'mining' && (r.poolId === pool.id || r.poolId === pool.host)
  );
  const activeBots = pool.bots || [];

  const rigsHashrate = activeRigs.reduce(
    (sum, r) => sum + r.totalHashrate * (1 + (r.overclockPercent || 0) / 100),
    0
  );
  const botsHashrate = activeBots.reduce((sum, b) => sum + (b.hashrate || 0), 0);
  const baseHashrate = pool.isSystem ? 1000 : 0;
  const totalHashrate = baseHashrate + rigsHashrate + botsHashrate;

  const activeMinersCount = activeRigs.length + activeBots.length + (pool.isSystem ? 1 : 0);

  let estimatedIncomePerMinuteUSDT = 0;

  activeRigs.forEach((rig) => {
    const config = COIN_MINING_CONFIG[rig.targetCoin];
    if (config) {
      const grossReward = rig.totalHashrate * config.rewardPerMhsPerMinute * (1 + (rig.overclockPercent || 0) / 100);
      const feeInCoin = grossReward * (pool.feePercent / 100);
      const price = marketPrices.find((m) => m.coin === rig.targetCoin)?.priceUSDT || 1;
      estimatedIncomePerMinuteUSDT += feeInCoin * price;
    }
  });

  activeBots.forEach((bot) => {
    const config = COIN_MINING_CONFIG[bot.coin];
    if (config) {
      const grossReward = bot.hashrate * config.rewardPerMhsPerMinute;
      const feeInCoin = grossReward * (pool.feePercent / 100);
      const price = marketPrices.find((m) => m.coin === bot.coin)?.priceUSDT || 1;
      estimatedIncomePerMinuteUSDT += feeInCoin * price;
    }
  });

  const estimatedIncomePerHourUSDT = estimatedIncomePerMinuteUSDT * 60;
  const estimatedIncomePerDayUSDT = estimatedIncomePerHourUSDT * 24;

  return {
    totalHashrate,
    activeMinersCount,
    estimatedIncomePerMinuteUSDT,
    estimatedIncomePerHourUSDT,
    estimatedIncomePerDayUSDT,
    activeRigs,
    activeBots,
  };
}

// Transactions
export function getAllTransactions(): TransactionRecord[] {
  const raw = localStorage.getItem(TRANSACTIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getUserTransactions(userId: string): TransactionRecord[] {
  const all = getAllTransactions();
  return all.filter((t) => !t.userId || t.userId === userId);
}

export function logTransaction(record: Omit<TransactionRecord, 'id' | 'timestamp'>): void {
  const txs = getAllTransactions();
  const currentUserId = localStorage.getItem(CURRENT_USER_ID_KEY) || undefined;
  const newTx: TransactionRecord = {
    ...record,
    userId: record.userId || currentUserId,
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
  };
  txs.unshift(newTx);
  if (txs.length > 500) txs.pop(); // keep last 500
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
}

// Market Prices & Dynamic Tick
export function getMarketPrices(): MarketPrice[] {
  const raw = localStorage.getItem(MARKET_PRICES_KEY);
  if (!raw) {
    localStorage.setItem(MARKET_PRICES_KEY, JSON.stringify(INITIAL_MARKET_PRICES));
    return INITIAL_MARKET_PRICES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_MARKET_PRICES;
  }
}

export function updateMarketPrices(): MarketPrice[] {
  const prices = getMarketPrices();
  const updated = prices.map((item) => {
    if (item.coin === 'USDT') return item; // stable 1.00

    // Fluctuate price by -2.5% to +2.8%
    const deltaPercent = (Math.random() * 5.3 - 2.5) / 100;
    let newPrice = item.priceUSDT * (1 + deltaPercent);
    if (item.coin === 'BTC') newPrice = Math.max(70000, Math.round(newPrice * 10) / 10);
    else if (item.coin === 'HAMSTER') newPrice = Math.max(0.0005, Number(newPrice.toFixed(6)));
    else newPrice = Math.max(0.01, Number(newPrice.toFixed(4)));

    const newHistory = [...item.history.slice(1), newPrice];
    const change24h = Number((item.change24h + deltaPercent * 10).toFixed(2));
    const high24h = Math.max(item.high24h, newPrice);
    const low24h = Math.min(item.low24h, newPrice);

    return {
      ...item,
      priceUSDT: newPrice,
      change24h,
      high24h,
      low24h,
      history: newHistory,
    };
  });

  localStorage.setItem(MARKET_PRICES_KEY, JSON.stringify(updated));
  return updated;
}

// Global Mining & Business Simulation Cycle (Called Every Second or on Tick)
export function processGameTick(): {
  miningPayouts: { rigName: string; coin: CoinSymbol; amount: number; targetAddress: string; userId?: string }[];
  businessEarningsUSD: number;
} {
  // Clean up any banned accounts that passed the 10-minute timeout
  cleanupExpiredBannedUsers();

  const now = Date.now();
  const lastTick = Number(localStorage.getItem(LAST_MINING_TICK_KEY) || now);
  const elapsedSeconds = Math.max(1, Math.min(300, Math.floor((now - lastTick) / 1000)));
  localStorage.setItem(LAST_MINING_TICK_KEY, now.toString());

  const users = getAllUsers();
  const rigs = getAllRigs();
  const pools = getAllPools();
  const payoutsSummary: { rigName: string; coin: CoinSymbol; amount: number; targetAddress: string; userId?: string }[] = [];

  // 1. Process Active Mining Rigs
  rigs.forEach((rig) => {
    if (rig.status !== 'mining') return;

    // Check if 60 seconds have passed since last payout or if running
    const timeSincePayout = (now - (rig.lastPayoutTime || rig.createdAt)) / 1000;
    if (timeSincePayout >= 60) {
      rig.lastPayoutTime = now;

      // Find pool
      const pool = pools.find((p) => p.id === rig.poolId) || pools[0];
      const feePercent = pool ? pool.feePercent : 5.0;

      // Calculate gross reward based on hashrate and coin config
      const coinConfig = COIN_MINING_CONFIG[rig.targetCoin];
      if (!coinConfig) return;

      const grossReward = rig.totalHashrate * coinConfig.rewardPerMhsPerMinute * (1 + rig.overclockPercent / 100);
      const poolFee = grossReward * (feePercent / 100);
      const netReward = grossReward - poolFee;

      // Find recipient user by target crypto address
      let targetUser = users.find((u) => {
        return Object.values(u.cryptoAddresses).includes(rig.targetWalletAddress);
      });

      if (targetUser) {
        targetUser.cryptoBalances[rig.targetCoin] =
          (targetUser.cryptoBalances[rig.targetCoin] || 0) + netReward;
        payoutsSummary.push({
          rigName: rig.name,
          coin: rig.targetCoin,
          amount: netReward,
          targetAddress: rig.targetWalletAddress,
          userId: targetUser.id,
        });
      }

      // If pool has a user creator/owner, reward creator with pool fee in the exact mined coin (DOGE, TON, BTC, etc.)
      if (pool) {
        const creatorUser = users.find(
          (u) =>
            (pool.creatorId && pool.creatorId !== 'system' && u.id === pool.creatorId) ||
            (pool.creatorUsername && pool.creatorUsername !== 'System' && u.username.toLowerCase() === pool.creatorUsername.toLowerCase())
        );

        const marketPrices = getMarketPrices();
        const coinPrice = marketPrices.find((m) => m.coin === rig.targetCoin)?.priceUSDT || 1;
        const feeInUSDT = poolFee * coinPrice;

        pool.totalFeesEarnedUSDT = (pool.totalFeesEarnedUSDT || 0) + feeInUSDT;

        if (creatorUser && poolFee > 0) {
          // Add pool commission directly in the coin being mined by the rig
          creatorUser.cryptoBalances[rig.targetCoin] =
            (creatorUser.cryptoBalances[rig.targetCoin] || 0) + poolFee;

          logTransaction({
            userId: creatorUser.id,
            type: 'pool_fee_income',
            amount: Number(poolFee.toFixed(6)),
            currency: rig.targetCoin,
            description: `Начисление комиссии за пул «${pool.name}» (${pool.feePercent}% с майнера ${rig.name})`,
          });
        }
      }
    }
  });

  // 1.5. Process Bot Miners on Pools (Simulated miners paying pool fee to pool creator every 60s in the mined coin)
  pools.forEach((pool) => {
    // Dynamic recalculation of pool hashrate & miner count
    const poolActiveRigs = rigs.filter(
      (r) => r.status === 'mining' && (r.poolId === pool.id || r.poolId === pool.host)
    );
    const poolBots = pool.bots || [];
    
    const rigsHash = poolActiveRigs.reduce(
      (sum, r) => sum + r.totalHashrate * (1 + (r.overclockPercent || 0) / 100),
      0
    );
    const botsHash = poolBots.reduce((sum, b) => sum + (b.hashrate || 0), 0);
    pool.totalHashrate = (pool.isSystem ? 1000 : 0) + rigsHash + botsHash;
    pool.activeMinersCount = poolActiveRigs.length + poolBots.length + (pool.isSystem ? 1 : 0);

    if (poolBots.length === 0) return;

    poolBots.forEach((bot) => {
      const coinConfig = COIN_MINING_CONFIG[bot.coin];
      if (!coinConfig) return;

      // Increment shares accepted randomly to simulate real miner activity
      if (typeof bot.sharesAccepted !== 'number') bot.sharesAccepted = 120;
      if (Math.random() < 0.3) {
        bot.sharesAccepted += 1;
      }

      // Check if 60 seconds have elapsed since last bot payout
      const timeSincePayout = (now - (bot.lastPayoutTime || bot.createdAt || 0)) / 1000;
      if (timeSincePayout >= 60) {
        const elapsedMinutes = Math.floor(timeSincePayout / 60);
        bot.lastPayoutTime = now;

        const grossReward = bot.hashrate * coinConfig.rewardPerMhsPerMinute * elapsedMinutes;
        const poolFee = grossReward * (pool.feePercent / 100);

        if (poolFee > 0) {
          const creatorUser = users.find(
            (u) =>
              (pool.creatorId && pool.creatorId !== 'system' && u.id === pool.creatorId) ||
              (pool.creatorUsername && pool.creatorUsername !== 'System' && u.username.toLowerCase() === pool.creatorUsername.toLowerCase())
          );

          const marketPrices = getMarketPrices();
          const coinPrice = marketPrices.find((m) => m.coin === bot.coin)?.priceUSDT || 1;
          const feeInUSDT = poolFee * coinPrice;

          pool.totalFeesEarnedUSDT = (pool.totalFeesEarnedUSDT || 0) + feeInUSDT;

          if (creatorUser && poolFee > 0) {
            // Add pool commission directly in the coin being mined by the bot (DOGE, TON, BTC, ETC, etc.)
            creatorUser.cryptoBalances[bot.coin] =
              (creatorUser.cryptoBalances[bot.coin] || 0) + poolFee;

            logTransaction({
              userId: creatorUser.id,
              type: 'pool_fee_income',
              amount: Number(poolFee.toFixed(6)),
              currency: bot.coin,
              description: `Начисление комиссии за пул «${pool.name}» (${pool.feePercent}% с воркера ${bot.name})`,
            });
          }
        }
      }
    });
  });

  // 2. Process Business Passive Incomes for Users
  let totalBusinessIncomeUSD = 0;
  users.forEach((user) => {
    user.businesses.forEach((userBiz) => {
      const template = BUSINESS_TEMPLATES.find((t) => t.id === userBiz.businessId);
      if (!template) return;

      const hourlyRate = calculateBusinessIncomePerHour(
        template,
        userBiz.level,
        userBiz.staffCount,
        userBiz.marketingLevel
      );
      const incomeForElapsed = (hourlyRate / 3600) * elapsedSeconds;

      if (userBiz.automationUnlocked) {
        user.bankBalanceUSD += incomeForElapsed;
        const curMax = user.maxBalanceReachedUSD || 10000;
        if (user.bankBalanceUSD > curMax) {
          user.maxBalanceReachedUSD = user.bankBalanceUSD;
        }
        totalBusinessIncomeUSD += incomeForElapsed;
      }
    });
  });

  // Save updated states
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(RIGS_KEY, JSON.stringify(rigs));
  localStorage.setItem(POOLS_KEY, JSON.stringify(pools));

  return {
    miningPayouts: payoutsSummary,
    businessEarningsUSD: totalBusinessIncomeUSD,
  };
}

// Calculate Hashrate and Power for Rig Assembly
export function calculateRigSpecs(
  rackId: string,
  motherboardId: string,
  cpuId: string,
  psuIds: string[],
  gpuIds: string[],
  coin: CoinSymbol
): {
  totalHashrate: number;
  totalPowerWatts: number;
  psuCapacityWatts: number;
  maxGpuSlots: number;
  isValid: boolean;
  validationError?: string;
} {
  const rack = getHardwareById(rackId);
  const mb = getHardwareById(motherboardId);
  const cpu = getHardwareById(cpuId);

  const maxSlots = Math.min(rack?.specs.maxGpus || 7, mb?.specs.maxGpus || 7);

  if (gpuIds.length > maxSlots) {
    return {
      totalHashrate: 0,
      totalPowerWatts: 0,
      psuCapacityWatts: 0,
      maxGpuSlots: maxSlots,
      isValid: false,
      validationError: `Rack/Motherboard max GPU capacity is ${maxSlots} slots, but you selected ${gpuIds.length} GPUs.`,
    };
  }

  let totalPower = (mb?.powerWatts || 40) + (cpu?.powerWatts || 65);
  let totalHash = cpu?.specs.hashrates[coin] || 0;

  gpuIds.forEach((gpuId) => {
    const gpu = getHardwareById(gpuId);
    if (gpu) {
      totalPower += gpu.powerWatts;
      totalHash += gpu.specs.hashrates[coin] || 0;
    }
  });

  let psuCapacity = 0;
  psuIds.forEach((psuId) => {
    const psu = getHardwareById(psuId);
    if (psu) {
      psuCapacity += psu.powerWatts;
    }
  });

  const isPowerSufficient = psuCapacity >= totalPower;

  return {
    totalHashrate: Number(totalHash.toFixed(2)),
    totalPowerWatts: totalPower,
    psuCapacityWatts: psuCapacity,
    maxGpuSlots: maxSlots,
    isValid: isPowerSufficient && gpuIds.length > 0 && !!rack && !!mb && !!cpu && psuIds.length > 0,
    validationError: !isPowerSufficient
      ? `PSU capacity (${psuCapacity}W) is lower than rig power draw (${totalPower}W). Add or upgrade PSU!`
      : gpuIds.length === 0
      ? 'Please insert at least 1 GPU into the rack!'
      : undefined,
  };
}

// Full Reset: Wipes all accounts, pools, rigs, transactions, and session state
export function fullSystemReset(): void {
  localStorage.clear();
}

// Ban User: Distributes user's entire balance (USD & all Cryptos) across all other non-banned users,
// zeroes out banned user's balances, and sets isBanned = true with bannedAt timestamp.
export function banUser(userId: string): { success: boolean; message: string } {
  const users = getAllUsers();
  const bannedUser = users.find((u) => u.id === userId);
  if (!bannedUser) {
    return { success: false, message: 'Пользователь не найден.' };
  }
  if (bannedUser.isBanned) {
    return { success: false, message: 'Пользователь уже заблокирован.' };
  }

  // Active non-banned users to receive the split balance
  const activeUsers = users.filter((u) => u.id !== userId && !u.isBanned);

  const bankAmount = bannedUser.bankBalanceUSD || 0;
  const cryptoBalancesToDistribute = { ...(bannedUser.cryptoBalances || {}) };

  if (activeUsers.length > 0) {
    const bankShare = bankAmount / activeUsers.length;

    activeUsers.forEach((user) => {
      user.bankBalanceUSD = (user.bankBalanceUSD || 0) + bankShare;
      user.maxBalanceReachedUSD = Math.max(user.maxBalanceReachedUSD || 0, user.bankBalanceUSD);

      (Object.keys(cryptoBalancesToDistribute) as CoinSymbol[]).forEach((coinKey) => {
        const coin = coinKey as CoinSymbol;
        const coinShare = (cryptoBalancesToDistribute[coin] || 0) / activeUsers.length;
        user.cryptoBalances[coin] = (user.cryptoBalances[coin] || 0) + coinShare;
      });

      saveUser(user);
    });
  }

  // Zero out banned user's funds
  bannedUser.bankBalanceUSD = 0;
  bannedUser.cryptoBalances = {
    BTC: 0,
    ETC: 0,
    DOGE: 0,
    HAMSTER: 0,
    TON: 0,
    USDT: 0,
  };
  bannedUser.isBanned = true;
  bannedUser.bannedAt = Date.now();

  saveUser(bannedUser);

  return {
    success: true,
    message: `Игрок «${bannedUser.username}» заблокирован! Все средства распределены между активными игроками (${activeUsers.length}). Имя снова освободится через 10 минут.`,
  };
}

// Permanently Delete User: Immediately removes account and associated rigs
export function deleteUserPermanently(userId: string): void {
  let users = getAllUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return;

  users = users.filter((u) => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Delete rigs owned by this user
  let rigs = getAllRigs();
  rigs = rigs.filter((r) => r.ownerId !== userId);
  saveRigs(rigs);

  if (localStorage.getItem(CURRENT_USER_ID_KEY) === userId) {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  }
}

// Automatically cleans up banned users after 10 minutes (600,000 ms)
export function cleanupExpiredBannedUsers(): void {
  const users = getAllUsers();
  const now = Date.now();
  const BAN_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

  users.forEach((user) => {
    if (user.isBanned && user.bannedAt && now - user.bannedAt >= BAN_EXPIRATION_MS) {
      deleteUserPermanently(user.id);
    }
  });
}

// Rename Mining Rig
export function renameMiningRig(rigId: string, newName: string): MiningRig | null {
  const rigs = getAllRigs();
  const rig = rigs.find((r) => r.id === rigId);
  if (!rig) return null;

  rig.name = newName.trim() || rig.name;
  saveRigs(rigs);
  return rig;
}

// Update Card PIN
export function updateCardPin(userId: string, newPin: string): boolean {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return false;

  user.bankCard.pin = newPin.trim();
  saveUser(user);
  return true;
}

// Top Up From Someone Else's Card
export function topUpFromOtherCard(
  currentUserId: string,
  targetCardNumber: string,
  targetPin: string,
  amount: number
): { success: boolean; message: string } {
  if (amount <= 0) {
    return { success: false, message: 'Введите корректную сумму для списания.' };
  }
  if (amount > 50000) {
    return { success: false, message: 'Максимальная сумма разового списания с чужой карты — $50,000 USD!' };
  }

  const users = getAllUsers();
  const currentUser = users.find((u) => u.id === currentUserId);
  if (!currentUser) {
    return { success: false, message: 'Пользователь не найден.' };
  }

  const cleanTargetCard = targetCardNumber.replace(/\s+/g, '');
  const targetUser = users.find(
    (u) => u.bankCard.cardNumber.replace(/\s+/g, '') === cleanTargetCard
  );

  if (!targetUser) {
    return { success: false, message: 'Карта с таким номером не найдена!' };
  }

  if (targetUser.id === currentUser.id) {
    return { success: false, message: 'Нельзя списать деньги со своей карты этим способом!' };
  }

  if (targetUser.bankCard.pin !== targetPin.trim()) {
    return { success: false, message: 'Неверный PIN-код карты! Доступ отклонен.' };
  }

  if (targetUser.bankBalanceUSD < amount) {
    return { success: false, message: `На выбранной карте недостаточно средств (Доступный баланс: $${targetUser.bankBalanceUSD.toFixed(2)} USD).` };
  }

  // Deduct from target and add to current
  targetUser.bankBalanceUSD -= amount;
  currentUser.bankBalanceUSD += amount;

  saveUser(targetUser);
  saveUser(currentUser);

  // Log for recipient
  logTransaction({
    userId: currentUser.id,
    type: 'bank_transfer',
    amount: amount,
    currency: 'USD',
    from: targetUser.bankCard.cardNumber,
    to: currentUser.bankCard.cardNumber,
    description: `Пополнение счета с чужой карты №${targetUser.bankCard.cardNumber} (PIN подтвержден)`,
  });

  // Log for victim
  logTransaction({
    userId: targetUser.id,
    type: 'suspicious_expense',
    amount: -amount,
    currency: 'USD',
    from: targetUser.bankCard.cardNumber,
    to: currentUser.bankCard.cardNumber,
    description: `⚠️ Подозрительная трата: Списание по PIN-коду на карту №${currentUser.bankCard.cardNumber}`,
  });

  return { success: true, message: `Успешно переведено $${amount.toLocaleString('en-US')} с карты №${targetCardNumber}!` };
}

// Hacker PCs Logic
export function purchaseHackerPc(userId: string, templateId: number): { success: boolean; message: string; pc?: UserHackerPc } {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return { success: false, message: 'Пользователь не найден.' };

  const template = HACKER_PC_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return { success: false, message: 'Модель Хакерского ПК не найдена.' };

  if (user.bankBalanceUSD < template.priceUSD) {
    return { success: false, message: `Недостаточно средств на балансе! Требуется $${template.priceUSD.toLocaleString('en-US')} USD.` };
  }

  user.bankBalanceUSD -= template.priceUSD;

  if (!user.hackerPcs) {
    user.hackerPcs = [];
  }

  const newPc: UserHackerPc = {
    id: `hackerpc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    templateId: template.id,
    name: template.name,
    cpu: template.cpu,
    gpu: template.gpu,
    ram: template.ram,
    priceUSD: template.priceUSD,
    bruteForceSeconds: template.bruteForceSeconds,
    status: 'idle',
  };

  user.hackerPcs.push(newPc);
  saveUser(user);

  logTransaction({
    userId: user.id,
    type: 'hacker_pc_purchase',
    amount: -template.priceUSD,
    currency: 'USD',
    description: `Покупка станций брутфорса «${template.name}» ($${template.priceUSD.toLocaleString('en-US')})`,
  });

  return { success: true, message: `Вы успешно приобрели ${template.name}!`, pc: newPc };
}

export function startBruteForceJob(
  userId: string,
  pcInstanceId: string,
  targetCardNumber: string,
  targetUsername: string
): { success: boolean; message: string } {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user || !user.hackerPcs) return { success: false, message: 'ПК не найден.' };

  const pc = user.hackerPcs.find((p) => p.id === pcInstanceId);
  if (!pc) return { success: false, message: 'Хакерский ПК не найден.' };

  if (pc.status === 'cracking') {
    return { success: false, message: 'Этот ПК уже выполняет подбор PIN-кода!' };
  }

  const cleanTarget = targetCardNumber.replace(/\s+/g, '');
  const targetUser = users.find((u) => u.bankCard.cardNumber.replace(/\s+/g, '') === cleanTarget);
  if (!targetUser) {
    return { success: false, message: 'Целевая карта не найдена в системе!' };
  }

  pc.status = 'cracking';
  pc.targetCardNumber = targetUser.bankCard.cardNumber;
  pc.targetUsername = targetUser.username;
  pc.jobStartedAt = Date.now();
  pc.crackedPin = undefined;

  saveUser(user);
  return { success: true, message: `Брутфорс карты №${targetUser.bankCard.cardNumber} запущен на ${pc.name}!` };
}

export function updateHackerPcJobs(userId: string): UserAccount | null {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user || !user.hackerPcs || user.hackerPcs.length === 0) return user || null;

  let modified = false;
  const now = Date.now();

  user.hackerPcs.forEach((pc) => {
    if (pc.status === 'cracking' && pc.jobStartedAt && pc.targetCardNumber) {
      const elapsed = (now - pc.jobStartedAt) / 1000;
      if (elapsed >= pc.bruteForceSeconds) {
        // Job complete! Find target user's current PIN
        const cleanTarget = pc.targetCardNumber.replace(/\s+/g, '');
        const targetUser = users.find((u) => u.bankCard.cardNumber.replace(/\s+/g, '') === cleanTarget);

        pc.status = 'completed';
        if (targetUser) {
          pc.crackedPin = targetUser.bankCard.pin; // gets target's current PIN
        } else {
          pc.crackedPin = '0000';
        }
        modified = true;
      }
    }
  });

  if (modified) {
    saveUser(user);
  }

  return user;
}

