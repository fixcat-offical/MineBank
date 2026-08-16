import { BusinessTemplate } from '../types';

export const BUSINESS_TEMPLATES: BusinessTemplate[] = [
  {
    id: 'biz-pc-club',
    name: 'Cyber Lounge & PC Club',
    category: 'Entertainment & Gaming',
    description: 'A 24/7 esports cyber arena with high-end RTX rigs that mine cryptocurrency during off-peak night hours.',
    baseCostUSD: 5000,
    baseIncomePerHourUSD: 180,
    icon: 'Gamepad2',
    image: '🎮',
    maxLevel: 25
  },
  {
    id: 'biz-repair-shop',
    name: 'Crypto & GPU Repair Lab',
    category: 'Hardware Maintenance',
    description: 'Diagnoses dead GPUs, re-balls memory chips, and replaces thermal pads for miners across the city.',
    baseCostUSD: 8500,
    baseIncomePerHourUSD: 340,
    icon: 'Wrench',
    image: '🔧',
    maxLevel: 25
  },
  {
    id: 'biz-crypto-atm',
    name: 'Metropolitan Crypto ATM Network',
    category: 'Fintech & Cash',
    description: 'A network of physical bi-directional Bitcoin & USDT kiosks in shopping malls collecting 3.5% transaction fees.',
    baseCostUSD: 16000,
    baseIncomePerHourUSD: 720,
    icon: 'CircleDollarSign',
    image: '🏧',
    maxLevel: 25
  },
  {
    id: 'biz-mining-host',
    name: 'Hydro-Cooled Mining Hotel',
    category: 'Colocation & Hosting',
    description: 'Industrial warehouse providing cheap hydro-electric power, high CFM ventilation, and ASIC colocation for clients.',
    baseCostUSD: 32000,
    baseIncomePerHourUSD: 1550,
    icon: 'Building2',
    image: '🏭',
    maxLevel: 30
  },
  {
    id: 'biz-solar-farm',
    name: 'Solar Eco-Mining Station',
    category: 'Green Energy',
    description: 'A 5-megawatt solar panel farm generating zero-cost green electricity while selling excess power back to the grid.',
    baseCostUSD: 75000,
    baseIncomePerHourUSD: 3800,
    icon: 'SunMedium',
    image: '☀️',
    maxLevel: 30
  },
  {
    id: 'biz-ai-compute',
    name: 'AI Neural Cloud Cluster',
    category: 'Artificial Intelligence',
    description: 'Rents distributed high-bandwidth GPU clusters to LLM research labs and render farms during non-mining hours.',
    baseCostUSD: 180000,
    baseIncomePerHourUSD: 9600,
    icon: 'Cpu',
    image: '🧠',
    maxLevel: 35
  },
  {
    id: 'biz-crypto-exchange-desk',
    name: 'OTC Crypto Brokerage Desk',
    category: 'Financial Markets',
    description: 'Facilitates multi-million dollar high-volume block trades between institutional funds and whale miners.',
    baseCostUSD: 450000,
    baseIncomePerHourUSD: 24500,
    icon: 'TrendingUp',
    image: '📈',
    maxLevel: 40
  },
  {
    id: 'biz-silicon-fab',
    name: 'ASIC Micro-Foundry & Chip Design',
    category: 'Semiconductors',
    description: 'Designs next-generation 3nm mining accelerators and sells customized cryptographic wafers globally.',
    baseCostUSD: 1200000,
    baseIncomePerHourUSD: 68000,
    icon: 'Microchip',
    image: '🔬',
    maxLevel: 50
  }
];

export function calculateBusinessIncomePerHour(template: BusinessTemplate, level: number, staffCount: number, marketingLevel: number): number {
  const levelMultiplier = 1 + (level - 1) * 0.45;
  const staffMultiplier = 1 + staffCount * 0.15;
  const marketingMultiplier = 1 + marketingLevel * 0.20;
  return Math.round(template.baseIncomePerHourUSD * levelMultiplier * staffMultiplier * marketingMultiplier);
}

export function calculateUpgradeCost(template: BusinessTemplate, currentLevel: number): number {
  return Math.round(template.baseCostUSD * 0.65 * Math.pow(1.35, currentLevel));
}

export function calculateStaffCost(currentStaff: number): number {
  return Math.round(1200 * Math.pow(1.4, currentStaff));
}

export function calculateMarketingCost(currentMarketing: number): number {
  return Math.round(2500 * Math.pow(1.5, currentMarketing));
}
