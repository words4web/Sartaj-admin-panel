export interface ITheme {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IThemeMetadata {
  label: string;
  description: string;
  cssVars: {
    primary: string;
    secondary: string;
    accent: string;
  };
  particles?: {
    enabled: boolean;
  };
}

export const THEME_METADATA: Record<string, IThemeMetadata> = {
  default: {
    label: "Default",
    description: "Classic professional design",
    cssVars: {
      primary: "oklch(0.32 0.18 264)",
      secondary: "oklch(0.97 0 0)",
      accent: "oklch(0.97 0 0)",
    },
  },
  sakura: {
    label: "Sakura Spring",
    description: "Soft pink cherry blossom aesthetic",
    cssVars: {
      primary: "oklch(0.58 0.2 0)",
      secondary: "oklch(0.94 0.04 355)",
      accent: "oklch(0.92 0.06 350)",
    },
    particles: { enabled: true },
  },
  snowfall: {
    label: "Snowfall Winter",
    description: "Cool icy winter theme",
    cssVars: {
      primary: "oklch(0.52 0.14 230)",
      secondary: "oklch(0.93 0.04 220)",
      accent: "oklch(0.90 0.06 215)",
    },
    particles: { enabled: true },
  },
  diwali: {
    label: "Diwali Festival",
    description: "Vibrant festival celebration colors",
    cssVars: {
      primary: "oklch(0.65 0.19 55)",
      secondary: "oklch(0.95 0.07 60)",
      accent: "oklch(0.92 0.1 55)",
    },
    particles: { enabled: true },
  },
};

/** Swatch gradient stop colors for each theme — mirrors frontend themeSwatchColors */
export const THEME_SWATCH_COLORS: Record<string, [string, string]> = {
  default: ["#243b87", "#006e1c"],
  sakura: ["#d4507a", "#f9a8c9"],
  snowfall: ["#4a7ba7", "#93c5fd"],
  diwali: ["#d4771a", "#f59e0b"],
};
