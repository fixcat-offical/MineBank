import { useState, FormEvent } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Zap,
  Check,
  Coins,
  Cpu,
  UserCheck,
  Terminal,
  Activity
} from 'lucide-react';
import { UserAccount } from '../types';
import { createInitialUser, saveUser, setCurrentUserId, logTransaction } from '../services/storageService';

interface RegistrationScreenProps {
  onRegistered: (newUser: UserAccount) => void;
}

export function RegistrationScreen({ onRegistered }: RegistrationScreenProps) {
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('💎');
  const [error, setError] = useState<string | null>(null);

  const avatars = ['💎', '👨‍💻', '👩‍💻', '🚀', '⚡', '👑', '🧙‍♂️', '🦁', '🐺', '🦊', '🦾', '💰'];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = nickname.trim();
    if (!name || name.length < 2) {
      setError('Никнейм должен содержать как минимум 2 символа.');
      return;
    }

    if (name.length > 20) {
      setError('Никнейм не должен превышать 20 символов.');
      return;
    }

    // Create a clean account from zero
    const newUser = createInitialUser(name);
    newUser.avatar = selectedAvatar;
    saveUser(newUser);
    setCurrentUserId(newUser.id);

    // Initial starter cash transaction log
    logTransaction({
      type: 'bank_transfer',
      amount: 10000,
      currency: 'USD',
      description: 'Стартовый баланс новичка зачислен на банковскую карту',
    });

    onRegistered(newUser);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e0e0e0] flex items-center justify-center p-3 sm:p-6 font-mono selection:bg-green-500 selection:text-black">
      <div className="max-w-xl w-full bg-[#151518] border border-[#2d2d33] rounded-xl shadow-2xl p-5 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Terminal Header */}
        <div className="border-b border-[#2d2d33] pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              Apex Mining OS v4.2 • System Boot
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
              NO BOTS • CLEAN ZERO START
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Регистрация Нового Игрока
          </h1>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Создайте профиль майнера для выпуска персонализированной банковской карты, генерации уникальных крипто-адресов и получения стартового баланса <span className="text-green-400 font-bold">$10,000 USD</span>.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nickname Input */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-green-400" />
              Введите Ваш Игровой Никнейм:
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Например: CyberMiner_2026"
              className="w-full px-3.5 py-2.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-bold font-mono transition"
              required
              autoFocus
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-zinc-400 mb-1.5">
              Выберите Аватар Персонажа:
            </label>
            <div className="grid grid-cols-6 gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`p-2 rounded-lg text-xl transition flex items-center justify-center ${
                    selectedAvatar === av
                      ? 'bg-green-500/20 border border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                      : 'bg-[#111114] border border-[#2d2d33] hover:bg-zinc-800'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Starter Package Spec Card */}
          <div className="p-4 rounded-xl bg-[#111114] border border-[#2d2d33] space-y-2.5">
            <div className="text-xs font-bold text-green-400 uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                Стартовый пакет & Гарантии системы:
              </span>
              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] border border-green-500/20">
                100% С НУЛЯ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300 pt-1">
              <div className="flex items-center gap-2 p-2 rounded bg-[#151518] border border-[#2d2d33]">
                <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Стартовый баланс</div>
                  <div className="font-bold text-green-400 font-mono">$10,000.00 USD</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded bg-[#151518] border border-[#2d2d33]">
                <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Банковская карта</div>
                  <div className="font-bold text-white font-mono">16-значный P2P номер</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded bg-[#151518] border border-[#2d2d33]">
                <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Криптокошельки</div>
                  <div className="font-bold text-white font-mono">BTC, ETC, DOGE, TON...</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded bg-[#151518] border border-[#2d2d33]">
                <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Честный мир</div>
                  <div className="font-bold text-white font-mono">Без ботов и накруток</div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold font-mono">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.3)] transition flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            ЗАРЕГИСТРИРОВАТЬСЯ И НАЧАТЬ С $10,000 USD
          </button>
        </form>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-zinc-500 pt-2 border-t border-[#2d2d33]">
          Apex Global Mining Simulation Engine • Stratum Server: us.fixms.mine:3333
        </div>

      </div>
    </div>
  );
}
