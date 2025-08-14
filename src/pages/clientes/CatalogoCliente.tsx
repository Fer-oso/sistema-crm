import { useState, useEffect } from "react";
import { productosStore, presupuestosStore, clientesStore } from "@/lib/store";
import { Producto, ItemPresupuesto, Presupuesto } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Plus, Check, Filter } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export default function CatalogoCliente() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todas");
  const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [presupuestoDestino, setPresupuestoDestino] = useState<string>("nuevo");
  
  const navigate = useNavigate();

  // Cargar datos al iniciar
  useEffect(() => {
    cargarProductos();
    cargarPresupuestos();
  }, []);

  const cargarProductos = () => {
    const todosProductos = productosStore.getAll();
    setProductos(todosProductos);
    
    // Extraer categorías únicas
    const uniqueCategorias = Array.from(
      new Set(todosProductos.map(p => p.categoria))
    );
    setCategorias(uniqueCategorias);
  };

  const cargarPresupuestos = () => {
    // Solo cargar presupuestos en estado borrador
    const todosPresupuestos = presupuestosStore.getAll().filter(
      p => p.estado === 'borrador'
    );
    setPresupuestos(todosPresupuestos);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = categoriaFilter === "todas" || producto.categoria === categoriaFilter;
    
    return matchesSearch && matchesCategoria;
  });

  const toggleProductSelection = (producto: Producto) => {
    const newSelection = new Map(selectedProducts);
    
    if (newSelection.has(producto.id)) {
      newSelection.delete(producto.id);
    } else {
      newSelection.set(producto.id, 1); // Cantidad por defecto: 1
    }
    
    setSelectedProducts(newSelection);
  };

  const updateProductQuantity = (productoId: string, cantidad: number) => {
    const newSelection = new Map(selectedProducts);
    
    if (cantidad <= 0) {
      newSelection.delete(productoId);
    } else {
      newSelection.set(productoId, cantidad);
    }
    
    setSelectedProducts(newSelection);
  };

  const handleAddToPresupuesto = () => {
    if (selectedProducts.size === 0) {
      toast.error("No hay productos seleccionados");
      return;
    }
    
    setIsDialogOpen(true);
  };

  const getNombrePresupuesto = (presupuesto: Presupuesto) => {
    const cliente = clientesStore.getById(presupuesto.clienteId);
    const clienteNombre = cliente ? cliente.nombre : "Cliente desconocido";
    return `${clienteNombre} - ${new Date(presupuesto.fecha).toLocaleDateString()} (${presupuesto.id.substring(0, 6)})`;
  };

  const addProductsToPresupuesto = () => {
    if (presupuestoDestino === "nuevo") {
      // Crear nuevo presupuesto con los productos seleccionados
      const items: ItemPresupuesto[] = [];
      let subtotal = 0;
      
      selectedProducts.forEach((cantidad, productoId) => {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
          const precioUnitario = producto.precio;
          const itemSubtotal = precioUnitario * cantidad;
          
          items.push({
            id: uuidv4(),
            productoId,
            cantidad,
            precioUnitario,
            descuento: 0,
            subtotal: itemSubtotal
          });
          
          subtotal += itemSubtotal;
        }
      });
      
      const impuestos = subtotal * 0.21; // 21% IVA
      const total = subtotal + impuestos;
      
      // Crear nuevo presupuesto con items preseleccionados
      const nuevoPresupuesto: Omit<Presupuesto, "id"> = {
        clienteId: "",
        fecha: new Date(),
        fechaValidez: new Date(new Date().setDate(new Date().getDate() + 30)),
        items,
        subtotal,
        impuestos,
        descuentoTotal: 0,
        total,
        estado: 'borrador',
        notas: ""
      };
      
      presupuestosStore.create(nuevoPresupuesto);
      toast.success("Productos añadidos al nuevo presupuesto");
      setSelectedProducts(new Map());
      setIsDialogOpen(false);
      
      // Navegar a la página de presupuestos
      navigate("/presupuestos");
      
    } else {
      // Añadir productos a un presupuesto existente
      const presupuesto = presupuestosStore.getById(presupuestoDestino);
      
      if (presupuesto) {
        const items = [...presupuesto.items];
        let subtotalNuevo = presupuesto.subtotal;
        
        selectedProducts.forEach((cantidad, productoId) => {
          const producto = productos.find(p => p.id === productoId);
          if (producto) {
            const precioUnitario = producto.precio;
            const itemSubtotal = precioUnitario * cantidad;
            
            // Verificar si el producto ya existe en el presupuesto
            const itemExistente = items.find(item => item.productoId === productoId);
            
            if (itemExistente) {
              // Actualizar cantidad y subtotal
              const cantidadAnterior = itemExistente.cantidad;
              itemExistente.cantidad += cantidad;
              itemExistente.subtotal = itemExistente.precioUnitario * itemExistente.cantidad;
              
              // Actualizar subtotal general
              subtotalNuevo += precioUnitario * cantidad;
            } else {
              // Añadir nuevo ítem
              items.push({
                id: uuidv4(),
                productoId,
                cantidad,
                precioUnitario,
                descuento: 0,
                subtotal: itemSubtotal
              });
              
              subtotalNuevo += itemSubtotal;
            }
          }
        });
        
        const impuestosNuevo = subtotalNuevo * 0.21; // 21% IVA
        const totalNuevo = subtotalNuevo + impuestosNuevo;
        
        presupuestosStore.update(presupuestoDestino, {
          items,
          subtotal: subtotalNuevo,
          impuestos: impuestosNuevo,
          total: totalNuevo
        });
        
        toast.success("Productos añadidos al presupuesto existente");
        setSelectedProducts(new Map());
        setIsDialogOpen(false);
        
        // Navegar a la página de presupuestos
        navigate("/presupuestos");
      }
    }
  };

  return (
    <div className="space-y-6">
<>
<>
  {/* Banner Presupuesto */}
  <section className=" text-white py-12 px-6 flex justify-center items-center lg:py-16 lg:h-[560px] image-bg banner-content ">
    <div className="relative max-w-6xl w-full -mt-10">
      <h2 className="text-6xl font-bold mb-10 text-center text-black">
        ¿Cómo trabajamos contigo?
      </h2>
      {/* Contenedor dividido en dos mitades */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Primera mitad - Productos específicos */}
        <div className=" bg-black bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl border border-white border-opacity-20 h-[400px] flex flex-col justify-between">
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-500 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Productos Específicos</h3>
              <p className="text-lg opacity-90 mb-6">
                Encuentra y selecciona materiales exactos de nuestra galería
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 fade-in">
                <div className="w-8 h-8 bg-orange-500 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Explora la galería</h4>
                  <p className="text-sm opacity-80">
                    Navega por nuestros productos organizados por categorías
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
                  <h4 className="font-semibold">Añade al carrito</h4>
                  <p className="text-sm opacity-80">
                    Selecciona cantidades específicas de cada producto
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
        {/* Segunda mitad - Presupuesto general */}
        <div className="bg-black bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl border border-white border-opacity-20 h-[400px] flex flex-col justify-between">
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Presupuesto General</h3>
              <p className="text-lg opacity-90 mb-6">
                Describe tu proyecto y te armamos un presupuesto completo
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 fade-in">
                <div className="w-8 h-8 bg-blue-500 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Describe tu proyecto</h4>
                  <p className="text-sm opacity-80">
                    Cuéntanos qué tipo de obra vas a realizar
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
                    Proporciona detalles y medidas de tu proyecto
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
                  <h4 className="font-semibold">Recibe tu presupuesto</h4>
                  <p className="text-sm opacity-80">
                    Te enviamos un presupuesto detallado en 24-48hs
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button id="quickQuoteBtn" className="mt-5 pulse-animation bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all">
        📋 Presupuesto General
      </button>
        </div>
      </div>
    </div>
  </section>
</>

</>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Catálogo de Productos</h2>
          <p className="text-muted-foreground">
            Explora y selecciona productos para añadir a presupuestos
          </p>
        </div>
        
        {selectedProducts.size > 0 && (
          <Button 
            onClick={handleAddToPresupuesto}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Añadir {selectedProducts.size} {selectedProducts.size === 1 ? "producto" : "productos"} a presupuesto
          </Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Filtros */}
        <div className="w-full md:w-64 space-y-4 mb-4 md:mb-0">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <h3 className="font-medium">Filtros</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={categoriaFilter}
                onValueChange={setCategoriaFilter}
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setCategoriaFilter("todas");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
          
          {/* Resumen de selección */}
          {selectedProducts.size > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Productos seleccionados
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {Array.from(selectedProducts).map(([id, cantidad]) => {
                  const producto = productos.find(p => p.id === id);
                  if (!producto) return null;
                  
                  return (
                    <div key={id} className="flex justify-between items-center text-sm py-1 border-b last:border-b-0">
                      <span className="truncate max-w-[140px]">{producto.nombre}</span>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateProductQuantity(id, cantidad - 1)}
                        >
                          -
                        </Button>
                        <span className="w-6 text-center">{cantidad}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateProductQuantity(id, cantidad + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-2">
                <Button 
                  onClick={handleAddToPresupuesto} 
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Añadir a presupuesto
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Catálogo */}
        <div className="flex-1">
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
                <TabsTrigger value="list">Lista</TabsTrigger>
              </TabsList>
              <span className="text-sm text-muted-foreground">
                {filteredProductos.length} {filteredProductos.length === 1 ? "producto" : "productos"}
              </span>
            </div>
            
            <TabsContent value="grid" className="w-full">
              {filteredProductos.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No hay productos que coincidan con los filtros seleccionados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {filteredProductos.map((producto) => {
                    const isSelected = selectedProducts.has(producto.id);
                    const cantidad = selectedProducts.get(producto.id) || 0;
                    
                    return (
                      <Card 
                        key={producto.id} 
                        className={`overflow-hidden cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => toggleProductSelection(producto)}
                      >

 {/* Imagen del producto */}
 {producto.image && (
    <div className="w-full h-40 overflow-hidden">
      <img
        src={producto.image}
        alt={producto.nombre}
        className="w-full h-full object-cover"
      />
    </div>
  )}

                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg truncate max-w-[80%]">{producto.nombre}</CardTitle>
                            {isSelected && (
                              <div className="rounded-full bg-primary p-1.5">
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          <CardDescription className="truncate">{producto.categoria}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                            {producto.descripcion}
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-bold text-lg">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(producto.precio)}</span>
                            <Badge variant={producto.stock > 0 ? "outline" : "destructive"}>
                              {producto.stock > 0 ? `Stock: ${producto.stock}` : "Sin stock"}
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          {isSelected ? (
                            <div className="flex items-center gap-2 w-full">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateProductQuantity(producto.id, cantidad - 1);
                                }}
                              >
                                -
                              </Button>
                              <span className="flex-1 text-center">{cantidad}</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateProductQuantity(producto.id, cantidad + 1);
                                }}
                              >
                                +
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              className="w-full"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleProductSelection(producto);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" /> Seleccionar
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="w-full">
              {filteredProductos.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No hay productos que coincidan con los filtros seleccionados</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr className="border-b">
                        <th className="text-left p-3">Producto</th>
                        <th className="text-left p-3">Categoría</th>
                        <th className="text-right p-3">Precio</th>
                        <th className="text-right p-3">Stock</th>
                        <th className="text-center p-3">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProductos.map((producto) => {
                        const isSelected = selectedProducts.has(producto.id);
                        const cantidad = selectedProducts.get(producto.id) || 0;
                        
                        return (
                          <tr 
                            key={producto.id} 
                            className={`border-b hover:bg-muted/50 cursor-pointer ${
                              isSelected ? 'bg-primary/10' : ''
                            }`}
                            onClick={() => toggleProductSelection(producto)}
                          >
                            <td className="p-3">
                              <div className="font-medium">{producto.nombre}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                                {producto.descripcion}
                              </div>
                            </td>
                            <td className="p-3">{producto.categoria}</td>
                            <td className="p-3 text-right font-medium">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(producto.precio)}
                            </td>
                            <td className="p-3 text-right">
                              <Badge variant={producto.stock > 0 ? "outline" : "destructive"}>
                                {producto.stock > 0 ? producto.stock : "Sin stock"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {isSelected ? (
                                <div className="flex items-center justify-center gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="px-2 h-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateProductQuantity(producto.id, cantidad - 1);
                                    }}
                                  >
                                    -
                                  </Button>
                                  <span className="w-8 text-center">{cantidad}</span>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="px-2 h-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateProductQuantity(producto.id, cantidad + 1);
                                    }}
                                  >
                                    +
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm" 
                                  variant="outline"
                                  className="mx-auto flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleProductSelection(producto);
                                  }}
                                >
                                  <Plus className="mr-1 h-3 w-3" /> Seleccionar
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Diálogo para elegir destino del presupuesto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadir productos a presupuesto</DialogTitle>
            <DialogDescription>
              Selecciona si quieres añadir los productos a un presupuesto existente o crear uno nuevo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="presupuesto-destino">Destino</Label>
              <Select
                value={presupuestoDestino}
                onValueChange={setPresupuestoDestino}
              >
                <SelectTrigger id="presupuesto-destino">
                  <SelectValue placeholder="Seleccionar destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">Crear nuevo presupuesto</SelectItem>
                  {presupuestos.length > 0 && <SelectItem value="separator" disabled>───────────</SelectItem>}
                  {presupuestos.map((presupuesto) => (
                    <SelectItem key={presupuesto.id} value={presupuesto.id}>
                      {getNombrePresupuesto(presupuesto)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addProductsToPresupuesto}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}