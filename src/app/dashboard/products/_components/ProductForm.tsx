"use client";

import { ProductFormBasicTab } from "./step1/ProductFormBasicTab";
import { ProductFormPricingCatalogTab } from "./step2/ProductFormPricingCatalogTab";
import { ProductFormPackagingTab } from "./step3/ProductFormPackagingTab";
import { ProductFormStepper } from "./ProductFormStepper";
import { useProductForm } from "./useProductForm";
import { PRODUCT_FORM_STEPS } from "@/constants/product.constants";

import { ProductFormProps } from "./ProductForm.types";

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
        isSubmitting={isSubmitting || form.isUploading}
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
            imagePreviews={form.imagePreviews}
            handleImage={form.handleImage}
            removeImage={form.removeImage}
            removeNewFile={form.removeNewFile}
          />
        )}
        {form.step === 1 && (
          <ProductFormPricingCatalogTab
            supers={form.supers}
            values={form.values}
            setValues={form.setValues}
            hasSubcategories={form.hasSubcategories}
            setHasSubcategories={form.setHasSubcategories}
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
