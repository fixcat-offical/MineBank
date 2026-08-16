import { useState, useEffect, FormEvent } from 'react';
import {
  Terminal,
  Cpu,
  Zap,
  Clock,
  ShieldAlert,
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { UserAccount, UserHackerPc, PlayerPublicProfile } from '../types';
import { HACKER_PC_TEMPLATES, HackerPcTemplate } from '../data/hackerPcData';

interface HackerPcViewProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onBuyHackerPc: (templateId: number) => { success: boolean; message: string };
  onStartBruteForce: (pcInstanceId: string, targetCardNumber: string, targetUsername: string) => { success: boolean; message: string };
  onRefreshUser: () => void;
  onNavigateToBankWithCard?: (cardNumber: string, pin: string) => void;
}

export function HackerPcView({
  currentUser,
  allUsers,
  onBuyHackerPc,
  onStartBruteForce,
  onRefreshUser,
  onNavigateToBankWithCard,
}: HackerPcViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'my_pcs' | 'store'>('my_pcs');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPinPcId, setCopiedPinPcId] = useState<string | null>(null);

  // Brute force target modal state
  const [selectedPcForTarget, setSelectedPcForTarget] = useState<UserHackerPc | null>(null);
  const [targetCardInput, setTargetCardInput] = useState('');
  const [targetUsernameInput, setTargetUsernameInput] = useState('');
  const [jobStatus, setJobStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Store purchase status
  const [storeStatus, setStoreStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live timer tick for progress calculation
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      onRefreshUser();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const myPcs = currentUser.hackerPcs || [];

  const handleBuy = (template: HackerPcTemplate) => {
    setStoreStatus(null);
    const res = onBuyHackerPc(template.id);
    if (res.success) {
      setStoreStatus({ type: 'success', message: res.message });
      setActiveSubTab('my_pcs');
    } else {
      setStoreStatus({ type: 'error', message: res.message });
    }
  };

  const handleStartBruteForceSubmit = (e: FormEvent) => {
    e.preventDefault();
    setJobStatus(null);

    if (!selectedPcForTarget) return;
    if (!targetCardInput.trim()) {
      setJobStatus({ type: 'error', message: 'Введите номер карты жертвы!' });
      return;
    }

    const res = onStartBruteForce(
      selectedPcForTarget.id,
      targetCardInput.trim(),
      targetUsernameInput.trim() || 'Пользователь'
    );

    if (res.success) {
      setJobStatus({ type: 'success', message: res.message });
      setSelectedPcForTarget(null);
      setTargetCardInput('');
      setTargetUsernameInput('');
    } else {
      setJobStatus({ type: 'error', message: res.message });
    }
  };

  const handleCopyPin = (pcId: string, pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPinPcId(pcId);
    setTimeout(() => setCopiedPinPcId(null), 2000);
  };

  const filteredTemplates = HACKER_PC_TEMPLATES.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.cpu.toLowerCase().includes(q) ||
      t.gpu.toLowerCase().includes(q) ||
      t.tierName.toLowerCase().includes(q)
    );
  });

  const otherPlayers = allUsers.filter((u) => u.id !== currentUser.id && !u.isBanned);

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 text-[#e0e0e0] font-mono">
      {/* Header Banner */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-green-400 font-mono text-[10px] uppercase tracking-wider mb-0.5">
            <Terminal className="w-3.5 h-3.5" />
            Cyber Intelligence & PIN Brute-force Array
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
            Хакерские ПК & Брутфорс Карт
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5 max-w-2xl">
            Покупайте высокопроизводительные хакерские станции для подбора PIN-кодов с чужих карт. Чем мощнее ПК (всего 60 моделей), тем быстрее подбирается PIN: от <span className="text-amber-400 font-bold">1 часа</span> до <span className="text-green-400 font-bold">5 секунд</span>!
          </p>
        </div>

        {/* SubTab Toggle */}
        <div className="flex bg-[#111114] p-1 rounded-lg border border-[#2d2d33] shrink-0">
          <button
            onClick={() => setActiveSubTab('my_pcs')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition flex items-center gap-1.5 ${
              activeSubTab === 'my_pcs'
                ? 'bg-green-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>МОИ ХАКЕР-ПК ({myPcs.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('store')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition flex items-center gap-1.5 ${
              activeSubTab === 'store'
                ? 'bg-green-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>МАГАЗИН ПК (60 МОДЕЛЕЙ)</span>
          </button>
        </div>
      </div>

      {storeStatus && (
        <div
          className={`p-3 rounded-xl border text-xs font-bold ${
            storeStatus.type === 'success'
              ? 'bg-green-500/10 text-green-400 border-green-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {storeStatus.message}
        </div>
      )}

      {/* VIEW 1: MY HACKER PCs */}
      {activeSubTab === 'my_pcs' && (
        <div className="space-y-4">
          {myPcs.length === 0 ? (
            <div className="text-center py-16 bg-[#151518] rounded-xl border border-[#2d2d33] p-6 shadow-xl">
              <Terminal className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">У вас пока нет хакерских станций</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Перейдите в магазин ПК и приобретите свою первую брутфорс-станцию для взлома PIN-кодов банковских карт!
              </p>
              <button
                onClick={() => setActiveSubTab('store')}
                className="mt-4 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold text-xs shadow transition"
              >
                Открыть магазин Хакерских ПК →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myPcs.map((pc) => {
                const isCracking = pc.status === 'cracking';
                const isCompleted = pc.status === 'completed';
                const isIdle = pc.status === 'idle';

                let progressPercent = 0;
                let remainingSeconds = pc.bruteForceSeconds;

                if (isCracking && pc.jobStartedAt) {
                  const elapsed = Math.max(0, (now - pc.jobStartedAt) / 1000);
                  progressPercent = Math.min(100, (elapsed / pc.bruteForceSeconds) * 100);
                  remainingSeconds = Math.max(0, pc.bruteForceSeconds - elapsed);
                }

                const formatTime = (secs: number) => {
                  const m = Math.floor(secs / 60);
                  const s = Math.floor(secs % 60);
                  const h = Math.floor(m / 60);
                  if (h > 0) {
                    return `${h} ч ${m % 60} мин ${s} сек`;
                  }
                  return `${m} мин ${s} сек`;
                };

                return (
                  <div
                    key={pc.id}
                    className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                            <Terminal className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">{pc.name}</h3>
                            <div className="text-[10px] text-zinc-400">
                              Скорость взлома: <span className="text-green-400 font-bold">{formatTime(pc.bruteForceSeconds)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isCracking
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                              : isCompleted
                              ? 'bg-green-500/10 text-green-400 border-green-500/30'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {isCracking ? 'ИДЕТ ВЗЛОМ' : isCompleted ? 'ВЗЛОМАНО' : 'ГОТОВ'}
                        </span>
                      </div>

                      {/* Specs Box */}
                      <div className="bg-[#111114] border border-[#2d2d33] rounded-lg p-2.5 space-y-1 text-[11px] mb-3">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Процессор:</span>
                          <span className="text-zinc-200 font-bold truncate max-w-[180px]">{pc.cpu}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Видеокарта:</span>
                          <span className="text-zinc-200 font-bold truncate max-w-[180px]">{pc.gpu}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Память:</span>
                          <span className="text-zinc-200 font-bold">{pc.ram}</span>
                        </div>
                      </div>

                      {/* Status State Details */}
                      {isCracking && (
                        <div className="bg-[#111114] border border-amber-500/30 rounded-lg p-3 space-y-2 mb-3">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-amber-400">Подбор PIN-кода...</span>
                            <span className="text-zinc-300">{progressPercent.toFixed(0)}%</span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>

                          <div className="text-[10px] text-zinc-400 space-y-0.5">
                            <div>
                              Цель: <span className="text-white font-bold">{pc.targetUsername}</span> ({pc.targetCardNumber})
                            </div>
                            <div>
                              Осталось времени: <span className="text-amber-400 font-bold">{formatTime(remainingSeconds)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        (() => {
                          const cleanTargetCard = pc.targetCardNumber?.replace(/\s+/g, '') || '';
                          const targetUserObj = allUsers.find(
                            (u) => u.bankCard.cardNumber.replace(/\s+/g, '') === cleanTargetCard
                          );
                          const activePin = targetUserObj ? targetUserObj.bankCard.pin : (pc.crackedPin || '0000');

                          return (
                            <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3 space-y-2 mb-3">
                              <div className="flex items-center justify-between text-xs font-bold text-green-400">
                                <span className="flex items-center gap-1">
                                  <Unlock className="w-4 h-4" /> PIN-КОД ВЗЛОМАН!
                                </span>
                                <span className="text-[10px] text-zinc-400">Успешно</span>
                              </div>

                              <div className="text-[11px] text-zinc-300">
                                Цель: <span className="text-white font-bold">{pc.targetUsername}</span> ({pc.targetCardNumber})
                              </div>

                              <div className="bg-[#111114] p-2 rounded border border-green-500/30 flex items-center justify-between">
                                <span className="text-xs text-zinc-400">Взломанный PIN:</span>
                                <span className="text-lg font-black text-green-400 tracking-widest">{activePin}</span>
                                <button
                                  onClick={() => handleCopyPin(pc.id, activePin)}
                                  className="p-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition"
                                  title="Скопировать PIN"
                                >
                                  {copiedPinPcId === pc.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          );
                        })()
                      )}
                    </div>

                    {/* Action Button */}
                    <div>
                      {isIdle && (
                        <button
                          onClick={() => {
                            setSelectedPcForTarget(pc);
                            setJobStatus(null);
                          }}
                          className="w-full py-2 bg-green-500 hover:bg-green-400 text-black font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(34,197,94,0.2)]"
                        >
                          <Play className="w-3.5 h-3.5" />
                          ЗАПУСТИТЬ БРУТФОРС КАРТЫ
                        </button>
                      )}

                      {isCompleted && (
                        (() => {
                          const cleanTargetCard = pc.targetCardNumber?.replace(/\s+/g, '') || '';
                          const targetUserObj = allUsers.find(
                            (u) => u.bankCard.cardNumber.replace(/\s+/g, '') === cleanTargetCard
                          );
                          const activePin = targetUserObj ? targetUserObj.bankCard.pin : (pc.crackedPin || '0000');

                          return (
                            <div className="flex gap-2">
                              {onNavigateToBankWithCard && pc.targetCardNumber && activePin && (
                                <button
                                  onClick={() => onNavigateToBankWithCard(pc.targetCardNumber!, activePin)}
                                  className="flex-1 py-2 bg-green-500 hover:bg-green-400 text-black font-bold text-xs rounded-lg transition flex items-center justify-center gap-1"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Списать $50k в банке
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedPcForTarget(pc);
                                  setJobStatus(null);
                                }}
                                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-lg transition"
                                title="Взломать другую карту"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })()
                      )}

                      {isCracking && (
                        <div className="text-center py-2 text-xs font-bold text-amber-400 bg-amber-500/10 rounded-lg border border-amber-500/20">
                          Идет активный подбор PIN-кода...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: HACKER PC STORE (60 MODELS) */}
      {activeSubTab === 'store' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-3 shadow-xl flex items-center gap-3">
            <Search className="w-4 h-4 text-zinc-500 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по 60 моделям ПК, процессорам (Threadripper, i9), видеокартам (RTX 4090)..."
              className="w-full bg-transparent border-none text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-zinc-500 hover:text-white px-2"
              >
                Очистить
              </button>
            )}
          </div>

          {/* Grid of 60 Models */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTemplates.map((template) => {
              const canAfford = currentUser.bankBalanceUSD >= template.priceUSD;

              const formatTime = (secs: number) => {
                if (secs >= 3600) return `${(secs / 3600).toFixed(1)} ч (3600 сек)`;
                if (secs >= 60) return `${Math.floor(secs / 60)} мин ${secs % 60} сек`;
                return `${secs} секунд`;
              };

              return (
                <div
                  key={template.id}
                  className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl flex flex-col justify-between hover:border-zinc-700 transition font-mono"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold">
                          Модель #{template.id}
                        </span>
                        <span className="text-[10px] text-zinc-400 uppercase">{template.tierName}</span>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          ${template.priceUSD.toLocaleString('en-US')} USD
                        </div>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2">{template.name}</h3>

                    {/* Speed Box */}
                    <div className="bg-[#111114] border border-amber-500/30 rounded-lg p-2.5 mb-3 flex items-center justify-between">
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> Скорость взлома PIN:
                      </span>
                      <span className="text-xs font-bold text-amber-400">
                        {formatTime(template.bruteForceSeconds)}
                      </span>
                    </div>

                    {/* Specs List */}
                    <div className="space-y-1.5 text-[11px] bg-[#111114] p-2.5 rounded-lg border border-[#2d2d33] mb-3">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Процессор:</span>
                        <span className="text-zinc-200 font-bold truncate max-w-[170px]">{template.cpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Видеокарта:</span>
                        <span className="text-zinc-200 font-bold truncate max-w-[170px]">{template.gpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">ОЗУ:</span>
                        <span className="text-zinc-200 font-bold">{template.ram}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuy(template)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                      canAfford
                        ? 'bg-green-500 hover:bg-green-400 text-black shadow'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {canAfford ? 'КУПИТЬ ХАКЕР-ПК' : 'НЕДОСТАТОЧНО СРЕДСТВ'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Target Card Selection Modal */}
      {selectedPcForTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151518] border border-green-500/40 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#2d2d33] pb-3">
              <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                <Terminal className="w-4 h-4" />
                <span>Запуск брутфорса на «{selectedPcForTarget.name}»</span>
              </div>
              <button
                onClick={() => setSelectedPcForTarget(null)}
                className="text-zinc-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Выбор целевой карты. Этот ПК подберёт PIN-код ровно за{' '}
              <span className="text-green-400 font-bold">
                {selectedPcForTarget.bruteForceSeconds >= 60
                  ? `${Math.floor(selectedPcForTarget.bruteForceSeconds / 60)} мин`
                  : `${selectedPcForTarget.bruteForceSeconds} сек`}
              </span>.
            </p>

            {/* Quick target selector from other players */}
            {otherPlayers.length > 0 && (
              <div>
                <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-1">
                  Быстрый выбор жертвы из игроков:
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {otherPlayers.map((player) => (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => {
                        setTargetCardInput(player.bankCard.cardNumber);
                        setTargetUsernameInput(player.username);
                      }}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between transition text-xs ${
                        targetCardInput === player.bankCard.cardNumber
                          ? 'bg-green-500/20 border-green-500 text-white'
                          : 'bg-[#111114] border-[#2d2d33] text-zinc-300 hover:border-zinc-600'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{player.avatar}</span>
                          <span>{player.username}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          № {player.bankCard.cardNumber}
                        </div>
                      </div>
                      <span className="text-[10px] text-green-400 font-bold">ВЫБРАТЬ</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleStartBruteForceSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Номер банковской карты жертвы
                </label>
                <input
                  type="text"
                  value={targetCardInput}
                  onChange={(e) => setTargetCardInput(e.target.value)}
                  placeholder="4276 8840 9102 3341"
                  className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-mono"
                  required
                />
              </div>

              {jobStatus && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-bold ${
                    jobStatus.type === 'success'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {jobStatus.message}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold text-xs rounded-lg transition"
                >
                  НАЧАТЬ ПОДБОР PIN-КОДА
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPcForTarget(null)}
                  className="px-4 py-2.5 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-lg hover:bg-zinc-700"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
