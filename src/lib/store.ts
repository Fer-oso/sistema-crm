import { Cliente, Producto, Proveedor, Presupuesto } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Funciones de utilidad para localStorage
const getItem = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setItem = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Store para clientes
export const clientesStore = {
  getAll: (): Cliente[] => getItem<Cliente>('clientes'),
  
  getById: (id: string): Cliente | undefined => {
    const clientes = getItem<Cliente>('clientes');
    return clientes.find(cliente => cliente.id === id);
  },
  
  create: (cliente: Omit<Cliente, 'id' | 'fechaRegistro'>): Cliente => {
    const clientes = getItem<Cliente>('clientes');
    const newCliente: Cliente = {
      ...cliente,
      id: uuidv4(),
      fechaRegistro: new Date()
    };
    
    clientes.push(newCliente);
    setItem('clientes', clientes);
    return newCliente;
  },
  
  update: (id: string, cliente: Partial<Cliente>): Cliente | undefined => {
    const clientes = getItem<Cliente>('clientes');
    const index = clientes.findIndex(c => c.id === id);
    
    if (index !== -1) {
      clientes[index] = { ...clientes[index], ...cliente };
      setItem('clientes', clientes);
      return clientes[index];
    }
    return undefined;
  },
  
  delete: (id: string): boolean => {
    const clientes = getItem<Cliente>('clientes');
    const filtered = clientes.filter(c => c.id !== id);
    
    if (filtered.length !== clientes.length) {
      setItem('clientes', filtered);
      return true;
    }
    return false;
  }
};

// Store para productos
export const productosStore = {
  getAll: (): Producto[] => getItem<Producto>('productos'),
  
  getById: (id: string): Producto | undefined => {
    const productos = getItem<Producto>('productos');
    return productos.find(producto => producto.id === id);
  },
  
  create: (producto: Omit<Producto, 'id'>): Producto => {
    const productos = getItem<Producto>('productos');
    const newProducto: Producto = {
      ...producto,
      id: uuidv4()
    };
    
    productos.push(newProducto);
    setItem('productos', productos);
    return newProducto;
  },
  
  update: (id: string, producto: Partial<Producto>): Producto | undefined => {
    const productos = getItem<Producto>('productos');
    const index = productos.findIndex(p => p.id === id);
    
    if (index !== -1) {
      productos[index] = { ...productos[index], ...producto };
      setItem('productos', productos);
      return productos[index];
    }
    return undefined;
  },
  
  delete: (id: string): boolean => {
    const productos = getItem<Producto>('productos');
    const filtered = productos.filter(p => p.id !== id);
    
    if (filtered.length !== productos.length) {
      setItem('productos', filtered);
      return true;
    }
    return false;
  },

  getByProveedor: (proveedorId: string): Producto[] => {
    const productos = getItem<Producto>('productos');
    return productos.filter(producto => producto.proveedorId === proveedorId);
  }
};

// Store para proveedores
export const proveedoresStore = {
  getAll: (): Proveedor[] => getItem<Proveedor>('proveedores'),
  
  getById: (id: string): Proveedor | undefined => {
    const proveedores = getItem<Proveedor>('proveedores');
    return proveedores.find(proveedor => proveedor.id === id);
  },
  
  create: (proveedor: Omit<Proveedor, 'id'>): Proveedor => {
    const proveedores = getItem<Proveedor>('proveedores');
    const newProveedor: Proveedor = {
      ...proveedor,
      id: uuidv4()
    };
    
    proveedores.push(newProveedor);
    setItem('proveedores', proveedores);
    return newProveedor;
  },
  
  update: (id: string, proveedor: Partial<Proveedor>): Proveedor | undefined => {
    const proveedores = getItem<Proveedor>('proveedores');
    const index = proveedores.findIndex(p => p.id === id);
    
    if (index !== -1) {
      proveedores[index] = { ...proveedores[index], ...proveedor };
      setItem('proveedores', proveedores);
      return proveedores[index];
    }
    return undefined;
  },
  
  delete: (id: string): boolean => {
    const proveedores = getItem<Proveedor>('proveedores');
    const filtered = proveedores.filter(p => p.id !== id);
    
    if (filtered.length !== proveedores.length) {
      setItem('proveedores', filtered);
      return true;
    }
    return false;
  }
};

// Store para presupuestos
export const presupuestosStore = {
  getAll: (): Presupuesto[] => getItem<Presupuesto>('presupuestos'),
  
  getById: (id: string): Presupuesto | undefined => {
    const presupuestos = getItem<Presupuesto>('presupuestos');
    return presupuestos.find(presupuesto => presupuesto.id === id);
  },
  
  getByCliente: (clienteId: string): Presupuesto[] => {
    const presupuestos = getItem<Presupuesto>('presupuestos');
    return presupuestos.filter(presupuesto => presupuesto.clienteId === clienteId);
  },
  
  create: (presupuesto: Omit<Presupuesto, 'id'>): Presupuesto => {
    const presupuestos = getItem<Presupuesto>('presupuestos');
    const newPresupuesto: Presupuesto = {
      ...presupuesto,
      id: uuidv4()
    };
    
    presupuestos.push(newPresupuesto);
    setItem('presupuestos', presupuestos);
    return newPresupuesto;
  },
  
  update: (id: string, presupuesto: Partial<Presupuesto>): Presupuesto | undefined => {
    const presupuestos = getItem<Presupuesto>('presupuestos');
    const index = presupuestos.findIndex(p => p.id === id);
    
    if (index !== -1) {
      presupuestos[index] = { ...presupuestos[index], ...presupuesto };
      setItem('presupuestos', presupuestos);
      return presupuestos[index];
    }
    return undefined;
  },
  
  delete: (id: string): boolean => {
    const presupuestos = getItem<Presupuesto>('presupuestos');
    const filtered = presupuestos.filter(p => p.id !== id);
    
    if (filtered.length !== presupuestos.length) {
      setItem('presupuestos', filtered);
      return true;
    }
    return false;
  }
};

// Inicializar con datos de prueba si no existen
export const initializeData = () => {
  // Solo inicializa si no hay datos
  if (getItem<Cliente>('clientes').length === 0) {
    setItem<Cliente>('clientes', [
      {
        id: uuidv4(),
        nombre: 'Cliente Ejemplo S.A.',
        email: 'contacto@cliente.com',
        telefono: '123456789',
        direccion: 'Calle Principal 123',
        fechaRegistro: new Date()
      }
    ]);
  }
  
  if (getItem<Producto>('productos').length === 0) {
    setItem<Producto>('productos', [
      {
        id: uuidv4(),
        nombre: 'Producto Ejemplo',
        descripcion: 'Descripción del producto ejemplo',
        precio: 100,
        costo: 60,
        stock: 50,
        categoria: 'General'
      }
    ]);
  }
  
  if (getItem<Proveedor>('proveedores').length === 0) {
    setItem<Proveedor>('proveedores', [
      {
        id: uuidv4(),
        nombre: 'Proveedor Ejemplo S.A.',
        contacto: 'Juan Pérez',
        email: 'contacto@proveedor.com',
        telefono: '987654321',
        direccion: 'Calle Secundaria 456'
      }
    ]);
  }
  
  if (getItem<Presupuesto>('presupuestos').length === 0) {
    // Los presupuestos iniciales se crearán cuando haya clientes y productos
    // para poder hacer las referencias correctamente
  }
};