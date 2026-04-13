"use client";

import { ProductFormPricingCatalogTabProps } from "./ProductFormPricingCatalogTab.types";
import { ProductFormPricingSection } from "./ProductFormPricingSection";
import { ProductFormCatalogSection } from "./ProductFormCatalogSection";
import { ProductFormTaxSection } from "./ProductFormTaxSection";

export function ProductFormPricingCatalogTab({
  supers,
  values,
  setValues,
  hasSubcategories,
  setHasSubcategories,
  toggleSuperCategory,
  setSuperPrice,
}: ProductFormPricingCatalogTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 px-6">
      {/* ── LEFT: Pricing / Business segments ── */}
      <ProductFormPricingSection
        supers={supers}
        values={values}
        toggleSuperCategory={toggleSuperCategory}
        setSuperPrice={setSuperPrice}
      />

      {/* ── RIGHT: Catalog (category / subcategory / manufacturer) ── */}
      <ProductFormCatalogSection
        values={values}
        setValues={setValues}
        hasSubcategories={hasSubcategories}
        setHasSubcategories={setHasSubcategories}
      />

      {/* ── BOTTOM LEFT: Tax Configuration ── */}
      <ProductFormTaxSection values={values} setValues={setValues} />
    </div>
  );
}
