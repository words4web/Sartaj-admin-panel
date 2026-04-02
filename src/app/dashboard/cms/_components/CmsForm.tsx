"use client";

import { useEffect, useState } from "react";
import { FormInput } from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./RichTextEditor";

interface CmsFormValues {
  title: string;
  slug: string;
  content: string;
}

interface CmsFormProps {
  initialValues: CmsFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: CmsFormValues) => Promise<void>;
}

export default function CmsForm({
  initialValues,
  isSubmitting = false,
  submitLabel = "Save",
  onSubmit,
}: CmsFormProps) {
  const [values, setValues] = useState<CmsFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CmsFormValues, string>>>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof CmsFormValues, string>> = {};

    if (!values?.title?.trim()) nextErrors.title = "Title is required";
    if (!values?.slug?.trim()) nextErrors.slug = "Slug is required";
    if (!values?.content?.trim() || values?.content === "<p><br></p>") {
      nextErrors.content = "Content is required";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit(values);
  };

  const handleSlugChange = (val: string) => {
    // Basic auto-formatting for slug
    const formatted = val
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
      
    setValues((v) => ({ ...v, slug: formatted }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          label="Page Title"
          required
          value={values?.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e?.target?.value }))}
          placeholder="e.g. Terms and Conditions"
          error={errors?.title}
        />

        <FormInput
          label="URL Slug"
          required
          disabled
          value={values?.slug}
          onChange={(e) => handleSlugChange(e?.target?.value)}
          placeholder="e.g. terms-and-conditions"
          error={errors?.slug}
        />
      </div>

      <div className="space-y-2">
        <Label className={errors?.content ? "text-red-500" : ""}>
          Page Content <span className="text-red-500">*</span>
        </Label>
        <RichTextEditor
          value={values?.content}
          onChange={(val) => {
            setValues((v) => ({ ...v, content: val }));
            if (errors?.content) setErrors((e) => ({ ...e, content: undefined }));
          }}
          placeholder="Write the HTML content here..."
        />
        {errors?.content && (
          <p className="text-sm text-red-500 mt-1">{errors?.content}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
