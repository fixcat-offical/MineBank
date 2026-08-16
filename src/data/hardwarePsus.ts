import { HardwareItem } from '../types';

// 60+ Real Power Supplies (PSUs) & Server Mining PSUs across Corsair, EVGA, Seasonic, be quiet!, Super Flower,
// Great Wall, Delta, HP Server, Dell Server, Thermaltake, Cooler Master, Silverstone, Segotep, etc.
// with power wattage capacity (650W to 3300W), 80-Plus efficiency, modularity, release years (2015-2026), and prices
export const PSUS_DATA: HardwareItem[] = [
  // High-Capacity Multi-GPU Mining Power Supplies (1600W - 3300W)
  {
    id: 'psu-great-wall-3300w',
    category: 'psu',
    name: 'Great Wall GW-3300W Mining Edition (90+ Gold)',
    brand: 'Great Wall',
    year: 2021,
    priceUSD: 319,
    powerWatts: 3300,
    description: 'High capacity 3300W mining beast with 16x 6+2 pin PCIe power connectors.',
    specs: { efficiencyRating: '80 Plus Gold', modular: false, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-great-wall-2000w',
    category: 'psu',
    name: 'Great Wall GW-2000W 8-GPU Direct (90+ Gold)',
    brand: 'Great Wall',
    year: 2020,
    priceUSD: 199,
    powerWatts: 2000,
    description: 'Dedicated continuous 2000W load PSU for 8x RTX 3070/3080 mining rigs.',
    specs: { efficiencyRating: '80 Plus Gold', modular: false, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-hp-server-2450w-breakout',
    category: 'psu',
    name: 'HP Common Slot 2450W Platinum Server PSU + Breakout Board',
    brand: 'HP Server',
    year: 2019,
    priceUSD: 179,
    powerWatts: 2450,
    description: '94% Platinum server power module with 16-port breakout board and heavy gauge 16AWG cables.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-hp-server-1200w-breakout',
    category: 'psu',
    name: 'HP Common Slot 1200W Platinum Server PSU + Breakout Board',
    brand: 'HP Server',
    year: 2017,
    priceUSD: 89,
    powerWatts: 1200,
    description: 'The golden standard of budget mining power: whisper quiet, durable, and hyper efficient.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-dell-server-2400w-breakout',
    category: 'psu',
    name: 'Dell PowerEdge 2400W Titanium Server PSU + Breakout Kit',
    brand: 'Dell Server',
    year: 2020,
    priceUSD: 210,
    powerWatts: 2400,
    description: '96% Titanium enterprise efficiency with auto-sensing 110V/240V power rails.',
    specs: { efficiencyRating: '80 Plus Titanium', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-delta-2400w-server',
    category: 'psu',
    name: 'Delta Electronics 2400W Platinum Server Unit',
    brand: 'Delta',
    year: 2021,
    priceUSD: 195,
    powerWatts: 2400,
    description: 'Industrial continuous 2400W 12V output with active power factor correction.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-evga-supernova-2000g-plus',
    category: 'psu',
    name: 'EVGA SuperNOVA 2000 G+ 2000W (80+ Gold)',
    brand: 'EVGA',
    year: 2021,
    priceUSD: 449,
    powerWatts: 2000,
    description: 'Fully modular consumer beast with 100% Japanese capacitors and 14x PCIe cables.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-evga-supernova-1600-t2',
    category: 'psu',
    name: 'EVGA SuperNOVA 1600 T2 1600W (80+ Titanium)',
    brand: 'EVGA',
    year: 2016,
    priceUSD: 499,
    powerWatts: 1600,
    description: '96% efficiency Titanium flagship with ECO thermal control mode.',
    specs: { efficiencyRating: '80 Plus Titanium', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-evga-supernova-1600-p2',
    category: 'psu',
    name: 'EVGA SuperNOVA 1600 P2 1600W (80+ Platinum)',
    brand: 'EVGA',
    year: 2015,
    priceUSD: 399,
    powerWatts: 1600,
    description: 'Proven multi-GPU mining staple with rock-solid voltage regulation.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-evga-supernova-1300-g-plus',
    category: 'psu',
    name: 'EVGA SuperNOVA 1300 G+ 1300W (80+ Gold)',
    brand: 'EVGA',
    year: 2021,
    priceUSD: 249,
    powerWatts: 1300,
    description: 'Heavy duty fluid dynamic bearing fan with 8x 8-pin PCIe cables.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-evga-supernova-1000-g6',
    category: 'psu',
    name: 'EVGA SuperNOVA 1000 G6 1000W (80+ Gold)',
    brand: 'EVGA',
    year: 2021,
    priceUSD: 189,
    powerWatts: 1000,
    description: 'Ultra compact 140mm depth chassis with full modular cabling.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-evga-supernova-850-gt',
    category: 'psu',
    name: 'EVGA SuperNOVA 850 GT 850W (80+ Gold)',
    brand: 'EVGA',
    year: 2020,
    priceUSD: 129,
    powerWatts: 850,
    description: 'Reliable 850W unit with auto eco mode for 3-4 GPU setups.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-evga-supernova-750-g5',
    category: 'psu',
    name: 'EVGA SuperNOVA 750 G5 750W (80+ Gold)',
    brand: 'EVGA',
    year: 2019,
    priceUSD: 109,
    powerWatts: 750,
    description: 'Solid DC-DC converter technology with clean 12V single rail.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  // Corsair High-Performance PSUs
  {
    id: 'psu-corsair-ax1600i',
    category: 'psu',
    name: 'Corsair AX1600i 1600W (80+ Titanium Digital)',
    brand: 'Corsair',
    year: 2018,
    priceUSD: 609,
    powerWatts: 1600,
    description: 'Gallium Nitride (GaN) transistors delivering industry benchmark efficiency and iCUE monitoring.',
    specs: { efficiencyRating: '80 Plus Titanium', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-corsair-hx1500i',
    category: 'psu',
    name: 'Corsair HX1500i 1500W (80+ Platinum Digital)',
    brand: 'Corsair',
    year: 2022,
    priceUSD: 399,
    powerWatts: 1500,
    description: 'Digital signal processor with fluid dynamic bearing and ATX 3.0 readiness.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-corsair-hx1200',
    category: 'psu',
    name: 'Corsair HX1200 1200W (80+ Platinum)',
    brand: 'Corsair',
    year: 2017,
    priceUSD: 269,
    powerWatts: 1200,
    description: 'Legendary 1200W Platinum workhorse powering millions of 6-GPU rigs.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-corsair-hx1000i',
    category: 'psu',
    name: 'Corsair HX1000i 1000W (80+ Platinum)',
    brand: 'Corsair',
    year: 2022,
    priceUSD: 239,
    powerWatts: 1000,
    description: 'Zero RPM fan mode and magnetic levitation fan for whisper operation.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-corsair-rm1200x-shift',
    category: 'psu',
    name: 'Corsair RM1200x SHIFT 1200W (80+ Gold ATX 3.0)',
    brand: 'Corsair',
    year: 2023,
    priceUSD: 219,
    powerWatts: 1200,
    description: 'Side-mounted modular cable interface with native PCIe 5.0 12VHPWR cables.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-corsair-rm1000x',
    category: 'psu',
    name: 'Corsair RM1000x 1000W (80+ Gold)',
    brand: 'Corsair',
    year: 2021,
    priceUSD: 189,
    powerWatts: 1000,
    description: '100% all Japanese 105C rated capacitors with low ripple noise.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-corsair-rm850x',
    category: 'psu',
    name: 'Corsair RM850x 850W (80+ Gold)',
    brand: 'Corsair',
    year: 2021,
    priceUSD: 149,
    powerWatts: 850,
    description: 'Standard 850W power supply for 3x GPU mining rigs.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-corsair-rm750e',
    category: 'psu',
    name: 'Corsair RM750e 750W (80+ Gold ATX 3.0)',
    brand: 'Corsair',
    year: 2023,
    priceUSD: 99,
    powerWatts: 750,
    description: 'Compact 750W modular unit for entry mining systems.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  // Seasonic High-End Units
  {
    id: 'psu-seasonic-prime-tx-1600',
    category: 'psu',
    name: 'Seasonic PRIME TX-1600 1600W (80+ Titanium ATX 3.0)',
    brand: 'Seasonic',
    year: 2023,
    priceUSD: 549,
    powerWatts: 1600,
    description: 'Industry benchmark micro-tolerance load regulation (<0.5%) and 12-year warranty.',
    specs: { efficiencyRating: '80 Plus Titanium', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-seasonic-prime-px-1300',
    category: 'psu',
    name: 'Seasonic PRIME PX-1300 1300W (80+ Platinum)',
    brand: 'Seasonic',
    year: 2020,
    priceUSD: 319,
    powerWatts: 1300,
    description: 'Premium hybrid fan control with fluid dynamic bearings for continuous operation.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-seasonic-focus-gx-1000',
    category: 'psu',
    name: 'Seasonic FOCUS GX-1000 ATX 3.0 1000W (80+ Gold)',
    brand: 'Seasonic',
    year: 2023,
    priceUSD: 179,
    powerWatts: 1000,
    description: 'Compact 140mm size with native 12V-2x6 cable.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-seasonic-focus-gx-850',
    category: 'psu',
    name: 'Seasonic FOCUS GX-850 850W (80+ Gold)',
    brand: 'Seasonic',
    year: 2021,
    priceUSD: 139,
    powerWatts: 850,
    description: 'Tight voltage regulation with cable-free connection design inside the PSU.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  // be quiet! Series
  {
    id: 'psu-bequiet-dark-power-pro-13-1600w',
    category: 'psu',
    name: 'be quiet! Dark Power Pro 13 1600W (80+ Titanium)',
    brand: 'be quiet!',
    year: 2023,
    priceUSD: 459,
    powerWatts: 1600,
    description: 'Full digital control (PFC, LLC, SR/12V) with frameless Silent Wings fan.',
    specs: { efficiencyRating: '80 Plus Titanium', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-bequiet-dark-power-13-1000w',
    category: 'psu',
    name: 'be quiet! Dark Power 13 1000W (80+ Titanium)',
    brand: 'be quiet!',
    year: 2023,
    priceUSD: 279,
    powerWatts: 1000,
    description: '95.8% Titanium efficiency with Overclocking Key to combine 4x 12V rails into one.',
    specs: { efficiencyRating: '80 Plus Titanium', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-bequiet-straight-power-12-1200w',
    category: 'psu',
    name: 'be quiet! Straight Power 12 1200W (80+ Platinum)',
    brand: 'be quiet!',
    year: 2023,
    priceUSD: 249,
    powerWatts: 1200,
    description: 'Massive 12V single rail capable of powering multiple power-hungry GPUs.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-bequiet-pure-power-12-m-1000w',
    category: 'psu',
    name: 'be quiet! Pure Power 12 M 1000W (80+ Gold)',
    brand: 'be quiet!',
    year: 2023,
    priceUSD: 169,
    powerWatts: 1000,
    description: 'LLC technology with 2 independent 12V rails and PCIe 5.0 connector.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-bequiet-pure-power-12-m-850w',
    category: 'psu',
    name: 'be quiet! Pure Power 12 M 850W (80+ Gold)',
    brand: 'be quiet!',
    year: 2023,
    priceUSD: 135,
    powerWatts: 850,
    description: 'Silence-optimized 120mm be quiet! fan with high airflow blades.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  // Super Flower & Segotep & Great Wall
  {
    id: 'psu-superflower-leadex-titanium-1600w',
    category: 'psu',
    name: 'Super Flower Leadex Titanium 1600W',
    brand: 'Super Flower',
    year: 2017,
    priceUSD: 419,
    powerWatts: 1600,
    description: 'Patented illuminated crystal universal modular connectors with Titanium efficiency.',
    specs: { efficiencyRating: '80 Plus Titanium', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-superflower-leadex-platinum-2000w',
    category: 'psu',
    name: 'Super Flower Leadex Platinum 2000W 8Pack Edition',
    brand: 'Super Flower',
    year: 2018,
    priceUSD: 499,
    powerWatts: 2000,
    description: 'Co-developed with world record overclocker 8Pack for extreme load stability.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-superflower-leadex-vii-gold-1300w',
    category: 'psu',
    name: 'Super Flower Leadex VII Gold 1300W (ATX 3.0)',
    brand: 'Super Flower',
    year: 2023,
    priceUSD: 229,
    powerWatts: 1300,
    description: 'High power density with 140mm fluid dynamic bearing cooling.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-segotep-kl-1250g',
    category: 'psu',
    name: 'Segotep KL-1250G 1250W (80+ Gold ATX 3.0)',
    brand: 'Segotep',
    year: 2023,
    priceUSD: 169,
    powerWatts: 1250,
    description: 'Cost effective 1250W dual 12VHPWR mining power supply.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-segotep-1800w-mining',
    category: 'psu',
    name: 'Segotep 1800W Dedicated 8-GPU Mining PSU',
    brand: 'Segotep',
    year: 2020,
    priceUSD: 169,
    powerWatts: 1800,
    description: 'Dual fan push-pull cooling with 16x PCIe 8-pin cables.',
    specs: { efficiencyRating: '80 Plus Gold', modular: false, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  // Thermaltake & Cooler Master & Silverstone
  {
    id: 'psu-thermaltake-toughpower-gf3-1650w',
    category: 'psu',
    name: 'Thermaltake Toughpower GF3 1650W (80+ Gold PCIe 5.0)',
    brand: 'Thermaltake',
    year: 2022,
    priceUSD: 349,
    powerWatts: 1650,
    description: 'Dual 16-pin PCIe 5.0 connectors with 100% Japanese 105C capacitors.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-thermaltake-toughpower-gf-plus-1200w',
    category: 'psu',
    name: 'Thermaltake Toughpower GF Plus 1200W (80+ Gold)',
    brand: 'Thermaltake',
    year: 2021,
    priceUSD: 199,
    powerWatts: 1200,
    description: 'Riing Duo 14 RGB Fan with Smart Zero Fan technology.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-coolermaster-mwe-gold-1250-v2',
    category: 'psu',
    name: 'Cooler Master MWE Gold 1250 V2 (80+ Gold ATX 3.0)',
    brand: 'Cooler Master',
    year: 2023,
    priceUSD: 189,
    powerWatts: 1250,
    description: 'High temperature resilience (up to 50C ambient) with 140mm quiet fan.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-coolermaster-v1300-platinum',
    category: 'psu',
    name: 'Cooler Master V1300 Platinum 1300W',
    brand: 'Cooler Master',
    year: 2019,
    priceUSD: 289,
    powerWatts: 1300,
    description: 'Platinum efficiency with 16AWG high-current PCIe cables.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-silverstone-hela-2050-platinum',
    category: 'psu',
    name: 'SilverStone HELA 2050 Platinum 2050W',
    brand: 'SilverStone',
    year: 2022,
    priceUSD: 599,
    powerWatts: 2050,
    description: 'Highest power density ATX power supply in the world with compact 180mm depth.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-silverstone-strider-1500w-titanium',
    category: 'psu',
    name: 'SilverStone Strider Titanium 1500W',
    brand: 'SilverStone',
    year: 2018,
    priceUSD: 389,
    powerWatts: 1500,
    description: '1500W continuous output with 24/7 continuous operation rating at 50C.',
    specs: { efficiencyRating: '80 Plus Titanium', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-silverstone-da1000r-gold',
    category: 'psu',
    name: 'SilverStone Decathlon DA1000R Gold 1000W',
    brand: 'SilverStone',
    year: 2023,
    priceUSD: 169,
    powerWatts: 1000,
    description: 'Cybenetics Gold certified with flexible flat black modular cables.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  // FSP & ASUS ROG & MSI MEG PSUs
  {
    id: 'psu-fsp-cannon-pro-2000w',
    category: 'psu',
    name: 'FSP Cannon Pro 2000W (80+ Gold Mining Edition)',
    brand: 'FSP',
    year: 2020,
    priceUSD: 369,
    powerWatts: 2000,
    description: '18x PCIe 6+2 pin connectors designed for extreme cryptocurrency mining rigs.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-fsp-hydro-ptm-pro-1200w',
    category: 'psu',
    name: 'FSP Hydro PTM PRO 1200W (80+ Platinum ATX 3.0)',
    brand: 'FSP',
    year: 2022,
    priceUSD: 229,
    powerWatts: 1200,
    description: 'Conformal coating protection against harsh dust, moisture, and stains.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-asus-rog-thor-1600t-gaming',
    category: 'psu',
    name: 'ASUS ROG Thor 1600W Titanium',
    brand: 'ASUS',
    year: 2022,
    priceUSD: 649,
    powerWatts: 1600,
    description: 'OLED power display with GaN MOSFETs and ROG heatsinks for 0dB silent operation.',
    specs: { efficiencyRating: '80 Plus Titanium', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-asus-rog-thor-1200p2',
    category: 'psu',
    name: 'ASUS ROG Thor 1200W Platinum II',
    brand: 'ASUS',
    year: 2022,
    priceUSD: 349,
    powerWatts: 1200,
    description: 'Integrated OLED wattage readout with Lambda A++ noise certification.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-asus-tuf-gaming-1000g',
    category: 'psu',
    name: 'ASUS TUF Gaming 1000W Gold',
    brand: 'ASUS',
    year: 2023,
    priceUSD: 179,
    powerWatts: 1000,
    description: 'Military-grade components and dual ball bearing fans.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-msi-meg-ai1300p-pcie5',
    category: 'psu',
    name: 'MSI MEG Ai1300P PCIE5 1300W (80+ Platinum)',
    brand: 'MSI',
    year: 2022,
    priceUSD: 319,
    powerWatts: 1300,
    description: 'Built-in software MCU monitoring real-time power consumption and temperature.',
    specs: { efficiencyRating: '80 Plus Platinum', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-msi-mag-a1000gl-pcie5',
    category: 'psu',
    name: 'MSI MAG A1000GL PCIE5 1000W (80+ Gold)',
    brand: 'MSI',
    year: 2023,
    priceUSD: 159,
    powerWatts: 1000,
    description: 'Dual-color 16-pin connector ensures complete seated connection.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-msi-mag-a850gl-pcie5',
    category: 'psu',
    name: 'MSI MAG A850GL PCIE5 850W (80+ Gold)',
    brand: 'MSI',
    year: 2023,
    priceUSD: 129,
    powerWatts: 850,
    description: 'Compact 850W Gold power unit with ATX 3.0 support.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  // Budget & Entry Level Workhorse PSUs (650W - 850W)
  {
    id: 'psu-chieftec-navitas-1250w',
    category: 'psu',
    name: 'Chieftec Navitas 1250W (80+ Gold)',
    brand: 'Chieftec',
    year: 2017,
    priceUSD: 145,
    powerWatts: 1250,
    description: 'Affordable high wattage European favorite for multi-GPU arrays.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-deepcool-pq1000m',
    category: 'psu',
    name: 'DeepCool PQ1000M 1000W (80+ Gold)',
    brand: 'DeepCool',
    year: 2022,
    priceUSD: 149,
    powerWatts: 1000,
    description: 'Seasonics-partnered OEM platform with full modular flat black cables.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-deepcool-px1200g',
    category: 'psu',
    name: 'DeepCool PX1200G 1200W (80+ Gold ATX 3.0)',
    brand: 'DeepCool',
    year: 2023,
    priceUSD: 199,
    powerWatts: 1200,
    description: 'Dedicated 12V-2x6 power delivery with fluid dynamic bearing fan.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-aerocool-kcas-plus-800w',
    category: 'psu',
    name: 'AeroCool KCAS PLUS 800W (80+ Bronze)',
    brand: 'AeroCool',
    year: 2018,
    priceUSD: 59,
    powerWatts: 800,
    description: 'Budget entry PSU for low-power 2-3 GPU setups.',
    specs: { efficiencyRating: '80 Plus Bronze', modular: false, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-gigabyte-ud850gm-pg5',
    category: 'psu',
    name: 'Gigabyte UD850GM PG5 850W (80+ Gold)',
    brand: 'Gigabyte',
    year: 2022,
    priceUSD: 119,
    powerWatts: 850,
    description: 'Ultra Durable design with enlarged heatsink and 120mm smart hydraulic bearing fan.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-gigabyte-ud1000gm-pg5',
    category: 'psu',
    name: 'Gigabyte UD1000GM PG5 1000W (80+ Gold PCIe 5.0)',
    brand: 'Gigabyte',
    year: 2022,
    priceUSD: 159,
    powerWatts: 1000,
    description: '1000W continuous output with 6x PCIe 8-pin and 1x 16-pin PCIe 5.0.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-cougar-gx-f-aurum-750w',
    category: 'psu',
    name: 'COUGAR GX-F Aurum 750W (80+ Gold)',
    brand: 'COUGAR',
    year: 2019,
    priceUSD: 89,
    powerWatts: 750,
    description: 'LLC resonant converter with solid DC-DC stabilization.',
    specs: { efficiencyRating: '80 Plus Gold', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-zalman-gigamax-750w',
    category: 'psu',
    name: 'Zalman GigaMax 750W (80+ Bronze)',
    brand: 'Zalman',
    year: 2020,
    priceUSD: 69,
    powerWatts: 750,
    description: 'Active PFC with flat cables for cost-effective starter mining frames.',
    specs: { efficiencyRating: '80 Plus Bronze', modular: false, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  },
  {
    id: 'psu-evga-650-bq',
    category: 'psu',
    name: 'EVGA 650 BQ 650W (80+ Bronze Semi-Modular)',
    brand: 'EVGA',
    year: 2016,
    priceUSD: 59,
    powerWatts: 650,
    description: 'Entry level semi-modular PSU for 1-2 GPU testing rigs.',
    specs: { efficiencyRating: '80 Plus Bronze', modular: true, hashrates: { BTC: 0, ETC: 0, DOGE: 0, HAMSTER: 0, TON: 0 } }
  }
];
