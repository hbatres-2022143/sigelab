import { equipmentData } from '@/data/equipment';

export const dashboardStats = [
  {
    id: 'total',
    title: 'Total de equipos',
    value: equipmentData.length,
    icon: 'monitorsmartphone',
  },
  {
    id: 'available',
    title: 'Disponibles',
    value: equipmentData.filter((item) => item.status === 'Disponible').length,
    icon: 'available',
  },
  {
    id: 'loaned',
    title: 'Prestados',
    value: equipmentData.filter((item) => item.status === 'En préstamo').length,
    icon: 'package',
  },
  {
    id: 'maintenance',
    title: 'En mantenimiento',
    value: equipmentData.filter((item) => item.status === 'En mantenimiento')
      .length,
    icon: 'maintenance',
  },
  {
    id: 'damaged',
    title: 'Dañados',
    value: equipmentData.filter((item) => item.status === 'Dañado').length,
    icon: 'damaged',
  },
] as const;

export const quickAccessItems = [
  {
    id: 'equipment',
    title: 'Consultar equipos',
    icon: 'search',
    action: 'equipment',
  },
  {
    id: 'scanner',
    title: 'Escanear QR',
    icon: 'scanner',
    action: 'scanner',
  },
  {
    id: 'loans',
    title: 'Ver préstamos',
    icon: 'history',
    action: 'loans',
  },
  {
    id: 'reports',
    title: 'Ver reportes',
    icon: 'reports',
    action: 'reports',
  },
] as const;
