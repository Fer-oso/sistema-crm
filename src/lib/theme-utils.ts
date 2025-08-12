// Theme color palettes defined with HSL values
export interface ColorPalette {
  name: string;
  id: string;
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export const colorPalettes: ColorPalette[] = [
  {
    name: "Default",
    id: "default",
    colors: {
      light: {},
      dark: {},
    }
  },
  {
    name: "Blue",
    id: "blue",
    colors: {
      light: {
        "--primary": "210 100% 50%", 
        "--primary-foreground": "210 40% 98%",
        "--accent": "210 90% 90%",
        "--accent-foreground": "210 100% 20%",
        "--sidebar-primary": "210 100% 50%",
      },
      dark: {
        "--primary": "210 100% 60%",
        "--primary-foreground": "0 0% 100%",
        "--accent": "210 80% 30%",
        "--accent-foreground": "0 0% 100%",
        "--sidebar-primary": "210 100% 60%",
      }
    }
  },
  {
    name: "Green",
    id: "green",
    colors: {
      light: {
        "--primary": "142 76% 36%",
        "--primary-foreground": "0 0% 98%",
        "--accent": "142 60% 95%",
        "--accent-foreground": "142 76% 10%",
        "--sidebar-primary": "142 76% 36%",
      },
      dark: {
        "--primary": "142 76% 46%",
        "--primary-foreground": "0 0% 100%",
        "--accent": "142 60% 20%",
        "--accent-foreground": "0 0% 100%",
        "--sidebar-primary": "142 76% 46%",
      }
    }
  },
  {
    name: "Purple",
    id: "purple",
    colors: {
      light: {
        "--primary": "270 80% 50%",
        "--primary-foreground": "0 0% 98%", 
        "--accent": "270 80% 96%",
        "--accent-foreground": "270 80% 25%",
        "--sidebar-primary": "270 80% 50%",
      },
      dark: {
        "--primary": "270 80% 60%",
        "--primary-foreground": "0 0% 100%",
        "--accent": "270 80% 30%",
        "--accent-foreground": "0 0% 100%",
        "--sidebar-primary": "270 80% 60%",
      }
    }
  },
  {
    name: "Orange",
    id: "orange",
    colors: {
      light: {
        "--primary": "30 100% 50%",
        "--primary-foreground": "0 0% 98%",
        "--accent": "30 100% 94%",
        "--accent-foreground": "30 100% 25%",
        "--sidebar-primary": "30 100% 50%",
      },
      dark: {
        "--primary": "30 100% 60%", 
        "--primary-foreground": "0 0% 10%",
        "--accent": "30 90% 25%",
        "--accent-foreground": "0 0% 98%",
        "--sidebar-primary": "30 100% 60%",
      }
    }
  }
];

// Function to apply the color palette to the document root
export function applyColorPalette(paletteId: string, theme: "light" | "dark" | "system"): void {
  const root = document.documentElement;
  const palette = colorPalettes.find(p => p.id === paletteId);
  
  if (!palette) return;
  
  // Determine if we're in light or dark mode
  const mode: "light" | "dark" = theme === "system" 
    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" 
    : theme as "light" | "dark";
  
  // Apply the color values to CSS variables
  const colors = palette.colors[mode];
  Object.entries(colors).forEach(([variable, value]) => {
    root.style.setProperty(variable, value);
  });
}

// Function to get the stored color palette, defaulting to "default"
export function getStoredPalette(): string {
  return localStorage.getItem("ui-color-palette") || "default";
}