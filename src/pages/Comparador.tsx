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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChartHorizontal, 
  Check, 
  Search, 
  X, 
  FileCheck 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import { presupuestosStore, clientesStore, productosStore } from "@/lib/store";
import { Presupuesto, Cliente, Producto } from "@/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Comparador() {
  // Estados
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clienteFiltrado, setClienteFiltrado] = useState<string>("");
  const [presupuestosSeleccionados, setPresupuestosSeleccionados] = useState<string[]>([]);
  const [presupuestosComparacion, setPresupuestosComparacion] = useState<Presupuesto[]>([]);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [presupuestoAceptado, setPresupuestoAceptado] = useState<string | null>(null);

  // Cargar datos
  useEffect(() => {
    const todosPresupuestos = presupuestosStore.getAll();
    setPresupuestos(todosPresupuestos);
    const todosClientes = clientesStore.getAll();
    setClientes(todosClientes);
    const todosProductos = productosStore.getAll();
    setProductos(todosProductos);
  }, []);

  // Actualizar comparación cuando cambian los seleccionados
  useEffect(() => {
    const presupuestosAComparar = presupuestos.filter(p => 
      presupuestosSeleccionados.includes(p.id)
    );
    setPresupuestosComparacion(presupuestosAComparar);
  }, [presupuestosSeleccionados, presupuestos]);

  // Funciones de utilidad
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getNombreCliente = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : "Cliente no encontrado";
  };

  const getNombreProducto = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? producto.nombre : "Producto no encontrado";
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

  // Funciones para la comparación de presupuestos
  const presupuestosFiltrados = presupuestos.filter(presupuesto => {
    const cliente = clientes.find(c => c.id === presupuesto.clienteId);
    const cumpleBusqueda = (
      (cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      presupuesto.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      presupuesto.estado.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const cumpleFiltroCliente = clienteFiltrado === "todos" || presupuesto.clienteId === clienteFiltrado;
    return cumpleBusqueda && cumpleFiltroCliente;
  });

  const presupuestosDisponibles = presupuestosFiltrados.filter(
    p => !presupuestosSeleccionados.includes(p.id)
  );

  const agregarAComparacion = (presupuestoId: string) => {
    if (presupuestosSeleccionados.length >= 3) {
      toast.warning("Solo puedes comparar hasta 3 presupuestos a la vez");
      return;
    }
    setPresupuestosSeleccionados([...presupuestosSeleccionados, presupuestoId]);
  };

  const quitarDeComparacion = (presupuestoId: string) => {
    setPresupuestosSeleccionados(presupuestosSeleccionados.filter(id => id !== presupuestoId));
  };

  const confirmarAceptarPresupuesto = (presupuestoId: string) => {
    setPresupuestoAceptado(presupuestoId);
    setIsAlertDialogOpen(true);
  };

  const aceptarPresupuesto = () => {
    if (!presupuestoAceptado) return;
    
    const presupuesto = presupuestos.find(p => p.id === presupuestoAceptado);
    if (presupuesto) {
      const presupuestoActualizado: Presupuesto = {
        ...presupuesto,
        estado: 'aceptado'
      };
      
      presupuestosStore.update(presupuesto.id, presupuestoActualizado);
      
      // Rechazar otros presupuestos del mismo cliente
      const otrosPresupuestosCliente = presupuestos.filter(
        p => p.clienteId === presupuesto.clienteId && 
        p.id !== presupuesto.id && 
        p.estado !== 'rechazado'
      );
      
      otrosPresupuestosCliente.forEach(p => {
        presupuestosStore.update(p.id, { ...p, estado: 'rechazado' });
      });
      
      // Actualizar datos
      const todosPresupuestos = presupuestosStore.getAll();
      setPresupuestos(todosPresupuestos);
      
      toast.success("¡Presupuesto aceptado correctamente!");
      setIsAlertDialogOpen(false);
      setPresupuestoAceptado(null);
      setPresupuestosSeleccionados([]);
    }
  };
  
  // Funciones para la comparación de productos
  const getMejorPrecioProducto = (productoId: string) => {
    let mejorPrecio = Infinity;
    presupuestosComparacion.forEach(presupuesto => {
      const item = presupuesto.items.find(i => i.productoId === productoId);
      if (item) {
        const precioEfectivo = item.precioUnitario - (item.descuento / item.cantidad);
        if (precioEfectivo < mejorPrecio) {
          mejorPrecio = precioEfectivo;
        }
      }
    });
    return mejorPrecio === Infinity ? null : mejorPrecio;
  };
  
  const getProductosComparacion = () => {
    const productosIds = new Set<string>();
    presupuestosComparacion.forEach(presupuesto => {
      presupuesto.items.forEach(item => {
        productosIds.add(item.productoId);
      });
    });
    return Array.from(productosIds);
  };
  
  const tieneProducto = (presupuesto: Presupuesto, productoId: string) => {
    return presupuesto.items.some(item => item.productoId === productoId);
  };
  
  const getPrecioProductoEnPresupuesto = (presupuesto: Presupuesto, productoId: string) => {
    const item = presupuesto.items.find(i => i.productoId === productoId);
    if (!item) return null;
    const precioEfectivo = item.precioUnitario - (item.descuento / item.cantidad);
    return precioEfectivo;
  };
  
  const getCantidadProductoEnPresupuesto = (presupuesto: Presupuesto, productoId: string) => {
    const item = presupuesto.items.find(i => i.productoId === productoId);
    return item ? item.cantidad : 0;
  };
  
  const getDiferenciaPorcentual = (precio: number, mejorPrecio: number) => {
    if (precio === mejorPrecio) return 0;
    return ((precio - mejorPrecio) / mejorPrecio) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comparador de Presupuestos</h2>
          <p className="text-muted-foreground">
            Compara y selecciona el mejor presupuesto para tus clientes
          </p>
        </div>
        <div>
          <Button 
            variant="outline" 
            onClick={() => setPresupuestosSeleccionados([])}
            disabled={presupuestosSeleccionados.length === 0}
          >
            <X className="mr-2 h-4 w-4" /> Limpiar comparación
          </Button>
        </div>
      </div>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Aceptar este presupuesto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará este presupuesto como aceptado y rechazará automáticamente los demás presupuestos 
              para el mismo cliente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={aceptarPresupuesto}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Presupuestos disponibles</CardTitle>
              <CardDescription>Selecciona hasta 3 presupuestos para comparar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Buscar presupuestos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Select 
                    value={clienteFiltrado} 
                    onValueChange={setClienteFiltrado}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los clientes</SelectItem>
                      {clientes.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto space-y-3">
                {presupuestosDisponibles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron presupuestos disponibles
                  </div>
                ) : (
                  presupuestosDisponibles.map(presupuesto => (
                    <Card key={presupuesto.id} className="p-2">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{getNombreCliente(presupuesto.clienteId)}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{formatCurrency(presupuesto.total)}</span>
                              <span>•</span>
                              <span>{formatDate(presupuesto.fecha)}</span>
                            </div>
                            <div className="mt-1">
                              {getBadgeForEstado(presupuesto.estado)}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => agregarAComparacion(presupuesto.id)}
                            disabled={presupuesto.estado === 'rechazado' || presupuesto.estado === 'aceptado'}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <BarChartHorizontal className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Agregar a comparación</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Comparativa</CardTitle>
              <CardDescription>
                {presupuestosComparacion.length === 0 
                  ? "Selecciona presupuestos para comparar" 
                  : `Comparando ${presupuestosComparacion.length} presupuestos`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {presupuestosComparacion.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Search className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">No hay presupuestos seleccionados</h3>
                  <p>Selecciona presupuestos del panel izquierdo para comparar</p>
                </div>
              ) : (
                <Tabs defaultValue="resumen">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="resumen">Resumen</TabsTrigger>
                    <TabsTrigger value="productos">Productos</TabsTrigger>
                    <TabsTrigger value="detalles">Detalles</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="resumen" className="space-y-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Concepto</TableHead>
                          {presupuestosComparacion.map(presupuesto => (
                            <TableHead key={presupuesto.id}>
                              <div className="flex items-center justify-center gap-2">
                                <div className="flex flex-col items-center">
                                  <span className="font-medium">{getNombreCliente(presupuesto.clienteId)}</span>
                                  <span className="text-xs text-muted-foreground">Presupuesto {presupuesto.id.substring(0, 6)}...</span>
                                </div>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Estado</TableCell>
                          {presupuestosComparacion.map(presupuesto => (
                            <TableCell key={`estado-${presupuesto.id}`} className="text-center">
                              {getBadgeForEstado(presupuesto.estado)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Fecha</TableCell>
                          {presupuestosComparacion.map(presupuesto => (
                            <TableCell key={`fecha-${presupuesto.id}`} className="text-center">
                              {formatDate(presupuesto.fecha)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Validez</TableCell>
                          {presupuestosComparacion.map(presupuesto => (
                            <TableCell key={`validez-${presupuesto.id}`} className="text-center">
                              {formatDate(presupuesto.fechaValidez)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Items</TableCell>
                          {presupuestosComparacion.map(presupuesto => (
                            <TableCell key={`items-${presupuesto.id}`} className="text-center">
                              {presupuesto.items.length}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Subtotal</TableCell>
                          {presupuestosComparacion.map(presupuesto => (
                            <TableCell key={`subtotal-${presupuesto.id}`} className="text-center">
                              {formatCurrency(presupuesto.subtotal)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Descuentos</TableCell>
                          {presupuestosComparacion.map(presupuesto => (
                            <TableCell key={`descuentos-${presupuesto.id}`} className="text-center">
                              {formatCurrency(presupuesto.descuentoTotal)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Impuestos</TableCell>
                          {presupuestosComparacion.map(presupuesto => (
                            <TableCell key={`impuestos-${presupuesto.id}`} className="text-center">
                              {formatCurrency(presupuesto.impuestos)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Total</TableCell>
                          {presupuestosComparacion.map(presupuesto => {
                            // Encuentra el presupuesto con el precio total más bajo
                            const precioMasBajo = Math.min(...presupuestosComparacion.map(p => p.total));
                            const esMasBajo = presupuesto.total === precioMasBajo;
                            
                            return (
                              <TableCell 
                                key={`total-${presupuesto.id}`} 
                                className={`text-center font-bold ${esMasBajo ? 'text-green-600' : ''}`}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  {formatCurrency(presupuesto.total)}
                                  {esMasBajo && <Check className="h-4 w-4 text-green-600" />}
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Acción</TableCell>
                          {presupuestosComparacion.map(presupuesto => (
                            <TableCell key={`accion-${presupuesto.id}`} className="text-center">
                              <div className="flex flex-col gap-2 items-center">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => quitarDeComparacion(presupuesto.id)}
                                  className="w-full"
                                >
                                  <X className="h-4 w-4 mr-1" /> Quitar
                                </Button>
                                
                                {presupuesto.estado !== 'aceptado' && presupuesto.estado !== 'rechazado' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => confirmarAceptarPresupuesto(presupuesto.id)}
                                    className="w-full"
                                  >
                                    <FileCheck className="h-4 w-4 mr-1" /> Aceptar
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="productos" className="space-y-6">
                    {getProductosComparacion().length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Producto</TableHead>
                            {presupuestosComparacion.map(presupuesto => (
                              <TableHead key={presupuesto.id} className="text-center">
                                {getNombreCliente(presupuesto.clienteId)}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getProductosComparacion().map(productoId => {
                            const producto = productos.find(p => p.id === productoId);
                            const mejorPrecio = getMejorPrecioProducto(productoId);
                            
                            return (
                              <TableRow key={productoId}>
                                <TableCell className="font-medium">
                                  {getNombreProducto(productoId)}
                                </TableCell>
                                {presupuestosComparacion.map(presupuesto => {
                                  const tieneElProducto = tieneProducto(presupuesto, productoId);
                                  const precioProducto = getPrecioProductoEnPresupuesto(presupuesto, productoId);
                                  const cantidad = getCantidadProductoEnPresupuesto(presupuesto, productoId);
                                  const esMejorPrecio = mejorPrecio !== null && precioProducto === mejorPrecio;
                                  
                                  return (
                                    <TableCell key={`${presupuesto.id}-${productoId}`} className="text-center">
                                      {tieneElProducto ? (
                                        <div className="flex flex-col items-center">
                                          <div className={`font-medium ${esMejorPrecio ? 'text-green-600' : ''}`}>
                                            {formatCurrency(precioProducto || 0)}
                                            {esMejorPrecio && <Check className="inline h-3 w-3 ml-1 text-green-600" />}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Cantidad: {cantidad}
                                          </div>
                                          {mejorPrecio !== null && precioProducto !== null && precioProducto > mejorPrecio && (
                                            <div className="text-xs text-destructive">
                                              +{getDiferenciaPorcentual(precioProducto, mejorPrecio).toFixed(1)}%
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-muted-foreground text-sm">No incluido</span>
                                      )}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No hay productos para comparar
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="detalles" className="space-y-6">
                    {presupuestosComparacion.map(presupuesto => (
                      <Card key={presupuesto.id} className="mb-6">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>{getNombreCliente(presupuesto.clienteId)}</CardTitle>
                            {getBadgeForEstado(presupuesto.estado)}
                          </div>
                          <CardDescription>
                            Presupuesto #{presupuesto.id.substring(0, 8)} - {formatDate(presupuesto.fecha)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Productos incluidos</h4>
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
                                {presupuesto.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{getNombreProducto(item.productoId)}</TableCell>
                                    <TableCell className="text-right">{item.cantidad}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.precioUnitario)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.descuento)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              {presupuesto.notas && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Notas</h4>
                                  <div className="p-3 border rounded-md text-sm">
                                    {presupuesto.notas}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(presupuesto.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Descuentos:</span>
                                <span>{formatCurrency(presupuesto.descuentoTotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Impuestos (21%):</span>
                                <span>{formatCurrency(presupuesto.impuestos)}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>{formatCurrency(presupuesto.total)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-4">
                            {presupuesto.estado !== 'aceptado' && presupuesto.estado !== 'rechazado' && (
                              <Button onClick={() => confirmarAceptarPresupuesto(presupuesto.id)}>
                                <FileCheck className="mr-2 h-4 w-4" /> Aceptar este presupuesto
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}