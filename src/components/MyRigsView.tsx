import { useState } from 'react';
import {
  Zap,
  Power,
  Sliders,
  Trash2,
  Edit3,
  Server,
  Flame,
  Activity,
  Cpu,
  RefreshCcw,
  Check,
  Play,
  Pause,
  Clock,
  Sparkles,
  Plus
} from 'lucide-react';
import { MiningRig, CoinSymbol, MiningPool, UserAccount } from '../types';
import { getHardwareById } from '../data/hardwareData';
import { COIN_MINING_CONFIG } from '../data/marketData';

interface MyRigsViewProps {
  currentUser: UserAccount;
  rigs: MiningRig[];
  pools: MiningPool[];
  onToggleRigStatus: (rigId: string) => void;
  onDismantleRig: (rigId: string) => void;
  onUpdateOverclock: (rigId: string, percent: number) => void;
  onUpdateRigConfig: (rigId: string, coin: CoinSymbol, targetAddress: string, poolId: string) => void;
  onRenameRig?: (rigId: string, newName: string) => void;
  onNavigateToBuilder: () => void;
}

export function MyRigsView({
  currentUser,
  rigs,
  pools,
  onToggleRigStatus,
  onDismantleRig,
  onUpdateOverclock,
  onUpdateRigConfig,
  onRenameRig,
  onNavigateToBuilder,
}: MyRigsViewProps) {
  const [editingRigId, setEditingRigId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCoin, setEditCoin] = useState<CoinSymbol>('BTC');
  const [editAddress, setEditAddress] = useState('');
  const [editPoolId, setEditPoolId] = useState('us.fixms.mine');

  const myRigs = rigs.filter((r) => r.ownerId === currentUser.id);

  const startEditRig = (rig: MiningRig) => {
    setEditingRigId(rig.id);
    setEditName(rig.name);
    setEditCoin(rig.targetCoin);
    setEditAddress(rig.targetWalletAddress);
    setEditPoolId(rig.poolId);
  };

  const saveEditRig = (rigId: string) => {
    if (onRenameRig && editName.trim()) {
      onRenameRig(rigId, editName.trim());
    }
    onUpdateRigConfig(rigId, editCoin, editAddress, editPoolId);
    setEditingRigId(null);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 text-[#e0e0e0]">
      
      {/* Header Banner */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-green-400 font-mono text-[10px] uppercase tracking-wider mb-0.5">
            <Zap className="w-3.5 h-3.5" />
            Rig Fleet Telemetry & OC Tuning
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            Мои Активные Риги & Разгон
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5 max-w-2xl">
            Управляйте рабочими фермами, регулируйте разгон (Overclocking), меняйте целевую монету или перенаправляйте майнинг на кошельки друзей.
          </p>
        </div>

        <button
          onClick={onNavigateToBuilder}
          className="px-3.5 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black font-mono font-bold text-xs tracking-wider shadow-[0_0_12px_rgba(34,197,94,0.2)] transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          СОБРАТЬ НОВУЮ ФЕРМУ
        </button>
      </div>

      {/* Rigs Grid */}
      {myRigs.length === 0 ? (
        <div className="text-center py-16 bg-[#151518] rounded-xl border border-[#2d2d33] p-6 shadow-xl font-mono">
          <Server className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">У вас пока нет собранных ферм</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
            Используйте ваши стартовые компоненты или купите новое железо в магазине и соберите свой первый майнинг риг!
          </p>
          <button
            onClick={onNavigateToBuilder}
            className="mt-4 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold text-xs shadow transition"
          >
            Перейти в мастерскую сборки →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {myRigs.map((rig) => {
            const rack = getHardwareById(rig.rackId);
            const mb = getHardwareById(rig.motherboardId);
            const cpu = getHardwareById(rig.cpuId);
            const isEditing = editingRigId === rig.id;
            const effectiveHash = rig.totalHashrate * (1 + rig.overclockPercent / 100);

            return (
              <div
                key={rig.id}
                className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl hover:border-zinc-700 transition flex flex-col justify-between font-mono"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          rig.status === 'mining'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : 'bg-[#111114] text-zinc-500 border border-[#2d2d33]'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white">{rig.name}</h3>
                          <button
                            onClick={() => startEditRig(rig)}
                            className="text-zinc-500 hover:text-green-400 p-0.5 rounded transition"
                            title="Переименовать майнер"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                          <span>{rack?.name || 'Custom Rack'}</span>
                          <span>•</span>
                          <span className="text-green-400 font-semibold">{rig.gpuIds.length} GPU</span>
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          rig.status === 'mining'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20 animate-pulse'
                            : 'bg-[#111114] text-zinc-400 border-[#2d2d33]'
                        }`}
                      >
                        {rig.status === 'mining' ? 'МАЙНИТ' : 'НА ПАУЗЕ'}
                      </span>

                      <button
                        onClick={() => onToggleRigStatus(rig.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          rig.status === 'mining'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                        }`}
                        title={rig.status === 'mining' ? 'Приостановить' : 'Запустить'}
                      >
                        {rig.status === 'mining' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-[#111114] rounded-lg p-3 border border-[#2d2d33] mb-3">
                    <div>
                      <div className="text-[9px] text-zinc-500 uppercase font-semibold">Хешрейт</div>
                      <div className="text-sm font-bold text-green-400">
                        {effectiveHash.toFixed(1)} <span className="text-[10px] font-normal">MH/s</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] text-zinc-500 uppercase font-semibold">Энергия</div>
                      <div className="text-sm font-bold text-zinc-200">
                        {rig.totalPowerWatts}W
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] text-zinc-500 uppercase font-semibold">Температура</div>
                      <div className={`text-sm font-bold ${rig.temperature > 75 ? 'text-rose-400' : 'text-green-400'}`}>
                        {rig.temperature + Math.round(rig.overclockPercent * 0.3)}°C
                      </div>
                    </div>
                  </div>

                  {/* Edit Config or Normal Display */}
                  {isEditing ? (
                    <div className="p-3 bg-[#111114] rounded-lg border border-green-500/30 space-y-2 mb-3">
                      <div className="text-xs font-bold text-green-400">Редактирование параметров майнинга</div>
                      
                      <div>
                        <label className="text-[10px] uppercase text-zinc-500">Название майнера / рига</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Например: Bitminer-Rig-01"
                          className="w-full px-2 py-1 bg-[#151518] border border-[#2d2d33] rounded text-xs text-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase text-zinc-500">Монета</label>
                          <select
                            value={editCoin}
                            onChange={(e) => setEditCoin(e.target.value as CoinSymbol)}
                            className="w-full px-2 py-1 bg-[#151518] border border-[#2d2d33] rounded text-xs text-white"
                          >
                            {(['BTC', 'ETC', 'DOGE', 'HAMSTER', 'TON'] as CoinSymbol[]).map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase text-zinc-500">Пул (Stratum)</label>
                          <select
                            value={editPoolId}
                            onChange={(e) => setEditPoolId(e.target.value)}
                            className="w-full px-2 py-1 bg-[#151518] border border-[#2d2d33] rounded text-xs text-white"
                          >
                            {pools.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-zinc-500">Адрес кошелька выплаты</label>
                        <input
                          type="text"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          className="w-full px-2 py-1 bg-[#151518] border border-[#2d2d33] rounded text-xs text-white font-mono"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => saveEditRig(rig.id)}
                          className="flex-1 py-1 bg-green-500 text-black font-bold text-xs rounded"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => setEditingRigId(null)}
                          className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs text-zinc-300 bg-[#111114] p-2.5 rounded-lg border border-[#2d2d33] mb-3">
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-[11px]">Добываемая монета:</span>
                        <span className="font-bold text-green-400">{rig.targetCoin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-[11px]">Пул:</span>
                        <span className="font-mono text-zinc-300">{rig.poolId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 text-[11px]">Выплата на:</span>
                        <span className="font-mono text-[10px] text-zinc-300 max-w-[200px] truncate">
                          {rig.targetWalletAddress}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Overclocking Slider */}
                  <div className="bg-[#111114] rounded-lg p-2.5 border border-[#2d2d33] mb-3">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-zinc-400 flex items-center gap-1 text-[11px]">
                        <Sliders className="w-3 h-3 text-green-400" />
                        Разгон GPU (Overclocking)
                      </span>
                      <span className="font-mono font-bold text-green-400 text-xs">+{rig.overclockPercent}% Boost</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="5"
                      value={rig.overclockPercent}
                      onChange={(e) => onUpdateOverclock(rig.id, parseInt(e.target.value))}
                      className="w-full accent-green-500 cursor-pointer h-1.5"
                    />
                  </div>

                  {/* Installed Components List */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-zinc-500 uppercase">Установленные GPU:</div>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                      {rig.gpuIds.map((gpuId, idx) => {
                        const gpu = getHardwareById(gpuId);
                        return (
                          <span
                            key={`${gpuId}-${idx}`}
                            className="px-1.5 py-0.5 rounded bg-[#111114] text-zinc-300 text-[10px] border border-[#2d2d33] flex items-center gap-1"
                          >
                            <Flame className="w-2.5 h-2.5 text-orange-400" />
                            {gpu?.name || 'GPU'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-3 pt-2.5 border-t border-[#2d2d33] flex items-center justify-between gap-2">
                  <button
                    onClick={() => startEditRig(rig)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#111114] hover:bg-zinc-800 text-xs font-bold text-zinc-300 border border-[#2d2d33] transition"
                  >
                    <Edit3 className="w-3 h-3 text-green-400" />
                    Настроить
                  </button>

                  <button
                    onClick={() => onDismantleRig(rig.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Разобрать в инвентарь
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
