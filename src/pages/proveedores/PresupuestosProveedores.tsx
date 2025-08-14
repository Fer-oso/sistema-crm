import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Calendar,
  Pencil,
  PlusCircle,
  Trash2,
  FileText,
  Copy
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { presupuestosStore, clientesStore, productosStore } from "@/lib/store";
import { Presupuesto, ItemPresupuesto, Cliente, Producto } from "@/types";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { v4 as uuidv4 } from "uuid";

export default function PresupuestosProveedores() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState<Presupuesto | null>(null);
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState<Partial<Presupuesto>>({
    clienteId: "",
    fecha: new Date(),
    fechaValidez: new Date(new Date().setDate(new Date().getDate() + 30)),
    items: [],
    subtotal: 0,
    impuestos: 0,
    descuentoTotal: 0,
    total: 0,
    estado: 'borrador',
    notas: ""
  });
  const [presupuestoParaBorrar, setPresupuestoParaBorrar] = useState<string | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  
  const [nuevoItem, setNuevoItem] = useState<Partial<ItemPresupuesto>>({
    productoId: "",
    cantidad: 1,
    precioUnitario: 0,
    descuento: 0,
    subtotal: 0
  });
  const [itemIndex, setItemIndex] = useState<number | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    const todosPresupuestos = presupuestosStore.getAll();
    setPresupuestos(todosPresupuestos);
    
    const todosClientes = clientesStore.getAll();
    setClientes(todosClientes);
    
    const todosProductos = productosStore.getAll();
    setProductos(todosProductos);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const presupuestosFiltrados = presupuestos.filter(presupuesto => {
    // Filtrar por término de búsqueda
    const cliente = clientes.find(c => c.id === presupuesto.clienteId);
    const searchMatch = 
      cliente?.nombre.toLowerCase().includes(searchTerm) ||
      presupuesto.id.toLowerCase().includes(searchTerm) ||
      presupuesto.estado.toLowerCase().includes(searchTerm);

    // Filtrar por estado
    const estadoMatch = filtroEstado === "Todos" || presupuesto.estado === filtroEstado.toLowerCase();

    return searchMatch && estadoMatch;
  });

  const handleFiltroEstadoChange = (estado: string) => setFiltroEstado(estado);

  const handleClienteChange = (clienteId: string) => {
    if (presupuestoSeleccionado) {
      setPresupuestoSeleccionado({ ...presupuestoSeleccionado, clienteId });
    } else {
      setNuevoPresupuesto({ ...nuevoPresupuesto, clienteId });
    }
  };

  const handleEstadoChange = (estado: 'borrador' | 'enviado' | 'aceptado' | 'rechazado') => {
    if (presupuestoSeleccionado) {
      setPresupuestoSeleccionado({ ...presupuestoSeleccionado, estado });
    } else {
      setNuevoPresupuesto({ ...nuevoPresupuesto, estado });
    }
  };

  const handleNotasChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (presupuestoSeleccionado) {
      setPresupuestoSeleccionado({ ...presupuestoSeleccionado, notas: e.target.value });
    } else {
      setNuevoPresupuesto({ ...nuevoPresupuesto, notas: e.target.value });
    }
  };

  const handleFechaValidezChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fecha = new Date(e.target.value);
    if (presupuestoSeleccionado) {
      setPresupuestoSeleccionado({ ...presupuestoSeleccionado, fechaValidez: fecha });
    } else {
      setNuevoPresupuesto({ ...nuevoPresupuesto, fechaValidez: fecha });
    }
  };

  const handleProductoChange = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
      setNuevoItem({ 
        ...nuevoItem, 
        productoId,
        precioUnitario: producto.precio,
        subtotal: producto.precio * (nuevoItem.cantidad || 1) - (nuevoItem.descuento || 0)
      });
    }
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cantidad = parseInt(e.target.value) || 0;
    const precioUnitario = nuevoItem.precioUnitario || 0;
    const descuento = nuevoItem.descuento || 0;
    const subtotal = cantidad * precioUnitario - descuento;
    
    setNuevoItem({ ...nuevoItem, cantidad, subtotal });
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const precioUnitario = parseFloat(e.target.value) || 0;
    const cantidad = nuevoItem.cantidad || 0;
    const descuento = nuevoItem.descuento || 0;
    const subtotal = cantidad * precioUnitario - descuento;
    
    setNuevoItem({ ...nuevoItem, precioUnitario, subtotal });
  };

  const handleDescuentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const descuento = parseFloat(e.target.value) || 0;
    const cantidad = nuevoItem.cantidad || 0;
    const precioUnitario = nuevoItem.precioUnitario || 0;
    const subtotal = cantidad * precioUnitario - descuento;
    
    setNuevoItem({ ...nuevoItem, descuento, subtotal });
  };

  const agregarEditarItem = () => {
    // Si tenemos un presupuesto seleccionado, agregamos/editamos el item a ese presupuesto
    if (presupuestoSeleccionado) {
      const items = [...presupuestoSeleccionado.items];
      
      // Si estamos editando un item existente
      if (itemIndex !== null && itemIndex >= 0) {
        items[itemIndex] = { 
          ...nuevoItem, 
          id: items[itemIndex].id 
        } as ItemPresupuesto;
      } else {
        // Si estamos agregando un nuevo item
        items.push({ 
          ...nuevoItem, 
          id: uuidv4() 
        } as ItemPresupuesto);
      }
      
      // Recalculamos los totales
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const impuestos = subtotal * 0.21; // IVA 21% (ajustable)
      const descuentoTotal = items.reduce((sum, item) => sum + item.descuento, 0);
      const total = subtotal + impuestos;
      
      setPresupuestoSeleccionado({ 
        ...presupuestoSeleccionado, 
        items,
        subtotal,
        impuestos,
        descuentoTotal,
        total
      });
    } else {
      // Si estamos creando un nuevo presupuesto
      const items = [...(nuevoPresupuesto.items || [])];
      
      // Si estamos editando un item existente
      if (itemIndex !== null && itemIndex >= 0) {
        items[itemIndex] = { 
          ...nuevoItem, 
          id: items[itemIndex].id 
        } as ItemPresupuesto;
      } else {
        // Si estamos agregando un nuevo item
        items.push({ 
          ...nuevoItem, 
          id: uuidv4() 
        } as ItemPresupuesto);
      }
      
      // Recalculamos los totales
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const impuestos = subtotal * 0.21; // IVA 21% (ajustable)
      const descuentoTotal = items.reduce((sum, item) => sum + item.descuento, 0);
      const total = subtotal + impuestos;
      
      setNuevoPresupuesto({ 
        ...nuevoPresupuesto, 
        items,
        subtotal,
        impuestos,
        descuentoTotal,
        total
      });
    }
    
    setIsItemDialogOpen(false);
    setItemIndex(null);
    setNuevoItem({
      productoId: "",
      cantidad: 1,
      precioUnitario: 0,
      descuento: 0,
      subtotal: 0
    });
  };

  const eliminarItem = (index: number) => {
    if (presupuestoSeleccionado) {
      const items = [...presupuestoSeleccionado.items];
      items.splice(index, 1);
      
      // Recalculamos los totales
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const impuestos = subtotal * 0.21; // IVA 21%
      const descuentoTotal = items.reduce((sum, item) => sum + item.descuento, 0);
      const total = subtotal + impuestos;
      
      setPresupuestoSeleccionado({ 
        ...presupuestoSeleccionado, 
        items,
        subtotal,
        impuestos,
        descuentoTotal,
        total
      });
    } else {
      const items = [...(nuevoPresupuesto.items || [])];
      items.splice(index, 1);
      
      // Recalculamos los totales
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const impuestos = subtotal * 0.21; // IVA 21%
      const descuentoTotal = items.reduce((sum, item) => sum + item.descuento, 0);
      const total = subtotal + impuestos;
      
      setNuevoPresupuesto({ 
        ...nuevoPresupuesto, 
        items,
        subtotal,
        impuestos,
        descuentoTotal,
        total
      });
    }
  };

  const editarItem = (index: number) => {
    const items = presupuestoSeleccionado 
      ? presupuestoSeleccionado.items 
      : nuevoPresupuesto.items || [];
    
    if (items[index]) {
      setNuevoItem({ ...items[index] });
      setItemIndex(index);
      setIsItemDialogOpen(true);
    }
  };

  const abrirDialogoNuevoItem = () => {
    setItemIndex(null);
    setNuevoItem({
      productoId: "",
      cantidad: 1,
      precioUnitario: 0,
      descuento: 0,
      subtotal: 0
    });
    setIsItemDialogOpen(true);
  };

  const guardarPresupuesto = () => {
    if (presupuestoSeleccionado) {
      presupuestosStore.update(presupuestoSeleccionado.id, presupuestoSeleccionado);
    } else {
      if (nuevoPresupuesto.clienteId) {
        presupuestosStore.create(nuevoPresupuesto as Omit<Presupuesto, "id">);
        setNuevoPresupuesto({
          clienteId: "",
          fecha: new Date(),
          fechaValidez: new Date(new Date().setDate(new Date().getDate() + 30)),
          items: [],
          subtotal: 0,
          impuestos: 0,
          descuentoTotal: 0,
          total: 0,
          estado: 'borrador',
          notas: ""
        });
      }
    }
    
    cargarDatos();
    setIsDialogOpen(false);
    setPresupuestoSeleccionado(null);
  };

  const abrirDialogoNuevoPresupuesto = () => {
    setPresupuestoSeleccionado(null);
    setNuevoPresupuesto({
      clienteId: "",
      fecha: new Date(),
      fechaValidez: new Date(new Date().setDate(new Date().getDate() + 30)),
      items: [],
      subtotal: 0,
      impuestos: 0,
      descuentoTotal: 0,
      total: 0,
      estado: 'borrador',
      notas: ""
    });
    setIsDialogOpen(true);
  };

  const abrirDialogoEditarPresupuesto = (presupuesto: Presupuesto) => {
    setPresupuestoSeleccionado({ ...presupuesto });
    setIsDialogOpen(true);
  };

  const abrirVistaPresupuesto = (presupuesto: Presupuesto) => {
    setPresupuestoSeleccionado({ ...presupuesto });
    setIsViewDialogOpen(true);
  };

  const confirmarBorrarPresupuesto = (id: string) => {
    setPresupuestoParaBorrar(id);
    setIsAlertDialogOpen(true);
  };

  const borrarPresupuesto = () => {
    if (presupuestoParaBorrar) {
      presupuestosStore.delete(presupuestoParaBorrar);
      cargarDatos();
      setIsAlertDialogOpen(false);
      setPresupuestoParaBorrar(null);
    }
  };

  const getNombreCliente = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : "Cliente no encontrado";
  };

  const getNombreProducto = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? producto.nombre : "Producto no encontrado";
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getBadgeForEstado = (estado: string) => {
    switch (estado) {
      case 'borrador':
        return <Badge variant="outline">Borrador</Badge>;
      case 'enviado':
        return <Badge variant="secondary">Enviado</Badge>;
      case 'aceptado':
        return <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Aceptado</Badge>;
      case 'rechazado':
        return <Badge variant="destructive">Rechazado</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  return (

<>
<section className=" text-white py-12 px-6 flex justify-center items-center lg:py-16 lg:h-[560px] image-bg banner-content -mt-5 ">
    <div className="relative max-w-6xl w-full -mt-11">
      <h2 className="text-6xl font-bold mb-10 text-center text-black">
        ¿Cómo trabajamos contigo?
      </h2>
      {/* Contenedor dividido en dos mitades */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Primera mitad - Productos específicos */}
        <div className=" bg-black bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl border border-white border-opacity-20 h-[400px] flex flex-col justify-between">
        <div>
            <div className="text-center -mt-7">
              <div className="w-16 h-16 bg-blue-500 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Presupuesto General</h3>
              <p className="text-lg opacity-90 mb-6">
               Ofrece tus mejores productos
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 fade-in">
                <div className="w-8 h-8 bg-blue-500 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Verifica tu tabla de presupuestos disponibles</h4>
                  <p className="text-sm opacity-80">
                    Navega por los distintos presupuestos y oferta por el mejor te paresca
                  </p>
                </div>
              </div>
              <div
                className="flex items-start space-x-3 fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="w-8 h-8 bg-blue-500 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Completa el formulario</h4>
                  <p className="text-sm opacity-80">
                    Selecciona tus productos bajo el formulario y crea la oferta
                  </p>
                </div>
              </div>
              <div
                className="flex items-start space-x-3 fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="w-8 h-8 bg-blue-500 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Recibe tu respuesta</h4>
                  <p className="text-sm opacity-80">
                    Te informaremos el estado de tu presupuesto
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button id="quickQuoteBtn" className="mt-5 pulse-animation bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all">
        📋 Presupuesto General
      </button>
        </div>


        {/* Segunda mitad - Presupuesto general */}
        <div className="bg-black bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl border border-white border-opacity-20 h-[400px] flex flex-col justify-between">
          
        <div>
            <div className="text-center -mt-7">
              <div className="w-16 h-16 bg-orange-500 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Tus productos</h3>
              <p className="text-lg opacity-90 mb-6">
                Utiliza nuestro sistema para gestionar tus productos
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 fade-in">
                <div className="w-8 h-8 bg-orange-500 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Carga de productos</h4>
                  <p className="text-sm opacity-80">
                    Importa tus productos por medio de un archivo(CSV, PDF) o carga manualmente
                  </p>
                </div>
              </div>
              <div
                className="flex items-start space-x-3 fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="w-8 h-8 bg-orange-500 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Administra tus productos</h4>
                  <p className="text-sm opacity-80">
                    Control de stock
                  </p>
                </div>
              </div>
              <div
                className="flex items-start space-x-3 fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="w-8 h-8 bg-orange-500 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Solicita tu pedido</h4>
                  <p className="text-sm opacity-80">
                    Te contactamos para confirmar detalles y precios
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          
          
          
          
   
        </div>
      </div>
    </div>
  </section>


<div className="space-y-8">
  {/* Encabezado */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Presupuestos proveedores</h2>
      <p className="text-muted-foreground">
        Crea y gestiona presupuestos para tus clientes
      </p>
    </div>
    <Button onClick={abrirDialogoNuevoPresupuesto} className="self-start md:self-auto">
      <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Presupuesto
    </Button>
  </div>

  {/* Barra de búsqueda y filtro */}
  <div className="flex flex-col sm:flex-row gap-4 md:w-[600px]">
    <Input
      placeholder="Buscar por cliente, ID o estado..."
      value={searchTerm}
      onChange={handleSearch}
      className="flex-grow"
    />
    <Select value={filtroEstado} onValueChange={handleFiltroEstadoChange}>
      <SelectTrigger className="w-full sm:w-[180px] md:w-[250px]">
        <SelectValue placeholder="Filtrar por estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Todos">Todos los estados</SelectItem>
        <SelectItem value="Borrador">Borrador</SelectItem>
        <SelectItem value="Enviado">Enviado</SelectItem>
        <SelectItem value="Aceptado">Aceptado</SelectItem>
        <SelectItem value="Rechazado">Rechazado</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Tabla */}
  <div className="rounded-lg border shadow-sm overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Válido hasta</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right w-28">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {presupuestosFiltrados.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>No hay presupuestos para mostrar</p>
                <p className="text-sm">
                  Crea nuevos presupuestos usando el botón "Nuevo Presupuesto"
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          presupuestosFiltrados.map((presupuesto) => (
            <TableRow
              key={presupuesto.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => abrirVistaPresupuesto(presupuesto)}
            >
              <TableCell className="font-medium">{presupuesto.id.substring(0, 8)}...</TableCell>
              <TableCell>{getNombreCliente(presupuesto.clienteId)}</TableCell>
              <TableCell>{formatDate(presupuesto.fecha)}</TableCell>
              <TableCell>{formatDate(presupuesto.fechaValidez)}</TableCell>
              <TableCell>{formatCurrency(presupuesto.total)}</TableCell>
              <TableCell>{getBadgeForEstado(presupuesto.estado)}</TableCell>
              <TableCell className="text-right">
                <div
                  className="flex justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirDialogoEditarPresupuesto(presupuesto);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmarBorrarPresupuesto(presupuesto.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
 
     {/* Diálogo para crear/editar presupuesto */}
     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="max-w-6xl max-h-[105vh] flex flex-col">
    <DialogHeader>
      <DialogTitle>
        {presupuestoSeleccionado ? "Editar Presupuesto" : "Nuevo Presupuesto"}
      </DialogTitle>
      <DialogDescription>
        {presupuestoSeleccionado
          ? "Modifica los detalles del presupuesto y sus ítems."
          : "Crea un nuevo presupuesto seleccionando un cliente y agregando ítems."}
      </DialogDescription>
    </DialogHeader>

    {/* Contenido con scroll */}
    <div className="overflow-y-auto pr-2 flex-1">
         {/* Datos principales */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 ">
          <Label htmlFor="cliente">Cliente</Label>
          <Select
            value={presupuestoSeleccionado ? presupuestoSeleccionado.clienteId : nuevoPresupuesto.clienteId}
            onValueChange={handleClienteChange}

            
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha</Label>
            <div className="flex items-center border rounded-md pl-3 bg-muted text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(new Date())}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validez">Válido hasta</Label>
            <Input
              id="validez"
              type="date"
              value={
                presupuestoSeleccionado
                  ? new Date(presupuestoSeleccionado.fechaValidez).toISOString().split("T")[0]
                  : new Date(nuevoPresupuesto.fechaValidez!).toISOString().split("T")[0]
              }
              onChange={handleFechaValidezChange}
            />
          </div>
        </div>
      </div>

      {/* Ítems */}
      <div className="space-y-2 mt-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 ">
          <Label>Ítems del Presupuesto</Label>
          <Button variant="outline" size="sm" onClick={abrirDialogoNuevoItem}>
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Ítem
          </Button>
        </div>

        <div className="border rounded-md overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Descuento</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {((presupuestoSeleccionado ? presupuestoSeleccionado.items : nuevoPresupuesto.items) || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No hay ítems en este presupuesto. Haga clic en "Agregar Ítem".
                  </TableCell>
                </TableRow>
              ) : (
                (presupuestoSeleccionado ? presupuestoSeleccionado.items : nuevoPresupuesto.items || []).map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{getNombreProducto(item.productoId)}</TableCell>
                    <TableCell className="text-right">{item.cantidad}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.precioUnitario)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.descuento)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => editarItem(index)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => eliminarItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Estado y totales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select
            value={presupuestoSeleccionado ? presupuestoSeleccionado.estado : nuevoPresupuesto.estado}
            onValueChange={(value) => handleEstadoChange(value as "borrador" | "enviado" | "aceptado" | "rechazado")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="borrador">Borrador</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="aceptado">Aceptado</SelectItem>
              <SelectItem value="rechazado">Rechazado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">
              {formatCurrency(presupuestoSeleccionado ? presupuestoSeleccionado.subtotal : nuevoPresupuesto.subtotal || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Impuestos (21%):</span>
            <span className="font-medium">
              {formatCurrency(presupuestoSeleccionado ? presupuestoSeleccionado.impuestos : nuevoPresupuesto.impuestos || 0)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-bold">Total:</span>
            <span className="font-bold">
              {formatCurrency(presupuestoSeleccionado ? presupuestoSeleccionado.total : nuevoPresupuesto.total || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <Label htmlFor="notas">Notas</Label>
        <Textarea
          id="notas"
          placeholder="Notas adicionales para el presupuesto"
          value={presupuestoSeleccionado ? presupuestoSeleccionado.notas || "" : nuevoPresupuesto.notas || ""}
          onChange={handleNotasChange}
        />
      </div>
    </div>

{/* Botones siempre visibles */}
<DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
      <Button
        variant="outline"
        onClick={() => setIsDialogOpen(false)}
        className="w-full sm:w-auto"
      >
        Cancelar
      </Button>
      <Button
        onClick={guardarPresupuesto}
        className="w-full sm:w-auto"
      >
        {presupuestoSeleccionado ? "Guardar Cambios" : "Crear Presupuesto"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Diálogo para agregar/editar ítem del presupuesto */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{itemIndex !== null ? "Editar Ítem" : "Agregar Ítem"}</DialogTitle>
            <DialogDescription>
              {itemIndex !== null 
                ? "Modifica los detalles de este ítem." 
                : "Agrega un nuevo ítem al presupuesto."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="producto">Producto</Label>
              <Select 
                value={nuevoItem.productoId} 
                onValueChange={handleProductoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {productos.map(producto => (
                    <SelectItem key={producto.id} value={producto.id}>
                      {producto.nombre} - {formatCurrency(producto.precio)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="1"
                  value={nuevoItem.cantidad}
                  onChange={handleCantidadChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="precio">Precio Unitario</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  value={nuevoItem.precioUnitario}
                  onChange={handlePrecioChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descuento">Descuento</Label>
              <Input
                id="descuento"
                type="number"
                step="0.01"
                min="0"
                value={nuevoItem.descuento}
                onChange={handleDescuentoChange}
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="font-medium">Subtotal:</span>
              <span className="font-bold">{formatCurrency(nuevoItem.subtotal || 0)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={agregarEditarItem} disabled={!nuevoItem.productoId || nuevoItem.cantidad! <= 0}>
              {itemIndex !== null ? "Guardar Cambios" : "Agregar Ítem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vista detallada del presupuesto */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Presupuesto {presupuestoSeleccionado?.id.substring(0, 8)}
              </DialogTitle>
              {getBadgeForEstado(presupuestoSeleccionado?.estado || 'borrador')}
            </div>
            <DialogDescription>
              Detalles completos del presupuesto
            </DialogDescription>
          </DialogHeader>
          {presupuestoSeleccionado && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Cliente</h4>
                  <Card>
                    <CardContent className="p-4">
                      <p className="font-medium">{getNombreCliente(presupuestoSeleccionado.clienteId)}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">Fecha Emisión:</h4>
                    <span>{formatDate(presupuestoSeleccionado.fecha)}</span>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">Fecha Validez:</h4>
                    <span>{formatDate(presupuestoSeleccionado.fechaValidez)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Ítems</h4>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-right">Descuento</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {presupuestoSeleccionado.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{getNombreProducto(item.productoId)}</TableCell>
                          <TableCell className="text-right">{item.cantidad}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.precioUnitario)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.descuento)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-medium">Subtotal:</TableCell>
                        <TableCell className="text-right">{formatCurrency(presupuestoSeleccionado.subtotal)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-medium">Impuestos (21%):</TableCell>
                        <TableCell className="text-right">{formatCurrency(presupuestoSeleccionado.impuestos)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-bold">Total:</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(presupuestoSeleccionado.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              </div>
              
              {presupuestoSeleccionado.notas && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Notas</h4>
                  <Card>
                    <CardContent className="p-4">
                      <p className="whitespace-pre-wrap">{presupuestoSeleccionado.notas}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    abrirDialogoEditarPresupuesto(presupuestoSeleccionado);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmación para eliminar presupuesto */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente este presupuesto
              y todos sus datos asociados de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={borrarPresupuesto} className="bg-red-600 hover:bg-red-700">
              Eliminar Presupuesto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>


</>

    


  );
}