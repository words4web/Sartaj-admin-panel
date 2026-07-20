"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SubCategoryFormProps,
  SubCategoryFormValues,
} from "@/types/subCategory/subCategory.types";
import { ITranslationMap } from "@/types/api.types";
import { TranslationInput } from "@/components/common/TranslationInput";
import {
  normalizeTranslation,
  updateTranslationField,
  isTranslationComplete,
} from "@/utils/translation.utils";
import { getStandardTranslationFields } from "@/constants/translation.constants";
import { PaginatedDropdown } from "@/components/common/PaginatedDropdown";
import { categoryApi } from "@/services/category/category.api";
import { slugify } from "@/utils/product.util";

const TRANSLATION_FIELDS = getStandardTranslationFields("SubCategory Name");

export default function SubCategoryForm({
  initialValues,
  initialParentLabel,
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
    slug?: string;
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

  // ─── Handlers

  const handleTranslationChange = useCallback(
    (field: string, lang: string, value: string) => {
      setValues((v) => {
        let next = updateTranslationField(
          v,
          field as keyof SubCategoryFormValues,
          lang,
          value,
        );
        if (field === "name" && lang === "en") {
          const currentSlug = v?.slug || "";
          const expectedOldSlug = slugify(v?.name?.en || "");
          if (currentSlug === "" || currentSlug === expectedOldSlug) {
            next = { ...next, slug: slugify(value) };
          }
        }
        return next;
      });
    },
    [],
  );

  // ─── Validation

  const isValid = useMemo(() => {
    const nameOk = isTranslationComplete(values.name as ITranslationMap);
    const descOk = isTranslationComplete(values.description as ITranslationMap);
    const slugOk =
      values.slug?.trim()?.length > 0 &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug);
    const parentOk = !!values.parent;
    return nameOk && descOk && slugOk && parentOk;
  }, [values.name, values.description, values.slug, values.parent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    const nameMissing = !isTranslationComplete(values.name as ITranslationMap);
    const descMissing = !isTranslationComplete(
      values.description as ITranslationMap,
    );
    const slugValue = values.slug?.trim() || "";
    const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugValue);

    if (nameMissing)
      nextErrors.name = "SubCategory name is required in all languages";
    if (descMissing)
      nextErrors.description = "Description is required in all languages";
    if (!slugValue) {
      nextErrors.slug = "Slug is required";
    } else if (!slugValid) {
      nextErrors.slug =
        "Invalid slug format (only lowercase, numbers, and hyphens)";
    }
    if (!values.parent) nextErrors.parent = "Parent category is required";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit({
      ...values,
      slug: slugValue,
    });
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

      {/* Slug Input */}
      <div className="space-y-2 max-w-lg">
        <Label htmlFor="subcategory-slug" className="font-bold">
          SubCategory Slug <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="subcategory-slug"
          placeholder="e.g. ice-creams"
          value={values.slug}
          onChange={(e) => {
            const val = e.target.value?.toLowerCase()?.replace(/\s+/g, "-");
            setValues((p) => ({ ...p, slug: val }));
          }}
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500">
          The slug is used in SEO-friendly URLs. It must contain only lowercase
          letters, numbers, and hyphens.
        </p>
        {errors.slug && (
          <p className="text-red-600 text-sm mt-1">{errors.slug}</p>
        )}
      </div>

      {/* Parent Selection */}
      <div className="w-full space-y-2 max-w-lg">
        <label className="block text-sm font-bold text-gray-900">
          Parent Category <span className="text-red-500 ml-1">*</span>
        </label>

        <PaginatedDropdown
          value={values.parent}
          onValueChange={(v) => setValues((prev) => ({ ...prev, parent: v }))}
          queryKey={["categories", "dropdown"]}
          fetchData={async ({ search, page, limit }) => {
            const res = await categoryApi.getCategories({
              search,
              page,
              limit,
            });
            return {
              options: res?.categories?.map((c) => ({
                value: c._id,
                label: c?.name?.en || "Unknown Category",
              })),
              hasMore: res?.categories?.length === limit,
            };
          }}
          limit={10}
          selectedLabel={
            values.parent === initialValues.parent
              ? initialParentLabel
              : undefined
          }
          placeholder="Select a parent category"
          searchPlaceholder="Search categories..."
          disabled={isSubmitting}
        />

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
