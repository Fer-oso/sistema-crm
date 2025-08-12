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
import { clientesStore } from "@/lib/store";
import { Cliente } from "@/types";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState<Partial<Cliente>>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    notas: ""
  });
  const [clienteParaEditar, setClienteParaEditar] = useState<Cliente | null>(null);
  const [clienteParaBorrar, setClienteParaBorrar] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = () => {
    const todosClientes = clientesStore.getAll();
    setClientes(todosClientes);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (clienteParaEditar) {
      setClienteParaEditar({ ...clienteParaEditar, [name]: value });
    } else {
      setNuevoCliente({ ...nuevoCliente, [name]: value });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (clienteParaEditar) {
      clientesStore.update(clienteParaEditar.id, clienteParaEditar);
    } else {
      clientesStore.create(nuevoCliente as Omit<Cliente, "id" | "fechaRegistro">);
      setNuevoCliente({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        notas: ""
      });
    }
    
    cargarClientes();
    setIsDialogOpen(false);
    setClienteParaEditar(null);
  };

  const abrirDialogoEditar = (cliente: Cliente) => {
    setClienteParaEditar({ ...cliente });
    setIsDialogOpen(true);
  };

  const abrirDialogoCrear = () => {
    setClienteParaEditar(null);
    setNuevoCliente({
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      notas: ""
    });
    setIsDialogOpen(true);
  };

  const confirmarBorrarCliente = (id: string) => {
    setClienteParaBorrar(id);
    setIsAlertDialogOpen(true);
  };

  const borrarCliente = () => {
    if (clienteParaBorrar) {
      clientesStore.delete(clienteParaBorrar);
      cargarClientes();
      setIsAlertDialogOpen(false);
      setClienteParaBorrar(null);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground">
            Gestiona todos tus clientes en un solo lugar
          </p>
        </div>
        <Button onClick={abrirDialogoCrear}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>

      <div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Buscar clientes..."
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
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>No hay clientes para mostrar</p>
                      <p className="text-sm">Agrega nuevos clientes usando el botón "Nuevo Cliente"</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.direccion}</TableCell>
                    <TableCell>{formatDate(cliente.fechaRegistro)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => abrirDialogoEditar(cliente)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => confirmarBorrarCliente(cliente.id)}
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
            <DialogTitle>{clienteParaEditar ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
            <DialogDescription>
              {clienteParaEditar 
                ? "Modifica los datos del cliente aquí. Haz clic en guardar cuando termines." 
                : "Agrega un nuevo cliente al sistema. Completa los campos requeridos."
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
                  placeholder="Nombre del cliente"
                  value={clienteParaEditar ? clienteParaEditar.nombre : nuevoCliente.nombre}
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
                  value={clienteParaEditar ? clienteParaEditar.email : nuevoCliente.email}
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
                  value={clienteParaEditar ? clienteParaEditar.telefono : nuevoCliente.telefono}
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
                  value={clienteParaEditar ? clienteParaEditar.direccion : nuevoCliente.direccion}
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
                  value={clienteParaEditar ? clienteParaEditar.notas || "" : nuevoCliente.notas || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{clienteParaEditar ? "Guardar Cambios" : "Crear Cliente"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente este cliente
              y todos sus datos asociados de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={borrarCliente} className="bg-red-600 hover:bg-red-700">
              Eliminar Cliente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}