"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/utils/common.utils";
import {
  ITheme,
  THEME_SWATCH_COLORS,
  THEME_METADATA,
} from "@/types/theme/theme.types";

interface ThemeCardProps {
  theme: ITheme;
  isActive: boolean;
  isActivating: boolean;
  onActivate: () => void;
}

export function ThemeCard({
  theme,
  isActive,
  isActivating,
  onActivate,
}: ThemeCardProps) {
  const swatchColors = THEME_SWATCH_COLORS[theme?.name] ?? ["#888", "#aaa"];
  const meta = THEME_METADATA[theme?.name] || {
    label: theme?.name,
    description: "Visual theme config",
    cssVars: { primary: "#888", secondary: "#aaa", accent: "#ccc" },
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md border",
        isActive
          ? "ring-2 ring-primary shadow-md shadow-primary/10"
          : "hover:ring-1 hover:ring-gray-300",
      )}
      style={{
        backgroundColor: meta?.cssVars?.background ?? "#ffffff",
        color: meta?.cssVars?.foreground ?? "#0f172a",
        borderColor: meta?.cssVars?.border ?? "#e2e8f0",
      }}
      onClick={!isActive ? onActivate : undefined}>
      {/* Gradient Preview Strip */}
      <div
        className="h-24 w-full relative"
        style={{
          background: `linear-gradient(135deg, ${swatchColors[0]}, ${swatchColors[1]})`,
        }}>
        {/* Active badge */}
        {isActive && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <Check className="h-2.5 w-2.5" />
            Active
          </span>
        )}
        {/* Particle indicator */}
        {meta?.particles?.enabled && (
          <span className="absolute top-2 left-2 text-white/80">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3
            className="font-semibold text-sm"
            style={{ color: meta?.cssVars?.primary ?? "inherit" }}>
            {meta?.label}
          </h3>
          <p className="text-xs mt-0.5 leading-relaxed opacity-75">
            {meta?.description}
          </p>
        </div>

        {/* Swatch row */}
        <div className="flex gap-1.5">
          {[
            meta?.cssVars?.primary,
            meta?.cssVars?.secondary,
            meta?.cssVars?.accent,
          ]?.map((color, i) => (
            <span
              key={i}
              className="h-4 w-4 rounded-full ring-1 ring-black/10 flex-shrink-0"
              style={{ background: color }}
            />
          ))}
        </div>

        <Button
          size="sm"
          variant={isActive ? "outline" : "default"}
          className="w-full text-xs"
          disabled={isActive || isActivating}
          onClick={(e) => {
            e.stopPropagation();
            if (!isActive) onActivate();
          }}>
          {isActive
            ? "Currently Active"
            : isActivating
              ? "Applying..."
              : "Set as Active"}
        </Button>
      </div>
    </Card>
  );
}
