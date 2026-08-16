import { useState, FormEvent } from 'react';
import {
  Sparkles,
  CreditCard,
  UserCheck,
  Check,
  LogIn,
  UserPlus,
  Lock,
  Terminal,
} from 'lucide-react';
import { UserAccount } from '../types';
import {
  createInitialUser,
  saveUser,
  setCurrentUserId,
  getAllUsers,
  logTransaction,
} from '../services/storageService';
import { AVATAR_OPTIONS, AvatarIcon } from './CustomIcons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (newUser: UserAccount) => void;
}

export function AuthModal({ isOpen, onClose, onUserCreated }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('diamond');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = nickname.trim();
    if (!name || name.length < 2) {
      setError('Никнейм должен содержать минимум 2 символа.');
      return;
    }

    const all = getAllUsers();

    if (mode === 'register') {
      const existing = all.find((u) => u.username.toLowerCase() === name.toLowerCase());
      if (existing) {
        if (existing.isBanned) {
          setError('Невозможно войти');
        } else {
          setError(`Игрок с никнеймом «${name}» уже зарегистрирован! Выберите другое имя.`);
        }
        return;
      }

      const newUser = createInitialUser(name, password.trim());
      newUser.avatar = selectedAvatar;
      saveUser(newUser);
      setCurrentUserId(newUser.id);

      logTransaction({
        userId: newUser.id,
        type: 'bank_transfer',
        amount: 10000,
        currency: 'USD',
        description: 'Стартовый баланс новичка зачислен на банковскую карту',
      });

      onUserCreated(newUser);
      onClose();
    } else {
      const user = all.find((u) => u.username.toLowerCase() === name.toLowerCase());
      if (!user) {
        setError('Аккаунт не найден. Зарегистрируйтесь.');
        return;
      }

      if (user.isBanned) {
        setError('Невозможно войти');
        return;
      }

      if (user.password && user.password !== password.trim()) {
        setError('Неверный пароль.');
        return;
      }

      setCurrentUserId(user.id);
      onUserCreated(user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative font-mono text-[#e0e0e0]">
        
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2d2d33]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {mode === 'register' ? 'Создание Нового Профиля' : 'Вход в Профиль'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {mode === 'register' ? 'Бесплатная банковская карта + $10,000 USD' : 'Авторизация в Apex Mining OS'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xs font-bold px-2 py-1">✕</button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs font-bold mb-3">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-1.5 rounded-md transition flex items-center justify-center gap-1 ${
              mode === 'register' ? 'bg-green-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Регистрация (+10k)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-1.5 rounded-md transition flex items-center justify-center gap-1 ${
              mode === 'login' ? 'bg-green-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Вход
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-green-400" />
              Игровой Никнейм / Логин
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Например: CryptoLord_2026"
              className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-bold font-mono"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-green-400" />
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль..."
              className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-bold font-mono"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Выберите SVG Аватар
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {AVATAR_OPTIONS.map((av) => {
                  const Icon = av.icon;
                  const isSelected = selectedAvatar === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`p-2 rounded-lg transition flex items-center justify-center ${
                        isSelected
                          ? `${av.bg} border-2 shadow`
                          : 'bg-[#111114] border border-[#2d2d33] hover:bg-zinc-800'
                      }`}
                      title={av.label}
                    >
                      <Icon className={`w-4 h-4 ${av.color}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Starter Perks Preview */}
          {mode === 'register' && (
            <div className="p-3 rounded-lg bg-[#111114] border border-[#2d2d33] space-y-1.5 text-xs">
              <div className="font-bold text-green-400 flex items-center gap-1 text-[11px] uppercase">
                <CreditCard className="w-3.5 h-3.5" />
                Стартовый Пакет Новичка:
              </div>
              <ul className="space-y-1 text-zinc-300 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-green-400" />
                  <span><strong className="text-white">$10,000.00 USD</strong> на банковскую карту</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-green-400" />
                  <span>Уникальные кошельки (BTC, ETC, DOGE, HMSTR, TON, USDT)</span>
                </li>
              </ul>
            </div>
          )}

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.25)] transition flex items-center justify-center gap-1.5"
          >
            {mode === 'register' ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                СОЗДАТЬ АККАУНТ (+ $10,000 USD)
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                ВОЙТИ В СИСТЕМУ
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

