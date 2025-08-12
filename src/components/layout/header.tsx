import { MainNav } from "./main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { PaletteSelector } from "@/components/palette-selector";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 pt-10">
              <MainNav />
            </SheetContent>
          </Sheet>
        </div>
        <div onClick={toggleSidebar} className="cursor-pointer mr-4 hidden md:flex items-center text-xl font-semibold">
          <span className="bg-primary text-primary-foreground p-1 rounded mr-2">CRM</span> Sistema
        </div>
        <div className="hidden md:flex">
          <MainNav />
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <PaletteSelector />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}