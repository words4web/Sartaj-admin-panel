"use client";

import { useEffect, useState } from "react";
import { FormInput } from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./RichTextEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ITranslationMap } from "@/types/api.types";
import {
  EMPTY_TRANSLATION,
  LangCode,
  SUPPORTED_LANGUAGES,
} from "@/components/common/TranslationInput";

interface CmsFormValues {
  title: ITranslationMap;
  slug: string;
  content: ITranslationMap;
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
  const [activeTab, setActiveTab] = useState<LangCode>("en");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const normalizeTranslation = (val: any): ITranslationMap => {
    if (typeof val === "string") {
      return { ...EMPTY_TRANSLATION, en: val };
    }
    return val || EMPTY_TRANSLATION;
  };

  useEffect(() => {
    setValues({
      ...initialValues,
      title: normalizeTranslation(initialValues.title),
      content: normalizeTranslation(initialValues.content),
    });
    setErrors({});
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<string, string>> = {};

    if (!values?.title?.en?.trim()) {
      nextErrors.title_en = "English title is required";
    }
    if (!values?.slug?.trim()) {
      nextErrors.slug = "Slug is required";
    }
    if (!values?.content?.en?.trim() || values?.content?.en === "<p><br></p>") {
      nextErrors.content_en = "English content is required";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit(values);
  };

  const handleTranslationChange = (
    field: "title" | "content",
    lang: LangCode,
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] || EMPTY_TRANSLATION),
        [lang]: value,
      },
    }));

    // Clear error for this field/language if it exists
    if (errors[`${field}_${lang}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`${field}_${lang}`];
        return next;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-6">
        <div className="flex flex-col gap-1">
          <Label className="text-base font-semibold text-gray-900">
            General Information
          </Label>
          <p className="text-xs text-gray-500">
            Provide the page slug and other general details.
          </p>
        </div>

        <div className="max-w-md">
          <FormInput
            label="URL Slug"
            required
            disabled
            value={values?.slug}
            onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))}
            placeholder="e.g. terms-and-conditions"
            error={errors?.slug}
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Slug is automatically generated and cannot be edited to maintain
            link consistency.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <Label className="text-base font-semibold text-gray-900">
            Page Localization
          </Label>
          <p className="text-xs text-gray-500">
            Provide the title and HTML content for all supported languages.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as LangCode)}
        >
          <TabsList className="w-full justify-start h-auto flex-wrap bg-gray-100/60 p-1 gap-1 rounded-xl">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TabsTrigger
                key={lang.id}
                value={lang.id}
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary text-xs sm:text-sm"
              >
                {lang.nativeLabel}
              </TabsTrigger>
            ))}
          </TabsList>

          {SUPPORTED_LANGUAGES.map((lang) => (
            <TabsContent
              key={lang.id}
              value={lang.id}
              className="space-y-5 mt-4 pt-4 border-t border-gray-50"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">
                  {lang.id}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {lang.label} Language Content
                </span>
              </div>

              <FormInput
                label={`Page Title (${lang.label})`}
                required={lang.id === "en"}
                value={values?.title?.[lang.id] || ""}
                onChange={(e) =>
                  handleTranslationChange("title", lang.id, e.target.value)
                }
                placeholder={`e.g. Terms and Conditions in ${lang.label}`}
                error={errors[`title_${lang.id}`]}
              />

              <div className="space-y-2">
                <Label
                  className={
                    errors[`content_${lang.id}`]
                      ? "text-red-500 font-medium"
                      : "font-medium"
                  }
                >
                  Page Content ({lang.label}){" "}
                  {lang.id === "en" && <span className="text-red-500">*</span>}
                </Label>
                <RichTextEditor
                  value={values?.content?.[lang.id] || ""}
                  onChange={(val) =>
                    handleTranslationChange("content", lang.id, val)
                  }
                  placeholder={`Write the ${lang.label} HTML content here...`}
                />
                {errors[`content_${lang.id}`] && (
                  <p className="text-sm text-red-500 mt-1 font-medium">
                    {errors[`content_${lang.id}`]}
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-8">
        <Button
          size="lg"
          type="submit"
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? "Saving Updates..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
