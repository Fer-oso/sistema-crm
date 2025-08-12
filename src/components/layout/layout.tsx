import { ReactNode, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex">
        <main className={cn("flex-1 p-4 md:p-6")}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}