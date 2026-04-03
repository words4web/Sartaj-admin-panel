"use client";

import { ITranslationMap } from "@/types/api.types";
import { SUPPORTED_LANGUAGES, LangCode } from "./TranslationInput";

// ─── Row definitions ──────────────────────────────────────────────────────────

export interface TranslationDisplayField {
  /** Must match a key of the values object */
  key: string;
  label: string;
}

interface TranslationDisplayProps {
  /** Title for the section */
  title?: string;
  /** Field definitions (what to show per language tab/row) */
  fields: TranslationDisplayField[];
  /** Values keyed by [fieldKey] → ITranslationMap */
  values: Record<string, ITranslationMap | undefined>;
  /** Optionally highlight a specific language as primary */
  primaryLang?: LangCode;
  /** If true, show the primary language row separately at the top */
  showPrimary?: boolean;
}

/**
 * A reusable read-only translation display.
 *
 * Shows the primary language (English) highlighted at the top,
 * then a 2-column grid for all other translations.
 *
 * @example
 * <TranslationDisplay
 *   title="Global Translations"
 *   fields={[
 *     { key: "name", label: "Name" },
 *     { key: "description", label: "Description" },
 *   ]}
 *   values={{ name: category.name, description: category.description }}
 * />
 */
export function TranslationDisplay({
  title = "Global Translations",
  fields,
  values,
  primaryLang = "en",
  showPrimary = true,
}: TranslationDisplayProps) {
  const otherLangs = SUPPORTED_LANGUAGES.filter((l) => l.id !== primaryLang);
  const primaryLangDef = SUPPORTED_LANGUAGES.find((l) => l.id === primaryLang);

  return (
    <div className="space-y-6">
      {/* Primary language block */}
      {showPrimary && primaryLangDef && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">
              {primaryLangDef?.id}
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {primaryLangDef?.label}
            </span>
          </div>
          <div className="space-y-2">
            {fields?.map((field) => {
              const val = values[field.key]?.[primaryLang] ?? "";
              return (
                <div key={field.key}>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                    {field.label}
                  </p>
                  <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm leading-relaxed">
                    {val || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Other languages grid */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-primary rounded-full" />
          {title}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherLangs?.map((lang) => (
            <div
              key={lang?.id}
              className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600 uppercase">
                  {lang?.id}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {lang?.label}
                </span>
              </div>

              <div className="space-y-2">
                {fields?.map((field) => {
                  const val = values[field.key]?.[lang?.id as LangCode] ?? "";
                  return (
                    <div key={field?.key}>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                        {field?.label}
                      </p>
                      <p
                        className="text-sm text-gray-800 line-clamp-2"
                        title={val}>
                        {val || (
                          <span className="text-gray-300 italic text-xs">
                            —
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
