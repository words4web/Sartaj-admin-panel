"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useThemes, useSetActiveTheme } from "@/services/theme/theme.hooks";
import { THEME_SWATCH_COLORS, THEME_METADATA } from "@/types/theme/theme.types";
import { Check, Palette } from "lucide-react";
import { ThemeCard } from "./ThemeCard";

export default function ThemeSettingsPage() {
  const { data: themes, isLoading, error, refetch } = useThemes();
  const { mutate: activateTheme, isPending } = useSetActiveTheme();

  const [selectedThemeName, setSelectedThemeName] = useState<string | null>(
    null,
  );

  if (isLoading) {
    return <CommonLoader message="Loading themes..." />;
  }

  if (error) {
    return (
      <CommonError
        message="Failed to load themes"
        onRetry={() => refetch()}
        fullScreen={false}
      />
    );
  }

  const activeTheme = themes?.find((t) => t?.isActive);
  const activeMeta = activeTheme ? THEME_METADATA[activeTheme?.name] : null;
  const pendingMeta = selectedThemeName
    ? THEME_METADATA[selectedThemeName]
    : null;

  const handleConfirmActivation = () => {
    if (selectedThemeName) {
      activateTheme(selectedThemeName, {
        onSettled: () => {
          setSelectedThemeName(null);
        },
      });
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Website Theme"
        description="Control the visual theme shown to all website visitors. Changes take effect immediately."
      />

      {activeTheme && activeMeta && (
        <Card className="p-4 border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full flex-shrink-0 ring-2 ring-primary/30 ring-offset-2"
              style={{
                background: `linear-gradient(135deg, ${THEME_SWATCH_COLORS[activeTheme?.name]?.[0] ?? "#888"}, ${THEME_SWATCH_COLORS[activeTheme?.name]?.[1] ?? "#aaa"})`,
              }}
            />
            <div>
              <p className="text-sm font-semibold text-primary">Active Theme</p>
              <p className="text-base font-bold text-gray-900">
                {activeMeta?.label}
              </p>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <Check className="h-3 w-3" />
                Live
              </span>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          Available Themes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes?.map((theme) => (
            <ThemeCard
              key={theme?._id}
              theme={theme}
              isActive={theme?.isActive}
              isActivating={isPending && selectedThemeName === theme?.name}
              onActivate={() => setSelectedThemeName(theme?.name)}
            />
          ))}
        </div>
      </div>

      <ConfirmModal
        open={selectedThemeName !== null}
        title="Change Active Theme"
        description={`Are you sure you want to set "${pendingMeta?.label || selectedThemeName}" as the active website theme? This will immediately update the appearance for all visitors.`}
        confirmLabel="Activate Theme"
        cancelLabel="Cancel"
        isLoading={isPending}
        onConfirm={handleConfirmActivation}
        onCancel={() => setSelectedThemeName(null)}
      />
    </div>
  );
}
