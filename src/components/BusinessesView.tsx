import { useState, useEffect } from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  Megaphone,
  Zap,
  Check,
  Sparkles,
  ArrowUpCircle,
  Coins,
  ShieldCheck,
  Bot,
  Clock
} from 'lucide-react';
import { UserAccount, BusinessTemplate, UserBusiness } from '../types';
import {
  BUSINESS_TEMPLATES,
  calculateBusinessIncomePerHour,
  calculateUpgradeCost,
  calculateStaffCost,
  calculateMarketingCost,
} from '../data/businessData';

interface BusinessesViewProps {
  currentUser: UserAccount;
  onBuyBusiness: (templateId: string) => boolean;
  onUpgradeBusiness: (templateId: string) => boolean;
  onHireStaff: (templateId: string) => boolean;
  onUpgradeMarketing: (templateId: string) => boolean;
  onToggleAutomation: (templateId: string) => boolean;
}

export function BusinessesView({
  currentUser,
  onBuyBusiness,
  onUpgradeBusiness,
  onHireStaff,
  onUpgradeMarketing,
  onToggleAutomation,
}: BusinessesViewProps) {
  const [notification, setNotification] = useState<string | null>(null);

  const [secondsToPayout, setSecondsToPayout] = useState<number>(() => {
    return 60 - (Math.floor(Date.now() / 1000) % 60);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsToPayout(60 - (Math.floor(Date.now() / 1000) % 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const getUserBiz = (templateId: string): UserBusiness | undefined => {
    return currentUser.businesses.find((b) => b.businessId === templateId);
  };

  // Calculate total hourly passive income
  const totalPassiveHourlyUSD = currentUser.businesses.reduce((acc, b) => {
    const template = BUSINESS_TEMPLATES.find((t) => t.id === b.businessId);
    if (!template) return acc;
    return acc + calculateBusinessIncomePerHour(template, b.level, b.staffCount, b.marketingLevel);
  }, 0);

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 text-[#e0e0e0]">
      
      {/* Header Banner */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-green-400 font-mono text-[10px] uppercase tracking-wider mb-0.5">
            <Building2 className="w-3.5 h-3.5" />
            Business Empire & Yield Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            Покупка & Прокачка Бизнесов
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5 max-w-2xl">
            Покупайте компьютерные клубы, крипто-банкоматы, майнинг отели и заводы ASIC чипов. Прокачивайте персонал и маркетинг для максимизации прибыли!
          </p>
        </div>

        <div className="bg-[#111114] border border-green-500/20 rounded-lg px-4 py-3 text-right font-mono shrink-0">
          <div className="text-[10px] uppercase font-bold text-zinc-400">Общий доход с бизнесов</div>
          <div className="text-xl sm:text-2xl font-bold text-green-400 tracking-tight mt-0.5">
            +${totalPassiveHourlyUSD.toLocaleString()} <span className="text-[11px] font-normal text-zinc-400">/ час</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            Автоматически поступает на карту
          </div>
        </div>

        {notification && (
          <div className="w-full mt-2 p-2 rounded bg-green-950/80 border border-green-500/50 text-green-300 text-xs font-mono font-bold flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            {notification}
          </div>
        )}
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {BUSINESS_TEMPLATES.map((biz) => {
          const userBiz = getUserBiz(biz.id);
          const isOwned = !!userBiz;
          const level = userBiz?.level || 1;
          const staffCount = userBiz?.staffCount || 0;
          const marketingLevel = userBiz?.marketingLevel || 0;

          const currentHourly = isOwned
            ? calculateBusinessIncomePerHour(biz, level, staffCount, marketingLevel)
            : biz.baseIncomePerHourUSD;

          const upgradeCost = calculateUpgradeCost(biz, level);
          const staffCost = calculateStaffCost(staffCount);
          const marketingCost = calculateMarketingCost(marketingLevel);

          return (
            <div
              key={biz.id}
              className={`rounded-xl p-4 border shadow-xl flex flex-col justify-between transition font-mono ${
                isOwned
                  ? 'bg-[#151518] border-green-500/30'
                  : 'bg-[#151518] border-[#2d2d33] opacity-90'
              }`}
            >
              <div>
                {/* Top bar */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#111114] border border-[#2d2d33] flex items-center justify-center text-xl shadow">
                      {biz.image}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{biz.name}</h3>
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase">{biz.category}</span>
                    </div>
                  </div>

                  {isOwned ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                      УРОВЕНЬ {level}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111114] text-zinc-400 border border-[#2d2d33]">
                      НЕ КУПЛЕНО
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-3 font-sans">
                  {biz.description}
                </p>

                {/* Profit Metrics */}
                <div className="bg-[#111114] rounded-lg p-3 border border-[#2d2d33] mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-zinc-500">Текущий доход</div>
                    <div className="text-base font-bold text-green-400 mt-0.5">
                      +${currentHourly.toLocaleString()} <span className="text-[10px] font-normal text-zinc-400">/ час</span>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-zinc-400 space-y-0.5">
                    <div>Персонал: <strong className="text-white">{staffCount} чел.</strong></div>
                    <div>Маркетинг: <strong className="text-white">Lvl {marketingLevel}</strong></div>
                  </div>
                </div>

                {/* Live Payout Countdown for Owned Businesses */}
                {isOwned && (
                  <div className="p-2.5 mb-3 rounded-lg bg-green-500/10 border border-green-500/20 text-[11px] text-green-300 space-y-1.5 font-mono shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-green-400 animate-pulse" />
                        <span>До выплаты дохода:</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-black/80 text-green-400 font-bold border border-green-500/30 text-xs shadow-[0_0_8px_rgba(74,222,128,0.3)]">
                        {secondsToPayout === 60 || secondsToPayout === 0 ? 'Начислено!' : `00:${String(secondsToPayout).padStart(2, '0')} сек`}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-green-500/20">
                      <div
                        className="bg-green-400 h-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                        style={{ width: `${((60 - (secondsToPayout === 60 ? 0 : secondsToPayout)) / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Upgrades Section when owned */}
                {isOwned && (
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {/* Upgrade Level */}
                    <button
                      onClick={() => {
                        const ok = onUpgradeBusiness(biz.id);
                        if (ok) showToast(`Уровень бизнеса ${biz.name} повышен!`);
                      }}
                      className="p-2 rounded bg-[#111114] hover:bg-zinc-800 border border-[#2d2d33] text-left transition"
                    >
                      <div className="flex items-center gap-1 text-[9px] text-green-400 font-bold uppercase">
                        <ArrowUpCircle className="w-2.5 h-2.5" />
                        Lvl +1
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        ${upgradeCost.toLocaleString()}
                      </div>
                    </button>

                    {/* Hire Staff */}
                    <button
                      onClick={() => {
                        const ok = onHireStaff(biz.id);
                        if (ok) showToast(`Нанят сотрудник в ${biz.name}!`);
                      }}
                      className="p-2 rounded bg-[#111114] hover:bg-zinc-800 border border-[#2d2d33] text-left transition"
                    >
                      <div className="flex items-center gap-1 text-[9px] text-cyan-400 font-bold uppercase">
                        <Users className="w-2.5 h-2.5" />
                        Персонал +1
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        ${staffCost.toLocaleString()}
                      </div>
                    </button>

                    {/* Marketing */}
                    <button
                      onClick={() => {
                        const ok = onUpgradeMarketing(biz.id);
                        if (ok) showToast(`Маркетинг для ${biz.name} запущен!`);
                      }}
                      className="p-2 rounded bg-[#111114] hover:bg-zinc-800 border border-[#2d2d33] text-left transition"
                    >
                      <div className="flex items-center gap-1 text-[9px] text-indigo-400 font-bold uppercase">
                        <Megaphone className="w-2.5 h-2.5" />
                        Реклама
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        ${marketingCost.toLocaleString()}
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Buy or Automation Button */}
              <div>
                {!isOwned ? (
                  <button
                    onClick={() => {
                      const ok = onBuyBusiness(biz.id);
                      if (ok) showToast(`Бизнес ${biz.name} успешно куплен!`);
                    }}
                    className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold text-xs tracking-wider shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    КУПИТЬ ЗА ${biz.baseCostUSD.toLocaleString()} USD
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#111114] border border-[#2d2d33] text-xs">
                    <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                      <Bot className="w-3.5 h-3.5 text-green-400" />
                      Автозачисление на карту (24/7)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold text-[9px] border border-green-500/20">
                      АКТИВНО
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
