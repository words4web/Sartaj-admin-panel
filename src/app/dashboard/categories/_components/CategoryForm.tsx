"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageIcon, X } from "lucide-react";
import {
  CategoryFormProps,
  CategoryFormValues,
} from "@/types/category/category.types";
import { ITranslationMap } from "@/types/api.types";
import {
  TranslationInput,
  LANG_CODES,
  EMPTY_TRANSLATION,
} from "@/components/common/TranslationInput";
import {
  normalizeTranslation,
  updateTranslationField,
  isTranslationComplete,
} from "@/utils/translation.utils";
import { getStandardTranslationFields } from "@/constants/translation.constants";
import { slugify } from "@/utils/product.util";

const TRANSLATION_FIELDS = getStandardTranslationFields("Category Name");

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryForm({
  initialValues,
  isSubmitting = false,
  submitLabel = "Save",
  requireImage = false,
  onSubmit,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>(() => ({
    ...initialValues,
    name: normalizeTranslation(initialValues.name),
    description: normalizeTranslation(initialValues.description),
  }));
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    slug?: string;
    image?: string;
  }>({});
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues.existingImage || null,
  );

  // Sync when initialValues change (e.g. edit page data loads)
  useEffect(() => {
    setValues({
      ...initialValues,
      name: normalizeTranslation(initialValues.name),
      description: normalizeTranslation(initialValues.description),
    });
    setErrors({});
    setImagePreview(initialValues.existingImage || null);
  }, [initialValues]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValues((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const handleTranslationChange = useCallback(
    (field: string, lang: string, value: string) => {
      setValues((v) => {
        let next = updateTranslationField(
          v,
          field as keyof CategoryFormValues,
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

  // ─── Validation ────────────────────────────────────────────────────────────

  const isValid = useMemo(() => {
    const nameOk = isTranslationComplete(values.name as ITranslationMap);
    const descOk = isTranslationComplete(values.description as ITranslationMap);
    const slugOk =
      values.slug?.trim()?.length > 0 &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug);
    const imageOk = requireImage ? !!imagePreview : true;
    return nameOk && descOk && slugOk && imageOk;
  }, [
    values.name,
    values.description,
    values.slug,
    imagePreview,
    requireImage,
  ]);

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
      nextErrors.name = "Category name is required in all languages";
    if (descMissing)
      nextErrors.description = "Description is required in all languages";
    if (!slugValue) {
      nextErrors.slug = "Slug is required";
    } else if (!slugValid) {
      nextErrors.slug =
        "Invalid slug format (only lowercase, numbers, and hyphens)";
    }
    if (requireImage && !imagePreview)
      nextErrors.image = "Category image is required.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const name = values.name as ITranslationMap;
    const description = values.description as ITranslationMap;

    await onSubmit({
      ...values,
      slug: slugValue,
      name: {
        en: name.en?.trim() ?? "",
        hi: name.hi?.trim() ?? "",
        ne: name.ne?.trim() ?? "",
        ja: name.ja?.trim() ?? "",
        bn: name.bn?.trim() ?? "",
      },
      description: {
        en: description.en?.trim() ?? "",
        hi: description.hi?.trim() ?? "",
        ne: description.ne?.trim() ?? "",
        ja: description.ja?.trim() ?? "",
        bn: description.bn?.trim() ?? "",
      },
    } as CategoryFormValues);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Translation Tabs */}
      <TranslationInput
        title="Localization"
        description="Provide category name and description for all supported languages."
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
        <Label htmlFor="category-slug" className="font-bold">
          Category Slug <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="category-slug"
          placeholder="e.g. sauce-chutney"
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

      {/* Image Upload */}
      <div className="space-y-3">
        <Label>
          Category Image
          {requireImage && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="flex items-start gap-6">
          <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden hover:bg-gray-100 transition-colors">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/400x400/e2e8f0/64748b?text=Image";
                }}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                <span className="text-xs font-medium">Upload Image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
              onClick={() => {
                setImagePreview(null);
                setValues((v) => ({ ...v, image: null, existingImage: null }));
              }}
              disabled={!imagePreview || isSubmitting}>
              <X className="w-4 h-4 mr-2" />
              Remove Cover
            </Button>
            <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
              Recommended size: 400x400px. <br /> Max file size: 5MB.
              <br /> Formats: JPG, PNG, WebP.
            </p>
            {errors.image && (
              <p className="text-red-600 text-sm mt-1">{errors.image}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
