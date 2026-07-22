"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
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
  productId,
}: ProductFormProps) {
  const form = useProductForm({
    initialValues,
    isEdit,
    totalSteps: PRODUCT_FORM_STEPS.length,
    onSubmit,
    productId,
  });

  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
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
              productId={form.productId}
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

      <ConfirmModal
        open={showSaveModal}
        title={isEdit ? "Confirm Update" : "Confirm Create"}
        description={
          isEdit
            ? "Are you sure you want to update this product?"
            : "Are you sure you want to create this product?"
        }
        confirmLabel={isEdit ? "Update" : "Create"}
        cancelLabel="Cancel"
        isLoading={isSubmitting || form.isUploading}
        onConfirm={async () => {
          setShowSaveModal(false);
          await form.handleSubmit({ preventDefault: () => {} } as any);
        }}
        onCancel={() => setShowSaveModal(false)}
      />
    </>
  );
}
