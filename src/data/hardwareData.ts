import { HardwareItem, ComponentCategory } from '../types';
import { GPUS_DATA } from './hardwareGpus';
import { CPUS_DATA } from './hardwareCpus';
import { MOTHERBOARDS_DATA } from './hardwareMotherboards';
import { PSUS_DATA } from './hardwarePsus';
import { RACKS_DATA } from './hardwareRacks';

export const ALL_HARDWARE: HardwareItem[] = [
  ...RACKS_DATA,
  ...MOTHERBOARDS_DATA,
  ...CPUS_DATA,
  ...GPUS_DATA,
  ...PSUS_DATA,
];

export function getHardwareById(id: string): HardwareItem | undefined {
  return ALL_HARDWARE.find((item) => item.id === id);
}

export function getHardwareByCategory(category: ComponentCategory): HardwareItem[] {
  return ALL_HARDWARE.filter((item) => item.category === category);
}

export const HARDWARE_COUNTS = {
  racks: RACKS_DATA.length,
  motherboards: MOTHERBOARDS_DATA.length,
  cpus: CPUS_DATA.length,
  gpus: GPUS_DATA.length,
  psus: PSUS_DATA.length,
  total: ALL_HARDWARE.length,
};
