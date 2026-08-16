import { useState, useMemo, useEffect, FormEvent } from 'react';
import {
  Cpu,
  Server,
  Zap,
  Layers,
  Flame,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  Play,
  Sparkles,
  HelpCircle,
  Coins,
  Globe,
  Wallet
} from 'lucide-react';
import {
  UserAccount,
  CoinSymbol,
  MiningPool,
  HardwareItem,
} from '../types';
import { getHardwareById } from '../data/hardwareData';
import { calculateRigSpecs } from '../services/storageService';

interface RigBuilderViewProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  pools: MiningPool[];
  onDeployRig: (config: {
    name: string;
    rackId: string;
    motherboardId: string;
    cpuId: string;
    psuIds: string[];
    gpuIds: string[];
    targetCoin: CoinSymbol;
    targetWalletAddress: string;
    poolId: string;
  }) => boolean;
  onNavigateToStore: () => void;
}

export function RigBuilderView({
  currentUser,
  allUsers,
  pools,
  onDeployRig,
  onNavigateToStore,
}: RigBuilderViewProps) {
  // Selected components from user's inventory
  const [selectedRackId, setSelectedRackId] = useState<string>(currentUser.inventory.racks[0] || '');
  const [selectedMotherboardId, setSelectedMotherboardId] = useState<string>(currentUser.inventory.motherboards[0] || '');
  const [selectedCpuId, setSelectedCpuId] = useState<string>(currentUser.inventory.cpus[0] || '');
  const [selectedPsuIds, setSelectedPsuIds] = useState<string[]>(
    currentUser.inventory.psus[0] ? [currentUser.inventory.psus[0]] : []
  );
  const [selectedGpuIds, setSelectedGpuIds] = useState<string[]>(
    currentUser.inventory.gpus.slice(0, 5) // pre-populate with starter GPUs if any
  );

  // Rig Configuration Modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [rigName, setRigName] = useState('Rig-Alpha-01');
  const [targetCoin, setTargetCoin] = useState<CoinSymbol>('BTC');
  const [targetWalletAddress, setTargetWalletAddress] = useState(currentUser.cryptoAddresses.BTC);
  const [selectedPoolId, setSelectedPoolId] = useState(pools[0]?.id || 'us.fixms.mine');
  const [deployError, setDeployError] = useState<string | null>(null);

  // Auto-sync builder selection when currentUser or inventory changes
  useEffect(() => {
    if (!currentUser.inventory.racks.includes(selectedRackId)) {
      setSelectedRackId(currentUser.inventory.racks[0] || '');
    }
    if (!currentUser.inventory.motherboards.includes(selectedMotherboardId)) {
      setSelectedMotherboardId(currentUser.inventory.motherboards[0] || '');
    }
    if (!currentUser.inventory.cpus.includes(selectedCpuId)) {
      setSelectedCpuId(currentUser.inventory.cpus[0] || '');
    }

    setSelectedPsuIds((prev) => prev.filter((id) => currentUser.inventory.psus.includes(id)));
    setSelectedGpuIds((prev) => prev.filter((id) => currentUser.inventory.gpus.includes(id)));
    setTargetWalletAddress(currentUser.cryptoAddresses[targetCoin] || '');
  }, [currentUser.id, currentUser.inventory]);

  // Retrieve user's actual inventory items with counts
  const userInventoryRacks = useMemo(() => {
    return currentUser.inventory.racks.map((id) => getHardwareById(id)).filter(Boolean) as HardwareItem[];
  }, [currentUser.inventory.racks]);

  const userInventoryMbs = useMemo(() => {
    return currentUser.inventory.motherboards.map((id) => getHardwareById(id)).filter(Boolean) as HardwareItem[];
  }, [currentUser.inventory.motherboards]);

  const userInventoryCpus = useMemo(() => {
    return currentUser.inventory.cpus.map((id) => getHardwareById(id)).filter(Boolean) as HardwareItem[];
  }, [currentUser.inventory.cpus]);

  const userInventoryPsus = useMemo(() => {
    return currentUser.inventory.psus.map((id) => getHardwareById(id)).filter(Boolean) as HardwareItem[];
  }, [currentUser.inventory.psus]);

  const userInventoryGpus = useMemo(() => {
    return currentUser.inventory.gpus.map((id) => getHardwareById(id)).filter(Boolean) as HardwareItem[];
  }, [currentUser.inventory.gpus]);

  // Current calculations
  const specs = useMemo(() => {
    return calculateRigSpecs(
      selectedRackId,
      selectedMotherboardId,
      selectedCpuId,
      selectedPsuIds,
      selectedGpuIds,
      targetCoin
    );
  }, [selectedRackId, selectedMotherboardId, selectedCpuId, selectedPsuIds, selectedGpuIds, targetCoin]);

  const rackItem = getHardwareById(selectedRackId);
  const mbItem = getHardwareById(selectedMotherboardId);
  const cpuItem = getHardwareById(selectedCpuId);

  const handleAddGpuSlot = (gpuId: string) => {
    if (selectedGpuIds.length >= specs.maxGpuSlots) return;
    setSelectedGpuIds([...selectedGpuIds, gpuId]);
  };

  const handleRemoveGpuSlot = (index: number) => {
    const updated = [...selectedGpuIds];
    updated.splice(index, 1);
    setSelectedGpuIds(updated);
  };

  const handleAddPsu = (psuId: string) => {
    setSelectedPsuIds([...selectedPsuIds, psuId]);
  };

  const handleRemovePsu = (index: number) => {
    const updated = [...selectedPsuIds];
    updated.splice(index, 1);
    setSelectedPsuIds(updated);
  };

  const handleCoinChange = (coin: CoinSymbol) => {
    setTargetCoin(coin);
    setTargetWalletAddress(currentUser.cryptoAddresses[coin]);
  };

  const handleDeploySubmit = (e: FormEvent) => {
    e.preventDefault();
    setDeployError(null);

    if (!specs.isValid) {
      setDeployError(specs.validationError || 'Конфигурация фермы не валидна.');
      return;
    }

    if (!targetWalletAddress.trim()) {
      setDeployError('Укажите адрес кошелька для выплаты наград.');
      return;
    }

    const success = onDeployRig({
      name: rigName.trim() || 'Custom-Mining-Rig',
      rackId: selectedRackId,
      motherboardId: selectedMotherboardId,
      cpuId: selectedCpuId,
      psuIds: selectedPsuIds,
      gpuIds: selectedGpuIds,
      targetCoin,
      targetWalletAddress: targetWalletAddress.trim(),
      poolId: selectedPoolId,
    });

    if (success) {
      setShowConfigModal(false);
      // Reset selected GPUs/PSUs after building
      setSelectedGpuIds([]);
      setSelectedPsuIds([]);
    } else {
      setDeployError('Не удалось собрать ферму. Проверьте наличие компонентов в инвентаре.');
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 text-[#e0e0e0]">
      
      {/* Header Banner */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-green-400 font-mono text-[10px] uppercase tracking-wider mb-0.5">
            <Cpu className="w-3.5 h-3.5" />
            Rig Assembly & Engineering Bay
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            Сборка & Конфигурация Майнинг Рига
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5 max-w-2xl">
            Установите стойку (до 19 слотов PCIe), материнскую плату, процессор, блоки питания и видеокарты. Настройте монету, stratum-пул и адрес кошелька.
          </p>
        </div>

        <button
          onClick={onNavigateToStore}
          className="px-3.5 py-2 rounded-lg bg-[#111114] hover:bg-zinc-800 text-green-400 font-mono font-bold text-xs border border-[#2d2d33] transition flex items-center gap-1.5 shrink-0"
        >
          <Server className="w-3.5 h-3.5" />
          Купить детали в магазине
        </button>
      </div>

      {/* Assembly Layout: Builder Canvas (Left) + Real-time Specs & Launch Button (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Component Slots Assembly */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Slot 1: Rack / Frame */}
          <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">1. Стойка / Корпус (Mining Rack)</h3>
                  <p className="text-[11px] text-zinc-400">Количество посадочных мест для GPU</p>
                </div>
              </div>

              {rackItem && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                  Макс. {rackItem.specs.maxGpus} GPU
                </span>
              )}
            </div>

            {userInventoryRacks.length === 0 ? (
              <div className="p-3 rounded-lg bg-[#111114] text-center border border-[#2d2d33] font-mono">
                <p className="text-xs text-zinc-400">У вас нет свободных стоек в инвентаре.</p>
                <button
                  onClick={onNavigateToStore}
                  className="mt-1 text-xs text-green-400 font-bold hover:underline"
                >
                  Купить стойку в магазине →
                </button>
              </div>
            ) : (
              <select
                value={selectedRackId}
                onChange={(e) => setSelectedRackId(e.target.value)}
                className="w-full px-3 py-2 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-mono"
              >
                {userInventoryRacks.map((r, idx) => (
                  <option key={`${r.id}-${idx}`} value={r.id}>
                    {r.name} — до {r.specs.maxGpus} GPU (${r.priceUSD})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Slot 2: Motherboard & CPU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Motherboard */}
            <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">2. Материнская плата</h3>
                  <p className="text-[10px] text-zinc-400">PCIe линии и чипсет</p>
                </div>
              </div>

              {userInventoryMbs.length === 0 ? (
                <div className="p-2.5 bg-[#111114] rounded-lg text-center text-xs text-zinc-400 font-mono">
                  Нет плат. <button onClick={onNavigateToStore} className="text-green-400 underline">Купить</button>
                </div>
              ) : (
                <select
                  value={selectedMotherboardId}
                  onChange={(e) => setSelectedMotherboardId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {userInventoryMbs.map((mb, idx) => (
                    <option key={`${mb.id}-${idx}`} value={mb.id}>
                      {mb.name} ({mb.specs.maxGpus} PCIe)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* CPU */}
            <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">3. Процессор (CPU)</h3>
                  <p className="text-[10px] text-zinc-400">Управление и доп. хешрейт</p>
                </div>
              </div>

              {userInventoryCpus.length === 0 ? (
                <div className="p-2.5 bg-[#111114] rounded-lg text-center text-xs text-zinc-400 font-mono">
                  Нет CPU. <button onClick={onNavigateToStore} className="text-green-400 underline">Купить</button>
                </div>
              ) : (
                <select
                  value={selectedCpuId}
                  onChange={(e) => setSelectedCpuId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  {userInventoryCpus.map((cpu, idx) => (
                    <option key={`${cpu.id}-${idx}`} value={cpu.id}>
                      {cpu.name} ({cpu.specs.cores}c, {cpu.powerWatts}W)
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Slot 3: PSUs */}
          <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">4. Блоки питания (PSU)</h3>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Мощность БП: {specs.psuCapacityWatts}W / Нагрузка: {specs.totalPowerWatts}W
                  </p>
                </div>
              </div>

              {/* Add PSU button if available */}
              {userInventoryPsus.length > selectedPsuIds.length && (
                <button
                  type="button"
                  onClick={() => {
                    const nextPsu = userInventoryPsus.find((p) => !selectedPsuIds.includes(p.id)) || userInventoryPsus[0];
                    handleAddPsu(nextPsu.id);
                  }}
                  className="px-2.5 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-mono font-bold hover:bg-green-500/20 transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Добавить второй БП
                </button>
              )}
            </div>

            <div className="space-y-2">
              {selectedPsuIds.map((psuId, idx) => {
                const psu = getHardwareById(psuId);
                return (
                  <div
                    key={`${psuId}-${idx}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#111114] border border-[#2d2d33] font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs font-bold text-white">{psu?.name}</span>
                      <span className="text-[10px] text-green-400">({psu?.powerWatts}W)</span>
                    </div>

                    {selectedPsuIds.length > 1 && (
                      <button
                        onClick={() => handleRemovePsu(idx)}
                        className="text-rose-400 hover:text-rose-300 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}

              {selectedPsuIds.length === 0 && (
                <div className="p-2.5 bg-[#111114] rounded-lg text-center text-xs text-zinc-400 font-mono">
                  Не выбран БП. Выберите блок питания для подачи энергии на ферму.
                </div>
              )}
            </div>
          </div>

          {/* Slot 4: GPU Slots */}
          <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">
                    5. Посадочные слоты видеокарт ({selectedGpuIds.length} / {specs.maxGpuSlots} GPU)
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    Установите от 1 до {specs.maxGpuSlots} видеокарт в стойку
                  </p>
                </div>
              </div>

              {/* Available GPUs quick add dropdown */}
              {selectedGpuIds.length < specs.maxGpuSlots && userInventoryGpus.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddGpuSlot(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-2.5 py-1 rounded bg-[#111114] border border-green-500/30 text-green-400 text-xs font-mono font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="">+ Вставить карту в слот...</option>
                    {userInventoryGpus.map((gpu, idx) => (
                      <option key={`${gpu.id}-${idx}`} value={gpu.id}>
                        {gpu.name} ({gpu.specs.hashrates?.BTC} MH/s, {gpu.powerWatts}W)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* GPU Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {Array.from({ length: specs.maxGpuSlots }).map((_, slotIdx) => {
                const gpuId = selectedGpuIds[slotIdx];
                const gpu = gpuId ? getHardwareById(gpuId) : null;

                return (
                  <div
                    key={`slot-${slotIdx}`}
                    className={`rounded-lg p-2.5 border transition font-mono ${
                      gpu
                        ? 'bg-[#111114] border-green-500/30 shadow'
                        : 'bg-[#111114]/40 border-dashed border-[#2d2d33] flex flex-col items-center justify-center min-h-[75px]'
                    }`}
                  >
                    {gpu ? (
                      <div className="flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between gap-1">
                          <div className="text-[9px] uppercase font-bold text-green-400">
                            Слот #{slotIdx + 1}
                          </div>
                          <button
                            onClick={() => handleRemoveGpuSlot(slotIdx)}
                            className="text-zinc-500 hover:text-rose-400 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs font-bold text-white mt-1 line-clamp-1">{gpu.name}</div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1.5 font-mono">
                          <span className="text-green-400 font-bold">{gpu.specs.hashrates?.BTC} MH/s</span>
                          <span>{gpu.powerWatts}W</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-1.5">
                        <span className="text-[10px] font-medium text-zinc-600">
                          Слот #{slotIdx + 1} (Свободен)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {userInventoryGpus.length === 0 && (
              <div className="mt-3 p-3 rounded-lg bg-[#111114] text-center border border-[#2d2d33] font-mono">
                <p className="text-xs text-zinc-400">В вашем инвентаре нет видеокарт.</p>
                <button onClick={onNavigateToStore} className="mt-1 text-xs text-green-400 font-bold hover:underline">
                  Перейти в магазин видеокарт →
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Live Telemetry & Ready/Deploy Action */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 shadow-xl sticky top-24 font-mono">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-green-400" />
              Расчет Характеристик Рига
            </h3>

            {/* Metric 1: Total Hashrate */}
            <div className="bg-[#111114] rounded-lg p-3 border border-[#2d2d33] mb-2.5">
              <div className="text-[10px] text-zinc-500 uppercase">Суммарный Хешрейт (BTC)</div>
              <div className="text-xl font-bold text-green-400 mt-0.5">
                {specs.totalHashrate.toFixed(1)} MH/s
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                Видеокарты: {selectedGpuIds.length} шт. • CPU: 1 шт.
              </div>
            </div>

            {/* Metric 2: Power Draw vs PSU Capacity */}
            <div className="bg-[#111114] rounded-lg p-3 border border-[#2d2d33] mb-3">
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span className="text-zinc-500 uppercase">Потребление / БП:</span>
                <span className={specs.psuCapacityWatts >= specs.totalPowerWatts ? 'text-green-400 font-bold' : 'text-rose-400 font-bold'}>
                  {specs.totalPowerWatts}W / {specs.psuCapacityWatts}W
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    specs.psuCapacityWatts >= specs.totalPowerWatts ? 'bg-green-500' : 'bg-rose-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (specs.totalPowerWatts / Math.max(1, specs.psuCapacityWatts)) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Validation Message */}
            {!specs.isValid && (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-1.5 mb-3 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{specs.validationError || 'Не все обязательные компоненты выбраны.'}</span>
              </div>
            )}

            {/* Ready / Configure Button */}
            <button
              disabled={!specs.isValid}
              onClick={() => setShowConfigModal(true)}
              className={`w-full py-2.5 rounded-lg font-bold text-xs tracking-wider transition flex items-center justify-center gap-1.5 ${
                specs.isValid
                  ? 'bg-green-500 hover:bg-green-400 text-black shadow-[0_0_12px_rgba(34,197,94,0.2)] cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-[#2d2d33]'
              }`}
            >
              <Check className="w-4 h-4" />
              ГОТОВО / СОБРАТЬ ФЕРМУ
            </button>
          </div>

        </div>

      </div>

      {/* Deployment & Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-5 max-w-lg w-full shadow-2xl relative font-mono">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#2d2d33]">
              <div>
                <h3 className="text-sm font-bold text-white">Конфигурация Майнинга</h3>
                <p className="text-[11px] text-zinc-400">Настройка stratum-пула, монеты и кошелька для автовыплат</p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDeploySubmit} className="space-y-3">
              {/* Rig Name */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Название Фермы</label>
                <input
                  type="text"
                  value={rigName}
                  onChange={(e) => setRigName(e.target.value)}
                  placeholder="Rig-Titan-01"
                  className="w-full px-3 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-bold"
                  required
                />
              </div>

              {/* Coin Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Добываемая Монета</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(['BTC', 'ETC', 'DOGE', 'HAMSTER', 'TON'] as CoinSymbol[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleCoinChange(c)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                        targetCoin === c
                          ? 'bg-green-500 text-black border-green-500 shadow'
                          : 'bg-[#111114] text-zinc-400 border-[#2d2d33] hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pool Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Майнинг Пул (Stratum Server)
                </label>
                <select
                  value={selectedPoolId}
                  onChange={(e) => setSelectedPoolId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-mono"
                >
                  {pools.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.host}) — Fee: {p.feePercent}%
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Wallet Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400">
                    Адрес для выплаты ({targetCoin})
                  </label>
                  <button
                    type="button"
                    onClick={() => setTargetWalletAddress(currentUser.cryptoAddresses[targetCoin])}
                    className="text-[10px] text-green-400 font-bold hover:underline"
                  >
                    Мой кошелек
                  </button>
                </div>
                <input
                  type="text"
                  value={targetWalletAddress}
                  onChange={(e) => setTargetWalletAddress(e.target.value)}
                  placeholder="Вставьте адрес кошелька"
                  className="w-full px-3 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-mono"
                  required
                />
              </div>

              {/* Quick Select Online Player Address to Mine to Friends! */}
              {allUsers.filter((u) => u.id !== currentUser.id).length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">
                    Майнить на кошелек друга (Игроки):
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                    {allUsers
                      .filter((u) => u.id !== currentUser.id)
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setTargetWalletAddress(p.cryptoAddresses[targetCoin])}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#111114] text-zinc-300 hover:bg-green-500/10 hover:text-green-400 border border-[#2d2d33] transition"
                        >
                          {p.avatar} {p.username}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {deployError && (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-semibold">
                  {deployError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-mono font-bold text-xs tracking-wider transition flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(34,197,94,0.2)]"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                ЗАПУСТИТЬ МАЙНИНГ ФЕРМУ
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
