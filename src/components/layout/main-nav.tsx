import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";

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


  const clientsUrl: { title: string; href: string; description: string }[] = [
    {
      title: "Home clientes",
      href: "cliente/home",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
      title: "Presupuestos",
      href: "cliente/presupuestos",
      description:
        "For sighted users to preview content available behind a link.",
    },
    {
      title: "Comparador",
      href: "cliente/comparador",
      description:
        "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
  ]

  const proveedoresUrl: { title: string; href: string; description: string }[] = [
    {
      title: "Proveedores home",
      href: "proveedores/presupuestos",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
      title: "Productos",
      href: "proveedores/productos",
      description:
        "For sighted users to preview content available behind a link.",
    }
  ]

  function ListItem({
    title,
    children,
    href,
    ...props
  }: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
      <li {...props}>
        <NavigationMenuLink asChild>
          <Link to={href}>
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }
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

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
    <NavigationMenu >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Administrador</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid p-3 gap-2 md:w-[400px] lg:w-[400px] lg:h-[400px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-6">
                <NavigationMenuLink asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-center rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Beautifully designed components built with Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/" title="Dashboard">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/clientes" title="Clients">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/productos" title="Productos">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
              <ListItem href="/proveedores" title="Proveedores">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
              <ListItem href="/presupuestos" title="Presupuestos">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Clientes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] p-5 gap-2 md:w-[500px] md:grid-cols-2 lg:w-[400px] lg:h-[200px]">
              {clientsUrl.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      
        <NavigationMenuItem>
          <NavigationMenuTrigger>Proveedores</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] p-5 gap-2 md:w-[500px] md:grid-cols-2 lg:w-[400px] lg:h-[200px]">
              {proveedoresUrl.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/docs">Docs</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
     {/* {navItems.map((item) => (
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
      ))}*/}
    </nav>
  );
}