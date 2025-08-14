import { initializeData } from './store';

// Function to initialize mock data with more comprehensive examples
export const initializeMockData = () => {
  // Call the basic initialization function
  initializeData();
  
  // Current date for reference
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Force initialization with a comprehensive set of mock data
  // This will clear any existing data and replace with our mock data
  const mockData = {
    clientes: [
      {
        id: 'general',
        nombre: 'Presupuesto general',
        email: 'contacto@empresaabc.com',
        telefono: '123-456-7890',
        direccion: 'Av. Principal 123, Ciudad',
        notas: 'Cliente prioritario',
        fechaRegistro: new Date(currentYear, currentMonth-5, 15)
      },
      {
        id: 'c1',
        nombre: 'Empresa ABC S.A.',
        email: 'contacto@empresaabc.com',
        telefono: '123-456-7890',
        direccion: 'Av. Principal 123, Ciudad',
        notas: 'Cliente prioritario',
        fechaRegistro: new Date(currentYear, currentMonth-5, 15)
      },
      {
        id: 'c2',
        nombre: 'Industrias XYZ',
        email: 'info@industriasxyz.com',
        telefono: '987-654-3210',
        direccion: 'Calle Secundaria 456, Ciudad',
        fechaRegistro: new Date(currentYear, currentMonth-3, 22)
      },
      {
        id: 'c3',
        nombre: 'Comercial El Sol',
        email: 'ventas@elsol.com',
        telefono: '555-123-4567',
        direccion: 'Plaza Central 789, Ciudad',
        notas: 'Requiere entrega especial',
        fechaRegistro: new Date(currentYear, currentMonth-1, 10)
      },
      {
        id: 'c4',
        nombre: 'Tiendas Modernos',
        email: 'info@modernos.com',
        telefono: '333-555-7777',
        direccion: 'Centro Comercial Europa, Ciudad',
        fechaRegistro: new Date(currentYear, currentMonth, 5)
      },
      {
        id: 'c5',
        nombre: 'Tecnologías Futuro',
        email: 'contacto@futuro.tech',
        telefono: '444-123-9876',
        direccion: 'Parque Tecnológico 567, Ciudad',
        notas: 'Cliente con potencial de crecimiento',
        fechaRegistro: new Date(currentYear, currentMonth, 18)
      }
    ],
    
    proveedores: [
      {
        id: 'p1',
        nombre: 'Distribuidora Nacional',
        contacto: 'María López',
        email: 'maria@distribuidora.com',
        telefono: '111-222-3333',
        direccion: 'Zona Industrial 123',
        productos: ['prod1', 'prod2']
      },
      {
        id: 'p2',
        nombre: 'Importaciones Globales',
        contacto: 'Juan Pérez',
        email: 'juan@importaciones.com',
        telefono: '444-555-6666',
        direccion: 'Puerto Comercial 456',
        productos: ['prod3', 'prod5', 'prod7']
      },
      {
        id: 'p3',
        nombre: 'Suministros Rápidos',
        contacto: 'Ana Gómez',
        email: 'ana@suministros.com',
        telefono: '777-888-9999',
        direccion: 'Autopista Norte Km 5',
        productos: ['prod4', 'prod8']
      },
      {
        id: 'p4',
        nombre: 'Tech Components Inc.',
        contacto: 'Carlos Rodriguez',
        email: 'carlos@techcomp.com',
        telefono: '222-333-4444',
        direccion: 'Avenida Industrial 789',
        productos: ['prod6', 'prod9', 'prod10']
      }
    ],
    
    productos: [
      {
        id: 'prod1',
        nombre: 'Arena1',
        descripcion: 'Arena de mar',
        precio: 1299.99,
        costo: 899.99,
        stock: 25,
        proveedorId: 'p1',
        categoria: 'Arena',
        image: "/img/galeriaproductos/arena.webp"
      },
      {
        id: 'prod2',
        nombre: 'Arena2',
        descripcion: 'Arena de rio',
        precio: 499.99,
        costo: 320.50,
        stock: 15,
        proveedorId: 'p1',
        categoria: 'Arena',
        image: "/img/galeriaproductos/arena1.webp"
      },
      {
        id: 'prod3',
        nombre: 'Arena3',
        descripcion: 'Arena colorada',
        precio: 129.99,
        costo: 75.25,
        stock: 50,
        proveedorId: 'p2',
        categoria: 'Arena',
        image: "/img/galeriaproductos/arena1.webp"
      },
      {
        id: 'prod4',
        nombre: 'cemento1',
        descripcion: 'Silla de oficina con soporte lumbar y ajustes completos',
        precio: 349.99,
        costo: 210.75,
        stock: 10,
        proveedorId: 'p3',
        categoria: 'Cemento',
         image: "/img/galeriaproductos/cemento1.jpg"
      },
      {
        id: 'prod5',
        nombre: 'Cemento2',
        descripcion: 'Almacenamiento de estado sólido de alta velocidad',
        precio: 159.99,
        costo: 95.50,
        stock: 30,
        proveedorId: 'p2',
        categoria: 'Cemento',
          image: "/img/galeriaproductos/cemento2.jfif"
      },
      {
        id: 'prod6',
        nombre: 'Cemento3',
        descripcion: 'GPU para diseño y gaming de alto rendimiento',
        precio: 799.99,
        costo: 550.00,
        stock: 8,
        proveedorId: 'p4',
        categoria: 'Cemento',
          image: "/img/galeriaproductos/cemento3.webp"
      },
      {
        id: 'prod7',
        nombre: 'Ladrillo1',
        descripcion: 'Auriculares inalámbricos con cancelación de ruido',
        precio: 179.99,
        costo: 95.00,
        stock: 40,
        proveedorId: 'p2',
        categoria: 'Ladrillo',
        image: "/img/galeriaproductos/ladrillos.webp"
      },
      {
        id: 'prod8',
        nombre: 'Ladrillo2',
        descripcion: 'Escritorio con altura ajustable eléctrica',
        precio: 449.99,
        costo: 270.00,
        stock: 12,
        proveedorId: 'p3',
        categoria: 'Ladrillo',
        image: "/img/galeriaproductos/ladrillos-block.webp"
      },
      {
        id: 'prod9',
        nombre: 'Inodoro3',
        descripcion: 'Kit de memoria de alta velocidad',
        precio: 249.99,
        costo: 160.00,
        stock: 35,
        proveedorId: 'p4',
        categoria: 'Ladrillo',
        image: "/img/galeriaproductos/piedra.webp"
      },
      {
        id: 'prod10',
        nombre: 'Ceramica',
        descripcion: 'Cámara web de alta definición para videoconferencias',
        precio: 129.99,
        costo: 75.00,
        stock: 20,
        proveedorId: 'p4',
         categoria: 'Pack',
        image: "/img/galeriaproductos/materiales-pack.webp"
      }
    ],
    
    presupuestos: [
      {
        id: 'pres1',
        clienteId: 'c1',
        fecha: new Date(currentYear, currentMonth-2, 15),
        fechaValidez: new Date(currentYear, currentMonth-1, 15),
        items: [
          {
            id: 'item1',
            productoId: 'prod1',
            cantidad: 1,
            precioUnitario: 1299.99,
            descuento: 100,
            subtotal: 1299.99 - 100
          },
          {
            id: 'item2',
            productoId: 'prod2',
            cantidad: 1,
            precioUnitario: 499.99,
            descuento: 50,
            subtotal: 499.99 - 50
          }
        ],
        subtotal: 5249.94,
        impuestos: 997.49,
        descuentoTotal: 150,
        total: 6097.43,
        estado: 'enviado',
        notas: 'Entrega urgente requerida'
      },
      {
        id: 'pres2',
        clienteId: 'c2',
        fecha: new Date(currentYear, currentMonth-1, 20),
        fechaValidez: new Date(currentYear, currentMonth, 20),
        items: [
          {
            id: 'item3',
            productoId: 'prod1',
            cantidad: 1,
            precioUnitario: 129.99,
            descuento: 0,
            subtotal: 1299.90
          },
          {
            id: 'item4',
            productoId: 'prod2',
            cantidad: 1,
            precioUnitario: 159.99,
            descuento: 0,
            subtotal: 799.95
          }
        ],
        subtotal: 2099.85,
        impuestos: 398.97,
        descuentoTotal: 0,
        total: 2498.82,
        estado: 'aceptado'
      },
      {
        id: 'pres3',
        clienteId: 'c3',
        fecha: new Date(currentYear, currentMonth-1, 5),
        fechaValidez: new Date(currentYear, currentMonth, 5),
        items: [
          {
            id: 'item5',
            productoId: 'prod4',
            cantidad: 2,
            precioUnitario: 349.99,
            descuento: 20,
            subtotal: 679.98
          },
          {
            id: 'item6',
            productoId: 'prod8',
            cantidad: 1,
            precioUnitario: 449.99,
            descuento: 0,
            subtotal: 449.99
          }
        ],
        subtotal: 1129.97,
        impuestos: 214.69,
        descuentoTotal: 20,
        total: 1324.66,
        estado: 'aceptado'
      },
      {
        id: 'pres4',
        clienteId: 'c4',
        fecha: new Date(currentYear, currentMonth, 2),
        fechaValidez: new Date(currentYear, currentMonth+1, 2),
        items: [
          {
            id: 'item7',
            productoId: 'prod7',
            cantidad: 15,
            precioUnitario: 179.99,
            descuento: 150,
            subtotal: 2549.85
          }
        ],
        subtotal: 2549.85,
        impuestos: 484.47,
        descuentoTotal: 150,
        total: 2884.32,
        estado: 'enviado'
      },
      {
        id: 'pres5',
        clienteId: 'c5',
        fecha: new Date(currentYear, currentMonth, 10),
        fechaValidez: new Date(currentYear, currentMonth+1, 10),
        items: [
          {
            id: 'item8',
            productoId: 'prod6',
            cantidad: 2,
            precioUnitario: 799.99,
            descuento: 50,
            subtotal: 1549.98
          },
          {
            id: 'item9',
            productoId: 'prod9',
            cantidad: 4,
            precioUnitario: 249.99,
            descuento: 0,
            subtotal: 999.96
          }
        ],
        subtotal: 2549.94,
        impuestos: 484.49,
        descuentoTotal: 50,
        total: 2984.43,
        estado: 'borrador'
      },
      {
        id: 'pres6',
        clienteId: 'c1',
        fecha: new Date(currentYear, currentMonth, 18),
        fechaValidez: new Date(currentYear, currentMonth+1, 18),
        items: [
          {
            id: 'item10',
            productoId: 'prod10',
            cantidad: 8,
            precioUnitario: 129.99,
            descuento: 80,
            subtotal: 959.92
          },
          {
            id: 'item11',
            productoId: 'prod3',
            cantidad: 5,
            precioUnitario: 129.99,
            descuento: 30,
            subtotal: 619.95
          }
        ],
        subtotal: 1579.87,
        impuestos: 300.18,
        descuentoTotal: 110,
        total: 1770.05,
        estado: 'enviado'
      },
      {
        id: 'pres7',
        clienteId: 'c2',
        fecha: new Date(currentYear, currentMonth-6, 10),
        fechaValidez: new Date(currentYear, currentMonth-5, 10),
        items: [
          {
            id: 'item12',
            productoId: 'prod1',
            cantidad: 1,
            precioUnitario: 1299.99,
            descuento: 0,
            subtotal: 1299.99
          }
        ],
        subtotal: 1299.99,
        impuestos: 247.00,
        descuentoTotal: 0,
        total: 1546.99,
        estado: 'rechazado'
      }
    ],
    
    // Mock data for recent activity
    actividad: [
      {
        id: 'act1',
        tipo: 'presupuesto',
        accion: 'creado',
        itemId: 'pres6',
        fecha: new Date(currentYear, currentMonth, 18, 14, 35),
        usuario: 'admin',
        detalles: 'Presupuesto creado para Empresa ABC S.A.'
      },
      {
        id: 'act2',
        tipo: 'cliente',
        accion: 'creado',
        itemId: 'c5',
        fecha: new Date(currentYear, currentMonth, 18, 10, 20),
        usuario: 'admin',
        detalles: 'Nuevo cliente registrado: Tecnologías Futuro'
      },
      {
        id: 'act3',
        tipo: 'presupuesto',
        accion: 'estado',
        itemId: 'pres4',
        fecha: new Date(currentYear, currentMonth, 15, 9, 45),
        usuario: 'admin',
        detalles: 'Presupuesto #pres4 enviado a Tiendas Modernos'
      },
      {
        id: 'act4',
        tipo: 'producto',
        accion: 'actualizado',
        itemId: 'prod3',
        fecha: new Date(currentYear, currentMonth, 12, 16, 30),
        usuario: 'admin',
        detalles: 'Stock actualizado: Teclado Mecánico RGB (+15 unidades)'
      },
      {
        id: 'act5',
        tipo: 'presupuesto',
        accion: 'creado',
        itemId: 'pres5',
        fecha: new Date(currentYear, currentMonth, 10, 11, 15),
        usuario: 'admin',
        detalles: 'Presupuesto creado para Tecnologías Futuro'
      }
    ],
    
    // Mock data for monthly performance
    rendimientoMensual: [
      { mes: 'Enero', presupuestos: 3, aceptados: 2, total: 4500.00 },
      { mes: 'Febrero', presupuestos: 4, aceptados: 2, total: 5200.00 },
      { mes: 'Marzo', presupuestos: 5, aceptados: 3, total: 7800.00 },
      { mes: 'Abril', presupuestos: 4, aceptados: 2, total: 6100.00 },
      { mes: 'Mayo', presupuestos: 6, aceptados: 3, total: 8300.00 },
      { mes: 'Junio', presupuestos: 7, aceptados: 5, total: 9920.91 }
    ]
  };

  // Store the mock data in localStorage
  localStorage.setItem('clientes', JSON.stringify(mockData.clientes));
  localStorage.setItem('proveedores', JSON.stringify(mockData.proveedores));
  localStorage.setItem('productos', JSON.stringify(mockData.productos));
  localStorage.setItem('presupuestos', JSON.stringify(mockData.presupuestos));
  localStorage.setItem('actividad', JSON.stringify(mockData.actividad));
  localStorage.setItem('rendimientoMensual', JSON.stringify(mockData.rendimientoMensual));
};