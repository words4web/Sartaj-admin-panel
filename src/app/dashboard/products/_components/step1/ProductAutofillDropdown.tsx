"use client";

import { useSearchParams } from "next/navigation";
import { SetProductFormValues } from "./ProductFormBasicTab.types";
import rakhiProducts from "@/data/rakhi-products.json";

interface ProductAutofillDropdownProps {
  setValues: SetProductFormValues;
}

export function ProductAutofillDropdown({
  setValues,
}: ProductAutofillDropdownProps) {
  const searchParams = useSearchParams();
  const isDevMode = searchParams.get("dev") === "true";

  if (!isDevMode) return null;

  const handleSelectProduct = (sku: string) => {
    if (!sku) return;
    const selected = rakhiProducts?.find((p) => p?.sku === sku);
    if (!selected) return;

    const isConfirm = window.confirm(
      `Autofill form with "${selected?.name?.en}"? This will overwrite the current name, SKU, slug, description, and keywords.`,
    );
    if (!isConfirm) return;

    setValues((prev) => ({
      ...prev,
      sku: selected.sku,
      slug: selected.slug,
      name: {
        en: selected.name.en,
        ja: selected.name.ja || "",
        hi: selected.name.hi || "",
        ne: selected.name.ne || "",
        bn: selected.name.bn || "",
      },
      description: {
        en: selected.description.en,
        ja: selected.description.ja || "",
        hi: selected.description.hi || "",
        ne: selected.description.ne || "",
        bn: selected.description.bn || "",
      },
      keywords: [
        ...new Set([
          ...(selected.keywords.en || []),
          ...(selected.keywords.ja || []),
          ...(selected.keywords.hi || []),
          ...(selected.keywords.ne || []),
          ...(selected.keywords.bn || []),
        ]),
      ],
    }));
  };

  return (
    <select
      onChange={(e) => {
        handleSelectProduct(e.target.value);
        e.target.value = "";
      }}
      defaultValue=""
      className="bg-white border border-dashed border-primary/40 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 cursor-pointer shadow-sm text-primary min-w-[200px]">
      <option value="" disabled>
        Autofill Rakhi Product (Dev)...
      </option>
      {rakhiProducts?.map((p) => (
        <option key={p.sku} value={p.sku}>
          {p?.name?.en} ({p?.sku})
        </option>
      ))}
    </select>
  );
}
