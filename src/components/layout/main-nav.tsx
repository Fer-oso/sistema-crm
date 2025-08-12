import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MainNav() {
  const location = useLocation();
  
  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/clientes", label: "Clientes" },
    { href: "/productos", label: "Productos" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/proveedores", label: "Proveedores" },
    { href: "/presupuestos", label: "Presupuestos" },
    { href: "/comparador", label: "Comparador" },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location.pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}