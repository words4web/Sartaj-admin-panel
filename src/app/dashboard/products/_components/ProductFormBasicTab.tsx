"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TranslationInput } from "@/components/common/TranslationInput";
import { ProductFormHint } from "./ProductFormHint";
import { ImageIcon, X, Tag, Layers } from "lucide-react";
import {
  PRODUCT_BADGE_OPTIONS,
  PRODUCT_TAGS,
  PRODUCT_BASIC_INFO_FIELDS,
} from "@/constants/product.constants";
import { ProductFormBasicTabProps } from "./types/ProductFormBasicTab.types";

import {
  PropertySection,
  PropertyCheckbox,
  FormSectionCard,
} from "./ProductFormDecorators";

export function ProductFormBasicTab({
  values,
  setValues,
  toggleTag,
  imagePreview,
  onImageChange,
}: ProductFormBasicTabProps) {
  return (
    <div className="space-y-6">
      {/* Name & Description */}
      <TranslationInput
        title="Name & description"
        description="All languages required before proceeding."
        fields={PRODUCT_BASIC_INFO_FIELDS}
        values={{ name: values.name, description: values.description }}
        onChange={(field, lang, value) =>
          setValues((p) => ({
            ...p,
            [field]: { ...p[field as "name" | "description"], [lang]: value },
          }))
        }
      />

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* ── LEFT COLUMN: Text & Media ── */}
        <FormSectionCard title="Identity & Media" icon={Layers}>
          {/* Item code */}
          <div className="space-y-1.5">
            <Label
              htmlFor="product-sku"
              className="text-sm font-medium text-gray-700">
              Item Code (SKU) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="product-sku"
              placeholder="e.g. TEA-ORG-001"
              value={values.sku}
              onChange={(e) =>
                setValues((p) => ({ ...p, sku: e.target.value?.toUpperCase() }))
              }
              className="bg-white shadow-none border-gray-200 h-10 font-mono text-sm max-w-md"
            />
            <ProductFormHint>
              Unique code for invoices. Must not match another active product.
            </ProductFormHint>
          </div>

          {/* Product image */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Product image <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {values.image && (
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-background/90 rounded-full p-1 shadow hover:bg-background transition-colors"
                      onClick={() => setValues((p) => ({ ...p, image: null }))}
                      aria-label="Remove new image">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm h-10">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  {values.image || values.existingImage
                    ? "Change image"
                    : "Upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChange}
                />
              </label>
            </div>
            <ProductFormHint>
              A clear representation of the product.
            </ProductFormHint>
          </div>
        </FormSectionCard>

        {/* ── RIGHT COLUMN: Properties Panel ── */}
        <FormSectionCard title="Product Properties" icon={Tag}>
          <PropertySection label="Classification Rules">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {PRODUCT_TAGS?.map((tag) => (
                <PropertyCheckbox
                  key={tag.key}
                  label={tag.label}
                  checked={values.tags?.includes(tag.key)}
                  onCheckedChange={(c) => toggleTag(tag.key, c)}
                />
              ))}
            </div>
          </PropertySection>

          <PropertySection label="Store Display & Flags">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {PRODUCT_BADGE_OPTIONS?.map(({ key, label }) => (
                <PropertyCheckbox
                  key={key}
                  label={label}
                  checked={values.badges?.includes(key)}
                  onCheckedChange={(isChecked) =>
                    setValues((p) => ({
                      ...p,
                      badges: isChecked
                        ? [...new Set([...(p.badges || []), key])]
                        : p.badges?.filter((b) => b !== key),
                    }))
                  }
                />
              ))}
            </div>
          </PropertySection>

          <PropertySection label="Restrictions">
            <PropertyCheckbox
              key="age20Plus"
              label="Age 20+ restriction"
              checked={Boolean(values.restrictions?.age20Plus)}
              variant="destructive"
              onCheckedChange={(c) =>
                setValues((p) => ({
                  ...p,
                  restrictions: { ...p.restrictions, age20Plus: c },
                }))
              }
            />
          </PropertySection>
        </FormSectionCard>
      </div>
    </div>
  );
}
