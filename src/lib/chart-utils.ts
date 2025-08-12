import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Tipos para los datos de los gráficos
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

// Generar datos de presupuestos mensuales para el año actual
export const generateMensualData = (): ChartData => {
  const currentYear = new Date().getFullYear();
  const months = [...Array(12)].map((_, i) => {
    const date = new Date(currentYear, i, 1);
    return format(date, 'MMM', { locale: es });
  });
  
  // Datos de presupuestos simulados
  const presupuestosData = [23, 34, 45, 56, 65, 78, 82, 91, 88, 95, 110, 115];
  
  // Datos de presupuestos aceptados simulados (porcentaje del total)
  const aceptadosData = presupuestosData.map(val => Math.round(val * (0.5 + Math.random() * 0.4)));

  return {
    labels: months,
    datasets: [
      {
        label: 'Presupuestos Enviados',
        data: presupuestosData,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
      {
        label: 'Presupuestos Aceptados',
        data: aceptadosData,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }
    ]
  };
};

// Generar datos para los productos más cotizados
export const generateProductosPopulares = (): ChartData => {
  return {
    labels: [
      'Laptop Pro XL', 
      'Monitor 4K', 
      'Teclado Mecánico', 
      'Auriculares Pro', 
      'Smartphone Ultra',
      'Tablet Slim'
    ],
    datasets: [
      {
        label: 'Veces Cotizado',
        data: [65, 59, 45, 42, 38, 31],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };
};

// Generar datos para el resumen general
export const generateResumenGeneral = (): ChartData => {
  // Simulamos datos de los últimos 7 días
  const days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return format(date, 'dd MMM', { locale: es });
  });

  return {
    labels: days,
    datasets: [
      {
        label: 'Presupuestos',
        data: [8, 12, 9, 14, 11, 13, 17],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        tension: 0.3
      },
      {
        label: 'Ventas',
        data: [4, 6, 5, 8, 7, 9, 10],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };
};

// Tipo para la actividad reciente
export interface ActivityItem {
  id: string;
  type: 'cliente' | 'producto' | 'presupuesto' | 'proveedor';
  action: 'creación' | 'actualización' | 'eliminación' | 'aprobación';
  name: string;
  date: Date;
  user?: string;
}

// Generar datos de actividad reciente
export const generateRecentActivity = (): ActivityItem[] => {
  const now = new Date();
  
  return [
    {
      id: '1',
      type: 'presupuesto',
      action: 'aprobación',
      name: 'Presupuesto #P-2023-089',
      date: new Date(now.getTime() - 35 * 60000), // 35 minutos atrás
      user: 'María López'
    },
    {
      id: '2',
      type: 'cliente',
      action: 'creación',
      name: 'Tecnologías Avanzadas S.L.',
      date: new Date(now.getTime() - 2 * 3600000), // 2 horas atrás
      user: 'Carlos Ruiz'
    },
    {
      id: '3',
      type: 'producto',
      action: 'actualización',
      name: 'Laptop Pro XL - stock actualizado',
      date: new Date(now.getTime() - 4 * 3600000), // 4 horas atrás
      user: 'Ana Martínez'
    },
    {
      id: '4',
      type: 'presupuesto',
      action: 'creación',
      name: 'Presupuesto #P-2023-088 para Grupo Innova',
      date: new Date(now.getTime() - 1 * 86400000), // 1 día atrás
      user: 'Carlos Ruiz'
    },
    {
      id: '5',
      type: 'proveedor',
      action: 'creación',
      name: 'Electrónicos del Sur',
      date: new Date(now.getTime() - 2 * 86400000), // 2 días atrás
      user: 'Ana Martínez'
    }
  ];
};