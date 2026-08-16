export interface HackerPcTemplate {
  id: number; // 1 to 60
  name: string;
  tierName: string;
  cpu: string;
  gpu: string;
  ram: string;
  priceUSD: number;
  bruteForceSeconds: number; // 3600 down to 5
}

function generateHackerPcTemplates(): HackerPcTemplate[] {
  const templates: HackerPcTemplate[] = [];

  const cpuList = [
    'Intel Celeron G5900', 'Intel Pentium Gold G6400', 'AMD Athlon 3000G', 'Intel Core i3-10100F',
    'AMD Ryzen 3 4100', 'Intel Core i3-12100F', 'AMD Ryzen 5 3600', 'Intel Core i5-10400F',
    'AMD Ryzen 5 5600', 'Intel Core i5-12400F', 'Intel Core i5-13400F', 'AMD Ryzen 5 7600',
    'Intel Core i5-13600K', 'AMD Ryzen 7 5700X', 'Intel Core i7-11700K', 'AMD Ryzen 7 5800X3D',
    'Intel Core i7-12700K', 'AMD Ryzen 7 7700X', 'Intel Core i7-13700K', 'AMD Ryzen 7 7800X3D',
    'Intel Core i7-14700K', 'AMD Ryzen 9 5900X', 'Intel Core i9-12900K', 'AMD Ryzen 9 7900X',
    'Intel Core i9-13900K', 'AMD Ryzen 9 7950X', 'Intel Core i9-14900K', 'AMD Ryzen 9 7950X3D',
    'AMD Threadripper 1950X', 'AMD Threadripper 2990WX', 'AMD Threadripper 3960X', 'AMD Threadripper 3970X',
    'AMD Threadripper 3990X (64 Cores)', 'Intel Xeon w9-3495X', 'AMD Threadripper PRO 5975WX',
    'AMD Threadripper PRO 5995WX', 'AMD Threadripper PRO 7985WX', 'AMD Threadripper PRO 7995WX (96 Cores)',
    'Dual AMD EPYC 9654 Genoa', 'Quantum Neural Engine Array'
  ];

  const gpuList = [
    'NVIDIA GT 710 2GB', 'NVIDIA GT 1030 2GB', 'AMD Radeon RX 550 4GB', 'NVIDIA GTX 1050 Ti 4GB',
    'AMD Radeon RX 570 8GB', 'NVIDIA GTX 1650 4GB', 'NVIDIA GTX 1660 Super 6GB', 'AMD Radeon RX 6600 8GB',
    'NVIDIA RTX 2060 6GB', 'NVIDIA RTX 3060 12GB', 'AMD Radeon RX 6700 XT 12GB', 'NVIDIA RTX 3060 Ti 8GB',
    'NVIDIA RTX 4060 8GB', 'NVIDIA RTX 3070 8GB', 'NVIDIA RTX 4060 Ti 16GB', 'AMD Radeon RX 7800 XT 16GB',
    'NVIDIA RTX 3080 10GB', 'NVIDIA RTX 4070 12GB', 'NVIDIA RTX 4070 Super 12GB', 'NVIDIA RTX 3080 Ti 12GB',
    'NVIDIA RTX 4070 Ti Super 16GB', 'NVIDIA RTX 3090 24GB', 'NVIDIA RTX 4080 16GB', 'NVIDIA RTX 4080 Super 16GB',
    'Dual NVIDIA RTX 3090 24GB', 'NVIDIA RTX 4090 24GB Liquid', 'Dual NVIDIA RTX 4090 24GB',
    'Triple NVIDIA RTX 4090 24GB', 'Quad NVIDIA RTX 4090 24GB', '4x NVIDIA RTX A6000 48GB',
    '4x NVIDIA H100 80GB SXM5', '8x NVIDIA RTX 4090 24GB Watercooled', '8x NVIDIA H100 Tensor Core 80GB'
  ];

  for (let i = 1; i <= 60; i++) {
    const progress = (i - 1) / 59; // 0.0 to 1.0

    // Time in seconds: 3600 (1 hour) at i=1 down to 5 seconds at i=60
    // Quadratic decay for nice curve:
    const seconds = Math.max(5, Math.round(3600 * Math.pow(1 - progress, 2.2) + 5));

    // Price USD: $300 at i=1 up to $500,000 at i=60
    const price = Math.round(300 + Math.pow(progress, 1.8) * 499700);

    const cpuIndex = Math.min(cpuList.length - 1, Math.floor(progress * cpuList.length));
    const gpuIndex = Math.min(gpuList.length - 1, Math.floor(progress * gpuList.length));

    const ramGB = Math.pow(2, Math.min(9, Math.floor(3 + progress * 6))); // 8GB up to 512GB

    templates.push({
      id: i,
      name: `BruteForce Station v${i}.0`,
      tierName: i <= 10 ? 'Entry Cyber' : i <= 25 ? 'Pro Bruteforcer' : i <= 45 ? 'Cluster Rig' : 'Quantum Superstation',
      cpu: cpuList[cpuIndex],
      gpu: gpuList[gpuIndex],
      ram: `${ramGB}GB DDR5 High-Speed`,
      priceUSD: price,
      bruteForceSeconds: seconds,
    });
  }

  return templates;
}

export const HACKER_PC_TEMPLATES: HackerPcTemplate[] = generateHackerPcTemplates();
