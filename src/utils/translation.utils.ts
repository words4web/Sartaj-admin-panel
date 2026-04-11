import { ITranslationMap } from "@/types/api.types";
import {
  EMPTY_TRANSLATION,
  LANG_CODES,
} from "@/components/common/TranslationInput";

/**
 * Ensures a translation value is a valid ITranslationMap.
 * Falls back to EMPTY_TRANSLATION if null/undefined.
 * If string, puts it in 'en' field.
 */
export function normalizeTranslation(v: unknown): ITranslationMap {
  if (!v) return { ...EMPTY_TRANSLATION };
  if (typeof v === "string") return { ...EMPTY_TRANSLATION, en: v };
  return { ...EMPTY_TRANSLATION, ...(v as ITranslationMap) };
}

/**
 * Checks if all language fields in a map have non-empty values.
 */
export function isTranslationComplete(
  map: ITranslationMap | undefined,
): boolean {
  if (!map) return false;
  return LANG_CODES.every((l) => !!map[l]?.trim());
}

/**
 * Checks if any language field in a map is empty.
 */
export function hasMissingTranslations(
  map: ITranslationMap | undefined,
): boolean {
  return !isTranslationComplete(map);
}

/**
 * Helper for updating a translation field in a form state.
 */
export function updateTranslationField<T>(
  prev: T,
  field: keyof T,
  lang: string,
  value: string,
): T {
  const currentMap = prev[field] as unknown as ITranslationMap;
  return {
    ...prev,
    [field]: {
      ...currentMap,
      [lang]: value,
    },
  };
}
