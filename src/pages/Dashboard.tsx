import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users, Package, Truck, FileText, CheckCircle2, MoreHorizontal } from "lucide-react";
import { clientesStore, productosStore, proveedoresStore, presupuestosStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { 
  generateMensualData, 
  generateProductosPopulares,
  generateResumenGeneral,
  generateRecentActivity,
  type ActivityItem
} from "@/lib/chart-utils";
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Registramos los componentes de Chart.js que necesitamos
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProductos: 0,
    totalProveedores: 0,
    totalPresupuestos: 0
  });
  
  const [mensualData] = useState(generateMensualData());
  const [productosPopularesData] = useState(generateProductosPopulares());
  const [resumenGeneralData] = useState(generateResumenGeneral());
  const [recentActivity] = useState<ActivityItem[]>(generateRecentActivity());

  useEffect(() => {
    const clientes = clientesStore.getAll();
    const productos = productosStore.getAll();
    const proveedores = proveedoresStore.getAll();
    const presupuestos = presupuestosStore.getAll();

    setStats({
      totalClientes: clientes.length || 12, // Valores por defecto para demo
      totalProductos: productos.length || 45,
      totalProveedores: proveedores.length || 8,
      totalPresupuestos: presupuestos.length || 67
    });
  }, []);

  // Opciones comunes para los gráficos
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Función para renderizar el icono según el tipo de actividad
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'cliente': return <Users className="h-5 w-5 text-blue-500" />;
      case 'producto': return <Package className="h-5 w-5 text-amber-500" />;
      case 'proveedor': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'presupuesto': return <FileText className="h-5 w-5 text-green-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  // Función para obtener el texto de la acción
  const getActionText = (action: string) => {
    switch (action) {
      case 'creación': return 'creó';
      case 'actualización': return 'actualizó';
      case 'eliminación': return 'eliminó';
      case 'aprobación': return 'aprobó';
      default: return 'modificó';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido a tu sistema CRM para la gestión de productos, clientes, proveedores y presupuestos.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClientes}</div>
                <p className="text-xs text-muted-foreground">
                  Gestión completa de clientes
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProductos}</div>
                <p className="text-xs text-muted-foreground">
                  Inventario y catálogo
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProveedores}</div>
                <p className="text-xs text-muted-foreground">
                  Red de suministro
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Presupuestos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPresupuestos}</div>
                <p className="text-xs text-muted-foreground">
                  Cotizaciones y propuestas
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen General</CardTitle>
                <CardDescription>
                  Últimos 7 días - Presupuestos y Ventas
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px]">
                  <Line data={resumenGeneralData} options={lineChartOptions} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas acciones en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">
                            {activity.user || "Usuario"} {getActionText(activity.action)} {activity.type}
                          </p>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(activity.date, { addSuffix: true, locale: es })}
                            </span>
                            <button className="ml-2 hover:bg-muted p-1 rounded">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Rendimiento Mensual</CardTitle>
                <CardDescription>
                  Análisis de presupuestos y conversiones
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <Line data={mensualData} options={lineChartOptions} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Cotizados</CardTitle>
                <CardDescription>
                  Productos incluidos en presupuestos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar data={productosPopularesData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Presupuestos</CardTitle>
                <CardDescription>
                  Distribución por estado
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="h-[250px] w-[250px]">
                  <Doughnut 
                    data={{
                      labels: ['Borrador', 'Enviado', 'Aceptado', 'Rechazado'],
                      datasets: [
                        {
                          data: [15, 25, 20, 7],
                          backgroundColor: [
                            'rgba(99, 102, 241, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(239, 68, 68, 0.7)'
                          ]
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Conversión de Presupuestos</CardTitle>
                <CardDescription>
                  Tasa de aceptación mensual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mensualData.labels.slice(-6).map((month, i) => {
                    const index = mensualData.labels.length - 6 + i;
                    const total = mensualData.datasets[0].data[index];
                    const accepted = mensualData.datasets[1].data[index];
                    const percentage = Math.round((accepted / total) * 100);
                    
                    return (
                      <div key={month} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{month}</span>
                          <div className="flex items-center">
                            <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}