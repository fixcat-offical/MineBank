import { HardwareItem } from '../types';

// 60+ Real Graphics Cards across NVIDIA and AMD with authentic specs, years (2016-2026), prices, TDP, VRAM, and realistic hashrates
export const GPUS_DATA: HardwareItem[] = [
  // RTX 50 Series (Next-Gen)
  {
    id: 'gpu-rtx-5090',
    category: 'gpu',
    name: 'NVIDIA GeForce RTX 5090 32GB',
    brand: 'NVIDIA',
    year: 2025,
    priceUSD: 2399,
    powerWatts: 575,
    description: 'Blackwell architecture flagship. Monstrous compute power and colossal 32GB GDDR7 bandwidth.',
    specs: {
      vramGB: 32,
      hashrates: { BTC: 420.0, ETC: 215.0, DOGE: 185.0, HAMSTER: 950.0, TON: 18.5 }
    }
  },
  {
    id: 'gpu-rtx-5080',
    category: 'gpu',
    name: 'NVIDIA GeForce RTX 5080 16GB',
    brand: 'NVIDIA',
    year: 2025,
    priceUSD: 1299,
    powerWatts: 380,
    description: 'Ultra-fast GDDR7 memory mining powerhouse with exceptional power efficiency.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 310.0, ETC: 165.0, DOGE: 135.0, HAMSTER: 720.0, TON: 14.2 }
    }
  },
  {
    id: 'gpu-rtx-5070ti',
    category: 'gpu',
    name: 'ASUS ROG Astral RTX 5070 Ti 16GB',
    brand: 'ASUS',
    year: 2025,
    priceUSD: 899,
    powerWatts: 285,
    description: 'Premium overclocked edition with axial tech cooling and optimized mining thermal pads.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 245.0, ETC: 130.0, DOGE: 105.0, HAMSTER: 560.0, TON: 11.0 }
    }
  },
  {
    id: 'gpu-rtx-5070',
    category: 'gpu',
    name: 'MSI Gaming Trio RTX 5070 12GB',
    brand: 'MSI',
    year: 2025,
    priceUSD: 649,
    powerWatts: 240,
    description: 'Tri-Frozr 4 thermal architecture for whisper quiet 24/7 continuous mining rigs.',
    specs: {
      vramGB: 12,
      hashrates: { BTC: 195.0, ETC: 108.0, DOGE: 86.0, HAMSTER: 440.0, TON: 8.8 }
    }
  },
  // RTX 40 Series
  {
    id: 'gpu-rtx-4090-strix',
    category: 'gpu',
    name: 'ASUS ROG Strix RTX 4090 OC 24GB',
    brand: 'ASUS',
    year: 2023,
    priceUSD: 1899,
    powerWatts: 450,
    description: 'Top tier Ada Lovelace card with massive vapor chamber and rugged heatsink design.',
    specs: {
      vramGB: 24,
      hashrates: { BTC: 340.0, ETC: 180.0, DOGE: 150.0, HAMSTER: 780.0, TON: 15.5 }
    }
  },
  {
    id: 'gpu-rtx-4090-suprim',
    category: 'gpu',
    name: 'MSI Suprim X RTX 4090 24GB',
    brand: 'MSI',
    year: 2023,
    priceUSD: 1849,
    powerWatts: 450,
    description: 'Brushed metal shroud and extreme power delivery VRM built for non-stop compute.',
    specs: {
      vramGB: 24,
      hashrates: { BTC: 335.0, ETC: 178.0, DOGE: 148.0, HAMSTER: 770.0, TON: 15.2 }
    }
  },
  {
    id: 'gpu-rtx-4080-super',
    category: 'gpu',
    name: 'Gigabyte AORUS RTX 4080 Super Master 16GB',
    brand: 'Gigabyte',
    year: 2024,
    priceUSD: 1099,
    powerWatts: 320,
    description: 'LCD edge view monitor with windforce bionic shark fans and dual BIOS.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 260.0, ETC: 142.0, DOGE: 118.0, HAMSTER: 610.0, TON: 12.0 }
    }
  },
  {
    id: 'gpu-rtx-4080',
    category: 'gpu',
    name: 'ZOTAC Trinity RTX 4080 16GB',
    brand: 'ZOTAC',
    year: 2022,
    priceUSD: 980,
    powerWatts: 320,
    description: 'Aerodynamic IceStorm 2.0 cooling system designed for multi-GPU density.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 245.0, ETC: 135.0, DOGE: 110.0, HAMSTER: 570.0, TON: 11.2 }
    }
  },
  {
    id: 'gpu-rtx-4070ti-super',
    category: 'gpu',
    name: 'PNY XLR8 RTX 4070 Ti Super 16GB',
    brand: 'PNY',
    year: 2024,
    priceUSD: 829,
    powerWatts: 285,
    description: 'Epic-X RGB triple fan design with 16GB 256-bit memory bus ideal for Etchash and Ton.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 215.0, ETC: 120.0, DOGE: 98.0, HAMSTER: 490.0, TON: 9.8 }
    }
  },
  {
    id: 'gpu-rtx-4070-super',
    category: 'gpu',
    name: 'Inno3D iChill X3 RTX 4070 Super 12GB',
    brand: 'Inno3D',
    year: 2024,
    priceUSD: 620,
    powerWatts: 220,
    description: 'High efficiency compact cooler with reinforced backplate and low power consumption.',
    specs: {
      vramGB: 12,
      hashrates: { BTC: 175.0, ETC: 98.0, DOGE: 79.0, HAMSTER: 395.0, TON: 7.9 }
    }
  },
  {
    id: 'gpu-rtx-4070',
    category: 'gpu',
    name: 'Palit Dual RTX 4070 12GB',
    brand: 'Palit',
    year: 2023,
    priceUSD: 549,
    powerWatts: 200,
    description: '2-slot compact design allowing high density 8-GPU array placement.',
    specs: {
      vramGB: 12,
      hashrates: { BTC: 155.0, ETC: 88.0, DOGE: 71.0, HAMSTER: 350.0, TON: 7.0 }
    }
  },
  {
    id: 'gpu-rtx-4060ti-16gb',
    category: 'gpu',
    name: 'Gainward Ghost RTX 4060 Ti 16GB',
    brand: 'Gainward',
    year: 2023,
    priceUSD: 469,
    powerWatts: 165,
    description: 'Large 16GB frame buffer with remarkable 165W power efficiency.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 130.0, ETC: 76.0, DOGE: 62.0, HAMSTER: 290.0, TON: 5.9 }
    }
  },
  {
    id: 'gpu-rtx-4060',
    category: 'gpu',
    name: 'KFA2 1-Click OC RTX 4060 8GB',
    brand: 'KFA2',
    year: 2023,
    priceUSD: 299,
    powerWatts: 115,
    description: 'Low power budget king drawing just 115 watts for entry mining setups.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 95.0, ETC: 55.0, DOGE: 44.0, HAMSTER: 215.0, TON: 4.3 }
    }
  },
  // RTX 30 Series
  {
    id: 'gpu-rtx-3090ti',
    category: 'gpu',
    name: 'EVGA FTW3 Ultra RTX 3090 Ti 24GB',
    brand: 'EVGA',
    year: 2022,
    priceUSD: 1150,
    powerWatts: 450,
    description: 'Legendary EVGA flagship with iCX3 technology and reinforced thermal sensors.',
    specs: {
      vramGB: 24,
      hashrates: { BTC: 290.0, ETC: 158.0, DOGE: 130.0, HAMSTER: 660.0, TON: 13.0 }
    }
  },
  {
    id: 'gpu-rtx-3090',
    category: 'gpu',
    name: 'ASUS TUF Gaming RTX 3090 24GB',
    brand: 'ASUS',
    year: 2020,
    priceUSD: 920,
    powerWatts: 350,
    description: 'All-aluminum shroud with dual ball bearing fans and military-grade components.',
    specs: {
      vramGB: 24,
      hashrates: { BTC: 260.0, ETC: 145.0, DOGE: 120.0, HAMSTER: 600.0, TON: 11.8 }
    }
  },
  {
    id: 'gpu-rtx-3080ti',
    category: 'gpu',
    name: 'MSI Ventus 3X RTX 3080 Ti 12GB',
    brand: 'MSI',
    year: 2021,
    priceUSD: 740,
    powerWatts: 350,
    description: 'Triple fan design engineered for continuous crypto workload durability.',
    specs: {
      vramGB: 12,
      hashrates: { BTC: 235.0, ETC: 128.0, DOGE: 106.0, HAMSTER: 530.0, TON: 10.5 }
    }
  },
  {
    id: 'gpu-rtx-3080-12g',
    category: 'gpu',
    name: 'Gigabyte Gaming OC RTX 3080 12GB',
    brand: 'Gigabyte',
    year: 2022,
    priceUSD: 620,
    powerWatts: 350,
    description: 'Graphene nano lubricant fans extending bearing lifespan by 2.1x in 24/7 mining.',
    specs: {
      vramGB: 12,
      hashrates: { BTC: 215.0, ETC: 120.0, DOGE: 99.0, HAMSTER: 485.0, TON: 9.6 }
    }
  },
  {
    id: 'gpu-rtx-3080-10g',
    category: 'gpu',
    name: 'EVGA XC3 Black RTX 3080 10GB',
    brand: 'EVGA',
    year: 2020,
    priceUSD: 520,
    powerWatts: 320,
    description: 'Compact 2.2 slot footprint with EVGA Precision X1 tuning support.',
    specs: {
      vramGB: 10,
      hashrates: { BTC: 198.0, ETC: 112.0, DOGE: 92.0, HAMSTER: 450.0, TON: 8.9 }
    }
  },
  {
    id: 'gpu-rtx-3070ti',
    category: 'gpu',
    name: 'Colorful iGame RTX 3070 Ti Vulcan 8GB',
    brand: 'Colorful',
    year: 2021,
    priceUSD: 440,
    powerWatts: 290,
    description: 'LCD status display and swiveling bracket with ultra-dense heatpipe matrix.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 165.0, ETC: 94.0, DOGE: 78.0, HAMSTER: 380.0, TON: 7.5 }
    }
  },
  {
    id: 'gpu-rtx-3070',
    category: 'gpu',
    name: 'ASUS Dual RTX 3070 8GB OC',
    brand: 'ASUS',
    year: 2020,
    priceUSD: 360,
    powerWatts: 220,
    description: 'Legendary efficiency mining champion with 62 MH/s ETC at just 125W tuned.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 145.0, ETC: 82.0, DOGE: 67.0, HAMSTER: 330.0, TON: 6.6 }
    }
  },
  {
    id: 'gpu-rtx-3060ti',
    category: 'gpu',
    name: 'ZOTAC Twin Edge RTX 3060 Ti 8GB',
    brand: 'ZOTAC',
    year: 2020,
    priceUSD: 290,
    powerWatts: 200,
    description: 'Compact dual fan favorite among small home mining farms.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 130.0, ETC: 74.0, DOGE: 60.0, HAMSTER: 295.0, TON: 5.8 }
    }
  },
  {
    id: 'gpu-rtx-3060-12g',
    category: 'gpu',
    name: 'MSI GeForce RTX 3060 Gaming X 12GB',
    brand: 'MSI',
    year: 2021,
    priceUSD: 260,
    powerWatts: 170,
    description: 'Generous 12GB VRAM supporting large DAG sizes for multi-algorithm mining.',
    specs: {
      vramGB: 12,
      hashrates: { BTC: 105.0, ETC: 60.0, DOGE: 49.0, HAMSTER: 240.0, TON: 4.8 }
    }
  },
  // NVIDIA Specialized Mining & Enterprise
  {
    id: 'gpu-cmp-170hx',
    category: 'gpu',
    name: 'NVIDIA CMP 170HX 8GB Mining Card',
    brand: 'NVIDIA',
    year: 2021,
    priceUSD: 1450,
    powerWatts: 250,
    description: 'Dedicated GA100 core crypto mining accelerator with HBM2e memory and 164 MH/s.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 310.0, ETC: 175.0, DOGE: 140.0, HAMSTER: 710.0, TON: 14.5 }
    }
  },
  {
    id: 'gpu-cmp-90hx',
    category: 'gpu',
    name: 'NVIDIA CMP 90HX 10GB Mining Card',
    brand: 'NVIDIA',
    year: 2021,
    priceUSD: 680,
    powerWatts: 320,
    description: 'Purpose-built mining board based on GA102 with passive blower cooling.',
    specs: {
      vramGB: 10,
      hashrates: { BTC: 205.0, ETC: 116.0, DOGE: 94.0, HAMSTER: 465.0, TON: 9.2 }
    }
  },
  {
    id: 'gpu-cmp-50hx',
    category: 'gpu',
    name: 'Gigabyte CMP 50HX 10GB Mining',
    brand: 'Gigabyte',
    year: 2021,
    priceUSD: 380,
    powerWatts: 225,
    description: 'Turing TU102 based enterprise mining GPU with displayless design.',
    specs: {
      vramGB: 10,
      hashrates: { BTC: 125.0, ETC: 70.0, DOGE: 57.0, HAMSTER: 280.0, TON: 5.6 }
    }
  },
  {
    id: 'gpu-cmp-30hx',
    category: 'gpu',
    name: 'Palit CMP 30HX 6GB Mining',
    brand: 'Palit',
    year: 2021,
    priceUSD: 180,
    powerWatts: 125,
    description: 'Entry level TU116 crypto accelerator with optimized BIOS.',
    specs: {
      vramGB: 6,
      hashrates: { BTC: 65.0, ETC: 37.0, DOGE: 30.0, HAMSTER: 145.0, TON: 2.9 }
    }
  },
  {
    id: 'gpu-a100-80gb',
    category: 'gpu',
    name: 'NVIDIA A100 Tensor Core 80GB SXM4/PCIe',
    brand: 'NVIDIA',
    year: 2021,
    priceUSD: 5400,
    powerWatts: 400,
    description: 'Enterprise AI & Compute colossus with 2 TB/s HBM2e memory bandwidth.',
    specs: {
      vramGB: 80,
      hashrates: { BTC: 490.0, ETC: 260.0, DOGE: 220.0, HAMSTER: 1100.0, TON: 22.0 }
    }
  },
  {
    id: 'gpu-h100-80gb',
    category: 'gpu',
    name: 'NVIDIA H100 PCIe 80GB Hopper',
    brand: 'NVIDIA',
    year: 2023,
    priceUSD: 9900,
    powerWatts: 350,
    description: 'State of the art datacenter compute processor with unprecedented cryptographic throughput.',
    specs: {
      vramGB: 80,
      hashrates: { BTC: 680.0, ETC: 360.0, DOGE: 310.0, HAMSTER: 1550.0, TON: 31.0 }
    }
  },
  // NVIDIA GTX 10 & 20 Series
  {
    id: 'gpu-rtx-2080ti',
    category: 'gpu',
    name: 'ASUS ROG Strix RTX 2080 Ti 11GB',
    brand: 'ASUS',
    year: 2018,
    priceUSD: 360,
    powerWatts: 260,
    description: 'Former Turing king with 11GB GDDR6 and 352-bit bus width.',
    specs: {
      vramGB: 11,
      hashrates: { BTC: 140.0, ETC: 78.0, DOGE: 64.0, HAMSTER: 315.0, TON: 6.2 }
    }
  },
  {
    id: 'gpu-rtx-2080-super',
    category: 'gpu',
    name: 'EVGA XC Ultra RTX 2080 Super 8GB',
    brand: 'EVGA',
    year: 2019,
    priceUSD: 290,
    powerWatts: 250,
    description: 'Robust dual-fan design with high core clock headroom.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 115.0, ETC: 65.0, DOGE: 53.0, HAMSTER: 260.0, TON: 5.2 }
    }
  },
  {
    id: 'gpu-rtx-2070-super',
    category: 'gpu',
    name: 'MSI Gaming X Trio RTX 2070 Super 8GB',
    brand: 'MSI',
    year: 2019,
    priceUSD: 240,
    powerWatts: 215,
    description: 'Quiet triple fan cooling maintaining sub-60C temperatures in mining rigs.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 100.0, ETC: 56.0, DOGE: 46.0, HAMSTER: 225.0, TON: 4.5 }
    }
  },
  {
    id: 'gpu-rtx-2060-super',
    category: 'gpu',
    name: 'Gigabyte Windforce RTX 2060 Super 8GB',
    brand: 'Gigabyte',
    year: 2019,
    priceUSD: 195,
    powerWatts: 175,
    description: 'Workhorse 8GB card popular in budget mining rigs worldwide.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 88.0, ETC: 49.0, DOGE: 40.0, HAMSTER: 198.0, TON: 3.9 }
    }
  },
  {
    id: 'gpu-rtx-2060-12gb',
    category: 'gpu',
    name: 'ZOTAC Gaming RTX 2060 Twin Fan 12GB',
    brand: 'ZOTAC',
    year: 2021,
    priceUSD: 185,
    powerWatts: 184,
    description: 'Re-released 12GB variant designed during the GPU crypto boom.',
    specs: {
      vramGB: 12,
      hashrates: { BTC: 82.0, ETC: 46.0, DOGE: 37.0, HAMSTER: 184.0, TON: 3.7 }
    }
  },
  {
    id: 'gpu-gtx-1080ti',
    category: 'gpu',
    name: 'EVGA SC2 GTX 1080 Ti 11GB',
    brand: 'EVGA',
    year: 2017,
    priceUSD: 230,
    powerWatts: 250,
    description: 'Legendary Pascal 11GB monster with 352-bit bus that shaped modern mining.',
    specs: {
      vramGB: 11,
      hashrates: { BTC: 110.0, ETC: 62.0, DOGE: 51.0, HAMSTER: 250.0, TON: 5.0 }
    }
  },
  {
    id: 'gpu-gtx-1080',
    category: 'gpu',
    name: 'MSI Armor GTX 1080 8GB',
    brand: 'MSI',
    year: 2016,
    priceUSD: 170,
    powerWatts: 180,
    description: 'GDDR5X Pascal architecture offering solid multi-algo performance.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 85.0, ETC: 47.0, DOGE: 39.0, HAMSTER: 190.0, TON: 3.8 }
    }
  },
  {
    id: 'gpu-gtx-1070ti',
    category: 'gpu',
    name: 'ASUS Cerberus GTX 1070 Ti 8GB',
    brand: 'ASUS',
    year: 2017,
    priceUSD: 155,
    powerWatts: 180,
    description: 'Rigorously stress-tested for 144 hours of continuous compute.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 75.0, ETC: 42.0, DOGE: 34.0, HAMSTER: 170.0, TON: 3.4 }
    }
  },
  {
    id: 'gpu-gtx-1070',
    category: 'gpu',
    name: 'Gigabyte G1 Gaming GTX 1070 8GB',
    brand: 'Gigabyte',
    year: 2016,
    priceUSD: 135,
    powerWatts: 150,
    description: 'Classic 8GB card that kicked off the 2017 mining revolution.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 65.0, ETC: 36.0, DOGE: 29.0, HAMSTER: 145.0, TON: 2.9 }
    }
  },
  {
    id: 'gpu-gtx-1660-super',
    category: 'gpu',
    name: 'Palit GamingPro GTX 1660 Super 6GB',
    brand: 'Palit',
    year: 2019,
    priceUSD: 145,
    powerWatts: 125,
    description: 'Hyper-efficient 31.8 MH/s ETC at 75W tuned. The holy grail of efficiency.',
    specs: {
      vramGB: 6,
      hashrates: { BTC: 68.0, ETC: 38.0, DOGE: 31.0, HAMSTER: 152.0, TON: 3.0 }
    }
  },
  {
    id: 'gpu-gtx-1660ti',
    category: 'gpu',
    name: 'MSI Ventus XS GTX 1660 Ti 6GB',
    brand: 'MSI',
    year: 2019,
    priceUSD: 150,
    powerWatts: 120,
    description: 'Turing TU116 core with full 1536 CUDA cores.',
    specs: {
      vramGB: 6,
      hashrates: { BTC: 66.0, ETC: 37.0, DOGE: 30.0, HAMSTER: 148.0, TON: 2.9 }
    }
  },
  {
    id: 'gpu-gtx-1060-6gb',
    category: 'gpu',
    name: 'ZOTAC AMP Edition GTX 1060 6GB',
    brand: 'ZOTAC',
    year: 2016,
    priceUSD: 95,
    powerWatts: 120,
    description: 'The most popular mining GPU in history with Samsung memory chips.',
    specs: {
      vramGB: 6,
      hashrates: { BTC: 48.0, ETC: 27.0, DOGE: 22.0, HAMSTER: 108.0, TON: 2.1 }
    }
  },
  // AMD Radeon RX 7000 Series (RDNA 3)
  {
    id: 'gpu-rx-7900-xtx',
    category: 'gpu',
    name: 'Sapphire NITRO+ Radeon RX 7900 XTX 24GB',
    brand: 'Sapphire',
    year: 2023,
    priceUSD: 1049,
    powerWatts: 355,
    description: 'RDNA3 flagship with massive 24GB GDDR6 and vapor-X cooling chamber.',
    specs: {
      vramGB: 24,
      hashrates: { BTC: 280.0, ETC: 150.0, DOGE: 125.0, HAMSTER: 630.0, TON: 12.5 }
    }
  },
  {
    id: 'gpu-rx-7900-xt',
    category: 'gpu',
    name: 'PowerColor Hellhound RX 7900 XT 20GB',
    brand: 'PowerColor',
    year: 2022,
    priceUSD: 749,
    powerWatts: 315,
    description: '20GB VRAM on 320-bit bus with whisper-silent ring-fan blades.',
    specs: {
      vramGB: 20,
      hashrates: { BTC: 235.0, ETC: 128.0, DOGE: 105.0, HAMSTER: 530.0, TON: 10.4 }
    }
  },
  {
    id: 'gpu-rx-7900-gre',
    category: 'gpu',
    name: 'ASRock Steel Legend RX 7900 GRE 16GB',
    brand: 'ASRock',
    year: 2024,
    priceUSD: 569,
    powerWatts: 260,
    description: 'Golden Rabbit Edition with optimized memory controllers for compute tasks.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 195.0, ETC: 108.0, DOGE: 88.0, HAMSTER: 440.0, TON: 8.7 }
    }
  },
  {
    id: 'gpu-rx-7800-xt',
    category: 'gpu',
    name: 'XFX Speedster MERC319 RX 7800 XT 16GB',
    brand: 'XFX',
    year: 2023,
    priceUSD: 519,
    powerWatts: 263,
    description: 'Cast aluminium airflow shroud with massive heatsink surface area.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 180.0, ETC: 100.0, DOGE: 81.0, HAMSTER: 405.0, TON: 8.0 }
    }
  },
  {
    id: 'gpu-rx-7700-xt',
    category: 'gpu',
    name: 'Sapphire Pulse RX 7700 XT 12GB',
    brand: 'Sapphire',
    year: 2023,
    priceUSD: 419,
    powerWatts: 245,
    description: 'Dual-X cooling technology with high-efficiency compound heatpipes.',
    specs: {
      vramGB: 12,
      hashrates: { BTC: 145.0, ETC: 82.0, DOGE: 66.0, HAMSTER: 325.0, TON: 6.4 }
    }
  },
  {
    id: 'gpu-rx-7600-xt',
    category: 'gpu',
    name: 'PowerColor Fighter RX 7600 XT 16GB',
    brand: 'PowerColor',
    year: 2024,
    priceUSD: 329,
    powerWatts: 190,
    description: 'Unprecedented 16GB VRAM at budget price range for deep memory algorithms.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 110.0, ETC: 62.0, DOGE: 50.0, HAMSTER: 248.0, TON: 4.9 }
    }
  },
  {
    id: 'gpu-rx-7600',
    category: 'gpu',
    name: 'ASRock Challenger RX 7600 8GB',
    brand: 'ASRock',
    year: 2023,
    priceUSD: 259,
    powerWatts: 165,
    description: 'Entry RDNA 3 card with striped axial fans and 0dB silent cooling.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 90.0, ETC: 51.0, DOGE: 41.0, HAMSTER: 202.0, TON: 4.0 }
    }
  },
  // AMD Radeon RX 6000 Series (RDNA 2)
  {
    id: 'gpu-rx-6950-xt',
    category: 'gpu',
    name: 'Sapphire Toxic RX 6950 XT 16GB',
    brand: 'Sapphire',
    year: 2022,
    priceUSD: 679,
    powerWatts: 335,
    description: 'AIO liquid-cooled halo card delivering sustained high clock frequencies.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 220.0, ETC: 122.0, DOGE: 100.0, HAMSTER: 495.0, TON: 9.8 }
    }
  },
  {
    id: 'gpu-rx-6900-xt',
    category: 'gpu',
    name: 'ASUS ROG Strix LC RX 6900 XT 16GB',
    brand: 'ASUS',
    year: 2020,
    priceUSD: 580,
    powerWatts: 300,
    description: 'Top-bin Big Navi chip with superior compute performance.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 205.0, ETC: 114.0, DOGE: 93.0, HAMSTER: 460.0, TON: 9.1 }
    }
  },
  {
    id: 'gpu-rx-6800-xt',
    category: 'gpu',
    name: 'PowerColor Red Devil RX 6800 XT 16GB',
    brand: 'PowerColor',
    year: 2020,
    priceUSD: 460,
    powerWatts: 300,
    description: '16GB VRAM beast with 128MB Infinity Cache.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 185.0, ETC: 104.0, DOGE: 84.0, HAMSTER: 415.0, TON: 8.2 }
    }
  },
  {
    id: 'gpu-rx-6800',
    category: 'gpu',
    name: 'Sapphire Pulse RX 6800 16GB',
    brand: 'Sapphire',
    year: 2020,
    priceUSD: 390,
    powerWatts: 250,
    description: 'Exceptional 64 MH/s on Etchash at only 105W when tuned properly.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 165.0, ETC: 94.0, DOGE: 76.0, HAMSTER: 370.0, TON: 7.4 }
    }
  },
  {
    id: 'gpu-rx-6750-xt',
    category: 'gpu',
    name: 'MSI Mech 2X RX 6750 XT 12GB',
    brand: 'MSI',
    year: 2022,
    priceUSD: 340,
    powerWatts: 250,
    description: '18 Gbps GDDR6 memory offering high bandwidth throughput.',
    specs: {
      vramGB: 12,
      hashrates: { BTC: 135.0, ETC: 76.0, DOGE: 61.0, HAMSTER: 305.0, TON: 6.0 }
    }
  },
  {
    id: 'gpu-rx-6700-xt',
    category: 'gpu',
    name: 'XFX Speedster QICK319 RX 6700 XT 12GB',
    brand: 'XFX',
    year: 2021,
    priceUSD: 295,
    powerWatts: 230,
    description: 'Triple fan cooler with direct contact copper heat pipes.',
    specs: {
      vramGB: 12,
      hashrates: { BTC: 125.0, ETC: 70.0, DOGE: 57.0, HAMSTER: 280.0, TON: 5.5 }
    }
  },
  {
    id: 'gpu-rx-6600-xt',
    category: 'gpu',
    name: 'ASRock Phantom Gaming RX 6600 XT 8GB',
    brand: 'ASRock',
    year: 2021,
    priceUSD: 220,
    powerWatts: 160,
    description: 'Famous mining efficiency card achieving 32 MH/s ETC at just 55W.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 95.0, ETC: 54.0, DOGE: 43.0, HAMSTER: 215.0, TON: 4.2 }
    }
  },
  {
    id: 'gpu-rx-6600',
    category: 'gpu',
    name: 'PowerColor Fighter RX 6600 8GB',
    brand: 'PowerColor',
    year: 2021,
    priceUSD: 185,
    powerWatts: 132,
    description: 'Ultra power efficient budget GPU with 29 MH/s at 50W core draw.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 82.0, ETC: 47.0, DOGE: 37.0, HAMSTER: 185.0, TON: 3.6 }
    }
  },
  // AMD Radeon VII & RX Vega & Polaris
  {
    id: 'gpu-radeon-vii',
    category: 'gpu',
    name: 'AMD Radeon VII 16GB HBM2',
    brand: 'AMD',
    year: 2019,
    priceUSD: 450,
    powerWatts: 300,
    description: 'Monstrous 1024 GB/s HBM2 memory bandwidth delivering 90+ MH/s in memory coins.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 210.0, ETC: 118.0, DOGE: 96.0, HAMSTER: 470.0, TON: 9.3 }
    }
  },
  {
    id: 'gpu-rx-vega-64',
    category: 'gpu',
    name: 'Sapphire Nitro+ RX Vega 64 8GB HBM2',
    brand: 'Sapphire',
    year: 2017,
    priceUSD: 180,
    powerWatts: 295,
    description: 'Vega 10 architecture with HBM2 memory and intense compute capability.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 115.0, ETC: 64.0, DOGE: 52.0, HAMSTER: 255.0, TON: 5.1 }
    }
  },
  {
    id: 'gpu-rx-vega-56',
    category: 'gpu',
    name: 'PowerColor Red Dragon RX Vega 56 8GB',
    brand: 'PowerColor',
    year: 2017,
    priceUSD: 150,
    powerWatts: 210,
    description: 'Flashable with Vega 64 BIOS for elevated memory voltage and hashrates.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 105.0, ETC: 58.0, DOGE: 47.0, HAMSTER: 235.0, TON: 4.6 }
    }
  },
  {
    id: 'gpu-rx-590',
    category: 'gpu',
    name: 'Sapphire Nitro+ RX 590 8GB Special Edition',
    brand: 'Sapphire',
    year: 2018,
    priceUSD: 125,
    powerWatts: 225,
    description: '12nm Polaris refresh with factory overclock and metallic blue shroud.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 74.0, ETC: 41.0, DOGE: 33.0, HAMSTER: 165.0, TON: 3.3 }
    }
  },
  {
    id: 'gpu-rx-580-8gb',
    category: 'gpu',
    name: 'XFX GTS Black Edition RX 580 8GB',
    brand: 'XFX',
    year: 2017,
    priceUSD: 110,
    powerWatts: 185,
    description: 'The historic mining staple card with strap mod BIOS reaching 31.5 MH/s.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 68.0, ETC: 38.0, DOGE: 31.0, HAMSTER: 152.0, TON: 3.0 }
    }
  },
  {
    id: 'gpu-rx-570-8gb',
    category: 'gpu',
    name: 'ASUS Expedition RX 570 8GB',
    brand: 'ASUS',
    year: 2017,
    priceUSD: 95,
    powerWatts: 150,
    description: 'Non-stop durability certification with dual-ball bearing dust resistant fans.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 62.0, ETC: 34.0, DOGE: 28.0, HAMSTER: 138.0, TON: 2.7 }
    }
  },
  {
    id: 'gpu-rx-480-8gb',
    category: 'gpu',
    name: 'MSI Gaming X RX 480 8GB',
    brand: 'MSI',
    year: 2016,
    priceUSD: 85,
    powerWatts: 150,
    description: 'Original Polaris 10 pioneer that powered thousands of early Ethereum farms.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 56.0, ETC: 31.0, DOGE: 25.0, HAMSTER: 125.0, TON: 2.5 }
    }
  },
  {
    id: 'gpu-rx-470-mining',
    category: 'gpu',
    name: 'Sapphire Radeon RX 470 8GB Mining Edition',
    brand: 'Sapphire',
    year: 2017,
    priceUSD: 75,
    powerWatts: 120,
    description: 'Single DVI port headless mining edition optimized for lowest acquisition cost.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 50.0, ETC: 28.0, DOGE: 22.0, HAMSTER: 110.0, TON: 2.2 }
    }
  },
  // Intel Arc Series
  {
    id: 'gpu-arc-a770',
    category: 'gpu',
    name: 'Intel Arc A770 Limited Edition 16GB',
    brand: 'Intel',
    year: 2022,
    priceUSD: 289,
    powerWatts: 225,
    description: 'Alchemist ACM-G10 architecture with 16GB VRAM and strong compute matrices.',
    specs: {
      vramGB: 16,
      hashrates: { BTC: 115.0, ETC: 65.0, DOGE: 52.0, HAMSTER: 260.0, TON: 5.2 }
    }
  },
  {
    id: 'gpu-arc-a750',
    category: 'gpu',
    name: 'Sparkle Titan Arc A750 OC 8GB',
    brand: 'Sparkle',
    year: 2023,
    priceUSD: 199,
    powerWatts: 225,
    description: 'High memory bandwidth for competitive pricing in mid-tier crypto operations.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 95.0, ETC: 53.0, DOGE: 42.0, HAMSTER: 210.0, TON: 4.1 }
    }
  },
  {
    id: 'gpu-arc-a580',
    category: 'gpu',
    name: 'ASRock Challenger Arc A580 8GB',
    brand: 'ASRock',
    year: 2023,
    priceUSD: 159,
    powerWatts: 185,
    description: 'Budget 256-bit memory bus card offering entry compute value.',
    specs: {
      vramGB: 8,
      hashrates: { BTC: 76.0, ETC: 42.0, DOGE: 34.0, HAMSTER: 170.0, TON: 3.4 }
    }
  }
];
