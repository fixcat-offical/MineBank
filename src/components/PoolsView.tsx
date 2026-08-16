import { useState, useEffect, FormEvent } from 'react';
import {
  Globe,
  Plus,
  Server,
  Zap,
  DollarSign,
  ShieldCheck,
  Check,
  Sparkles,
  Users,
  Copy,
  TrendingUp,
  Activity,
  Cpu,
  Wifi,
  ChevronRight,
  Search,
  Bot,
  Clock
} from 'lucide-react';
import { MiningPool, UserAccount, MiningRig, MarketPrice } from '../types';
import { getPoolComputedStats } from '../services/storageService';
import { AvatarIcon, CoinIcon } from './CustomIcons';

interface PoolsViewProps {
  currentUser: UserAccount;
  pools: MiningPool[];
  rigs: MiningRig[];
  marketPrices: MarketPrice[];
  allUsers?: UserAccount[];
  onCreatePool: (name: string, host: string, feePercent: number) => boolean;
}

export function PoolsView({ currentUser, pools, rigs, marketPrices, allUsers = [], onCreatePool }: PoolsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPoolForMiners, setSelectedPoolForMiners] = useState<MiningPool | null>(null);
  const [copiedHost, setCopiedHost] = useState<string | null>(null);
  const [minersFilter, setMinersFilter] = useState('');

  const [poolName, setPoolName] = useState('');
  const [poolHost, setPoolHost] = useState('');
  const [poolFee, setPoolFee] = useState('3.0');
  const [createStatus, setCreateStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [secondsToPayout, setSecondsToPayout] = useState<number>(() => {
    return 60 - (Math.floor(Date.now() / 1000) % 60);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsToPayout(60 - (Math.floor(Date.now() / 1000) % 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const POOL_CREATION_COST_USDT = 10000;

  const handleCopyHost = (host: string) => {
    navigator.clipboard.writeText(host);
    setCopiedHost(host);
    setTimeout(() => setCopiedHost(null), 2000);
  };

  const handleCreateSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCreateStatus(null);

    const feeNum = parseFloat(poolFee);
    if (isNaN(feeNum) || feeNum < 0.5 || feeNum > 15) {
      setCreateStatus({ type: 'error', message: 'Комиссия пула должна быть от 0.5% до 15%.' });
      return;
    }

    if (!poolName.trim() || !poolHost.trim()) {
      setCreateStatus({ type: 'error', message: 'Заполните все поля.' });
      return;
    }

    if (currentUser.cryptoBalances.USDT < POOL_CREATION_COST_USDT && currentUser.bankBalanceUSD < POOL_CREATION_COST_USDT) {
      setCreateStatus({
        type: 'error',
        message: `Для создания пула требуется ${POOL_CREATION_COST_USDT.toLocaleString()} USDT или $${POOL_CREATION_COST_USDT.toLocaleString()} USD на балансе.`,
      });
      return;
    }

    const success = onCreatePool(poolName.trim(), poolHost.trim(), feeNum);
    if (success) {
      setCreateStatus({ type: 'success', message: 'Майнинг пул успешно развернут в сети!' });
      setTimeout(() => {
        setShowCreateModal(false);
        setPoolName('');
        setPoolHost('');
      }, 1500);
    } else {
      setCreateStatus({ type: 'error', message: 'Ошибка при создании пула. Проверьте баланс.' });
    }
  };

  const formatHashrate = (mhs: number) => {
    if (mhs >= 1000000) return `${(mhs / 1000000).toFixed(2)} TH/s`;
    if (mhs >= 1000) return `${(mhs / 1000).toFixed(2)} GH/s`;
    return `${mhs.toFixed(1)} MH/s`;
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 text-[#e0e0e0] font-mono">
      
      {/* Header Banner */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-green-400 text-[10px] uppercase tracking-wider mb-0.5">
            <Globe className="w-3.5 h-3.5" />
            Stratum Protocol & Mining Hubs
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Майнинг Пулы (Stratum Servers)
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5 max-w-2xl font-sans">
            Подключайте фермы к официальным пулам или создайте собственный пул за 10,000 USDT и зарабатывайте процент с комиссий со всех подключенных майнеров в реальном времени!
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold text-xs tracking-wider shadow-[0_0_12px_rgba(34,197,94,0.2)] transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          СОЗДАТЬ СВОЙ ПУЛ (10,000 USDT)
        </button>
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {pools.map((pool) => {
          const isMyPool = pool.creatorId === currentUser.id;
          const stats = getPoolComputedStats(pool, rigs, marketPrices);

          return (
            <div
              key={pool.id}
              className={`rounded-xl p-4 border shadow-xl flex flex-col justify-between transition ${
                pool.isSystem
                  ? 'bg-[#151518] border-green-500/30 hover:border-green-500/50'
                  : isMyPool
                  ? 'bg-[#151518] border-emerald-500/40 hover:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'bg-[#151518] border-[#2d2d33] hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      pool.isSystem
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : isMyPool
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-[#111114] text-zinc-400 border-[#2d2d33]'
                    }`}
                  >
                    {pool.isSystem ? 'ОФИЦИАЛЬНЫЙ ПУЛ' : isMyPool ? 'ВАШ СОБСТВЕННЫЙ ПУЛ' : 'СООБЩЕСТВО'}
                  </span>

                  <span className="px-2 py-0.5 rounded bg-[#111114] text-green-400 text-[11px] font-bold border border-[#2d2d33]">
                    {pool.feePercent}% Fee
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white truncate max-w-[200px]">{pool.name}</h3>
                  <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Stratum v2
                  </span>
                </div>

                {/* Host */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#111114] border border-[#2d2d33] text-xs text-green-400 mb-3">
                  <span className="truncate">{pool.host}</span>
                  <button
                    onClick={() => handleCopyHost(pool.host)}
                    className="text-zinc-500 hover:text-white p-1 transition"
                    title="Копировать адрес Stratum"
                  >
                    {copiedHost === pool.host ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Pool Stats Card */}
                <div className="bg-[#111114] rounded-lg p-3 border border-[#2d2d33] space-y-2 text-xs">
                  {/* Total Hashrate */}
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[11px] flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      Общий хешрейт пула:
                    </span>
                    <span className="font-bold text-green-400 text-sm">
                      {formatHashrate(stats.totalHashrate)}
                    </span>
                  </div>

                  {/* Active Miners */}
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[11px] flex items-center gap-1">
                      <Users className="w-3 h-3 text-cyan-400" />
                      Активные майнеры:
                    </span>
                    <button
                      onClick={() => setSelectedPoolForMiners(pool)}
                      className="font-bold text-white hover:text-cyan-400 flex items-center gap-1 underline decoration-dotted transition text-xs"
                    >
                      {stats.activeMinersCount} воркеров
                      <ChevronRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  </div>

                  {/* Creator */}
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[11px]">Создатель:</span>
                    <span className="font-medium text-zinc-300 truncate max-w-[140px]">
                      {pool.creatorUsername}
                    </span>
                  </div>

                  {/* Real-time Earnings Per Minute */}
                  <div className="pt-2 border-t border-[#2d2d33] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-[11px] flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        Прибыль пула в минуту:
                      </span>
                      <span className="font-bold text-emerald-400">
                        +${stats.estimatedIncomePerMinuteUSDT.toFixed(4)} USDT/мин
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-zinc-500">
                      <span>Оценка прибыли:</span>
                      <span className="text-zinc-400">
                        ~${stats.estimatedIncomePerHourUSDT.toFixed(2)}/ч • ~${stats.estimatedIncomePerDayUSDT.toFixed(2)}/день
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1">
                      <span className="text-zinc-400">Всего заработано:</span>
                      <span className="font-bold text-green-400">
                        +${(pool.totalFeesEarnedUSDT || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setSelectedPoolForMiners(pool)}
                  className="w-full py-1.5 px-3 rounded-lg bg-[#111114] hover:bg-zinc-800 border border-[#2d2d33] text-xs text-cyan-300 font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  СПИСОК МАЙНЕРОВ ({stats.activeMinersCount})
                </button>

                {isMyPool && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1.5 font-mono shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>До выплаты комиссии:</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-black/80 text-emerald-400 font-bold border border-emerald-500/40 text-xs shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                        {secondsToPayout === 60 || secondsToPayout === 0 ? 'Выплата!' : `00:${String(secondsToPayout).padStart(2, '0')} сек`}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-emerald-500/20">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        style={{ width: `${((60 - (secondsToPayout === 60 ? 0 : secondsToPayout)) / 60) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                      <span>Комиссия ({pool.feePercent}%) в монетах</span>
                      <span className="text-emerald-400 font-bold">
                        +${(stats.estimatedIncomePerMinuteUSDT || 0).toFixed(4)} USDT/мин
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connected Miners Modal (Real players & realistic bot miners) */}
      {selectedPoolForMiners && (() => {
        const pool = selectedPoolForMiners;
        const stats = getPoolComputedStats(pool, rigs, marketPrices);
        
        // Combine player rigs and bots into a unified realistic miners list
        const playerMiners = stats.activeRigs.map((rig) => {
          const owner = allUsers.find((u) => Object.values(u.cryptoAddresses || {}).includes(rig.targetWalletAddress)) || currentUser;
          return {
            id: rig.id,
            isBot: false,
            username: owner.username,
            avatar: owner.avatar || 'hacker',
            workerName: rig.name,
            coin: rig.targetCoin,
            hashrate: rig.totalHashrate * (1 + (rig.overclockPercent || 0) / 100),
            pingMs: 12,
            sharesAccepted: 350,
            sharesRejected: 0,
            walletAddress: rig.targetWalletAddress,
            powerWatts: rig.totalPowerWatts,
          };
        });

        const botMiners = (pool.bots || []).map((bot) => ({
          id: bot.id,
          isBot: true,
          username: bot.username || bot.name?.split(' ')[0] || 'MinerWorker',
          avatar: bot.avatar || 'cat',
          workerName: bot.workerName || bot.name || 'Antminer-S21',
          coin: bot.coin,
          hashrate: bot.hashrate,
          pingMs: bot.pingMs || 18,
          sharesAccepted: bot.sharesAccepted || 180,
          sharesRejected: bot.sharesRejected || 0,
          walletAddress: bot.walletAddress,
          powerWatts: Math.round(bot.hashrate * 1.2),
        }));

        const allConnectedMiners = [...playerMiners, ...botMiners].filter((m) => {
          if (!minersFilter.trim()) return true;
          const query = minersFilter.toLowerCase();
          return (
            m.username.toLowerCase().includes(query) ||
            m.workerName.toLowerCase().includes(query) ||
            m.coin.toLowerCase().includes(query) ||
            m.walletAddress.toLowerCase().includes(query)
          );
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
            <div className="bg-[#151518] border border-[#2d2d33] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono">
              
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-[#2d2d33] flex items-center justify-between bg-[#111114]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{pool.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        {pool.feePercent}% Fee
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>Stratum: {pool.host}</span>
                      <span>•</span>
                      <span>Владелец: {pool.creatorUsername}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPoolForMiners(null);
                    setMinersFilter('');
                  }}
                  className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              {/* Pool Summary Stats Banner in Modal */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 sm:p-4 bg-[#0e0e11] border-b border-[#2d2d33] text-xs">
                <div className="p-2.5 rounded-lg bg-[#151518] border border-[#2d2d33]">
                  <div className="text-zinc-500 text-[10px]">СУММАРНЫЙ ХЕШРЕЙТ:</div>
                  <div className="text-sm font-bold text-green-400 mt-0.5">
                    {formatHashrate(stats.totalHashrate)}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#151518] border border-[#2d2d33]">
                  <div className="text-zinc-500 text-[10px]">АКТИВНЫХ МАЙНЕРОВ:</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {stats.activeMinersCount} воркеров
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#151518] border border-[#2d2d33]">
                  <div className="text-zinc-500 text-[10px]">ДОХОД ПУЛА В МИНУТУ:</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    +${stats.estimatedIncomePerMinuteUSDT.toFixed(4)}/мин
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#151518] border border-[#2d2d33]">
                  <div className="text-zinc-500 text-[10px]">НАЧИСЛЕНО КОМИССИЙ:</div>
                  <div className="text-sm font-bold text-green-400 mt-0.5">
                    ${(pool.totalFeesEarnedUSDT || 0).toFixed(2)} USDT
                  </div>
                </div>
              </div>

              {/* Search / Filter Bar */}
              <div className="p-3 sm:p-4 border-b border-[#2d2d33] flex items-center gap-2 bg-[#111114]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={minersFilter}
                    onChange={(e) => setMinersFilter(e.target.value)}
                    placeholder="Поиск по никнейму, воркеру, монете или кошельку..."
                    className="w-full pl-9 pr-3 py-1.5 bg-[#151518] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
                  />
                </div>
                <span className="text-xs text-zinc-500 shrink-0">
                  Найдено: {allConnectedMiners.length}
                </span>
              </div>

              {/* Miners List */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 divide-y divide-[#2d2d33]/50">
                {allConnectedMiners.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-xs">
                    К данному пулу пока не подключено активных майнеров.
                  </div>
                ) : (
                  allConnectedMiners.map((miner) => (
                    <div
                      key={miner.id}
                      className="pt-2.5 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-[#111114] border border-[#2d2d33] hover:border-zinc-700 transition"
                    >
                      {/* Left: Avatar & Miner Identity */}
                      <div className="flex items-center gap-3">
                        <AvatarIcon avatar={miner.avatar} className="w-6 h-6" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{miner.username}</span>
                            <span className="text-xs text-zinc-400 font-medium">/{miner.workerName}</span>
                            <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              ONLINE
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-500 flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="truncate max-w-[200px]">Кошелек: {miner.walletAddress}</span>
                            <span>•</span>
                            <span className="text-zinc-400">Ping: {miner.pingMs}ms</span>
                            <span>•</span>
                            <span className="text-emerald-400">Shares: {miner.sharesAccepted} A / {miner.sharesRejected} R (100%)</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Hashrate & Coin Info */}
                      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#2d2d33]">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151518] border border-[#2d2d33]">
                          <CoinIcon coin={miner.coin} className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold text-white">{miner.coin}</span>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-green-400">
                            {formatHashrate(miner.hashrate)}
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            ~{miner.powerWatts}W
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 bg-[#111114] border-t border-[#2d2d33] flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-green-400" />
                  Stratum Engine: протокол v2 с защитой от сбоев
                </span>
                <button
                  onClick={() => {
                    setSelectedPoolForMiners(null);
                    setMinersFilter('');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition"
                >
                  Закрыть
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Create Custom Pool Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-5 max-w-md w-full shadow-2xl relative font-mono">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#2d2d33]">
              <div>
                <h3 className="text-sm font-bold text-white">Создание Майнинг Пула</h3>
                <p className="text-[11px] text-zinc-400">Стоимость развертывания: 10,000 USDT</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Название Пула</label>
                <input
                  type="text"
                  value={poolName}
                  onChange={(e) => setPoolName(e.target.value)}
                  placeholder="Apex Nordic Pool"
                  className="w-full px-3 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Stratum Host Адрес
                </label>
                <input
                  type="text"
                  value={poolHost}
                  onChange={(e) => setPoolHost(e.target.value)}
                  placeholder="eu.apexpool.net:3333"
                  className="w-full px-3 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Процент комиссии пула (от 0.5% до 15.0%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="15.0"
                  value={poolFee}
                  onChange={(e) => setPoolFee(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-mono font-bold"
                  required
                />
              </div>

              {createStatus && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-semibold ${
                    createStatus.type === 'success'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {createStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold text-xs tracking-wider shadow-[0_0_12px_rgba(34,197,94,0.2)] transition flex items-center justify-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                ОПЛАТИТЬ 10,000 USDT И СОЗДАТЬ ПУЛ
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

