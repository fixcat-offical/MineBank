import { useState, FormEvent } from 'react';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCcw,
  Sparkles,
  Activity,
  Check,
  Zap,
  BarChart2,
  DollarSign
} from 'lucide-react';
import { MarketPrice, CoinSymbol, UserAccount } from '../types';
import { COIN_DETAILS } from './CryptoWalletView';

interface CryptoExchangeViewProps {
  currentUser: UserAccount;
  marketPrices: MarketPrice[];
  onTrade: (
    action: 'BUY' | 'SELL',
    coin: CoinSymbol,
    coinAmount: number,
    totalUSDT: number
  ) => boolean;
}

export function CryptoExchangeView({
  currentUser,
  marketPrices,
  onTrade,
}: CryptoExchangeViewProps) {
  const [selectedCoin, setSelectedCoin] = useState<CoinSymbol>('BTC');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [inputAmount, setInputAmount] = useState('');
  const [tradeStatus, setTradeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentMarket = marketPrices.find((m) => m.coin === selectedCoin) || marketPrices[0];
  const coinPrice = currentMarket.priceUSDT;
  const userCoinBalance = currentUser.cryptoBalances[selectedCoin] || 0;
  const userUSDTBalance = currentUser.cryptoBalances.USDT || 0;

  const parsedAmount = parseFloat(inputAmount) || 0;
  const calculatedUSDT = parsedAmount * coinPrice;

  const handlePercentage = (pct: number) => {
    if (tradeType === 'BUY') {
      const maxUSDT = userUSDTBalance * (pct / 100);
      const coinAmt = maxUSDT / coinPrice;
      setInputAmount(coinAmt.toFixed(selectedCoin === 'HAMSTER' ? 2 : 6));
    } else {
      const coinAmt = userCoinBalance * (pct / 100);
      setInputAmount(coinAmt.toFixed(selectedCoin === 'HAMSTER' ? 2 : 6));
    }
  };

  const handleExecuteTrade = (e: FormEvent) => {
    e.preventDefault();
    setTradeStatus(null);

    if (parsedAmount <= 0) {
      setTradeStatus({ type: 'error', message: 'Введите корректный объем сделки.' });
      return;
    }

    if (tradeType === 'BUY' && calculatedUSDT > userUSDTBalance) {
      setTradeStatus({
        type: 'error',
        message: `Недостаточно USDT для покупки. Требуется: ${calculatedUSDT.toFixed(2)} USDT, доступно: ${userUSDTBalance.toFixed(2)} USDT`,
      });
      return;
    }

    if (tradeType === 'SELL' && parsedAmount > userCoinBalance) {
      setTradeStatus({
        type: 'error',
        message: `Недостаточно ${selectedCoin} для продажи. Доступно: ${userCoinBalance.toFixed(6)} ${selectedCoin}`,
      });
      return;
    }

    const success = onTrade(tradeType, selectedCoin, parsedAmount, calculatedUSDT);
    if (success) {
      setTradeStatus({
        type: 'success',
        message: tradeType === 'BUY'
          ? `Успешно куплено ${parsedAmount} ${selectedCoin} за ${calculatedUSDT.toFixed(2)} USDT!`
          : `Успешно продано ${parsedAmount} ${selectedCoin} за +${calculatedUSDT.toFixed(2)} USDT!`,
      });
      setInputAmount('');
    } else {
      setTradeStatus({ type: 'error', message: 'Ошибка при исполнении ордера.' });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950/40 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <TrendingUp className="w-4 h-4" />
              Торговая Спот Биржа
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Криптобиржа & Спот Торговля к USDT
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Торгуйте намайненными Bitcoin, Ethereum Classic, Dogecoin, Hamster Kombat и Toncoin по реальным рыночным ценам без задержек.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl px-6 py-4 text-right">
            <div className="text-xs uppercase font-medium text-slate-400">Доступно USDT для торгов</div>
            <div className="text-2xl font-black text-cyan-400 tracking-tight mt-0.5">
              ${userUSDTBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₮
            </div>
          </div>
        </div>
      </div>

      {/* Markets Ticker Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {marketPrices.filter((m) => m.coin !== 'USDT').map((item) => {
          const isSelected = selectedCoin === item.coin;
          return (
            <div
              key={item.coin}
              onClick={() => setSelectedCoin(item.coin)}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-amber-500/80 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-white">{item.coin}/USDT</span>
                <span className={`text-[11px] font-bold ${item.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.change24h >= 0 ? `+${item.change24h}%` : `${item.change24h}%`}
                </span>
              </div>
              <div className="text-sm font-black font-mono text-white mt-1">
                ${item.priceUSDT.toLocaleString('en-US', { minimumFractionDigits: item.coin === 'HAMSTER' ? 5 : 2 })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Terminal Grid: Chart / Orderbook (Left) + Order Placement Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Price Sparkline & Order Book */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
                  {COIN_DETAILS[selectedCoin]?.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedCoin} / USDT</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span>24h High: <span className="font-mono text-slate-200">${currentMarket.high24h}</span></span>
                    <span>24h Low: <span className="font-mono text-slate-200">${currentMarket.low24h}</span></span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Текущая цена</div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  ${currentMarket.priceUSDT.toLocaleString('en-US', { minimumFractionDigits: selectedCoin === 'HAMSTER' ? 5 : 2 })}
                </div>
              </div>
            </div>

            {/* Price Sparkline Visualization */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 mb-6">
              <div className="text-[11px] font-semibold text-slate-400 mb-2">График цены (Последние тики)</div>
              <div className="h-32 flex items-end gap-2 pt-4">
                {currentMarket.history.map((val, idx) => {
                  const min = Math.min(...currentMarket.history);
                  const max = Math.max(...currentMarket.history);
                  const range = max - min || 1;
                  const heightPercent = Math.max(15, Math.min(100, ((val - min) / range) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-cyan-600 to-amber-400 group-hover:brightness-125 transition"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                      <div className="text-[9px] font-mono text-slate-500 group-hover:text-amber-300">
                        {idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Live Order Book */}
            <div>
              <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Книга Ордеров (Order Book)
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                {/* Asks (Sell) */}
                <div className="space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Ордера на продажу</div>
                  {[1.008, 1.005, 1.002].map((mult, idx) => (
                    <div key={idx} className="flex justify-between text-rose-400 bg-rose-950/20 px-2 py-1 rounded">
                      <span>${(coinPrice * mult).toFixed(selectedCoin === 'HAMSTER' ? 5 : 2)}</span>
                      <span className="text-slate-400">{(Math.random() * 2 + 0.5).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Bids (Buy) */}
                <div className="space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Ордера на покупку</div>
                  {[0.998, 0.995, 0.992].map((mult, idx) => (
                    <div key={idx} className="flex justify-between text-emerald-400 bg-emerald-950/20 px-2 py-1 rounded">
                      <span>${(coinPrice * mult).toFixed(selectedCoin === 'HAMSTER' ? 5 : 2)}</span>
                      <span className="text-slate-400">{(Math.random() * 2 + 0.5).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Instant Buy / Sell Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            
            {/* Trade Type Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2.5 rounded-xl font-bold text-xs transition ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Купить {selectedCoin}
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2.5 rounded-xl font-bold text-xs transition ${
                  tradeType === 'SELL'
                    ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Продать {selectedCoin}
              </button>
            </div>

            <form onSubmit={handleExecuteTrade} className="space-y-4">
              {/* Balances summary */}
              <div className="flex justify-between text-xs text-slate-400 px-1">
                <span>Баланс USDT: <strong className="text-white font-mono">{userUSDTBalance.toFixed(2)} ₮</strong></span>
                <span>Баланс {selectedCoin}: <strong className="text-white font-mono">{userCoinBalance.toFixed(4)}</strong></span>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Количество {selectedCoin}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3.5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono font-bold"
                    required
                  />
                  <span className="absolute right-3 top-3 text-xs text-slate-400 font-bold">
                    {selectedCoin}
                  </span>
                </div>
              </div>

              {/* Percentage Presets */}
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentage(pct)}
                    className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 transition"
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              {/* USDT Total Estimation */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Итого в USDT:</span>
                <span className="font-mono font-black text-amber-400 text-sm">
                  ${calculatedUSDT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                </span>
              </div>

              {tradeStatus && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    tradeStatus.type === 'success'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950/60 text-rose-300 border border-rose-800'
                  }`}
                >
                  {tradeStatus.message}
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3.5 rounded-2xl font-black text-xs tracking-wider shadow-lg transition flex items-center justify-center gap-2 ${
                  tradeType === 'BUY'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20 hover:brightness-110'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 text-slate-950 shadow-rose-500/20 hover:brightness-110'
                }`}
              >
                {tradeType === 'BUY' ? `КУПИТЬ ${selectedCoin}` : `ПРОДАТЬ ${selectedCoin}`}
              </button>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
