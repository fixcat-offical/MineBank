import { useState, useMemo } from 'react';
import {
  Server,
  Cpu,
  Zap,
  Layers,
  Search,
  Filter,
  ShoppingCart,
  Check,
  Sparkles,
  DollarSign,
  Tag,
  Calendar,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { HardwareItem, ComponentCategory, UserAccount } from '../types';
import { ALL_HARDWARE, HARDWARE_COUNTS } from '../data/hardwareData';

interface HardwareStoreViewProps {
  currentUser: UserAccount;
  onBuyItem: (item: HardwareItem, currency: 'USD' | 'USDT') => boolean;
}

export function HardwareStoreView({ currentUser, onBuyItem }: HardwareStoreViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'year_desc' | 'power_asc' | 'hashrate_desc'>('year_desc');
  const [paymentCurrency, setPaymentCurrency] = useState<'USD' | 'USDT'>('USD');
  const [purchaseNotification, setPurchaseNotification] = useState<string | null>(null);

  // Extract all unique brands and years
  const availableBrands = useMemo(() => {
    const brands = new Set(ALL_HARDWARE.map((h) => h.brand));
    return ['all', ...Array.from(brands).sort()];
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set(ALL_HARDWARE.map((h) => h.year.toString()));
    return ['all', ...Array.from(years).sort().reverse()];
  }, []);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return ALL_HARDWARE.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedBrand !== 'all' && item.brand !== selectedBrand) return false;
      if (selectedYear !== 'all' && item.year.toString() !== selectedYear) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchBrand = item.brand.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price_desc') return b.priceUSD - a.priceUSD;
      if (sortBy === 'year_desc') return b.year - a.year;
      if (sortBy === 'power_asc') return a.powerWatts - b.powerWatts;
      if (sortBy === 'hashrate_desc') {
        const hashA = a.specs.hashrates ? Math.max(...Object.values(a.specs.hashrates)) : 0;
        const hashB = b.specs.hashrates ? Math.max(...Object.values(b.specs.hashrates)) : 0;
        return hashB - hashA;
      }
      return 0;
    });
  }, [selectedCategory, selectedBrand, selectedYear, searchQuery, sortBy]);

  const handlePurchase = (item: HardwareItem) => {
    const success = onBuyItem(item, paymentCurrency);
    if (success) {
      setPurchaseNotification(`Куплено: ${item.name} за ${item.priceUSD} ${paymentCurrency}! Добавлено в инвентарь.`);
      setTimeout(() => setPurchaseNotification(null), 3000);
    }
  };

  // Check how many of this item the user currently owns
  const getItemCountInInventory = (itemId: string, category: ComponentCategory): number => {
    const listKey = category === 'rack' ? 'racks' :
                    category === 'motherboard' ? 'motherboards' :
                    category === 'cpu' ? 'cpus' :
                    category === 'gpu' ? 'gpus' : 'psus';
    return currentUser.inventory[listKey].filter((id) => id === itemId).length;
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 text-[#e0e0e0]">
      
      {/* Header Banner */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-green-400 font-mono text-[10px] uppercase tracking-wider mb-0.5">
            <Server className="w-3.5 h-3.5" />
            Hardware Components Supply Depot
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            Каталог Оборудования (300+ Моделей)
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5 max-w-2xl">
            Стойки, материнские платы до 19 слотов PCIe, процессоры, видеокарты от GTX 1060 до RTX 5090 и блоки питания.
          </p>
        </div>

        {/* Payment Currency Toggle */}
        <div className="flex items-center gap-2 bg-[#111114] border border-[#2d2d33] p-1.5 rounded-lg shrink-0">
          <span className="text-[10px] font-mono text-zinc-500 pl-1">Оплата:</span>
          <button
            onClick={() => setPaymentCurrency('USD')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${
              paymentCurrency === 'USD'
                ? 'bg-green-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            USD (${currentUser.bankBalanceUSD.toFixed(0)})
          </button>
          <button
            onClick={() => setPaymentCurrency('USDT')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${
              paymentCurrency === 'USDT'
                ? 'bg-cyan-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            USDT ({currentUser.cryptoBalances.USDT.toFixed(0)} ₮)
          </button>
        </div>
      </div>

      {purchaseNotification && (
        <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          {purchaseNotification}
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono">
        {[
          { id: 'all', label: `Все (${HARDWARE_COUNTS.total})`, icon: Sparkles },
          { id: 'rack', label: `Стойки (${HARDWARE_COUNTS.racks})`, icon: Server },
          { id: 'motherboard', label: `Материнки (${HARDWARE_COUNTS.motherboards})`, icon: Layers },
          { id: 'cpu', label: `CPU (${HARDWARE_COUNTS.cpus})`, icon: Cpu },
          { id: 'gpu', label: `GPU (${HARDWARE_COUNTS.gpus})`, icon: Flame },
          { id: 'psu', label: `БП (${HARDWARE_COUNTS.psus})`, icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                isSelected
                  ? 'bg-green-500 text-black shadow'
                  : 'bg-[#151518] text-zinc-300 hover:bg-zinc-800 border border-[#2d2d33]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-[#151518] border border-[#2d2d33] rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск модели (RTX 4090, B250...)"
            className="w-full pl-8 pr-3 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500"
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
        </div>

        {/* Brand */}
        <div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-medium"
          >
            <option value="all">Все бренды</option>
            {availableBrands.filter((b) => b !== 'all').map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-medium"
          >
            <option value="all">Все года (2015-2026)</option>
            {availableYears.filter((y) => y !== 'all').map((year) => (
              <option key={year} value={year}>
                Год: {year}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-2.5 py-1.5 bg-[#111114] border border-[#2d2d33] rounded-lg text-xs text-white focus:outline-none focus:border-green-500 font-medium"
          >
            <option value="year_desc">Сначала новые (2026 → 2015)</option>
            <option value="price_asc">Цена: по возрастанию ($)</option>
            <option value="price_desc">Цена: по убыванию ($)</option>
            <option value="hashrate_desc">По максимальному хешрейту</option>
            <option value="power_asc">По энергоэффективности (W)</option>
          </select>
        </div>
      </div>

      {/* Hardware Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredItems.map((item) => {
          const ownedCount = getItemCountInInventory(item.id, item.category);

          return (
            <div
              key={item.id}
              className="bg-[#151518] border border-[#2d2d33] hover:border-zinc-600 rounded-xl p-3.5 shadow-xl transition flex flex-col justify-between group font-mono"
            >
              <div>
                {/* Top Badge & Category */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111114] text-zinc-300 border border-[#2d2d33]">
                    {item.brand} • {item.year}
                  </span>
                  {ownedCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                      В инвентаре: {ownedCount}
                    </span>
                  )}
                </div>

                {/* Item Name */}
                <h3 className="text-xs font-bold text-white group-hover:text-green-400 transition line-clamp-2 leading-snug">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-tight">
                  {item.description}
                </p>

                {/* Specs Box */}
                <div className="mt-2.5 bg-[#111114] rounded-lg p-2.5 border border-[#2d2d33] space-y-1 text-[10px]">
                  {item.category === 'rack' && (
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-500">Вместимость:</span>
                      <span className="font-bold text-green-400">{item.specs.maxGpus} GPU</span>
                    </div>
                  )}

                  {item.category === 'motherboard' && (
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-500">PCIe Слотов:</span>
                      <span className="font-bold text-cyan-400">{item.specs.maxGpus} ({item.specs.socket})</span>
                    </div>
                  )}

                  {item.category === 'psu' && (
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-500">Мощность:</span>
                      <span className="font-bold text-green-400">{item.powerWatts} Ватт</span>
                    </div>
                  )}

                  {item.category === 'cpu' && (
                    <>
                      <div className="flex justify-between text-zinc-300">
                        <span className="text-zinc-500">Сокет / Ядра:</span>
                        <span className="text-zinc-200">{item.specs.socket} ({item.specs.cores}c)</span>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span className="text-zinc-500">TDP:</span>
                        <span className="text-zinc-200">{item.powerWatts}W</span>
                      </div>
                    </>
                  )}

                  {item.category === 'gpu' && (
                    <>
                      <div className="flex justify-between text-zinc-300">
                        <span className="text-zinc-500">VRAM / TDP:</span>
                        <span className="text-zinc-200">{item.specs.vramGB}GB • {item.powerWatts}W</span>
                      </div>
                      <div className="flex justify-between text-zinc-300 pt-1 border-t border-[#2d2d33]">
                        <span className="text-zinc-500">BTC/ETC Hash:</span>
                        <span className="font-bold text-green-400">
                          {item.specs.hashrates?.BTC} / {item.specs.hashrates?.ETC} MH
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Price & Buy Button */}
              <div className="mt-3 pt-2.5 border-t border-[#2d2d33] flex items-center justify-between gap-2">
                <div>
                  <div className="text-[9px] text-zinc-500 uppercase">Цена</div>
                  <div className="text-sm font-bold text-white font-mono">
                    ${item.priceUSD.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(item)}
                  className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-400 text-black font-mono font-bold text-xs tracking-wider transition flex items-center gap-1 shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                >
                  <ShoppingCart className="w-3 h-3" />
                  Купить
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-10 bg-[#151518] rounded-xl border border-[#2d2d33] font-mono">
          <p className="text-zinc-500 text-xs">Компоненты по заданным фильтрам не найдены.</p>
        </div>
      )}

    </div>
  );
}
