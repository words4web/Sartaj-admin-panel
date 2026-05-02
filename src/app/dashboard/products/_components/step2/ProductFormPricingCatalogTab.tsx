"use client";

import { ProductFormPricingCatalogTabProps } from "./ProductFormPricingCatalogTab.types";
import { ProductFormPricingSection } from "./ProductFormPricingSection";
import { ProductFormCatalogSection } from "./ProductFormCatalogSection";
import { ProductFormTaxSection } from "./ProductFormTaxSection";
import { ProductFormDiscountSection } from "./ProductFormDiscountSection";

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
    <div className="grid gap-6 lg:grid-cols-12 px-6">
      <div className="lg:col-span-7 space-y-6">
        <ProductFormPricingSection
          supers={supers}
          values={values}
          toggleSuperCategory={toggleSuperCategory}
          setSuperPrice={setSuperPrice}
        />
      </div>

      <div className="lg:col-span-5 space-y-6">
        <ProductFormCatalogSection
          values={values}
          setValues={setValues}
          hasSubcategories={hasSubcategories}
          setHasSubcategories={setHasSubcategories}
        />
      </div>

      <div className="lg:col-span-7">
        <ProductFormDiscountSection values={values} setValues={setValues} />
      </div>

      <div className="lg:col-span-5">
        <ProductFormTaxSection values={values} setValues={setValues} />
      </div>
    </div>
  );
}
