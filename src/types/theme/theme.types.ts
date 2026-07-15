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
    background?: string;
    foreground?: string;
    border?: string;
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
      background: "oklch(0.99 0 0)",
      foreground: "oklch(0.145 0 0)",
      border: "oklch(0.922 0 0)",
    },
  },
  sakura: {
    label: "Sakura Spring",
    description: "Soft pink cherry blossom aesthetic",
    cssVars: {
      primary: "oklch(0.58 0.2 0)",
      secondary: "oklch(0.94 0.04 355)",
      accent: "oklch(0.92 0.06 350)",
      background: "oklch(0.99 0.01 355)",
      foreground: "oklch(0.2 0.05 0)",
      border: "oklch(0.88 0.06 355)",
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
      background: "oklch(0.975 0.01 220)",
      foreground: "oklch(0.18 0.06 225)",
      border: "oklch(0.86 0.05 220)",
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
      background: "oklch(0.99 0.02 70)",
      foreground: "oklch(0.18 0.05 45)",
      border: "oklch(0.88 0.09 55)",
    },
    particles: { enabled: true },
  },
  emerald: {
    label: "Emerald Garden",
    description: "Rich forest green vibes with fresh lime accents",
    cssVars: {
      primary: "oklch(0.45 0.16 150)",
      secondary: "oklch(0.96 0.03 150)",
      accent: "oklch(0.65 0.18 110)",
      background: "oklch(0.99 0.01 150)",
      foreground: "oklch(0.15 0.05 150)",
      border: "oklch(0.9 0.04 150)",
    },
  },
  midnight: {
    label: "Midnight Ocean",
    description: "Vibrant deep oceanic blue with cyan accents",
    cssVars: {
      primary: "oklch(0.35 0.14 245)",
      secondary: "oklch(0.96 0.02 245)",
      accent: "oklch(0.55 0.18 200)",
      background: "oklch(0.995 0.005 245)",
      foreground: "oklch(0.15 0.03 245)",
      border: "oklch(0.92 0.01 245)",
    },
  },
  sunset: {
    label: "Golden Sunset",
    description: "Vibrant tangerine and amber glow",
    cssVars: {
      primary: "oklch(0.6 0.22 35)",
      secondary: "oklch(0.97 0.03 40)",
      accent: "oklch(0.82 0.18 80)",
      background: "oklch(0.99 0.01 45)",
      foreground: "oklch(0.16 0.05 40)",
      border: "oklch(0.92 0.04 45)",
    },
  },
  lavender: {
    label: "Lavender Dream",
    description: "Serene pastel lilac with vibrant orchid pops",
    cssVars: {
      primary: "oklch(0.55 0.18 290)",
      secondary: "oklch(0.96 0.02 290)",
      accent: "oklch(0.7 0.22 330)",
      background: "oklch(0.99 0.01 290)",
      foreground: "oklch(0.18 0.04 290)",
      border: "oklch(0.92 0.04 290)",
    },
  },
  cyberpunk: {
    label: "Cyber Matrix",
    description: "Vibrant neon magenta with bright cyber cyan accents",
    cssVars: {
      primary: "oklch(0.55 0.22 320)",
      secondary: "oklch(0.97 0.01 320)",
      accent: "oklch(0.6 0.2 195)",
      background: "oklch(0.995 0.005 320)",
      foreground: "oklch(0.15 0.05 320)",
      border: "oklch(0.92 0.02 320)",
    },
  },
  forest: {
    label: "Autumn Maple",
    description: "Deep rustic forest tones with maple orange accents",
    cssVars: {
      primary: "oklch(0.42 0.16 30)",
      secondary: "oklch(0.97 0.03 60)",
      accent: "oklch(0.48 0.15 110)",
      background: "oklch(0.985 0.02 85)",
      foreground: "oklch(0.14 0.04 120)",
      border: "oklch(0.89 0.04 120)",
    },
  },
  monochrome: {
    label: "Sleek Slate",
    description: "Modern professional cool slate gray",
    cssVars: {
      primary: "oklch(0.25 0.03 240)",
      secondary: "oklch(0.95 0.01 240)",
      accent: "oklch(0.45 0.1 240)",
      background: "oklch(0.99 0 0)",
      foreground: "oklch(0.15 0 0)",
      border: "oklch(0.91 0 0)",
    },
  },
  royal: {
    label: "Royal Velvet",
    description: "Deep regal violet with bright gold highlights",
    cssVars: {
      primary: "oklch(0.42 0.2 300)",
      secondary: "oklch(0.96 0.03 300)",
      accent: "oklch(0.72 0.18 70)",
      background: "oklch(0.99 0.01 300)",
      foreground: "oklch(0.15 0.05 300)",
      border: "oklch(0.9 0.04 300)",
    },
  },
  crimson: {
    label: "Crimson Velvet",
    description: "Velvety rose crimson with sweet pink accents",
    cssVars: {
      primary: "oklch(0.52 0.22 18)",
      secondary: "oklch(0.97 0.02 20)",
      accent: "oklch(0.85 0.12 355)",
      background: "oklch(0.99 0.01 20)",
      foreground: "oklch(0.16 0.05 18)",
      border: "oklch(0.91 0.03 20)",
    },
  },
  nordic: {
    label: "Nordic Frost",
    description: "Clean polar sky blue with refreshing cyan accents",
    cssVars: {
      primary: "oklch(0.48 0.16 230)",
      secondary: "oklch(0.95 0.03 220)",
      accent: "oklch(0.68 0.18 190)",
      background: "oklch(0.99 0.01 220)",
      foreground: "oklch(0.15 0.03 220)",
      border: "oklch(0.92 0.02 220)",
    },
  },
  terracotta: {
    label: "Warm Clay",
    description: "Earthy Tuscan clay terracotta with rich sand accents",
    cssVars: {
      primary: "oklch(0.55 0.16 52)",
      secondary: "oklch(0.97 0.03 65)",
      accent: "oklch(0.75 0.14 85)",
      background: "oklch(0.99 0.01 65)",
      foreground: "oklch(0.16 0.05 52)",
      border: "oklch(0.92 0.03 65)",
    },
  },
  peachy: {
    label: "Sweet Peach",
    description: "Coral peach tones with refreshing mint accents",
    cssVars: {
      primary: "oklch(0.65 0.14 45)",
      secondary: "oklch(0.97 0.03 50)",
      accent: "oklch(0.78 0.12 165)",
      background: "oklch(0.99 0.01 50)",
      foreground: "oklch(0.16 0.05 45)",
      border: "oklch(0.93 0.02 50)",
    },
  },
};

/** Swatch gradient stop colors for each theme — mirrors frontend themeSwatchColors */
export const THEME_SWATCH_COLORS: Record<string, [string, string]> = {
  default: ["#243b87", "#006e1c"],
  sakura: ["#d4507a", "#f9a8c9"],
  snowfall: ["#4a7ba7", "#93c5fd"],
  diwali: ["#d4771a", "#f59e0b"],
  emerald: ["#0f5132", "#a3e635"],
  midnight: ["#0f172a", "#38bdf8"],
  sunset: ["#ea580c", "#fbbf24"],
  lavender: ["#7c3aed", "#e879f9"],
  cyberpunk: ["#111827", "#84cc16"],
  forest: ["#7f1d1d", "#65a30d"],
  monochrome: ["#334155", "#cbd5e1"],
  royal: ["#581c87", "#eab308"],
  crimson: ["#be123c", "#fda4af"],
  nordic: ["#1d4ed8", "#38bdf8"],
  terracotta: ["#9a3412", "#fed7aa"],
  peachy: ["#f97316", "#86efac"],
};
