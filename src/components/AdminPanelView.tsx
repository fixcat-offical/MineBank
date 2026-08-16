import { useState, FormEvent } from 'react';
import {
  ShieldAlert,
  Server,
  DollarSign,
  Plus,
  Users,
  Percent,
  Check,
  Zap,
  Globe,
  Coins,
  CreditCard,
  Trash2,
  Edit3,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Award,
  Bot,
  Cpu,
  Activity,
  Shuffle,
  Wifi,
  Ban,
  UserX,
} from 'lucide-react';
import { UserAccount, MiningPool, CoinSymbol, PoolBotMiner, MiningRig, MarketPrice } from '../types';
import { AvatarIcon, CoinIcon, AVATAR_OPTIONS } from './CustomIcons';
import {
  saveUser,
  savePool,
  getAllPools,
  logTransaction,
  addBotToPool,
  removeBotFromPool,
  updateBotHashrate,
  getPoolComputedStats,
  banUser,
  deleteUserPermanently,
} from '../services/storageService';

interface AdminPanelViewProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  pools: MiningPool[];
  rigs?: MiningRig[];
  marketPrices?: MarketPrice[];
  onRefreshData: () => void;
  onFullReset?: () => void;
}

const RANDOM_NICKNAMES = [
  'CryptoVlad_88', 'Alex_Miner', 'Dmitry_Hash', 'Max_Stratum', 'Elena_Crypto',
  'Satoshi_Fan', 'NodeRunner_PRO', 'RigMaster_77', 'CyberWhale', 'AsicKing',
  'BlockSmith', 'Roman_Mining', 'Tony_Stark_GPU', 'Alpha_Hash'
];

const RANDOM_WORKERS = [
  'Antminer-S21-Pro', 'Antminer-L9-Doge', 'WhatsMiner-M50S', 'RTX-4090-x8-Rig',
  'IceRiver-KS3M', 'Bitaxe-Ultra-Array', 'Avalon-1466-Rig', 'Geforce-Farm-01'
];

export function AdminPanelView({
  currentUser,
  allUsers,
  pools,
  rigs = [],
  marketPrices = [],
  onRefreshData,
  onFullReset,
}: AdminPanelViewProps) {
  // Pool Creation State
  const [poolName, setPoolName] = useState('');
  const [poolHost, setPoolHost] = useState('stratum+tcp://vip.fixcat.mine:3333');
  const [poolFee, setPoolFee] = useState('5.0');
  const [assignedUserId, setAssignedUserId] = useState(currentUser.id);
  const [poolStatus, setPoolStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Balance Injection State
  const [targetUserId, setTargetUserId] = useState(allUsers[0]?.id || currentUser.id);
  const [injectType, setInjectType] = useState<'USD' | CoinSymbol>('USD');
  const [injectAmount, setInjectAmount] = useState('50000');
  const [injectNote, setInjectNote] = useState('Административное начисление от FixCat');
  const [injectStatus, setInjectStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Editing Pool Fee State
  const [editingPoolId, setEditingPoolId] = useState<string | null>(null);
  const [editFeeValue, setEditFeeValue] = useState('10.0');

  // Bot Deployment State (Realistic Persona)
  const [botPoolId, setBotPoolId] = useState(pools[0]?.id || '');
  const [botUsername, setBotUsername] = useState('CryptoVlad_88');
  const [botWorkerName, setBotWorkerName] = useState('Antminer-S21-Pro#1');
  const [botAvatar, setBotAvatar] = useState('hacker');
  const [botCoin, setBotCoin] = useState<CoinSymbol>('BTC');
  const [botHashrate, setBotHashrate] = useState('2500');
  const [botStatus, setBotStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingBotId, setEditingBotId] = useState<string | null>(null);
  const [editBotHashrate, setEditBotHashrate] = useState('');

  // Moderation & Confirmation States
  const [banConfirmUser, setBanConfirmUser] = useState<UserAccount | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserAccount | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [moderationStatus, setModerationStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const generateRandomPersona = () => {
    const nick = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    const worker = RANDOM_WORKERS[Math.floor(Math.random() * RANDOM_WORKERS.length)];
    const avatar = AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)].id;
    setBotUsername(`${nick}_${Math.floor(Math.random() * 90 + 10)}`);
    setBotWorkerName(`${worker}#${Math.floor(Math.random() * 9 + 1)}`);
    setBotAvatar(avatar);
  };

  // 1. Handle Admin Pool Creation (0 - 100% commission)
  const handleAdminCreatePool = (e: FormEvent) => {
    e.preventDefault();
    setPoolStatus(null);

    const feeNum = parseFloat(poolFee);
    if (isNaN(feeNum) || feeNum < 0 || feeNum > 100) {
      setPoolStatus({ type: 'error', message: 'Комиссия должна быть в диапазоне от 0% до 100%.' });
      return;
    }

    if (!poolName.trim() || !poolHost.trim()) {
      setPoolStatus({ type: 'error', message: 'Укажите название и адрес хоста пула.' });
      return;
    }

    const assignedUser = allUsers.find((u) => u.id === assignedUserId) || currentUser;

    const newPool: MiningPool = {
      id: `pool-admin-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: poolName.trim(),
      host: poolHost.trim(),
      feePercent: feeNum,
      creatorId: assignedUser.id,
      creatorUsername: assignedUser.username,
      creatorWalletAddress: assignedUser.cryptoAddresses?.USDT || assignedUser.bankCard.cardNumber,
      totalHashrate: 0,
      activeMinersCount: 0,
      totalFeesEarnedUSDT: 0,
      createdAt: Date.now(),
      isSystem: false,
    };

    savePool(newPool);

    // Also add to assigned user created pools list
    if (!assignedUser.createdPoolIds.includes(newPool.id)) {
      assignedUser.createdPoolIds.push(newPool.id);
      saveUser(assignedUser);
    }

    setPoolStatus({
      type: 'success',
      message: `Пул «${newPool.name}» с комиссией ${feeNum}% успешно создан и закреплен за игроком ${assignedUser.username}!`,
    });

    setPoolName('');
    setPoolHost('stratum+tcp://node.fixcat.mine:3333');
    setPoolFee('5.0');
    onRefreshData();
  };

  // 2. Handle Admin Balance Grant / Injection
  const handleInjectFunds = (e: FormEvent) => {
    e.preventDefault();
    setInjectStatus(null);

    const amountNum = parseFloat(injectAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setInjectStatus({ type: 'error', message: 'Введите положительную сумму.' });
      return;
    }

    const targetUser = allUsers.find((u) => u.id === targetUserId);
    if (!targetUser) {
      setInjectStatus({ type: 'error', message: 'Выбранный игрок не найден.' });
      return;
    }

    if (injectType === 'USD') {
      targetUser.bankBalanceUSD += amountNum;
      // Also raise maxBalanceReachedUSD so user can make transfers if >= 15000
      targetUser.maxBalanceReachedUSD = Math.max(
        targetUser.maxBalanceReachedUSD || 0,
        targetUser.bankBalanceUSD
      );

      logTransaction({
        userId: targetUser.id,
        type: 'bank_transfer',
        amount: amountNum,
        currency: 'USD',
        description: `[ADMIN GRANT] ${injectNote || 'Начисление USD от администратора fixcat'}`,
      });
    } else {
      targetUser.cryptoBalances[injectType] = (targetUser.cryptoBalances[injectType] || 0) + amountNum;

      logTransaction({
        userId: targetUser.id,
        type: 'crypto_transfer',
        amount: amountNum,
        currency: injectType,
        description: `[ADMIN GRANT] ${injectNote || `Начисление ${injectType} от администратора fixcat`}`,
      });
    }

    saveUser(targetUser);
    onRefreshData();

    setInjectStatus({
      type: 'success',
      message: `Успешно начислено ${amountNum.toLocaleString()} ${injectType} игроку ${targetUser.username}!`,
    });
  };

  // Quick Grant Helper
  const handleQuickGrant = (user: UserAccount, usdAmount: number, usdtAmount: number) => {
    if (usdAmount > 0) {
      user.bankBalanceUSD += usdAmount;
      user.maxBalanceReachedUSD = Math.max(user.maxBalanceReachedUSD || 0, user.bankBalanceUSD);
      logTransaction({
        userId: user.id,
        type: 'bank_transfer',
        amount: usdAmount,
        currency: 'USD',
        description: `[QUICK GRANT] Быстрое пополнение +$${usdAmount.toLocaleString()} USD от fixcat`,
      });
    }

    if (usdtAmount > 0) {
      user.cryptoBalances.USDT = (user.cryptoBalances.USDT || 0) + usdtAmount;
      logTransaction({
        userId: user.id,
        type: 'crypto_transfer',
        amount: usdtAmount,
        currency: 'USDT',
        description: `[QUICK GRANT] Быстрое пополнение +${usdtAmount} USDT от fixcat`,
      });
    }

    saveUser(user);
    onRefreshData();
  };

  // Handle Edit Pool Fee (0 - 100%)
  const handleSavePoolFee = (pool: MiningPool) => {
    const fee = parseFloat(editFeeValue);
    if (isNaN(fee) || fee < 0 || fee > 100) return;

    pool.feePercent = fee;
    savePool(pool);
    setEditingPoolId(null);
    onRefreshData();
  };

  // Handle Add Bot Miner to Selected Pool
  const handleAddBotMiner = (e: FormEvent) => {
    e.preventDefault();
    setBotStatus(null);

    const hashrateNum = parseFloat(botHashrate);
    if (isNaN(hashrateNum) || hashrateNum <= 0) {
      setBotStatus({ type: 'error', message: 'Укажите положительный хешрейт для бота.' });
      return;
    }

    const selectedPool = pools.find((p) => p.id === (botPoolId || pools[0]?.id));
    if (!selectedPool) {
      setBotStatus({ type: 'error', message: 'Выберите целевой майнинг-пул.' });
      return;
    }

    const assignedNick = botUsername.trim() || `CryptoMiner_${Math.floor(Math.random() * 900 + 100)}`;
    const assignedWorker = botWorkerName.trim() || `Antminer-Rig#${(selectedPool.bots?.length || 0) + 1}`;

    const updatedPool = addBotToPool(
      selectedPool.id,
      assignedNick,
      botCoin,
      hashrateNum,
      assignedWorker,
      botAvatar
    );

    if (updatedPool) {
      setBotStatus({
        type: 'success',
        message: `Майнер «${assignedNick}» [${assignedWorker}] (${hashrateNum.toLocaleString()} MH/s в ${botCoin}) успешно подключен к пулу «${selectedPool.name}»! Владелец пула (${selectedPool.creatorUsername}) получает ${selectedPool.feePercent}% комиссионных.`,
      });
      generateRandomPersona();
      onRefreshData();
    } else {
      setBotStatus({ type: 'error', message: 'Не удалось добавить бота к пулу.' });
    }
  };

  // Handle Remove Bot Miner
  const handleRemoveBot = (poolId: string, botId: string) => {
    removeBotFromPool(poolId, botId);
    onRefreshData();
  };

  // Handle Save Edited Bot Hashrate
  const handleSaveBotHashrate = (poolId: string, botId: string) => {
    const rate = parseFloat(editBotHashrate);
    if (isNaN(rate) || rate <= 0) return;
    updateBotHashrate(poolId, botId, rate);
    setEditingBotId(null);
    onRefreshData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 text-[#e0e0e0] font-mono">
      
      {/* Admin Banner */}
      <div className="bg-[#181216] border border-fuchsia-500/40 rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
          <ShieldAlert className="w-64 h-64 text-fuchsia-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-fuchsia-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              Root Administration Terminal • Logged in as: {currentUser.username}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-fuchsia-400" />
              Панель Администратора FixCat
            </h1>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
              Эксклюзивный доступ: создание майнинг-пулов с любой комиссией (0%–100%) и привязкой к любому игроку, начисление фиата ($ USD) и крипты (USDT), прямое управление базой игроков.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(217,70,239,0.25)]">
              <Award className="w-4 h-4 text-fuchsia-400" />
              SUPERADMIN PRIVILEGES
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Admin Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Module 1: Create Stratum Pool (0% - 100% Commission) */}
        <div className="lg:col-span-6 bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#2d2d33]">
            <div className="w-8 h-8 rounded bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Создание Пула с Любой Комиссией (0% - 100%)</h3>
              <p className="text-[11px] text-zinc-400">Привязка пула к любому выбранному игроку из базы</p>
            </div>
          </div>

          <form onSubmit={handleAdminCreatePool} className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Название Пула:
              </label>
              <input
                type="text"
                value={poolName}
                onChange={(e) => setPoolName(e.target.value)}
                placeholder="Например: FixCat VIP Royal Pool"
                className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-fuchsia-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Stratum Host / Адрес сервера:
              </label>
              <input
                type="text"
                value={poolHost}
                onChange={(e) => setPoolHost(e.target.value)}
                placeholder="stratum+tcp://pool.example.mine:3333"
                className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-fuchsia-500 font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Комиссия Пула (0% - 100%):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={poolFee}
                    onChange={(e) => setPoolFee(e.target.value)}
                    placeholder="10.0"
                    className="w-full pl-3 pr-8 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-fuchsia-500 font-bold"
                    required
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-fuchsia-400">%</span>
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  {[0, 1, 5, 10, 25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPoolFee(preset.toString())}
                      className="px-1.5 py-0.5 rounded text-[9px] bg-[#111114] border border-[#2d2d33] hover:border-fuchsia-400 text-zinc-300 font-bold"
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Владелец (получатель 100% комиссий):
                </label>
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-fuchsia-500 font-bold"
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} ({u.bankCard.cardNumber.slice(-4)})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Все комиссии пула поступают на USDT счет этого игрока!
                </p>
              </div>
            </div>

            {poolStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs font-bold ${
                  poolStatus.type === 'success'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {poolStatus.message}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
            >
              <Plus className="w-4 h-4" />
              СОЗДАТЬ ПУЛ БЕЗ ОГРАНИЧЕНИЙ И ПРИВЯЗАТЬ К ИГРОКУ
            </button>
          </form>
        </div>

        {/* Module 2: Balance Injections & Currency Grants */}
        <div className="lg:col-span-6 bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#2d2d33]">
            <div className="w-8 h-8 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Начисление Средств Игрокам (USD / USDT / Crypto)</h3>
              <p className="text-[11px] text-zinc-400">Мгновенное пополнение любого аккаунта в базе</p>
            </div>
          </div>

          <form onSubmit={handleInjectFunds} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Выберите Игрока:
                </label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-bold"
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} (${u.bankBalanceUSD.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Валюта зачисления:
                </label>
                <select
                  value={injectType}
                  onChange={(e) => setInjectType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-bold"
                >
                  <option value="USD">💵 USD (Банковская Карта)</option>
                  <option value="USDT">₮ USDT (Tether Crypto)</option>
                  <option value="BTC">₿ BTC (Bitcoin)</option>
                  <option value="TON">💎 TON (The Open Network)</option>
                  <option value="ETC">Ξ ETC (Ethereum Classic)</option>
                  <option value="DOGE">Ð DOGE (Dogecoin)</option>
                  <option value="HAMSTER">⚡ HAMSTER (Hamster Kombat)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Сумма начисления:
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={injectAmount}
                  onChange={(e) => setInjectAmount(e.target.value)}
                  placeholder="50000"
                  className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-bold"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {[10000, 50000, 100000, 500000, 1000000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInjectAmount(val.toString())}
                    className="px-2 py-0.5 rounded text-[9px] bg-[#111114] border border-[#2d2d33] hover:border-green-400 text-green-400 font-bold"
                  >
                    +{val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Комментарий в журнал игрока:
              </label>
              <input
                type="text"
                value={injectNote}
                onChange={(e) => setInjectNote(e.target.value)}
                placeholder="Административное начисление от FixCat"
                className="w-full px-3 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500"
              />
            </div>

            {injectStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs font-bold ${
                  injectStatus.type === 'success'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {injectStatus.message}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.25)]"
            >
              <Zap className="w-4 h-4" />
              НАЧИСЛИТЬ СРЕДСТВА НА СЧЕТ ИГРОКА
            </button>
          </form>
        </div>

      </div>

      {/* Module 3: Live Player Database Explorer */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#2d2d33]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-fuchsia-400" />
            <h3 className="text-sm font-bold text-white">
              База Зарегистрированных Игроков ({allUsers.length})
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500">Live Telemetry & Quick Grants</span>
        </div>

        {moderationStatus && (
          <div
            className={`p-3 rounded-lg text-xs font-bold font-mono flex items-center justify-between gap-2 ${
              moderationStatus.type === 'success'
                ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            <span>{moderationStatus.message}</span>
            <button
              onClick={() => setModerationStatus(null)}
              className="text-xs text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-black/30"
            >
              ✕
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2d2d33] text-[10px] text-zinc-400 uppercase">
                <th className="pb-2">Игрок</th>
                <th className="pb-2">Статус</th>
                <th className="pb-2">Карта</th>
                <th className="pb-2">Баланс USD</th>
                <th className="pb-2">Пик ($15k+)</th>
                <th className="pb-2">USDT</th>
                <th className="pb-2 text-right">Быстрые действия / Модерация</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2d33]">
              {allUsers.map((user) => {
                const peak = Math.max(user.maxBalanceReachedUSD || 0, user.bankBalanceUSD);
                const isUnlocked = peak >= 15000;
                const isBanned = !!user.isBanned;
                const remainingMinutes = user.bannedAt
                  ? Math.max(0, Math.ceil((10 * 60 * 1000 - (Date.now() - user.bannedAt)) / 60000))
                  : 0;

                return (
                  <tr key={user.id} className={`transition ${isBanned ? 'bg-rose-950/20' : 'hover:bg-[#111114]'}`}>
                    <td className="py-2.5 flex items-center gap-2 font-bold text-white">
                      <AvatarIcon avatar={user.avatar} className="w-4 h-4" />
                      <span className={isBanned ? 'line-through text-rose-400' : ''}>{user.username}</span>
                      {user.username.toLowerCase() === 'fixcat' && (
                        <span className="px-1.5 py-0.2 text-[8px] rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                          ADMIN
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 font-mono text-[10px]">
                      {isBanned ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1 w-fit">
                          <Ban className="w-3 h-3" /> ЗАБЛОКИРОВАН (Удаление через {remainingMinutes}м)
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/30 font-bold">
                          АКТИВЕН
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 font-mono text-zinc-400 text-[11px]">
                      {user.bankCard.cardNumber}
                    </td>
                    <td className="py-2.5 font-mono text-green-400 font-bold">
                      ${user.bankBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 font-mono text-xs">
                      {isUnlocked ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Разрешено (${peak.toLocaleString()})
                        </span>
                      ) : (
                        <span className="text-amber-400 text-[10px]">
                          Блок (${peak.toLocaleString()} / $15k)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 font-mono text-teal-400 font-bold">
                      {(user.cryptoBalances?.USDT || 0).toFixed(2)} ₮
                    </td>
                    <td className="py-2.5 text-right space-x-1">
                      {!isBanned && (
                        <>
                          <button
                            onClick={() => handleQuickGrant(user, 10000, 0)}
                            className="px-2 py-1 rounded bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold"
                            title="Начислить +$10,000 USD"
                          >
                            +$10k USD
                          </button>
                          <button
                            onClick={() => handleQuickGrant(user, 50000, 1000)}
                            className="px-2 py-1 rounded bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 text-[10px] font-bold"
                            title="Начислить +$50k USD и +1,000 USDT"
                          >
                            +$50k + 1k USDT
                          </button>
                          {!isUnlocked && (
                            <button
                              onClick={() => {
                                user.maxBalanceReachedUSD = 15000;
                                saveUser(user);
                                onRefreshData();
                              }}
                              className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold"
                              title="Разблокировать P2P переводы"
                            >
                              Снять Блок
                            </button>
                          )}
                          <button
                            onClick={() => setBanConfirmUser(user)}
                            className="px-2 py-1 rounded bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer"
                            title="Заблокировать аккаунт и распределить его средства"
                          >
                            <Ban className="w-3 h-3 text-rose-400" />
                            Забанить
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setDeleteConfirmUser(user)}
                        className="px-2 py-1 rounded bg-red-800/30 hover:bg-red-800/60 text-red-300 border border-red-600/50 text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer"
                        title="Удалить аккаунт навсегда"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                        Удалить
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Module 4: Bot Miners Manager (Simulated Workers paying commission to Pool Creator) */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#2d2d33]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Подключение Ботов-Майнеров к Пулам (Custom Hashrate)
              </h3>
              <p className="text-[11px] text-zinc-400">
                Боты майнят как реальные игроки, а вся комиссия пула (0%–100%) поступает создателю пула
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold self-start sm:self-auto">
            BOT SIMULATION ENGINE
          </span>
        </div>

        {/* Deploy New Bot Form */}
        <form onSubmit={handleAddBotMiner} className="bg-[#111114] border border-[#2d2d33] rounded-xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#2d2d33]">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Развернуть Майнера-Бота (Выглядит как реальный игрок):</span>
            </div>

            <button
              type="button"
              onClick={generateRandomPersona}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-[10px] font-bold flex items-center gap-1.5 transition self-start sm:self-auto border border-zinc-700"
            >
              <Shuffle className="w-3 h-3 text-cyan-400" />
              🎲 Случайный игрок & воркер
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Целевой Майнинг-Пул:
              </label>
              <select
                value={botPoolId || pools[0]?.id}
                onChange={(e) => setBotPoolId(e.target.value)}
                className="w-full px-3 py-2 bg-[#151518] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
              >
                {pools.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.feePercent}% Fee • {p.creatorUsername})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Никнейм Игрока (Username):
              </label>
              <input
                type="text"
                value={botUsername}
                onChange={(e) => setBotUsername(e.target.value)}
                placeholder="CryptoVlad_88"
                className="w-full px-3 py-2 bg-[#151518] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Имя Воркера / Рига:
              </label>
              <input
                type="text"
                value={botWorkerName}
                onChange={(e) => setBotWorkerName(e.target.value)}
                placeholder="Antminer-S21-Pro#1"
                className="w-full px-3 py-2 bg-[#151518] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Аватарка Игрока:
              </label>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#151518] border border-[#2d2d33]">
                  <AvatarIcon avatar={botAvatar} className="w-5 h-5" />
                </div>
                <select
                  value={botAvatar}
                  onChange={(e) => setBotAvatar(e.target.value)}
                  className="w-full px-3 py-2 bg-[#151518] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
                >
                  {AVATAR_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Монета Майнинга:
              </label>
              <select
                value={botCoin}
                onChange={(e) => setBotCoin(e.target.value as CoinSymbol)}
                className="w-full px-3 py-2 bg-[#151518] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
              >
                <option value="BTC">₿ BTC (SHA-256)</option>
                <option value="ETC">Ξ ETC (Etchash)</option>
                <option value="TON">💎 TON (SHA-256 TON)</option>
                <option value="DOGE">Ð DOGE (Scrypt)</option>
                <option value="HAMSTER">⚡ HAMSTER (HMSTR Protocol)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Кастомный Хешрейт (MH/s):
              </label>
              <input
                type="number"
                step="any"
                min="1"
                value={botHashrate}
                onChange={(e) => setBotHashrate(e.target.value)}
                placeholder="2500"
                className="w-full px-3 py-2 bg-[#151518] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-bold font-mono"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2d2d33]">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-zinc-500 mr-1">Пресеты хешрейта:</span>
              {[500, 2500, 10000, 50000, 250000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBotHashrate(preset.toString())}
                  className="px-2 py-0.5 rounded text-[9px] bg-[#151518] border border-[#2d2d33] hover:border-cyan-400 text-cyan-400 font-bold"
                >
                  {preset >= 1000 ? `${preset / 1000} GH/s` : `${preset} MH/s`}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs tracking-wider transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Plus className="w-4 h-4" />
              ПОДКЛЮЧИТЬ МАЙНЕРА К ПУЛУ
            </button>
          </div>

          {botStatus && (
            <div
              className={`p-2.5 rounded-lg text-xs font-bold mt-2 ${
                botStatus.type === 'success'
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {botStatus.message}
            </div>
          )}
        </form>

        {/* Active Bots List by Pool */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Активные Майнеры на Пулах:
            </h4>
            <span className="text-[10px] text-zinc-500">
              Всего ботов: {pools.reduce((acc, p) => acc + (p.bots?.length || 0), 0)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pools.flatMap((pool) =>
              (pool.bots || []).map((bot) => {
                const isEditingThisBot = editingBotId === bot.id;
                const botUser = bot.username || bot.name?.split(' ')[0] || 'MinerWorker';
                const botWorker = bot.workerName || 'Antminer-Rig';
                const botAv = bot.avatar || 'hacker';

                return (
                  <div
                    key={bot.id}
                    className="p-3.5 rounded-xl bg-[#111114] border border-[#2d2d33] space-y-2.5 hover:border-cyan-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <AvatarIcon avatar={botAv} className="w-6 h-6" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white truncate max-w-[130px]">
                              {botUser}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">/{botWorker}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            ONLINE • {bot.pingMs || 15}ms
                          </div>
                        </div>
                      </div>

                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#151518] text-[10px] text-amber-300 font-bold border border-[#2d2d33]">
                        <CoinIcon coin={bot.coin} className="w-3 h-3" />
                        {bot.coin}
                      </span>
                    </div>

                    <div className="text-[10px] space-y-1 bg-[#151518] p-2.5 rounded-lg border border-[#2d2d33]">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Пул:</span>
                        <span className="font-bold text-zinc-300 truncate max-w-[140px]">{pool.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Владелец комиссий:</span>
                        <span className="font-bold text-fuchsia-400">{pool.creatorUsername}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Комиссия пула:</span>
                        <span className="font-bold text-green-400">{pool.feePercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Хешрейт:</span>
                        <span className="font-bold text-cyan-400 font-mono">
                          {bot.hashrate >= 1000 ? `${(bot.hashrate / 1000).toFixed(2)} GH/s` : `${bot.hashrate.toLocaleString()} MH/s`}
                        </span>
                      </div>
                      <div className="flex justify-between text-zinc-500 pt-0.5 border-t border-[#2d2d33]">
                        <span>Кошелек:</span>
                        <span className="font-mono text-[9px] text-zinc-400 truncate max-w-[150px]">{bot.walletAddress}</span>
                      </div>
                    </div>

                    {isEditingThisBot ? (
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="number"
                          step="any"
                          value={editBotHashrate}
                          onChange={(e) => setEditBotHashrate(e.target.value)}
                          placeholder="Хешрейт MH/s"
                          className="w-full px-2 py-1 bg-[#151518] border border-[#2d2d33] rounded text-xs text-white font-mono"
                        />
                        <button
                          onClick={() => handleSaveBotHashrate(pool.id, bot.id)}
                          className="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-bold"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => setEditingBotId(null)}
                          className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-[10px]"
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1 border-t border-[#2d2d33]">
                        <button
                          onClick={() => {
                            setEditingBotId(bot.id);
                            setEditBotHashrate(bot.hashrate.toString());
                          }}
                          className="text-[10px] text-zinc-400 hover:text-cyan-400 flex items-center gap-1 font-bold"
                        >
                          <Edit3 className="w-3 h-3" />
                          Изменить MH/s
                        </button>
                        <button
                          onClick={() => handleRemoveBot(pool.id, bot.id)}
                          className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold"
                        >
                          <Trash2 className="w-3 h-3" />
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {pools.every((p) => !p.bots || p.bots.length === 0) && (
              <div className="col-span-full py-6 text-center text-zinc-500 text-xs bg-[#111114] rounded-xl border border-dashed border-[#2d2d33]">
                Пока нет развернутых ботов. Добавьте первого бота через форму выше, указав кастомный хешрейт!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Module 5: Stratum Pools Live Manager */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#2d2d33]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Управление Всеми Майнинг-Пулами в Сети ({pools.length})
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500">Контроль комиссий 0%–100% и владельцев</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pools.map((pool) => {
            const isEditing = editingPoolId === pool.id;
            const stats = getPoolComputedStats(pool, rigs, marketPrices);

            return (
              <div
                key={pool.id}
                className="p-3.5 rounded-xl bg-[#111114] border border-[#2d2d33] space-y-2.5 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-xs truncate max-w-[180px]">
                    {pool.name}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                    Комиссия: {pool.feePercent}%
                  </span>
                </div>

                <div className="text-[11px] font-mono text-zinc-400 truncate">
                  {pool.host}
                </div>

                <div className="text-[10px] text-zinc-400 border-t border-[#2d2d33] pt-1.5 space-y-1">
                  <div className="flex justify-between">
                    <span>Владелец комиссий:</span>
                    <strong className="text-white">{pool.creatorUsername || 'System'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Суммарный хешрейт:</span>
                    <strong className="text-green-400 font-mono">
                      {stats.totalHashrate >= 1000000
                        ? `${(stats.totalHashrate / 1000000).toFixed(2)} TH/s`
                        : stats.totalHashrate >= 1000
                        ? `${(stats.totalHashrate / 1000).toFixed(2)} GH/s`
                        : `${stats.totalHashrate.toFixed(1)} MH/s`}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Активных майнеров:</span>
                    <strong className="text-cyan-400">{stats.activeMinersCount} воркеров ({pool.bots?.length || 0} ботов)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Доход в минуту:</span>
                    <strong className="text-emerald-400 font-mono">+${stats.estimatedIncomePerMinuteUSDT.toFixed(4)} USDT/мин</strong>
                  </div>
                  <div className="flex justify-between pt-0.5 border-t border-[#2d2d33]">
                    <span>Всего выплачено:</span>
                    <strong className="text-emerald-400">${(pool.totalFeesEarnedUSDT || 0).toFixed(2)} USDT</strong>
                  </div>
                </div>

                {isEditing ? (
                  <div className="pt-2 border-t border-[#2d2d33] flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={editFeeValue}
                      onChange={(e) => setEditFeeValue(e.target.value)}
                      className="w-20 px-2 py-1 bg-[#151518] border border-[#2d2d33] rounded text-xs text-white"
                    />
                    <button
                      onClick={() => handleSavePoolFee(pool)}
                      className="px-2 py-1 bg-green-500 hover:bg-green-400 text-black text-[10px] font-bold rounded"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => setEditingPoolId(null)}
                      className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] rounded"
                    >
                      Отмена
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#2d2d33] flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setEditingPoolId(pool.id);
                        setEditFeeValue(pool.feePercent.toString());
                      }}
                      className="px-2 py-1 rounded bg-[#151518] hover:bg-zinc-800 text-zinc-300 text-[10px] font-bold border border-[#2d2d33] flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Изменить % (0-100)
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Full System Reset */}
      <div className="bg-[#1a1114] border border-red-500/40 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm tracking-wider uppercase">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
          <span>ОПАСНАЯ ЗОНА: ПОЛНЫЙ СБРОС ВСЕЙ СИСТЕМЫ И БАЗЫ ДАННЫХ</span>
        </div>

        <p className="text-zinc-300 text-xs leading-relaxed font-sans">
          Полностью удаляет все аккаунты игроков (включая аккаунт администратора), все созданные пулы, ботов, фермы, транзакции и истории балансов. После нажатия все подключенные пользователи будут мгновенно выведены из системы и перенаправлены на страницу регистрации/входа.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-red-500/20">
          <span className="text-[11px] text-red-400 font-bold">
            ⚠️ Действие необратимо! Вся история майнинга и балансы будут стерты.
          </span>

          <button
            onClick={() => setResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.4)] transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            ПОЛНЫЙ СБРОС СИСТЕМЫ И ВСЕХ АККАУНТОВ
          </button>
        </div>
      </div>

      {/* Ban Confirmation Modal */}
      {banConfirmUser && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151518] border-2 border-rose-500 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(244,63,94,0.3)] space-y-4 font-mono text-center animate-in fade-in zoom-in">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500 text-rose-500 flex items-center justify-center mx-auto">
              <Ban className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                Заблокировать аккаунт?
              </h3>
              <p className="text-xs text-zinc-300 mt-2 font-sans leading-relaxed">
                Игрок <strong className="text-rose-400 font-mono">«{banConfirmUser.username}»</strong> будет заблокирован. Все его средства ($ USD и крипта) будут мгновенно распределены среди всех остальных активных пользователей, а через 10 минут имя освободится.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBanConfirmUser(null)}
                className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition cursor-pointer"
              >
                Отмена
              </button>

              <button
                type="button"
                onClick={() => {
                  const res = banUser(banConfirmUser.id);
                  setModerationStatus({ type: 'success', message: res.message });
                  setBanConfirmUser(null);
                  onRefreshData();
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Ban className="w-4 h-4" />
                Да, Забанить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151518] border-2 border-red-600 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.3)] space-y-4 font-mono text-center animate-in fade-in zoom-in">
            <div className="w-14 h-14 rounded-full bg-red-600/10 border border-red-600 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                Удалить аккаунт навсегда?
              </h3>
              <p className="text-xs text-zinc-300 mt-2 font-sans leading-relaxed">
                Аккаунт <strong className="text-red-400 font-mono">«{deleteConfirmUser.username}»</strong> и все его майнеры будут безвозвратно удалены из базы данных.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition cursor-pointer"
              >
                Отмена
              </button>

              <button
                type="button"
                onClick={() => {
                  const name = deleteConfirmUser.username;
                  deleteUserPermanently(deleteConfirmUser.id);
                  setModerationStatus({ type: 'success', message: `Аккаунт «${name}» безвозвратно удален из системы.` });
                  setDeleteConfirmUser(null);
                  onRefreshData();
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Да, Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full System Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151518] border-2 border-red-500 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_60px_rgba(239,68,68,0.4)] space-y-5 font-mono text-center animate-in fade-in zoom-in">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500 text-red-500 flex items-center justify-center mx-auto animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                ПОЛНЫЙ СБРОС ВСЕХ ДАННЫХ?
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                Вы действительно хотите полностью стереть базу данных? Все аккаунты (включая админа), пулы, фермы и балансы будут безвозвратно удалены. Все находящиеся в сети пользователи будут разлогинены.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition cursor-pointer"
              >
                Отмена
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetConfirmOpen(false);
                  if (onFullReset) {
                    onFullReset();
                  }
                }}
                className="py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                СБРОСИТЬ ВСЁ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
