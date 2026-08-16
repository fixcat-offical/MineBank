import { useState, FormEvent } from 'react';
import {
  CreditCard,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Copy,
  Check,
  Eye,
  EyeOff,
  RotateCw,
  RefreshCcw,
  Sparkles,
  Building,
  History,
  TrendingUp,
  Landmark,
  Key,
  Download,
  Lock,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { UserAccount, TransactionRecord } from '../types';

interface BankViewProps {
  currentUser: UserAccount;
  onSendUSD: (recipientCardOrName: string, amount: number, note: string) => boolean;
  onConvertUsdUsdt: (amount: number, direction: 'usd_to_usdt' | 'usdt_to_usd') => boolean;
  onUpdateCardPin?: (newPin: string) => void;
  onTopUpFromOtherCard?: (targetCardNumber: string, targetPin: string, amount: number) => { success: boolean; message: string };
  initialTopUpCardNumber?: string;
  initialTopUpPin?: string;
  transactions: TransactionRecord[];
  allUsers: UserAccount[];
}

export function BankView({
  currentUser,
  onSendUSD,
  onConvertUsdUsdt,
  onUpdateCardPin,
  onTopUpFromOtherCard,
  initialTopUpCardNumber,
  initialTopUpPin,
  transactions,
  allUsers,
}: BankViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFullCard, setShowFullCard] = useState(true);
  const [copiedCard, setCopiedCard] = useState(false);

  // PIN Code Management
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinStatus, setPinStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Top Up From Other Card Form
  const [showTopUpModal, setShowTopUpModal] = useState(Boolean(initialTopUpCardNumber));
  const [topUpCardNumber, setTopUpCardNumber] = useState(initialTopUpCardNumber || '');
  const [topUpPin, setTopUpPin] = useState(initialTopUpPin || '');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpStatus, setTopUpStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Transfer Form State
  const [recipientInput, setRecipientInput] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [transferStatus, setTransferStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Quick USDT Swap Modal / Form
  const [swapAmount, setSwapAmount] = useState('');
  const [swapDirection, setSwapDirection] = useState<'usd_to_usdt' | 'usdt_to_usd'>('usd_to_usdt');
  const [swapStatus, setSwapStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Anti-abuse: transfers are unlocked only after peak balance hits $15,000
  const peakBalance = Math.max(currentUser.maxBalanceReachedUSD || 0, currentUser.bankBalanceUSD);
  const isTransferUnlocked = peakBalance >= 15000;

  const handleCopyCard = () => {
    navigator.clipboard.writeText(currentUser.bankCard.cardNumber);
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const handleTransferSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTransferStatus(null);

    if (!isTransferUnlocked) {
      setTransferStatus({
        type: 'error',
        message: 'Переводы заблокированы: для разблокировки необходимо достичь баланса $15,000 хотя бы один раз.',
      });
      return;
    }

    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      setTransferStatus({ type: 'error', message: 'Введите корректную сумму перевода.' });
      return;
    }
    if (amt > currentUser.bankBalanceUSD) {
      setTransferStatus({ type: 'error', message: 'Недостаточно средств на банковском балансе.' });
      return;
    }
    if (!recipientInput.trim()) {
      setTransferStatus({ type: 'error', message: 'Укажите номер карты или никнейм получателя.' });
      return;
    }

    const success = onSendUSD(recipientInput.trim(), amt, transferNote || 'Перевод между пользователями');
    if (success) {
      setTransferStatus({ type: 'success', message: `Успешно переведено $${amt.toFixed(2)} на ${recipientInput}!` });
      setTransferAmount('');
      setRecipientInput('');
      setTransferNote('');
    } else {
      setTransferStatus({ type: 'error', message: 'Получатель с таким номером карты или ником не найден.' });
    }
  };

  const handlePinSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPinStatus(null);
    const cleanPin = newPinInput.trim();
    if (!/^\d{4}$/.exec(cleanPin)) {
      setPinStatus({ type: 'error', message: 'PIN-код должен состоять ровно из 4 цифр!' });
      return;
    }
    if (onUpdateCardPin) {
      onUpdateCardPin(cleanPin);
      setPinStatus({ type: 'success', message: 'PIN-код карты успешно изменен! Старый PIN недействителен.' });
      setNewPinInput('');
    }
  };

  const handleTopUpSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTopUpStatus(null);

    const amt = parseFloat(topUpAmount);
    if (isNaN(amt) || amt <= 0) {
      setTopUpStatus({ type: 'error', message: 'Введите корректную сумму.' });
      return;
    }
    if (amt > 50000) {
      setTopUpStatus({ type: 'error', message: 'Максимальное списание за 1 раз — $50,000 USD!' });
      return;
    }
    if (!topUpCardNumber.trim() || !topUpPin.trim()) {
      setTopUpStatus({ type: 'error', message: 'Укажите номер чужой карты и ее PIN-код.' });
      return;
    }

    if (onTopUpFromOtherCard) {
      const res = onTopUpFromOtherCard(topUpCardNumber.trim(), topUpPin.trim(), amt);
      if (res.success) {
        setTopUpStatus({ type: 'success', message: res.message });
        setTopUpAmount('');
        setTopUpCardNumber('');
        setTopUpPin('');
      } else {
        setTopUpStatus({ type: 'error', message: res.message });
      }
    }
  };

  const handleSwapSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSwapStatus(null);
    const amt = parseFloat(swapAmount);
    if (isNaN(amt) || amt <= 0) {
      setSwapStatus({ type: 'error', message: 'Введите корректную сумму обмена.' });
      return;
    }

    const success = onConvertUsdUsdt(amt, swapDirection);
    if (success) {
      setSwapStatus({
        type: 'success',
        message: swapDirection === 'usd_to_usdt'
          ? `Сконвертировано $${amt.toFixed(2)} USD в ${amt.toFixed(2)} USDT!`
          : `Выведено ${amt.toFixed(2)} USDT в $${amt.toFixed(2)} USD на карту!`
      });
      setSwapAmount('');
    } else {
      setSwapStatus({ type: 'error', message: 'Недостаточно средств для операции обмена.' });
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 text-[#e0e0e0]">
      
      {/* High Density Header Bar */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-green-400 font-mono text-[10px] uppercase tracking-wider mb-0.5">
            <Landmark className="w-3.5 h-3.5" />
            Apex Global Central Reserve
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            Банковский Аккаунт & Премиальная Дебетовая Карта
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5 max-w-2xl">
            Бесплатная карта <span className="text-white font-semibold">Titanium Mining Tier</span> с балансом <span className="text-green-400 font-mono font-bold">$10,000.00 USD</span>. Мгновенные переводы, вывод крипты и финансирование ферм.
          </p>
        </div>

        <div className="bg-[#111114] border border-green-500/30 rounded-lg px-4 py-2.5 text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Общий Баланс USD</div>
          <div className="text-2xl sm:text-3xl font-black text-green-400 font-mono tracking-tight">
            ${currentUser.bankBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-green-500 flex items-center justify-end gap-1 mt-0.5 font-mono">
            <ShieldCheck className="w-3 h-3" />
            FDIC / MINEX INSURED
          </div>
        </div>
      </div>

      {/* Main High Density Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Interactive 3D Bank Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                Physical Smart Card
              </span>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-1 text-[11px] text-green-400 hover:text-green-300 bg-[#151518] px-2 py-1 rounded border border-[#2d2d33] transition font-mono"
              >
                <RotateCw className="w-3 h-3" />
                <span>{isFlipped ? 'Лицевая сторона' : 'Оборотная сторона (CVV)'}</span>
              </button>
            </div>

            {/* Realistic Credit Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full aspect-[1.586/1] cursor-pointer perspective-1000 select-none group"
            >
              <div
                className={`w-full h-full duration-500 transform-style-3d transition-transform ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Card FRONT */}
                <div className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-zinc-900 via-[#151518] to-black border border-green-500/40 shadow-2xl backface-hidden flex flex-col justify-between overflow-hidden">
                  
                  {/* Subtle Grid */}
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

                  {/* Card Top: Bank Name & Contactless */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 font-mono font-black text-xs shadow">
                        AGB
                      </div>
                      <span className="font-mono font-bold text-xs text-white tracking-wider">
                        APEX GLOBAL BANK
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase font-mono font-bold text-green-400 tracking-widest bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                        {currentUser.bankCard.tier}
                      </span>
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    </div>
                  </div>

                  {/* Card Middle: EMV Golden Chip */}
                  <div className="flex items-center justify-between relative z-10 my-1">
                    <div className="w-10 h-7 rounded bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 border border-yellow-200 shadow-md flex items-center justify-center p-1">
                      <div className="w-full h-full border border-amber-800/40 rounded flex flex-col justify-between py-0.5 px-1 opacity-80">
                        <div className="border-t border-amber-900/60"></div>
                        <div className="border-t border-amber-900/60"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-black/80 border border-amber-500/60 rounded px-2 py-0.5 shadow">
                        <Key className="w-3 h-3 text-amber-400" />
                        <span className="text-[9px] text-zinc-400 font-mono uppercase">PIN:</span>
                        <span className="text-xs font-mono font-black text-amber-400 tracking-widest">{currentUser.bankCard.pin}</span>
                      </div>
                      <span className="text-xl font-bold text-zinc-600 font-mono italic">
                        DEBIT
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Number, Holder & Expiry */}
                  <div className="relative z-10 space-y-1.5">
                    <div className="font-mono text-base sm:text-lg font-bold tracking-widest text-zinc-100">
                      {currentUser.bankCard.cardNumber}
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-300">
                      <div>
                        <div className="text-[8px] uppercase font-bold text-zinc-500 font-mono">Card Holder</div>
                        <div className="font-mono font-bold text-[11px] tracking-wider text-white">{currentUser.bankCard.cardholderName}</div>
                      </div>
                      <div>
                        <div className="text-[8px] uppercase font-bold text-zinc-500 font-mono">Expires</div>
                        <div className="font-mono font-bold text-[11px] text-white">{currentUser.bankCard.expiryDate}</div>
                      </div>
                      <div className="w-8 h-5 bg-gradient-to-r from-green-500 to-emerald-700 rounded opacity-80 shadow"></div>
                    </div>
                  </div>

                </div>

                {/* Card BACK (CVV & Magnetic Stripe) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-[#111114] via-[#151518] to-black border border-[#2d2d33] shadow-2xl backface-hidden rotate-y-180 flex flex-col justify-between overflow-hidden">
                  
                  {/* Magnetic Stripe */}
                  <div className="-mx-5 -mt-1 h-10 bg-black border-y border-zinc-800"></div>

                  {/* Signature bar & CVV */}
                  <div className="space-y-1">
                    <div className="text-[9px] text-zinc-400 font-mono uppercase">Секретный Код Безопасности (CVV)</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-8 bg-zinc-200 rounded flex items-center justify-end px-3">
                        <span className="font-mono font-black text-zinc-950 text-xs tracking-widest">
                          {currentUser.bankCard.cvv}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        PIN: {currentUser.bankCard.pin}
                      </div>
                    </div>
                  </div>

                  {/* Security Disclaimer */}
                  <div className="text-[8px] text-zinc-500 font-mono leading-tight">
                    Официальное расчетное средство внутри симулятора Apex Global Mining. Никому не передавайте CVV код.
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Action Buttons Below Card */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleCopyCard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151518] border border-[#2d2d33] hover:border-green-500/40 text-xs font-mono font-bold text-zinc-300 transition"
              >
                {copiedCard ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-green-400" />}
                <span>{copiedCard ? 'СКОПИРОВАНО' : 'СКОПИРОВАТЬ НОМЕР'}</span>
              </button>

              <button
                onClick={() => {
                  setShowPinModal(!showPinModal);
                  setShowTopUpModal(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition ${
                  showPinModal
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-[#151518] border-[#2d2d33] hover:border-amber-500/40 text-amber-400'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>СМЕНИТЬ PIN</span>
              </button>

              <button
                onClick={() => {
                  setShowTopUpModal(!showTopUpModal);
                  setShowPinModal(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition ${
                  showTopUpModal
                    ? 'bg-green-500/20 border-green-500/50 text-green-300'
                    : 'bg-[#151518] border-[#2d2d33] hover:border-green-500/40 text-green-400'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>ПОПОЛНИТЬ С ДРУГОЙ КАРТЫ</span>
              </button>
            </div>

            {/* Change PIN Form */}
            {showPinModal && (
              <div className="mt-3 w-full bg-[#151518] border border-amber-500/40 rounded-xl p-4 shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-[#2d2d33] pb-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <Key className="w-4 h-4" />
                    <span>Смена PIN-кода карты</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Текущий: {currentUser.bankCard.pin}</span>
                </div>

                <form onSubmit={handlePinSubmit} className="space-y-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Новый 4-значный PIN-код
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="Например: 8899"
                      className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono tracking-widest text-center text-base"
                      required
                    />
                  </div>

                  {pinStatus && (
                    <div
                      className={`p-2 rounded text-[11px] font-bold ${
                        pinStatus.type === 'success'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {pinStatus.message}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition"
                    >
                      СОХРАНИТЬ НОВЫЙ PIN
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPinModal(false)}
                      className="px-3 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-lg hover:bg-zinc-700"
                    >
                      Закрыть
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Top Up From Other Card Form */}
            {showTopUpModal && (
              <div className="mt-3 w-full bg-[#151518] border border-green-500/40 rounded-xl p-4 shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-[#2d2d33] pb-2">
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                    <Download className="w-4 h-4" />
                    <span>Пополнение с другой карты (Макс $50,000)</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                    PIN REQUIRED
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Введите номер карты и PIN-код владельца. Вы можете списать до <span className="text-green-400 font-bold">$50,000 USD</span> за одну операцию.
                </p>

                <form onSubmit={handleTopUpSubmit} className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Номер чужой карты
                    </label>
                    <input
                      type="text"
                      value={topUpCardNumber}
                      onChange={(e) => setTopUpCardNumber(e.target.value)}
                      placeholder="4276 8840 9102 3341"
                      className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        PIN-код карты (4 цифры)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={topUpPin}
                        onChange={(e) => setTopUpPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-mono text-center tracking-widest"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        Сумма USD (до $50,000)
                      </label>
                      <input
                        type="number"
                        max={50000}
                        step="any"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        placeholder="50000"
                        className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-green-400 font-bold placeholder-zinc-600 focus:outline-none focus:border-green-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  {topUpStatus && (
                    <div
                      className={`p-2 rounded text-[11px] font-bold ${
                        topUpStatus.type === 'success'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {topUpStatus.message}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-lg bg-green-500 text-black font-bold text-xs hover:bg-green-400 transition"
                    >
                      СПИСАТЬ И ПОПОЛНИТЬ
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTopUpModal(false)}
                      className="px-3 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-lg hover:bg-zinc-700"
                    >
                      Закрыть
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Transfer & USDT Exchange Tabs */}
        <div className="lg:col-span-7 space-y-4">
          
            {/* Action 1: Send Money by Card or Nickname */}
          <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded border flex items-center justify-center ${
                  isTransferUnlocked
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">Перевод на другую карту (P2P USD)</h3>
                  <p className="text-[11px] text-zinc-400">Мгновенный перевод по номеру карты или никнейму</p>
                </div>
              </div>

              {!isTransferUnlocked && (
                <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ЗАБЛОКИРОВАНО ДО $15,000
                </div>
              )}
            </div>

            {!isTransferUnlocked ? (
              <div className="p-4 rounded-xl bg-[#111114] border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Защита от накрутки и перелива стартовых бонусов
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                  Переводы другим игрокам станут доступны, как только ваш баланс хотя бы один раз превысит <strong className="text-white">$15,000 USD</strong>.
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Текущий пиковый баланс:</span>
                    <span className="text-amber-400 font-bold">${peakBalance.toLocaleString()} / $15,000 USD</span>
                  </div>
                  <div className="w-full h-2 bg-[#151518] rounded-full overflow-hidden border border-[#2d2d33]">
                    <div
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (peakBalance / 15000) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 italic">
                    💡 Совет: Запустите майнинг-ферму или прокачайте первый бизнес, чтобы заработать первые $5,000 прибыли и разблокировать переводы!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTransferSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-zinc-400 mb-1">
                      Карта или Никнейм получателя
                    </label>
                    <input
                      type="text"
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      placeholder="4276 8810 4921 5532 или Alex_Miner"
                      className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-zinc-400 mb-1">
                      Сумма перевода ($ USD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="100.00"
                        className="w-full pl-6 pr-14 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-mono font-bold"
                        required
                      />
                      <span className="absolute left-2.5 top-2 text-xs text-zinc-500 font-mono font-bold">$</span>
                      <button
                        type="button"
                        onClick={() => setTransferAmount(currentUser.bankBalanceUSD.toString())}
                        className="absolute right-1.5 top-1.5 px-2 py-0.5 text-[9px] font-bold font-mono text-green-400 bg-green-500/10 rounded border border-green-500/20 hover:bg-green-500/20"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Online Players Shortcut */}
                {allUsers.filter((u) => u.id !== currentUser.id).length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono uppercase font-bold text-zinc-500 mb-1">
                      Быстрый выбор зарегистрированных игроков:
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                      {allUsers
                        .filter((u) => u.id !== currentUser.id)
                        .map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setRecipientInput(p.bankCard.cardNumber)}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#111114] text-zinc-300 hover:bg-green-500/10 hover:text-green-300 border border-[#2d2d33] hover:border-green-500/30 transition flex items-center gap-1 font-mono"
                          >
                            <span>{p.avatar}</span>
                            <span>{p.username}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    placeholder="Комментарий к транзакции..."
                    className="w-full px-3 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-mono"
                  />
                </div>

                {transferStatus && (
                  <div
                    className={`p-2.5 rounded-lg text-xs font-mono font-bold ${
                      transferStatus.type === 'success'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {transferStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-mono font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(34,197,94,0.2)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  ОТПРАВИТЬ СРЕДСТВА БЕЗ КОМИССИИ
                </button>
              </form>
            )}
          </div>

          {/* Action 2: Convert USDT <-> Bank USD */}
          <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <RefreshCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">Вывод / Пополнение USDT (1:1 USD)</h3>
                  <p className="text-[11px] text-zinc-400">Мгновенный обмен между картой и криптокошельком</p>
                </div>
              </div>

              <div className="flex bg-[#111114] p-0.5 rounded-lg border border-[#2d2d33]">
                <button
                  type="button"
                  onClick={() => setSwapDirection('usd_to_usdt')}
                  className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded transition ${
                    swapDirection === 'usd_to_usdt'
                      ? 'bg-blue-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  USD → USDT
                </button>
                <button
                  type="button"
                  onClick={() => setSwapDirection('usdt_to_usd')}
                  className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded transition ${
                    swapDirection === 'usdt_to_usd'
                      ? 'bg-green-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  USDT → USD
                </button>
              </div>
            </div>

            <form onSubmit={handleSwapSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-zinc-400 mb-1">
                    {swapDirection === 'usd_to_usdt' ? 'Списание (USD с карты)' : 'Списание (USDT с кошелька)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      placeholder="1000.00"
                      className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono font-bold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const maxVal = swapDirection === 'usd_to_usdt'
                          ? currentUser.bankBalanceUSD
                          : currentUser.cryptoBalances.USDT;
                        setSwapAmount(maxVal.toString());
                      }}
                      className="absolute right-1.5 top-1.5 px-2 py-0.5 text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 rounded border border-blue-500/20 hover:bg-blue-500/20"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-zinc-400 mb-1">
                    {swapDirection === 'usd_to_usdt' ? 'Зачисление (USDT в кошелек)' : 'Зачисление (USD на карту)'}
                  </label>
                  <div className="px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-green-400 font-mono font-bold flex items-center justify-between">
                    <span>{swapAmount ? parseFloat(swapAmount).toFixed(2) : '0.00'}</span>
                    <span className="text-zinc-500 text-[10px]">КУРС 1.00 : 1.00</span>
                  </div>
                </div>
              </div>

              {swapStatus && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-mono font-bold ${
                    swapStatus.type === 'success'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {swapStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#22c55e15] hover:bg-[#22c55e25] text-green-400 border border-green-500/40 font-mono font-bold text-xs tracking-wider transition flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                {swapDirection === 'usd_to_usdt' ? 'КОНВЕРТИРОВАТЬ USD В USDT' : 'ВЫВЕСТИ USDT НА КАРТУ В USD'}
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Transaction History Log */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              Персональный Журнал Операций ({currentUser.username})
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Личные транзакции и выплаты</span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs font-mono">
            История операций пока пуста.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2d2d33] text-[10px] text-zinc-500 uppercase tracking-wider">
                  <th className="pb-2 font-bold">Время</th>
                  <th className="pb-2 font-bold">Тип</th>
                  <th className="pb-2 font-bold">Описание</th>
                  <th className="pb-2 font-bold text-right">Сумма</th>
                  <th className="pb-2 font-bold text-right">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2d33]">
                {transactions.slice(0, 15).map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-2 text-zinc-400 text-[11px]">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2 font-bold text-zinc-200">
                      {tx.type === 'suspicious_expense' ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Подозрительная трата
                        </span>
                      ) : tx.type === 'hacker_pc_purchase' ? (
                        <span className="text-amber-400 font-bold">Хакерский ПК</span>
                      ) : tx.type === 'bank_transfer' ? (
                        'Банковский перевод'
                      ) : tx.type === 'crypto_transfer' ? (
                        'Крипто перевод'
                      ) : tx.type === 'mining_payout' ? (
                        'Выплата майнинга'
                      ) : tx.type === 'pool_fee_income' ? (
                        'Начисление комиссии за пул'
                      ) : tx.type === 'business_income' ? (
                        'Доход бизнеса'
                      ) : tx.type === 'hardware_purchase' ? (
                        'Покупка железа'
                      ) : (
                        'Обмен валют'
                      )}
                    </td>
                    <td className="py-2 text-zinc-300 max-w-xs truncate">{tx.description}</td>
                    <td className={`py-2 text-right font-bold ${
                      tx.amount > 0 ? 'text-green-400' : 'text-rose-400'
                    }`}>
                      {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} {tx.currency}
                    </td>
                    <td className="py-2 text-right">
                      <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[9px] font-bold border border-green-500/20">
                        CONFIRMED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
