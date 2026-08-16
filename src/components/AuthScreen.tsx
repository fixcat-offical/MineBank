import { useState, FormEvent } from 'react';
import {
  CreditCard,
  Zap,
  Check,
  UserCheck,
  Terminal,
  Activity,
  LogIn,
  UserPlus,
  Lock,
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

interface AuthScreenProps {
  onAuthenticated: (user: UserAccount) => void;
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('diamond');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = usernameInput.trim();
    if (!name || name.length < 2) {
      setError('Никнейм должен содержать минимум 2 символа.');
      return;
    }

    if (name.length > 20) {
      setError('Никнейм не должен превышать 20 символов.');
      return;
    }

    const all = getAllUsers();
    const existing = all.find((u) => u.username.toLowerCase() === name.toLowerCase());
    if (existing) {
      if (existing.isBanned) {
        setError('Невозможно войти');
      } else {
        setError(`Игрок с никнеймом «${name}» уже зарегистрирован в базе! Пожалуйста, выберите уникальный никнейм или перейдите во вкладку «Вход».`);
      }
      return;
    }

    // Create a clean account from zero
    const newUser = createInitialUser(name, passwordInput.trim());
    newUser.avatar = selectedAvatar;
    saveUser(newUser);
    setCurrentUserId(newUser.id);

    // Initial starter cash transaction log strictly for this user
    logTransaction({
      userId: newUser.id,
      type: 'bank_transfer',
      amount: 10000,
      currency: 'USD',
      description: 'Стартовый баланс новичка зачислен на банковскую карту',
    });

    onAuthenticated(newUser);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = usernameInput.trim();
    if (!name) {
      setError('Введите ваш никнейм.');
      return;
    }

    const all = getAllUsers();
    const user = all.find((u) => u.username.toLowerCase() === name.toLowerCase());

    if (!user) {
      setError('Аккаунт с таким никнеймом не найден. Зарегистрируйтесь, если вы новичок.');
      return;
    }

    if (user.isBanned) {
      setError('Невозможно войти');
      return;
    }

    // Check password if set
    if (user.password && user.password !== passwordInput.trim()) {
      setError('Неверный пароль. Пожалуйста, проверьте ввод.');
      return;
    }

    setCurrentUserId(user.id);
    onAuthenticated(user);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e0e0e0] flex items-center justify-center p-3 sm:p-6 font-mono selection:bg-green-500 selection:text-black">
      <div className="max-w-xl w-full bg-[#151518] border border-[#2d2d33] rounded-xl shadow-2xl p-5 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Terminal Header */}
        <div className="border-b border-[#2d2d33] pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              Apex Mining OS v4.2 • Gateway
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
              NO BOTS • CLEAN ZERO START
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {mode === 'register' ? 'Регистрация Майнера' : 'Вход в Систему'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            {mode === 'register'
              ? 'Создайте новый аккаунт с персональной банковской картой, уникальными крипто-адресами и стартовым балансом $10,000 USD.'
              : 'Введите логин и пароль для доступа к вашим фермам, счетам и активам.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 rounded-md transition flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-green-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Регистрация (+ $10,000)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-md transition flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-green-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Вход в аккаунт
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={mode === 'register' ? handleRegister : handleLogin} className="space-y-4">
          
          {/* Nickname Input */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-green-400" />
              Игровой Никнейм / Логин:
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Например: CyberMiner_2026"
              className="w-full px-3.5 py-2.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-bold font-mono transition"
              required
              autoFocus
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-green-400" />
              Пароль {mode === 'register' ? '(для защиты профиля)' : ''}:
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Введите пароль..."
              className="w-full px-3.5 py-2.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 font-bold font-mono transition"
            />
          </div>

          {/* Avatar Selector (Registration Only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] uppercase font-bold text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>Выберите SVG Аватар Персонажа:</span>
                <span className="text-zinc-500 text-[10px]">
                  {AVATAR_OPTIONS.find((a) => a.id === selectedAvatar)?.label}
                </span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((av) => {
                  const Icon = av.icon;
                  const isSelected = selectedAvatar === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`p-2.5 rounded-lg transition flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? `${av.bg} border-2 shadow-[0_0_12px_rgba(34,197,94,0.3)] scale-105`
                          : 'bg-[#111114] border border-[#2d2d33] hover:bg-zinc-800'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${av.color}`} />
                      <span className="text-[9px] text-zinc-400 truncate max-w-full font-mono">
                        {av.label.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Starter Package Spec Card (Registration Mode) */}
          {mode === 'register' && (
            <div className="p-4 rounded-xl bg-[#111114] border border-[#2d2d33] space-y-2.5">
              <div className="text-xs font-bold text-green-400 uppercase flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  Стартовый пакет & Правила:
                </span>
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] border border-green-500/20">
                  100% С ЧИСТОГО ЛИСТА
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
                    <div className="text-[10px] text-zinc-500 uppercase">Честный антифрод</div>
                    <div className="font-bold text-white font-mono">Переводы от $15k пика</div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
            {mode === 'register' ? (
              <>
                <UserCheck className="w-4 h-4" />
                ЗАРЕГИСТРИРОВАТЬСЯ И НАЧАТЬ С $10,000 USD
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                ВОЙТИ В ИГРОВОЙ АККАУНТ
              </>
            )}
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
