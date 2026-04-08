"use client";

import { ProductFormBasicTab } from "./ProductFormBasicTab";
import { ProductFormPricingCatalogTab } from "./ProductFormPricingCatalogTab";
import { ProductFormPackagingTab } from "./ProductFormPackagingTab";
import { ProductFormStepper } from "./ProductFormStepper";
import { useProductForm } from "./useProductForm";
import { PRODUCT_FORM_STEPS } from "@/constants/product.constants";

import { ProductFormProps } from "./types/ProductForm.types";

export { mapProductToFormValues } from "./productForm.state";

export default function ProductForm({
  initialValues,
  isSubmitting = false,
  submitLabel = "Save",
  isEdit = false,
  onSubmit,
}: ProductFormProps) {
  const form = useProductForm({
    initialValues,
    isEdit,
    totalSteps: PRODUCT_FORM_STEPS.length,
    onSubmit,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      {/* ── Stepper with integrated Navigation ── */}
      <ProductFormStepper
        current={form.step}
        complete={form.complete}
        steps={PRODUCT_FORM_STEPS as any}
        onBack={form.goBack}
        onNext={form.goNext}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
        isFormValid={form.isFormValid}
      />

      {/* ── Step content ── */}
      <div className="px-6 py-6 overflow-x-hidden">
        {form.step === 0 && (
          <ProductFormBasicTab
            values={form.values}
            setValues={form.setValues}
            toggleTag={form.toggleTag}
            imagePreview={form.imagePreview}
            onImageChange={form.handleImage}
          />
        )}
        {form.step === 1 && (
          <ProductFormPricingCatalogTab
            supers={form.supers}
            values={form.values}
            setValues={form.setValues}
            categories={form.categories}
            subcategories={form.subcategories}
            manufacturers={form.manufacturers}
            toggleSuperCategory={form.toggleSuperCategory}
            setSuperPrice={form.setSuperPrice}
          />
        )}
        {form.step === 2 && (
          <ProductFormPackagingTab
            values={form.values}
            setValues={form.setValues}
          />
        )}
      </div>
    </form>
  );
}
