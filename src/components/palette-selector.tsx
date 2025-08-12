import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { colorPalettes, getStoredPalette } from "@/lib/theme-utils";
import { useState, useEffect } from "react";

export function PaletteSelector() {
  const { theme } = useTheme();
  const [currentPalette, setCurrentPalette] = useState<string>(getStoredPalette());
  
  // Apply the stored palette on component mount and theme change
  useEffect(() => {
    const storedPalette = getStoredPalette();
    setCurrentPalette(storedPalette);
    
    // Import here to avoid SSR issues
    import("@/lib/theme-utils").then(({ applyColorPalette }) => {
      applyColorPalette(storedPalette, theme);
    });
  }, [theme]);

  const changePalette = (paletteId: string) => {
    localStorage.setItem("ui-color-palette", paletteId);
    setCurrentPalette(paletteId);
    
    // Import here to avoid SSR issues
    import("@/lib/theme-utils").then(({ applyColorPalette }) => {
      applyColorPalette(paletteId, theme);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Select color palette</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {colorPalettes.map((palette) => (
          <DropdownMenuItem 
            key={palette.id}
            onClick={() => changePalette(palette.id)}
            className="flex items-center justify-between"
          >
            <span>{palette.name}</span>
            {currentPalette === palette.id && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}