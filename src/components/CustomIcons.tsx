import {
  Diamond,
  Terminal,
  Zap,
  Rocket,
  Crown,
  Flame,
  Shield,
  Cpu,
  Coins,
  Wallet,
  Sparkles,
  Server,
  DollarSign,
  CircleDot,
  Hexagon,
  Bot
} from 'lucide-react';
import { CoinSymbol } from '../types';

export const AVATAR_OPTIONS = [
  { id: 'diamond', label: 'Кибер Алмаз', icon: Diamond, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  { id: 'hacker', label: 'Хакер Терминала', icon: Terminal, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  { id: 'zap', label: 'Тесла Разряд', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 'rocket', label: 'Крипто Ракета', icon: Rocket, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  { id: 'crown', label: 'Apex Властелин', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 'flame', label: 'Оверклокер', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  { id: 'shield', label: 'Сейф Хранитель', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  { id: 'cpu', label: 'Квантовый Чип', icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { id: 'bot', label: 'ИИ Майнер', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  { id: 'vault', label: 'Золотой Склад', icon: Coins, color: 'text-yellow-300', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 'server', label: 'Датацентр', icon: Server, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
  { id: 'sparkles', label: 'FixCat VIP', icon: Sparkles, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/30' },
];

export function AvatarIcon({
  avatar,
  className = 'w-5 h-5',
  containerClassName = '',
}: {
  avatar?: string;
  className?: string;
  containerClassName?: string;
}) {
  const norm = (avatar || '').toLowerCase().trim();

  // Match avatar key or legacy emoji
  let match = AVATAR_OPTIONS.find((opt) => opt.id === norm);
  if (!match) {
    if (norm.includes('💎') || norm === 'diamond') match = AVATAR_OPTIONS[0];
    else if (norm.includes('👨‍💻') || norm.includes('👩‍💻') || norm === 'hacker') match = AVATAR_OPTIONS[1];
    else if (norm.includes('⚡') || norm === 'zap') match = AVATAR_OPTIONS[2];
    else if (norm.includes('🚀') || norm === 'rocket') match = AVATAR_OPTIONS[3];
    else if (norm.includes('👑') || norm === 'crown') match = AVATAR_OPTIONS[4];
    else if (norm.includes('🦁') || norm.includes('🔥') || norm === 'flame') match = AVATAR_OPTIONS[5];
    else if (norm.includes('🐺') || norm.includes('🛡️') || norm === 'shield') match = AVATAR_OPTIONS[6];
    else if (norm.includes('🦾') || norm === 'cpu') match = AVATAR_OPTIONS[7];
    else if (norm.includes('🤖') || norm === 'bot') match = AVATAR_OPTIONS[8];
    else if (norm.includes('💰') || norm === 'vault') match = AVATAR_OPTIONS[9];
    else if (norm.includes('🧙‍♂️') || norm.includes('✨') || norm === 'sparkles') match = AVATAR_OPTIONS[11];
    else match = AVATAR_OPTIONS[0];
  }

  const IconComp = match.icon;

  return (
    <span className={`inline-flex items-center justify-center ${containerClassName || match.bg} rounded p-1`}>
      <IconComp className={`${className} ${match.color}`} />
    </span>
  );
}

export function CoinIcon({
  coin,
  className = 'w-4 h-4',
}: {
  coin: CoinSymbol | string;
  className?: string;
}) {
  switch (coin) {
    case 'BTC':
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#f7931a]/15 text-[#f7931a] border border-[#f7931a]/30 font-mono font-black text-[10px] shadow-[0_0_8px_rgba(247,147,26,0.25)]">
          ₿
        </span>
      );
    case 'ETC':
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-black text-[10px] shadow-[0_0_8px_rgba(16,185,129,0.25)]">
          Ξ
        </span>
      );
    case 'DOGE':
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-mono font-black text-[10px] shadow-[0_0_8px_rgba(251,191,36,0.25)]">
          Ð
        </span>
      );
    case 'HAMSTER':
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 font-mono font-black text-[10px] shadow-[0_0_8px_rgba(249,115,22,0.25)]">
          ⚡
        </span>
      );
    case 'TON':
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 font-mono font-black text-[10px] shadow-[0_0_8px_rgba(14,165,233,0.25)]">
          💎
        </span>
      );
    case 'USDT':
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30 font-mono font-black text-[10px] shadow-[0_0_8px_rgba(20,184,166,0.25)]">
          ₮
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono font-bold text-[10px]">
          $
        </span>
      );
  }
}
