import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Layout } from './components/layout/layout';

// Páginas
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Proveedores from './pages/Proveedores';
import Presupuestos from './pages/Presupuestos';
import Catalogo from './pages/Catalogo';
import Comparador from './pages/Comparador';
import NotFound from './pages/NotFound';
import CatalogoCliente from './pages/clientes/CatalogoCliente';
import PresupuestosCliente from './pages/clientes/PresupuestosCliente';
import ComparadorCliente from './pages/clientes/ComparadorCliente';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="crm-theme">
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/proveedores" element={<Proveedores />} />
              <Route path="/presupuestos" element={<Presupuestos />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/comparador" element={<Comparador />} />
              
              {/* rutas vista cliente */}
              <Route path="/cliente/home" element={<CatalogoCliente/>} />
              <Route path="/cliente/presupuestos" element={<PresupuestosCliente/>} />
              <Route path="/cliente/comparador" element={<ComparadorCliente/>} />
            
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;