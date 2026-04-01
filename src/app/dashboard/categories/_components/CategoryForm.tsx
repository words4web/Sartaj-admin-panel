"use client";

import { useEffect, useMemo, useState } from "react";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, X } from "lucide-react";
import {
  CategoryFormProps,
  CategoryFormValues,
} from "@/types/category/category.types";

export default function CategoryForm({
  initialValues,
  isSubmitting = false,
  submitLabel = "Save",
  requireImage = false,
  onSubmit,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>(initialValues);
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues.existingImage || null,
  );

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setImagePreview(initialValues.existingImage || null);
  }, [initialValues]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValues((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      e.target.value = ""; // Reset input
    }
  };

  const isValid = useMemo(() => {
    const isNameValid = values.name?.trim()?.length >= 1;
    const isImageValid = requireImage ? !!imagePreview : true;
    return isNameValid && isImageValid;
  }, [values.name, imagePreview, requireImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; image?: string } = {};
    const trimmed = values.name?.trim();

    if (!trimmed) {
      nextErrors.name = "Category name is required";
    }

    if (requireImage && !imagePreview) {
      nextErrors.image = "Category image is required.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const submitValues = {
      ...values,
      name: trimmed,
      description: values.description?.trim() || undefined,
    };

    await onSubmit(submitValues as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormInput
        label="Category Name"
        required
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        placeholder="e.g. Restaurant"
        error={errors.name}
      />

      <FormTextarea
        label="Description"
        value={values.description || ""}
        onChange={(e) =>
          setValues((v) => ({ ...v, description: e.target.value }))
        }
        placeholder="Optional description"
        rows={4}
      />

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

            {/* Overlay Input */}
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

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
