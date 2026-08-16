import { useState, MouseEvent } from 'react';
import {
  CreditCard,
  Cpu,
  Server,
  Building2,
  TrendingUp,
  Globe,
  Wallet,
  Users,
  Sparkles,
  Zap,
  Check,
  Copy,
  LogOut,
  ChevronDown,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { UserAccount } from '../types';
import { AvatarIcon } from './CustomIcons';

interface NavbarProps {
  currentUser: UserAccount;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalNetworkHashrate: number;
  onSwitchUser: () => void;
  allUsers: UserAccount[];
  onSelectUser: (userId: string) => void;
  onOpenAuth: () => void;
}

export function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  totalNetworkHashrate,
  allUsers,
  onSelectUser,
  onOpenAuth,
}: NavbarProps) {
  const [copiedCard, setCopiedCard] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isFixCat = currentUser.username.toLowerCase() === 'fixcat';

  const navItems = [
    { id: 'bank', label: 'Банк & Карта', icon: CreditCard },
    { id: 'wallet', label: 'Кошелек', icon: Wallet },
    { id: 'builder', label: 'Сборка Фермы', icon: Cpu },
    { id: 'myrigs', label: 'Мои Майнеры', icon: Zap },
    { id: 'store', label: 'Магазин Железа', icon: Server },
    { id: 'exchange', label: 'Криптобиржа', icon: TrendingUp },
    { id: 'pools', label: 'Пулы Stratum', icon: Globe },
    { id: 'businesses', label: 'Бизнесы', icon: Building2 },
    { id: 'hackerpc', label: 'Хакерские ПК', icon: Terminal },
    { id: 'multiplayer', label: 'Сеть Игроков', icon: Users },
  ];

  if (isFixCat) {
    navItems.push({
      id: 'admin',
      label: 'Админ Панель',
      icon: ShieldAlert,
    });
  }

  const handleCopyCard = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(currentUser.bankCard.cardNumber);
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const totalUsdtAssets = (currentUser.cryptoBalances.USDT || 0);

  return (
    <header className="sticky top-0 z-50 bg-[#151518] border-b border-[#2d2d33] text-[#e0e0e0] shadow-xl font-mono">
      {/* Top High Density Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-mono leading-none">
                MINEX <span className="text-green-500">OS v4.2</span>
              </h1>
              {isFixCat ? (
                <span className="inline-block px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-mono font-black border border-fuchsia-500/40 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                  SUPERADMIN
                </span>
              ) : (
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-mono font-bold border border-green-500/20">
                  ONLINE
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-zinc-500 hidden sm:block mt-0.5">
              Stratum v2 • us.fixms.mine
            </p>
          </div>
        </div>

        {/* Global Stats & Balances */}
        <div className="flex items-center gap-4 sm:gap-8">
          
          {/* Network Hashrate */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Network Load</span>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-green-400 animate-pulse" />
              <span className="text-sm font-mono text-white font-bold">
                {totalNetworkHashrate.toFixed(1)} <span className="text-zinc-500 text-xs font-normal">MH/s</span>
              </span>
            </div>
          </div>

          {/* Fiat Balance */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Fiat Balance</span>
            <span className="text-sm sm:text-base font-mono text-green-400 font-bold">
              ${currentUser.bankBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Crypto USDT Balance */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Crypto Assets</span>
            <span className="text-sm sm:text-base font-mono text-teal-400 font-bold">
              {totalUsdtAssets.toFixed(2)} <span className="text-xs text-zinc-400 font-normal">USDT</span>
            </span>
          </div>

          {/* User Profile & Switcher */}
          <div className="relative pl-3 sm:pl-6 border-l border-zinc-800">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-zinc-800/60 transition"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold leading-none text-zinc-200">{currentUser.username}</p>
                <p className="text-[10px] text-green-500 mt-1 font-mono flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block"></span>
                  ● {isFixCat ? 'ROOT ADMIN' : 'ONLINE'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm shadow">
                <AvatarIcon avatar={currentUser.avatar} className="w-5 h-5" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-[#151518] border border-[#2d2d33] rounded-xl shadow-2xl p-3 z-50">
                <div className="pb-3 mb-2 border-b border-zinc-800">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <AvatarIcon avatar={currentUser.avatar} className="w-4 h-4" />
                      {currentUser.username}
                    </span>
                    <span className="text-[10px] text-green-400 font-mono">
                      {isFixCat ? 'SUPERADMIN' : 'ONLINE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1 font-mono">
                    <span className="truncate">{currentUser.bankCard.cardNumber}</span>
                    <button
                      onClick={handleCopyCard}
                      className="text-green-400 hover:text-green-300 ml-2"
                      title="Копировать карту"
                    >
                      {copiedCard ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1 tracking-wider">
                  Сменить профиль / Игрока:
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                        u.id === currentUser.id
                          ? 'bg-[#22c55e15] text-green-400 border border-green-500/30'
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <AvatarIcon avatar={u.avatar} className="w-3.5 h-3.5" />
                        <span>{u.username}</span>
                        {u.username.toLowerCase() === 'fixcat' && (
                          <span className="text-[8px] text-fuchsia-400 font-bold">👑</span>
                        )}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        ${u.bankBalanceUSD.toFixed(0)}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setShowUserMenu(false);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Новый профиль (+ $10k)
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* High Density Sub-Navigation Tabs Bar */}
      <div className="bg-[#111114] border-t border-[#2d2d33] px-3 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAdminTab = item.id === 'admin';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? isAdminTab
                      ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 font-bold shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                      : 'bg-[#22c55e15] text-green-400 border border-green-500/30 font-bold shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                    : isAdminTab
                    ? 'text-fuchsia-400 hover:bg-fuchsia-500/10 border border-fuchsia-500/20 font-bold'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? (isAdminTab ? 'text-fuchsia-300' : 'text-green-400') : (isAdminTab ? 'text-fuchsia-400' : 'text-zinc-500')}`} />
                <span>{item.label}</span>
                {isAdminTab && (
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
