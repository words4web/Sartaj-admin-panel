"use client";

export const DATE_PRESETS = [
  { label: "All Time", days: null },
  { label: "Today", days: 0 },
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "Last 90 Days", days: 90 },
] as const;

export function DateRangeFilter({
  activePreset,
  onPresetChange,
}: {
  activePreset: number;
  onPresetChange: (days: number | null, index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {DATE_PRESETS.map((preset, i) => (
        <button
          key={preset?.label}
          onClick={() => onPresetChange(preset?.days as number | null, i)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activePreset === i
              ? "bg-primary text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary"
          }`}>
          {preset?.label}
        </button>
      ))}
    </div>
  );
}
