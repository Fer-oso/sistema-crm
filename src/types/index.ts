// Definición de tipos para la aplicación CRM

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  notas?: string;
  fechaRegistro: Date;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  costo: number;
  stock: number;
  proveedorId?: string;
  categoria: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  direccion: string;
  productos?: string[];
  notas?: string;
}

export interface ItemPresupuesto {
  id: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

export interface Presupuesto {
  id: string;
  clienteId: string;
  fecha: Date;
  fechaValidez: Date;
  items: ItemPresupuesto[];
  subtotal: number;
  impuestos: number;
  descuentoTotal: number;
  total: number;
  estado: 'borrador' | 'enviado' | 'aceptado' | 'rechazado';
  notas?: string;
}