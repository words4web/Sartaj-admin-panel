"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import { ITranslationMap } from "@/types/api.types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const LANG_CODES = ["en", "hi", "ne", "ja", "bn"] as const;
export type LangCode = (typeof LANG_CODES)[number];

export const SUPPORTED_LANGUAGES: {
  id: LangCode;
  label: string;
  nativeLabel: string;
}[] = [
  { id: "en", label: "English", nativeLabel: "English (Primary)" },
  { id: "hi", label: "Hindi", nativeLabel: "हिंदी" },
  { id: "ne", label: "Nepali", nativeLabel: "नेपाली" },
  { id: "ja", label: "Japanese", nativeLabel: "日本語" },
  { id: "bn", label: "Bengali", nativeLabel: "বাংলা" },
];

export const EMPTY_TRANSLATION: ITranslationMap = {
  en: "",
  hi: "",
  ne: "",
  ja: "",
  bn: "",
};

// ─── Field Definitions ────────────────────────────────────────────────────────

export interface TranslationField {
  /** The key in the form values object */
  key: string;
  /** Label shown above the field */
  label: string;
  /** If true, shows a textarea instead of an input */
  multiline?: boolean;
  /** Row count for a textarea */
  rows?: number;
  /** If true, shown with a required asterisk */
  required?: boolean;
  /** Placeholder for the field */
  placeholder?: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TranslationInputProps {
  /** Title shown at the top of the card */
  title?: string;
  /** Subtitle description */
  description?: string;
  /** Array of field definitions to render inside each language tab */
  fields: TranslationField[];
  /** Current translation map values keyed by [fieldKey][langCode] */
  values: Record<string, ITranslationMap>;
  /** Called when value changes: (field, lang, newValue) */
  onChange: (field: string, lang: LangCode, value: string) => void;
  /** Error map keyed by field key */
  errors?: Record<string, string | undefined>;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * A reusable tabbed form component for entering translations.
 *
 * @example
 * <TranslationInput
 *   fields={[
 *     { key: "name", label: "Category Name", required: true },
 *     { key: "description", label: "Description", multiline: true, rows: 4, required: true },
 *   ]}
 *   values={{ name: values.name, description: values.description }}
 *   onChange={(field, lang, val) => setValues(v => ({ ...v, [field]: { ...v[field], [lang]: val } }))}
 *   errors={errors}
 * />
 */
export function TranslationInput({
  title = "Localization",
  description = "Provide content for all supported languages.",
  fields,
  values,
  onChange,
  errors = {},
}: TranslationInputProps) {
  const [activeTab, setActiveTab] = useState<LangCode>("en");

  const handleChange = useCallback(
    (field: string, lang: LangCode, value: string) => {
      onChange(field, lang, value);
    },
    [onChange],
  );

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="space-y-4 p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-2">
        <Label className="text-base font-semibold text-gray-900">{title}</Label>
        <p className="text-xs text-gray-500">{description}</p>

        {hasErrors && (
          <div className="mt-2 text-sm bg-red-50 border border-red-100 rounded-lg p-3 flex flex-col gap-1">
            {Object.entries(errors)
              ?.filter(([, msg]) => Boolean(msg))
              ?.map(([key, msg]) => (
                <span key={key} className="text-red-600">
                  • {msg}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as LangCode)}>
        <TabsList className="w-full justify-start h-auto flex-wrap bg-gray-100/60 p-1 gap-1 rounded-xl">
          {SUPPORTED_LANGUAGES.map((lang) => {
            // const isComplete = fields.every(
            //   (f) => (values[f.key]?.[lang.id] ?? "").trim().length > 0,
            // );
            return (
              <TabsTrigger
                key={lang?.id}
                value={lang?.id}
                className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary text-xs sm:text-sm">
                {lang?.nativeLabel}
                {/* Green dot if complete */}
                {/* {isComplete && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                )} */}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SUPPORTED_LANGUAGES.map((lang) => (
          <TabsContent
            key={lang.id}
            value={lang.id}
            className="space-y-4 mt-0 pt-4 outline-none">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">
                {lang.id}
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {lang.label}
              </span>
            </div>

            {fields?.map((field) => {
              const val = values[field.key]?.[lang.id] ?? "";
              const placeholder =
                field.placeholder ?? `${field.label} in ${lang.label}`;

              if (field.multiline) {
                return (
                  <FormTextarea
                    key={field.key}
                    label={field.label}
                    required={field.required}
                    value={val}
                    onChange={(e) =>
                      handleChange(field.key, lang.id, e.target.value)
                    }
                    placeholder={placeholder}
                    rows={field.rows ?? 4}
                  />
                );
              }

              return (
                <FormInput
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  value={val}
                  onChange={(e) =>
                    handleChange(field.key, lang.id, e.target.value)
                  }
                  placeholder={placeholder}
                />
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
