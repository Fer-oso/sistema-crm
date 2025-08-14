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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { productosStore, proveedoresStore } from "@/lib/store";
import { Producto, Proveedor } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductosProveedores() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nuevoProducto, setNuevoProducto] = useState<Partial<Producto>>({
    nombre: "",
    descripcion: "",
    precio: 0,
    costo: 0,
    stock: 0,
    proveedorId: "",
    categoria: ""
  });
  const [productoParaEditar, setProductoParaEditar] = useState<Producto | null>(null);
  const [productoParaBorrar, setProductoParaBorrar] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  useEffect(() => {
    cargarProductos();
    cargarProveedores();
  }, []);

  const cargarProductos = () => {
    const todosProductos = productosStore.getAll();
    setProductos(todosProductos);
  };

  const cargarProveedores = () => {
    const todosProveedores = proveedoresStore.getAll();
    setProveedores(todosProveedores);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const processedValue = name === "precio" || name === "costo" || name === "stock" 
      ? parseFloat(value) 
      : value;
    
    if (productoParaEditar) {
      setProductoParaEditar({ ...productoParaEditar, [name]: processedValue });
    } else {
      setNuevoProducto({ ...nuevoProducto, [name]: processedValue });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (productoParaEditar) {
      setProductoParaEditar({ ...productoParaEditar, [name]: value });
    } else {
      setNuevoProducto({ ...nuevoProducto, [name]: value });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productoParaEditar) {
      productosStore.update(productoParaEditar.id, productoParaEditar);
    } else {
      productosStore.create(nuevoProducto as Omit<Producto, "id">);
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: 0,
        costo: 0,
        stock: 0,
        proveedorId: "",
        categoria: ""
      });
    }
    
    cargarProductos();
    setIsDialogOpen(false);
    setProductoParaEditar(null);
  };

  const abrirDialogoEditar = (producto: Producto) => {
    setProductoParaEditar({ ...producto });
    setIsDialogOpen(true);
  };

  const abrirDialogoCrear = () => {
    console.log("Abriendo diálogo para crear producto");
    setProductoParaEditar(null);
    setNuevoProducto({
      nombre: "",
      descripcion: "",
      precio: 0,
      costo: 0,
      stock: 0,
      proveedorId: "",
      categoria: ""
    });
    setIsDialogOpen(true);
    // Force state update to ensure dialog opens
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 100);
  };

  const confirmarBorrarProducto = (id: string) => {
    setProductoParaBorrar(id);
    setIsAlertDialogOpen(true);
  };

  const borrarProducto = () => {
    if (productoParaBorrar) {
      productosStore.delete(productoParaBorrar);
      cargarProductos();
      setIsAlertDialogOpen(false);
      setProductoParaBorrar(null);
    }
  };

  const getNombreProveedor = (proveedorId?: string) => {
    if (!proveedorId) return "Sin proveedor";
    const proveedor = proveedores.find(p => p.id === proveedorId);
    return proveedor ? proveedor.nombre : "Proveedor no encontrado";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Productos proveedores</h2>
          <p className="text-muted-foreground">
            Gestiona tu catálogo de productos
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                console.log("Button clicked - preparing new product dialog");
                setProductoParaEditar(null);
                setNuevoProducto({
                  nombre: "",
                  descripcion: "",
                  precio: 0,
                  costo: 0,
                  stock: 0,
                  proveedorId: "",
                  categoria: ""
                });
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Nuevo Producto</DialogTitle>
              <DialogDescription>
                Agrega un nuevo producto al sistema. Completa los campos requeridos.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Nombre del producto"
                    value={nuevoProducto.nombre}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Descripción detallada del producto"
                    value={nuevoProducto.descripcion}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="precio" className="text-right">
                    Precio ($)
                  </Label>
                  <Input
                    id="precio"
                    name="precio"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Precio de venta"
                    value={nuevoProducto.precio}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="costo" className="text-right">
                    Costo ($)
                  </Label>
                  <Input
                    id="costo"
                    name="costo"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Costo de adquisición"
                    value={nuevoProducto.costo}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="Cantidad en inventario"
                    value={nuevoProducto.stock}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoria" className="text-right">
                    Categoría
                  </Label>
                  <Input
                    id="categoria"
                    name="categoria"
                    placeholder="Categoría del producto"
                    value={nuevoProducto.categoria}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="proveedor" className="text-right">
                    Proveedor
                  </Label>
                  <Select 
                    value={nuevoProducto.proveedorId || "none"} 
                    onValueChange={(value) => handleSelectChange("proveedorId", value === "none" ? "" : value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin proveedor</SelectItem>
                      {proveedores.map(proveedor => (
                        <SelectItem key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Crear Producto</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Stock</TableHead>
               
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>No hay productos para mostrar</p>
                      <p className="text-sm">Agrega nuevos productos usando el botón "Nuevo Producto"</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                productosFiltrados.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell>{producto.categoria}</TableCell>
                    <TableCell className="text-right">${producto.precio.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${producto.costo.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{producto.stock}</TableCell>
               
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => abrirDialogoEditar(producto)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => confirmarBorrarProducto(producto.id)}
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

      {/* Dialog for Edit Product is handled separately */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica los datos del producto aquí. Haz clic en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          {productoParaEditar && (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Nombre del producto"
                    value={productoParaEditar.nombre}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Descripción detallada del producto"
                    value={productoParaEditar.descripcion}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="precio" className="text-right">
                    Precio ($)
                  </Label>
                  <Input
                    id="precio"
                    name="precio"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Precio de venta"
                    value={productoParaEditar.precio}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="costo" className="text-right">
                    Costo ($)
                  </Label>
                  <Input
                    id="costo"
                    name="costo"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Costo de adquisición"
                    value={productoParaEditar.costo}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="Cantidad en inventario"
                    value={productoParaEditar.stock}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoria" className="text-right">
                    Categoría
                  </Label>
                  <Input
                    id="categoria"
                    name="categoria"
                    placeholder="Categoría del producto"
                    value={productoParaEditar.categoria}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="proveedor" className="text-right">
                    Proveedor
                  </Label>
                  <Select 
                    value={productoParaEditar.proveedorId || "none"} 
                    onValueChange={(value) => handleSelectChange("proveedorId", value === "none" ? "" : value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin proveedor</SelectItem>
                      {proveedores.map(proveedor => (
                        <SelectItem key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente este producto
              de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={borrarProducto} className="bg-red-600 hover:bg-red-700">
              Eliminar Producto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}