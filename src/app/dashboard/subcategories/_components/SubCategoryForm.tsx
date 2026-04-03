"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SubCategoryFormProps,
  SubCategoryFormValues,
} from "@/types/subCategory/subCategory.types";
import { ITranslationMap } from "@/types/api.types";
import {
  TranslationInput,
  LANG_CODES,
  EMPTY_TRANSLATION,
} from "@/components/common/TranslationInput";

const TRANSLATION_FIELDS = [
  { key: "name", label: "SubCategory Name", required: true },
  {
    key: "description",
    label: "Description",
    required: true,
    multiline: true,
    rows: 4,
  },
] as const;

function normalizeTranslation(value: unknown): ITranslationMap {
  const empty = { ...EMPTY_TRANSLATION };
  if (!value) return empty;
  if (typeof value === "string") return { ...empty, en: value };
  return { ...empty, ...(value as ITranslationMap) };
}

export default function SubCategoryForm({
  categories,
  initialValues,
  isSubmitting = false,
  submitLabel = "Save",
  onSubmit,
}: SubCategoryFormProps) {
  const [values, setValues] = useState<SubCategoryFormValues>(() => ({
    ...initialValues,
    name: normalizeTranslation(initialValues.name),
    description: normalizeTranslation(initialValues.description),
  }));
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    parent?: string;
  }>({});

  useEffect(() => {
    setValues({
      ...initialValues,
      name: normalizeTranslation(initialValues.name),
      description: normalizeTranslation(initialValues.description),
    });
    setErrors({});
  }, [initialValues]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleTranslationChange = useCallback(
    (field: string, lang: string, value: string) => {
      setValues((v) => ({
        ...v,
        [field]: {
          ...(v[field as keyof SubCategoryFormValues] as ITranslationMap),
          [lang]: value,
        },
      }));
    },
    [],
  );

  // ─── Validation ────────────────────────────────────────────────────────────

  const isValid = useMemo(() => {
    const nameOk = LANG_CODES.every(
      (l) => !!(values.name as ITranslationMap)?.[l]?.trim(),
    );
    const descOk = LANG_CODES.every(
      (l) => !!(values.description as ITranslationMap)?.[l]?.trim(),
    );
    const parentOk = !!values.parent;
    return nameOk && descOk && parentOk;
  }, [values.name, values.description, values.parent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    const nameMissing = LANG_CODES.some(
      (l) => !(values.name as ITranslationMap)?.[l]?.trim(),
    );
    const descMissing = LANG_CODES.some(
      (l) => !(values.description as ITranslationMap)?.[l]?.trim(),
    );

    if (nameMissing)
      nextErrors.name = "SubCategory name is required in all languages";
    if (descMissing)
      nextErrors.description = "Description is required in all languages";
    if (!values.parent) nextErrors.parent = "Parent category is required";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Translation Tabs */}
      <TranslationInput
        title="Localization"
        description="Provide subcategory name and description for all supported languages."
        fields={TRANSLATION_FIELDS as any}
        values={{
          name: values.name as ITranslationMap,
          description: values.description as ITranslationMap,
        }}
        onChange={handleTranslationChange}
        errors={{
          name: errors.name,
          description: errors.description,
        }}
      />

      {/* Parent Selection */}
      <div className="w-full space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Parent Category <span className="text-red-500 ml-1">*</span>
        </label>
        <Select
          value={values.parent}
          onValueChange={(v) => setValues((prev) => ({ ...prev, parent: v }))}
          disabled={isSubmitting || categories?.length === 0}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a parent category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((c) => (
              <SelectItem key={c?._id} value={c?._id}>
                {c?.name?.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.parent && (
          <p className="text-red-600 text-sm mt-1">{errors?.parent}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
