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
import { AlertCircle, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { proveedoresStore, productosStore } from "@/lib/store";
import { Proveedor, Producto } from "@/types";
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

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nuevoProveedor, setNuevoProveedor] = useState<Partial<Proveedor>>({
    nombre: "",
    contacto: "",
    email: "",
    telefono: "",
    direccion: "",
    notas: ""
  });
  const [proveedorParaEditar, setProveedorParaEditar] = useState<Proveedor | null>(null);
  const [proveedorParaBorrar, setProveedorParaBorrar] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [productosAsociados, setProductosAsociados] = useState<Producto[]>([]);

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = () => {
    const todosProveedores = proveedoresStore.getAll();
    setProveedores(todosProveedores);
  };

  const cargarProductosAsociados = (proveedorId: string) => {
    const productos = productosStore.getByProveedor(proveedorId);
    setProductosAsociados(productos);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (proveedorParaEditar) {
      setProveedorParaEditar({ ...proveedorParaEditar, [name]: value });
    } else {
      setNuevoProveedor({ ...nuevoProveedor, [name]: value });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const proveedoresFiltrados = proveedores.filter(proveedor => 
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.telefono.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (proveedorParaEditar) {
      proveedoresStore.update(proveedorParaEditar.id, proveedorParaEditar);
    } else {
      proveedoresStore.create(nuevoProveedor as Omit<Proveedor, "id">);
      setNuevoProveedor({
        nombre: "",
        contacto: "",
        email: "",
        telefono: "",
        direccion: "",
        notas: ""
      });
    }
    
    cargarProveedores();
    setIsDialogOpen(false);
    setProveedorParaEditar(null);
  };

  const abrirDialogoEditar = (proveedor: Proveedor) => {
    setProveedorParaEditar({ ...proveedor });
    setIsDialogOpen(true);
  };

  const abrirDialogoCrear = () => {
    setProveedorParaEditar(null);
    setNuevoProveedor({
      nombre: "",
      contacto: "",
      email: "",
      telefono: "",
      direccion: "",
      notas: ""
    });
    setIsDialogOpen(true);
  };

  const confirmarBorrarProveedor = (id: string) => {
    // Antes de confirmar borrado, cargamos productos asociados para informar al usuario
    cargarProductosAsociados(id);
    setProveedorParaBorrar(id);
    setIsAlertDialogOpen(true);
  };

  const borrarProveedor = () => {
    if (proveedorParaBorrar) {
      // Si hay productos asociados, primero actualizamos esos productos para quitar la referencia
      if (productosAsociados.length > 0) {
        productosAsociados.forEach(producto => {
          productosStore.update(producto.id, { proveedorId: undefined });
        });
      }
      
      proveedoresStore.delete(proveedorParaBorrar);
      cargarProveedores();
      setIsAlertDialogOpen(false);
      setProveedorParaBorrar(null);
      setProductosAsociados([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Proveedores</h2>
          <p className="text-muted-foreground">
            Gestiona tus proveedores y contactos
          </p>
        </div>
        <Button onClick={abrirDialogoCrear}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Proveedor
        </Button>
      </div>

      <div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Buscar proveedores..."
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
                <TableHead>Contacto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proveedoresFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>No hay proveedores para mostrar</p>
                      <p className="text-sm">Agrega nuevos proveedores usando el botón "Nuevo Proveedor"</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                proveedoresFiltrados.map((proveedor) => (
                  <TableRow key={proveedor.id}>
                    <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                    <TableCell>{proveedor.contacto}</TableCell>
                    <TableCell>{proveedor.email}</TableCell>
                    <TableCell>{proveedor.telefono}</TableCell>
                    <TableCell>{proveedor.direccion}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => abrirDialogoEditar(proveedor)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => confirmarBorrarProveedor(proveedor.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{proveedorParaEditar ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
            <DialogDescription>
              {proveedorParaEditar 
                ? "Modifica los datos del proveedor aquí. Haz clic en guardar cuando termines." 
                : "Agrega un nuevo proveedor al sistema. Completa los campos requeridos."
              }
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
                  placeholder="Nombre de la empresa"
                  value={proveedorParaEditar ? proveedorParaEditar.nombre : nuevoProveedor.nombre}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contacto" className="text-right">
                  Contacto
                </Label>
                <Input
                  id="contacto"
                  name="contacto"
                  placeholder="Nombre de la persona de contacto"
                  value={proveedorParaEditar ? proveedorParaEditar.contacto : nuevoProveedor.contacto}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={proveedorParaEditar ? proveedorParaEditar.email : nuevoProveedor.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  name="telefono"
                  placeholder="Número de teléfono"
                  value={proveedorParaEditar ? proveedorParaEditar.telefono : nuevoProveedor.telefono}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direccion" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="direccion"
                  name="direccion"
                  placeholder="Dirección completa"
                  value={proveedorParaEditar ? proveedorParaEditar.direccion : nuevoProveedor.direccion}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notas" className="text-right">
                  Notas
                </Label>
                <Textarea
                  id="notas"
                  name="notas"
                  placeholder="Notas adicionales (opcional)"
                  value={proveedorParaEditar ? proveedorParaEditar.notas || "" : nuevoProveedor.notas || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{proveedorParaEditar ? "Guardar Cambios" : "Crear Proveedor"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente este proveedor
              de nuestros servidores.
              {productosAsociados.length > 0 && (
                <div className="mt-3 p-3 border rounded-md bg-amber-50 dark:bg-amber-950">
                  <p className="font-semibold">Advertencia:</p>
                  <p>Este proveedor tiene {productosAsociados.length} productos asociados. 
                  Si continúa, estos productos quedarán sin proveedor asignado.</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={borrarProveedor} className="bg-red-600 hover:bg-red-700">
              Eliminar Proveedor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}