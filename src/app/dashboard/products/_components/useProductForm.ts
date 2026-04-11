import { useState, useCallback, useEffect, useMemo } from "react";
import { LANG_CODES } from "@/components/common/TranslationInput";
import {
  ProductFormValues,
  CreateProductPayload,
  UpdateProductPayload,
  ProductTag,
} from "@/types/product/product.types";
import { useSuperCategories } from "@/services/superCategory/superCategory.hooks";
import { toast } from "sonner";
import { defaultForm } from "./productForm.state";

import {
  UseProductFormProps,
  UseProductFormReturn,
} from "./types/useProductForm.types";

import { PRODUCT_FORM_VALIDATION_HINTS } from "@/constants/product.constants";
import {
  normalizeTranslation,
  isTranslationComplete,
} from "@/utils/translation.utils";

export function useProductForm({
  initialValues,
  isEdit,
  totalSteps,
  onSubmit,
}: UseProductFormProps): UseProductFormReturn {
  const [values, setValues] = useState<ProductFormValues>(() => ({
    ...defaultForm(),
    ...initialValues,
    name: normalizeTranslation(initialValues?.name),
    description: normalizeTranslation(initialValues?.description),
  }));

  const [step, setStep] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ── Data Fetching ──
  const { data: superData } = useSuperCategories();
  const supers = superData ?? [];

  const [hasSubcategories, setHasSubcategories] = useState<boolean | null>(
    null,
  );

  // ── Effects ──
  useEffect(() => {
    // If the category loses subcategories, drop subcategoryId
    if (hasSubcategories === false) {
      setValues((p) => {
        if (p?.subcategoryId) return { ...p, subcategoryId: "" };
        return p;
      });
    }
  }, [hasSubcategories]);

  useEffect(() => {
    // SubcategoryId clear on Category change is natively handled in the UI OnChange,
    // but if you want strict clearance, you can do it here too:
    if (!values.categoryId) {
      setValues((p) => {
        if (p?.subcategoryId || hasSubcategories !== null) {
          setHasSubcategories(null);
          return { ...p, subcategoryId: "" };
        }
        return p;
      });
    }
  }, [values.categoryId]);

  useEffect(() => {
    if (!initialValues) return;
    setValues((prev) => ({
      ...prev,
      ...initialValues,
      name: normalizeTranslation(initialValues?.name),
      description: normalizeTranslation(initialValues?.description),
      basePrices: initialValues?.basePrices?.length
        ? initialValues?.basePrices?.map((b) => ({ ...b }))
        : prev?.basePrices,
    }));
  }, [initialValues]);

  useEffect(() => {
    if (values.image) {
      const u = URL.createObjectURL(values?.image);
      setPreviewUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setPreviewUrl(null);
    return undefined;
  }, [values.image]);

  const imagePreview = previewUrl ?? values?.existingImage ?? null;

  // ── Handlers ──
  const toggleSuperCategory = useCallback(
    (superCategoryId: string, checked: boolean) => {
      setValues((prev) => {
        if (checked) {
          if (
            prev?.basePrices?.some(
              (b) => b?.superCategoryId === superCategoryId,
            )
          )
            return prev;
          return {
            ...prev,
            basePrices: [...prev?.basePrices, { superCategoryId, price: "" }],
          };
        }
        return {
          ...prev,
          basePrices: prev.basePrices?.filter(
            (b) => b?.superCategoryId !== superCategoryId,
          ),
        };
      });
    },
    [],
  );

  const setSuperPrice = useCallback(
    (superCategoryId: string, price: string) => {
      setValues((prev) => ({
        ...prev,
        basePrices: prev?.basePrices?.map((r) =>
          r?.superCategoryId === superCategoryId ? { ...r, price } : r,
        ),
      }));
    },
    [],
  );

  const toggleTag = useCallback((tag: ProductTag, checked: boolean) => {
    setValues((prev) => ({
      ...prev,
      tags: checked
        ? [...new Set([...prev.tags, tag])]
        : prev.tags?.filter((t) => t !== tag),
    }));
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValues((prev) => ({ ...prev, image: file }));
      e.target.value = "";
    }
  };

  const effectiveSubcategoryId = useMemo(() => {
    if (!values.categoryId) return "";
    if (hasSubcategories === false) return values?.categoryId;
    return values?.subcategoryId;
  }, [values.categoryId, values.subcategoryId, hasSubcategories]);

  // ── Validation ──
  const step0Valid = useMemo(() => {
    const skuOk = values?.sku?.trim()?.length > 0;
    const namesOk = isTranslationComplete(values?.name);
    const descsOk = isTranslationComplete(values?.description);
    const imageOk = Boolean(values?.image) || Boolean(values?.existingImage);
    return skuOk && namesOk && descsOk && imageOk;
  }, [
    values.sku,
    values.name,
    values.description,
    values.image,
    values.existingImage,
  ]);

  const step1Valid = useMemo(() => {
    const pricingOk =
      values.basePrices?.length > 0 &&
      values.basePrices?.every((b) => Number(b?.price) > 0);
    const effectiveSub =
      hasSubcategories === false ? values?.categoryId : values?.subcategoryId;
    const catalogOk =
      Boolean(values?.categoryId) &&
      Boolean(effectiveSub) &&
      Boolean(values?.manufacturerId);
    return pricingOk && catalogOk;
  }, [
    values.basePrices,
    values.categoryId,
    values.subcategoryId,
    values.manufacturerId,
    hasSubcategories,
  ]);

  const step2Valid = useMemo(
    () =>
      Boolean(values.unit) &&
      Boolean(values.productType) &&
      values.netWeightKg !== "" &&
      !Number.isNaN(Number(values.netWeightKg)) &&
      Number(values.netWeightKg) >= 0 &&
      values.caseQuantity !== "" &&
      !Number.isNaN(Number(values.caseQuantity)) &&
      Number(values.caseQuantity) >= 1 &&
      values.stockQuantity !== "" &&
      !Number.isNaN(Number(values.stockQuantity)) &&
      Number(values.stockQuantity) >= 0 &&
      Boolean(values.sellingUnit) &&
      Boolean(values.stockStatus),
    [
      values.unit,
      values.productType,
      values.netWeightKg,
      values.caseQuantity,
      values.stockQuantity,
      values.sellingUnit,
      values.stockStatus,
    ],
  );

  const stepValid = [step0Valid, step1Valid, step2Valid];
  const complete = stepValid.map((v, i) =>
    i < step ? true : i === step ? v : false,
  );

  const isFormValid = step0Valid && step1Valid && step2Valid;

  const goNext = () => {
    if (!stepValid[step]) {
      toast.error(
        PRODUCT_FORM_VALIDATION_HINTS[step] ?? "Complete all required fields.",
      );
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[DEBUG] ProductForm handleSubmit triggered");
    if (!isFormValid) {
      toast.error("Complete all required fields in every step.");
      return;
    }

    const basePrices = values.basePrices
      ?.filter((b) => Number(b?.price) > 0)
      ?.map((b) => ({ ...b, price: Number(b?.price) }));

    const base: Record<string, unknown> = {
      sku: values.sku.trim(),
      name: values.name,
      description: values.description,
      category: values.categoryId,
      subcategory: effectiveSubcategoryId,
      manufacturer: values.manufacturerId,
      basePrices,
      unit: values.unit,
      netWeightKg: Number(values.netWeightKg),
      caseQuantity: Number(values.caseQuantity),
      productType: values.productType,
      tags: values.tags,
      stockQuantity: Number(values.stockQuantity),
      sellingUnit: values.sellingUnit,
      stockStatus: values.stockStatus,
      isActive: values.isActive,
      badges: values.badges,
      restrictions: values.restrictions,
    };

    if (isEdit) {
      const updatePayload = { ...base } as UpdateProductPayload;
      if (values.image) updatePayload.image = values?.image;
      await onSubmit(updatePayload);
    } else {
      await onSubmit({ ...base, image: values.image! } as CreateProductPayload);
    }
  };

  return {
    values,
    setValues,
    step,
    complete,
    stepValid,
    isFormValid,
    supers,
    hasSubcategories,
    setHasSubcategories,
    imagePreview,
    toggleSuperCategory,
    setSuperPrice,
    toggleTag,
    handleImage,
    goNext,
    goBack,
    handleSubmit,
  };
}
