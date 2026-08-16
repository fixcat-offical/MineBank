import { useState, useEffect, FormEvent } from 'react';
import {
  Wallet,
  Copy,
  Check,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Cpu,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock,
  TrendingUp,
  Flame
} from 'lucide-react';
import { UserAccount, CoinSymbol, MiningRig, MarketPrice } from '../types';
import { COIN_MINING_CONFIG } from '../data/marketData';
import { CoinIcon } from './CustomIcons';

interface CryptoWalletViewProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  allRigs: MiningRig[];
  marketPrices: MarketPrice[];
  onSendCrypto: (coin: CoinSymbol, targetAddress: string, amount: number) => boolean;
}

export const COIN_DETAILS: Record<
  CoinSymbol,
  { name: string; symbol: CoinSymbol; bgGradient: string; network: string; decimals: number }
> = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    bgGradient: 'from-amber-600 to-orange-700',
    network: 'Bitcoin SegWit (Native)',
    decimals: 8,
  },
  ETC: {
    name: 'Ethereum Classic',
    symbol: 'ETC',
    bgGradient: 'from-blue-600 to-indigo-800',
    network: 'Ethereum Classic Mainnet',
    decimals: 6,
  },
  DOGE: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    bgGradient: 'from-yellow-500 to-amber-600',
    network: 'Dogecoin Core Network',
    decimals: 4,
  },
  HAMSTER: {
    name: 'Hamster Kombat',
    symbol: 'HAMSTER',
    bgGradient: 'from-amber-500 to-red-600',
    network: 'TON Jetton / HMSTR Protocol',
    decimals: 2,
  },
  TON: {
    name: 'Toncoin',
    symbol: 'TON',
    bgGradient: 'from-sky-500 to-blue-700',
    network: 'The Open Network (TON)',
    decimals: 4,
  },
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
    bgGradient: 'from-emerald-600 to-teal-800',
    network: 'TRC-20 / ERC-20 Tether',
    decimals: 2,
  },
};

export function CryptoWalletView({
  currentUser,
  allUsers,
  allRigs,
  marketPrices,
  onSendCrypto,
}: CryptoWalletViewProps) {
  const [copiedCoin, setCopiedCoin] = useState<CoinSymbol | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<CoinSymbol>('BTC');

  // Send Crypto Modal State
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendCoin, setSendCoin] = useState<CoinSymbol>('BTC');
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live Mining Countdown (60s tick timer)
  const [secondsUntilPayout, setSecondsUntilPayout] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      const sec = 60 - (Math.floor(Date.now() / 1000) % 60);
      setSecondsUntilPayout(sec);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyAddress = (coin: CoinSymbol) => {
    navigator.clipboard.writeText(currentUser.cryptoAddresses[coin]);
    setCopiedCoin(coin);
    setTimeout(() => setCopiedCoin(null), 2000);
  };

  // Find all active rigs that are mining to ANY of this user's addresses
  const userAddressesList = Object.values(currentUser.cryptoAddresses);
  const activeWorkers = allRigs.filter(
    (rig) => rig.status === 'mining' && userAddressesList.includes(rig.targetWalletAddress)
  );

  const totalWorkersHashrate = activeWorkers.reduce((acc, r) => acc + r.totalHashrate, 0);

  // Total Portfolio Value in USDT
  const totalPortfolioUSDT = Object.entries(currentUser.cryptoBalances).reduce((acc, [coin, bal]) => {
    const price = marketPrices.find((m) => m.coin === coin)?.priceUSDT || 1;
    return acc + bal * price;
  }, 0);

  const handleSendSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSendStatus(null);
    const amt = parseFloat(sendAmount);
    if (isNaN(amt) || amt <= 0) {
      setSendStatus({ type: 'error', message: 'Введите корректную сумму.' });
      return;
    }
    const currentBal = currentUser.cryptoBalances[sendCoin] || 0;
    if (amt > currentBal) {
      setSendStatus({ type: 'error', message: `Недостаточно ${sendCoin}. Доступно: ${currentBal.toFixed(4)}` });
      return;
    }
    if (!sendAddress.trim()) {
      setSendStatus({ type: 'error', message: 'Введите адрес кошелька получателя.' });
      return;
    }

    const success = onSendCrypto(sendCoin, sendAddress.trim(), amt);
    if (success) {
      setSendStatus({ type: 'success', message: `Успешно отправлено ${amt} ${sendCoin} на адрес ${sendAddress}!` });
      setSendAmount('');
      setSendAddress('');
      setTimeout(() => setShowSendModal(false), 2000);
    } else {
      setSendStatus({ type: 'error', message: 'Ошибка при отправке. Проверьте адрес.' });
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 text-[#e0e0e0]">
      
      {/* High Density Portfolio Header */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-wider mb-0.5">
            <Wallet className="w-3.5 h-3.5" />
            Decentralized Multi-Chain Vault
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            Крипто Балансы & Активные Воркеры
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5 max-w-2xl">
            У каждого игрока уникальные аппаратные адреса блокчейн-сетей. Майните на личные кошельки или кошельки друзей по stratum-протоколу.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="bg-[#111114] border border-cyan-500/30 rounded-lg px-4 py-2.5 text-right">
            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Оценка Портфеля (USDT)</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono tracking-tight">
              ${totalPortfolioUSDT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <button
            onClick={() => setShowSendModal(true)}
            className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider transition flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
          >
            <Send className="w-3.5 h-3.5" />
            ОТПРАВИТЬ КРИПТУ
          </button>
        </div>
      </div>

      {/* ACTIVE MINING WORKERS SECTION */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d2d33] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono">Stratum Workers (Воркеры на кошелек)</h3>
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-mono font-bold border border-green-500/20">
                  ONLINE: {activeWorkers.length}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Фермы, добывающие криптовалюту напрямую на ваши адреса
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#111114] px-3 py-1.5 rounded-lg border border-[#2d2d33]">
            <div>
              <div className="text-[9px] text-zinc-500 font-mono uppercase">След. выплата</div>
              <div className="text-xs font-mono font-bold text-green-400 flex items-center gap-1">
                <Clock className="w-3 h-3 animate-spin" />
                {secondsUntilPayout} сек
              </div>
            </div>
            <div className="h-4 w-px bg-[#2d2d33]"></div>
            <div>
              <div className="text-[9px] text-zinc-500 font-mono uppercase">Входящий Хешрейт</div>
              <div className="text-xs font-mono font-bold text-white">
                {totalWorkersHashrate.toFixed(1)} MH/s
              </div>
            </div>
          </div>
        </div>

        {/* Worker Cards Grid */}
        {activeWorkers.length === 0 ? (
          <div className="text-center py-6">
            <Cpu className="w-8 h-8 text-zinc-600 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-zinc-300 font-mono">На ваш кошелек сейчас не майнит ни одна ферма</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              В «Сборке Фермы» или «Моих Майнерах» укажите ваш адрес для получения наград.
            </p>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-[#111114] border border-[#2d2d33] hover:border-green-500/40 rounded-lg p-3 shadow transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="font-mono font-bold text-xs text-white">{worker.name}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                    {worker.targetCoin}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] font-mono text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Владелец:</span>
                    <span className="font-bold text-zinc-200">{worker.ownerUsername}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Хешрейт:</span>
                    <span className="font-bold text-green-400">{worker.totalHashrate} MH/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Пул:</span>
                    <span className="text-cyan-400">{worker.poolId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Температура:</span>
                    <span className="text-zinc-300">{worker.temperature}°C</span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[#2d2d33] text-[9px] text-zinc-500 truncate font-mono">
                  Адрес: {worker.targetWalletAddress}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Crypto Currencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(COIN_DETAILS) as CoinSymbol[]).map((coin) => {
          const details = COIN_DETAILS[coin];
          const balance = currentUser.cryptoBalances[coin] || 0;
          const address = currentUser.cryptoAddresses[coin];
          const priceObj = marketPrices.find((m) => m.coin === coin);
          const price = priceObj?.priceUSDT || (coin === 'USDT' ? 1 : 0);
          const usdValue = balance * price;
          const isCopied = copiedCoin === coin;

          return (
            <div
              key={coin}
              className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl hover:border-zinc-700 transition flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${details.bgGradient} flex items-center justify-center text-white text-base font-bold shadow`}
                    >
                      <CoinIcon coin={coin} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono leading-tight">{details.name}</h3>
                      <span className="text-[10px] font-mono text-zinc-400">{details.symbol}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-[10px] text-zinc-500">Курс</div>
                    <div className="text-xs font-bold text-white">
                      ${price.toLocaleString('en-US', { minimumFractionDigits: coin === 'HAMSTER' ? 5 : 2 })}
                    </div>
                    {priceObj && (
                      <span className={`text-[10px] font-bold ${priceObj.change24h >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                        {priceObj.change24h >= 0 ? `+${priceObj.change24h}%` : `${priceObj.change24h}%`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Balance */}
                <div className="bg-[#111114] rounded-lg p-3 border border-[#2d2d33] mb-3 font-mono">
                  <div className="text-[10px] text-zinc-500 uppercase">Баланс</div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: details.decimals })}{' '}
                    <span className="text-xs text-zinc-400 font-normal">{details.symbol}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    ≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                  </div>
                </div>

                {/* Realistic Unique Crypto Address */}
                <div>
                  <div className="text-[9px] uppercase font-mono font-bold text-zinc-500 mb-1">
                    Адрес кошелька ({details.network})
                  </div>
                  <div
                    onClick={() => handleCopyAddress(coin)}
                    className="flex items-center justify-between p-2 rounded bg-[#111114] border border-[#2d2d33] hover:border-green-500/40 transition cursor-pointer text-xs font-mono text-zinc-300"
                  >
                    <span className="truncate mr-2 text-[10px] select-all">{address}</span>
                    <div className="text-zinc-400 hover:text-green-400 transition">
                      {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-3 border-t border-[#2d2d33] flex items-center gap-2">
                <button
                  onClick={() => {
                    setSendCoin(coin);
                    setShowSendModal(true);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-[#111114] hover:bg-zinc-800 border border-[#2d2d33] text-xs font-mono font-bold text-zinc-200 transition flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3 text-cyan-400" />
                  Отправить
                </button>
                <button
                  onClick={() => handleCopyAddress(coin)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#111114] hover:bg-zinc-800 border border-[#2d2d33] text-xs font-mono font-bold text-green-400 transition flex items-center justify-center gap-1"
                >
                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {isCopied ? 'Скопирован' : 'Копировать'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Send Crypto Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-5 max-w-lg w-full shadow-2xl relative font-mono">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#2d2d33]">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Перевод Криптовалюты</h3>
              </div>
              <button
                onClick={() => setShowSendModal(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Выберите монету</label>
                <select
                  value={sendCoin}
                  onChange={(e) => setSendCoin(e.target.value as CoinSymbol)}
                  className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
                >
                  {(Object.keys(COIN_DETAILS) as CoinSymbol[]).map((c) => (
                    <option key={c} value={c}>
                      {c} — {COIN_DETAILS[c].name} (Доступно: {currentUser.cryptoBalances[c] || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Адрес кошелька получателя
                </label>
                <input
                  type="text"
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  placeholder={`Введите ${sendCoin} адрес`}
                  className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              {/* Quick Online Players Address Selector */}
              {allUsers.filter((u) => u.id !== currentUser.id).length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">
                    Быстрый выбор адреса зарегистрированного игрока:
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                    {allUsers
                      .filter((u) => u.id !== currentUser.id)
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSendAddress(p.cryptoAddresses[sendCoin])}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#111114] text-zinc-300 hover:bg-cyan-500/10 hover:text-cyan-300 border border-[#2d2d33] transition"
                        >
                          {p.avatar} {p.username}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Сумма ({sendCoin})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setSendAmount((currentUser.cryptoBalances[sendCoin] || 0).toString())}
                    className="absolute right-1.5 top-1.5 px-2 py-0.5 text-[9px] font-bold text-cyan-400 bg-cyan-500/10 rounded border border-cyan-500/20 hover:bg-cyan-500/20"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {sendStatus && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-mono font-bold ${
                    sendStatus.type === 'success'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {sendStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
              >
                <Send className="w-3.5 h-3.5" />
                ПОДТВЕРДИТЬ ТРАНЗАКЦИЮ
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
