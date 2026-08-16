import { useState } from 'react';
import {
  Users,
  CreditCard,
  Wallet,
  Zap,
  TrendingUp,
  Copy,
  Check,
  Send,
  Sparkles,
  Trophy,
  Crown,
  Flame,
  Award,
  UserPlus
} from 'lucide-react';
import { PlayerPublicProfile, UserAccount, CoinSymbol, MiningRig, MarketPrice } from '../types';
import { userToPlayerProfile } from '../services/storageService';
import { AvatarIcon, CoinIcon } from './CustomIcons';

interface MultiplayerViewProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  rigs: MiningRig[];
  marketPrices: MarketPrice[];
  onQuickTransferUSD: (cardNumber: string) => void;
  onQuickSendCrypto: (address: string, coin: CoinSymbol) => void;
  onOpenAuth: () => void;
}

export function MultiplayerView({
  currentUser,
  allUsers,
  rigs,
  marketPrices,
  onQuickTransferUSD,
  onQuickSendCrypto,
  onOpenAuth,
}: MultiplayerViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'players' | 'leaderboard'>('players');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Convert real active registered users to player public profiles (excluding banned accounts)
  const allPlayers: PlayerPublicProfile[] = allUsers
    .filter((u) => !u.isBanned)
    .map((u) => userToPlayerProfile(u, rigs, marketPrices));

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 text-[#e0e0e0]">
      
      {/* Header Banner */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-green-400 font-mono text-[10px] uppercase tracking-wider mb-0.5">
            <Users className="w-3.5 h-3.5" />
            Global Network & P2P Wire (No Bots)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            Список Реальных Игроков & Рейтинг
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5 max-w-2xl">
            Все боты удалены — экономика строится исключительно на реальных зарегистрированных пользователях. Переводите средства по номеру карты и крипто-адресам!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-mono font-bold transition flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Создать 2-й аккаунт (+ $10k)
          </button>

          <div className="flex bg-[#111114] p-1 rounded-lg border border-[#2d2d33] font-mono shrink-0">
            <button
              onClick={() => setSelectedTab('players')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                selectedTab === 'players'
                  ? 'bg-green-500 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Игроки ({allPlayers.length})
            </button>
            <button
              onClick={() => setSelectedTab('leaderboard')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                selectedTab === 'leaderboard'
                  ? 'bg-green-500 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Рейтинг Лидеров
            </button>
          </div>
        </div>
      </div>

      {/* Players Directory View */}
      {selectedTab === 'players' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allPlayers.map((player) => {
            const isCopiedCard = copiedId === `card-${player.id}`;
            const isCurrent = player.id === currentUser.id;

            return (
              <div
                key={player.id}
                className={`bg-[#151518] border rounded-xl p-4 shadow-xl transition flex flex-col justify-between font-mono ${
                  isCurrent ? 'border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-[#2d2d33] hover:border-zinc-700'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#111114] border border-[#2d2d33] flex items-center justify-center shadow">
                        <AvatarIcon avatar={player.avatar} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold text-white">{player.username}</h3>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                              ВЫ
                            </span>
                          )}
                          {player.username.toLowerCase() === 'fixcat' && (
                            <span className="text-[8px] px-1 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          Капитал: ${player.netWorthUSD.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                      ONLINE
                    </span>
                  </div>

                  {/* Bank Card Info */}
                  <div className="bg-[#111114] rounded-lg p-2.5 border border-[#2d2d33] mb-2.5 space-y-0.5">
                    <div className="flex items-center justify-between text-[9px] text-zinc-500 font-semibold uppercase">
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-green-400" />
                        Банковская Карта (USD)
                      </span>
                      <button
                        onClick={() => handleCopy(`card-${player.id}`, player.cardNumber)}
                        className="text-green-400 hover:underline font-bold"
                      >
                        {isCopiedCard ? 'Скопировано!' : 'Копировать'}
                      </button>
                    </div>
                    <div className="text-xs text-white font-bold tracking-wider">
                      {player.cardNumber}
                    </div>
                  </div>

                  {/* Crypto Addresses */}
                  <div className="space-y-1 text-[10px]">
                    <div className="text-[9px] uppercase font-bold text-zinc-500 font-mono mb-0.5">
                      Крипто Адреса:
                    </div>

                    {(['BTC', 'ETC', 'TON', 'USDT'] as CoinSymbol[]).map((coin) => {
                      const addr = player.cryptoAddresses[coin];
                      const isCopied = copiedId === `crypto-${player.id}-${coin}`;
                      return (
                        <div
                          key={coin}
                          onClick={() => handleCopy(`crypto-${player.id}-${coin}`, addr)}
                          className="flex items-center justify-between p-1.5 rounded bg-[#111114] hover:bg-zinc-800/80 cursor-pointer transition text-zinc-300 group border border-transparent hover:border-[#2d2d33]"
                        >
                          <span className="font-bold flex items-center gap-1 w-14">
                            <CoinIcon coin={coin} className="w-3.5 h-3.5" />
                            <span className="text-green-400">{coin}:</span>
                          </span>
                          <span className="truncate flex-1 text-zinc-400 group-hover:text-zinc-200">
                            {addr}
                          </span>
                          <span className="text-[9px] text-zinc-500 ml-1">
                            {isCopied ? '✓' : 'копия'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stats */}
                  <div className="mt-3 pt-2.5 border-t border-[#2d2d33] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[10px]">Хешрейт:</span>
                      <div className="font-bold text-green-400 text-xs">{player.totalHashrate} MH/s ({player.activeRigsCount} ригов)</div>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px]">Бизнесы:</span>
                      <div className="font-medium text-zinc-200 text-xs">{player.businessesCount} шт.</div>
                    </div>
                  </div>
                </div>

                {/* Quick Transfer Action */}
                {!isCurrent && (
                  <div className="mt-3 pt-2.5 border-t border-[#2d2d33] flex gap-2">
                    <button
                      onClick={() => onQuickTransferUSD(player.cardNumber)}
                      className="flex-1 py-1.5 rounded-lg bg-[#111114] hover:bg-zinc-800 text-xs font-bold text-green-400 border border-[#2d2d33] transition flex items-center justify-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Перевести USD
                    </button>
                    <button
                      onClick={() => onQuickSendCrypto(player.cryptoAddresses.BTC, 'BTC')}
                      className="flex-1 py-1.5 rounded-lg bg-[#111114] hover:bg-zinc-800 text-xs font-bold text-cyan-400 border border-[#2d2d33] transition flex items-center justify-center gap-1"
                    >
                      <Wallet className="w-3 h-3" />
                      Отправить BTC
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        /* Leaderboard View */
        <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl font-mono">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-bold text-white">Глобальный Рейтинг Майнеров & Капиталистов</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2d2d33] text-zinc-500">
                  <th className="pb-2.5 font-bold uppercase text-[10px]">Место</th>
                  <th className="pb-2.5 font-bold uppercase text-[10px]">Игрок</th>
                  <th className="pb-2.5 font-bold uppercase text-[10px]">Капитал (Net Worth)</th>
                  <th className="pb-2.5 font-bold uppercase text-[10px]">Хешрейт Ферм</th>
                  <th className="pb-2.5 font-bold uppercase text-[10px]">Бизнесы</th>
                  <th className="pb-2.5 font-bold uppercase text-[10px] text-right">Карта игрока</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2d33]">
                {[...allPlayers]
                  .sort((a, b) => b.netWorthUSD - a.netWorthUSD)
                  .map((player, idx) => (
                    <tr key={player.id} className="hover:bg-zinc-900/50 transition">
                      <td className="py-2.5 font-bold text-xs">
                        {idx === 0 ? <Crown className="w-4 h-4 text-yellow-400 inline" /> :
                         idx === 1 ? <Award className="w-4 h-4 text-zinc-300 inline" /> :
                         idx === 2 ? <Award className="w-4 h-4 text-amber-600 inline" /> :
                         `#${idx + 1}`}
                      </td>
                      <td className="py-2.5 font-bold text-white flex items-center gap-1.5">
                        <AvatarIcon avatar={player.avatar} className="w-3.5 h-3.5" />
                        <span>{player.username}</span>
                        {player.id === currentUser.id && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                            ВЫ
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 font-bold text-green-400">
                        ${player.netWorthUSD.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-zinc-300">
                        {player.totalHashrate.toLocaleString()} MH/s
                      </td>
                      <td className="py-2.5 text-zinc-400">
                        {player.businessesCount} шт.
                      </td>
                      <td className="py-2.5 text-right text-zinc-500 text-[11px]">
                        {player.cardNumber}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

