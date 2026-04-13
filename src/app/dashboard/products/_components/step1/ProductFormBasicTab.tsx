"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TranslationInput } from "@/components/common/TranslationInput";
import { ProductFormHint } from "../ProductFormHint";
import { ImageIcon, X, Tag, Layers } from "lucide-react";
import {
  PRODUCT_BADGE_OPTIONS,
  PRODUCT_TAGS,
  PRODUCT_BASIC_INFO_FIELDS,
} from "@/constants/product.constants";
import { ProductFormBasicTabProps } from "./ProductFormBasicTab.types";

import {
  PropertySection,
  PropertyCheckbox,
  FormSectionCard,
} from "../ProductFormDecorators";

export function ProductFormBasicTab({
  values,
  setValues,
  toggleTag,
  imagePreviews,
  handleImage,
  removeImage,
  removeNewFile,
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

          {/* Product images */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Product images <span className="text-destructive">*</span>
            </Label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imagePreviews?.map((url, index) => {
                const isExisting = index < values?.images?.length;
                return (
                  <div
                    key={url}
                    className="relative aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm group">
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-background/90 rounded-full p-1.5 shadow-sm hover:bg-destructive hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      onClick={() =>
                        isExisting
                          ? removeImage(index)
                          : removeNewFile(index - values.images?.length)
                      }
                      aria-label="Remove image">
                      <X className="w-4 h-4" />
                    </button>
                    {!isExisting && (
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-primary/90 text-[10px] text-white rounded font-medium">
                        Pending
                      </div>
                    )}
                  </div>
                );
              })}

              <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
                <ImageIcon className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">
                  Add More
                </span>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
            </div>

            <ProductFormHint>
              A clear representation of the product. Minimum 1 image required.
              Max 10.
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
