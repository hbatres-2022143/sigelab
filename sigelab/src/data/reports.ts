import {
  ChartNoAxesColumn,
  ClipboardList,
  PieChart,
  TrendingUp,
} from 'lucide-react-native';

export const reports = [
  {
    id: 'usage',
    title: 'Uso de equipos',
    description: 'Ver estadísticas de uso de cada equipo',
    icon: TrendingUp,
  },
  {
    id: 'loans',
    title: 'Préstamos',
    description: 'Resumen de préstamos por período',
    icon: ClipboardList,
  },
  {
    id: 'status',
    title: 'Equipos por estado',
    description: 'Disponibles, en uso, en mantenimiento',
    icon: PieChart,
  },
  {
    id: 'activity',
    title: 'Actividad general',
    description: 'Resumen de la actividad del sistema',
    icon: ChartNoAxesColumn,
  },
];
