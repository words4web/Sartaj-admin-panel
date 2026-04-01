"use client";

import { useEffect, useMemo, useState } from "react";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
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

export default function SubCategoryForm({
  categories,
  initialValues,
  isSubmitting = false,
  submitLabel = "Save",
  onSubmit,
}: SubCategoryFormProps) {
  const [values, setValues] = useState<SubCategoryFormValues>(initialValues);
  const [errors, setErrors] = useState<{ name?: string; parent?: string }>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const isValid = useMemo(() => {
    return values.name?.trim()?.length >= 1 && !!values.parent;
  }, [values.name, values.parent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; parent?: string } = {};
    if (!values.name?.trim()) nextErrors.name = "SubCategory name is required";
    if (!values.parent) nextErrors.parent = "Parent category is required";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const submitValues = {
      ...values,
      name: values.name?.trim(),
      description: values.description?.trim() || undefined,
    };
    await onSubmit(submitValues as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormInput
        label="SubCategory Name"
        required
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        placeholder="e.g. Sushi"
        error={errors.name}
      />

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Parent Category <span className="text-red-500 ml-1">*</span>
        </label>
        <Select
          value={values.parent}
          onValueChange={(v) => setValues((prev) => ({ ...prev, parent: v }))}
          disabled={isSubmitting || categories?.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder="Select a parent category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((c) => (
              <SelectItem key={c?._id} value={c?._id}>
                {c?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.parent && (
          <p className="text-red-600 text-sm mt-2">{errors?.parent}</p>
        )}
      </div>

      <FormTextarea
        label="Description"
        value={values.description || ""}
        onChange={(e) =>
          setValues((v) => ({ ...v, description: e.target.value }))
        }
        placeholder="Optional description"
        rows={4}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
