import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ProductFormValues,
  CreateProductPayload,
  UpdateProductPayload,
  ProductTag,
} from "@/types/product/product.types";
import { useSuperCategories } from "@/services/superCategory/superCategory.hooks";
import { toast } from "sonner";
import { defaultForm } from "./productForm.state";
import { productApi } from "@/services/product/product.api";
import {
  TAX_CATEGORY,
  TAX_TYPE,
  DISCOUNT_TYPE,
} from "@/services/appConfig/appConfig.service";

import {
  UseProductFormProps,
  UseProductFormReturn,
} from "./useProductForm.types";

import {
  PRODUCT_FORM_VALIDATION_HINTS,
  SELLING_UNIT,
  STOCK_STATUS,
} from "@/constants/product.constants";
import {
  normalizeTranslation,
  isTranslationComplete,
} from "@/utils/translation.utils";

export function useProductForm({
  initialValues,
  isEdit,
  totalSteps,
  onSubmit,
  productId,
}: UseProductFormProps): UseProductFormReturn {
  const [values, setValues] = useState<ProductFormValues>(() => {
    const defaults = defaultForm();
    return {
      ...defaults,
      ...initialValues,
      name: initialValues?.name
        ? normalizeTranslation(initialValues.name)
        : defaults.name,
      description: initialValues?.description
        ? normalizeTranslation(initialValues.description)
        : defaults.description,
      images: initialValues?.images || [],
      newFiles: [],
    };
  });

  const [step, setStep] = useState(0);
  const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
    if (values.newFiles.length > 0) {
      const urls = values.newFiles?.map((file) => URL.createObjectURL(file));
      setNewFilePreviews(urls);
      return () => urls.forEach((u) => URL.revokeObjectURL(u));
    }
    setNewFilePreviews([]);
    return undefined;
  }, [values.newFiles]);

  const imagePreviews = useMemo(
    () => [...values.images, ...newFilePreviews],
    [values.images, newFilePreviews],
  );

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
    const rawFiles = Array.from(e.target.files || []);

    // Filter by allowed MIME types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const selectedFiles = rawFiles.filter((file) =>
      allowedTypes.includes(file.type),
    );

    if (rawFiles.length > selectedFiles.length) {
      toast.error(
        "Some files were skipped. Only JPEG, PNG, and WebP are allowed.",
      );
    }

    if (selectedFiles?.length > 0) {
      const totalCount =
        values.images?.length + values.newFiles?.length + selectedFiles?.length;
      if (totalCount > 10) {
        toast.error("Maximum 10 images allowed per product.");
        return;
      }
      setValues((prev) => ({
        ...prev,
        newFiles: [...prev.newFiles, ...selectedFiles],
      }));
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setValues((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const removeNewFile = (index: number) => {
    setValues((prev) => ({
      ...prev,
      newFiles: prev.newFiles?.filter((_, i) => i !== index),
    }));
  };

  const processPendingUploads = async (): Promise<string[]> => {
    if (!values.newFiles?.length) return [];

    try {
      const fileInfos = values.newFiles.map((f) => ({
        originalName: f.name,
        contentType: f.type,
        size: f.size,
      }));

      const { sessionId, files: s3Files } =
        await productApi.getUploadUrls(fileInfos);

      const uploadTasks = s3Files?.map((s3File, index) => ({
        url: s3File.uploadUrl,
        file: values.newFiles[index],
        key: s3File.key,
      }));

      const keys: string[] = [];
      const uploadWithRetry = async (url: string, file: File, retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            await productApi.uploadToS3(url, file);
            return;
          } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
          }
        }
      };

      const queue = [...uploadTasks];
      const workers = Array(Math.min(3, queue.length))
        .fill(null)
        .map(async () => {
          while (queue.length > 0) {
            const task = queue.shift();
            if (task) {
              await uploadWithRetry(task.url, task.file);
              keys.push(task.key);
            }
          }
        });

      await Promise.all(workers);

      // Confirm and get permanent URLs
      const { images: finalUrls } = await productApi.confirmUploads(
        sessionId,
        keys,
      );

      return finalUrls;
    } catch (error: any) {
      throw error;
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
    const slugOk =
      values?.slug?.trim()?.length > 0 &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values?.slug?.trim());
    const namesOk = isTranslationComplete(values?.name);
    const descsOk = isTranslationComplete(values?.description);
    const imageOk = values.images?.length > 0 || values.newFiles?.length > 0;
    return skuOk && slugOk && namesOk && descsOk && imageOk;
  }, [
    values.sku,
    values.slug,
    values.name,
    values.description,
    values.images,
    values.newFiles,
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
    const isDynamicTax =
      (values.taxCategory === TAX_CATEGORY.REDUCED ||
        values.taxCategory === TAX_CATEGORY.STANDARD) &&
      values.taxType === TAX_TYPE.PERCENTAGE;

    const isTaxOk = () => {
      if (!values.isTaxable) return true;
      if (isDynamicTax) return true;
      const tv = Number(values.taxValue);
      if (values.taxType === TAX_TYPE.PERCENTAGE) return tv >= 0 && tv <= 100;
      if (values.taxType === TAX_TYPE.FIXED) return tv >= 0;
      return false;
    };

    const taxOk = isTaxOk();
    const isDiscountValueOk = () => {
      if (!values.timeDiscount.isEnabled) return true;
      const dv = Number(values.timeDiscount.discountValue);
      if (values.timeDiscount.discountType === DISCOUNT_TYPE.PERCENTAGE) {
        return dv >= 1 && dv <= 100;
      }
      if (values.timeDiscount.discountType === DISCOUNT_TYPE.FIXED) {
        return dv > 0;
      }
      return false;
    };
    const discountOk =
      !values.timeDiscount.isEnabled ||
      (isDiscountValueOk() &&
        Boolean(values.timeDiscount.startTime) &&
        Boolean(values.timeDiscount.endTime));
    return pricingOk && catalogOk && taxOk && discountOk;
  }, [
    values.basePrices,
    values.categoryId,
    values.subcategoryId,
    values.manufacturerId,
    hasSubcategories,
    values.isTaxable,
    values.taxCategory,
    values.taxValue,
    values.taxType,
    values.timeDiscount,
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
      (values.sellingUnit === SELLING_UNIT.CASE
        ? Boolean(values.caseType)
        : true) &&
      values.stockQuantity !== "" &&
      !Number.isNaN(Number(values.stockQuantity)) &&
      (values.stockStatus === STOCK_STATUS.OUT_OF_STOCK
        ? Number(values.stockQuantity) === 0
        : Number(values.stockQuantity) >= 1) &&
      Boolean(values.sellingUnit) &&
      Boolean(values.stockStatus),
    [
      values.unit,
      values.productType,
      values.netWeightKg,
      values.caseQuantity,
      values.caseType,
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

  // ── Validation Errors Detail Helper ──
  const getStepValidationErrors = useCallback(
    (stepIndex: number): string[] => {
      const errors: string[] = [];

      if (stepIndex === 0) {
        if (!values?.sku?.trim()) errors.push("SKU/Item Code is required");
        if (!values?.slug?.trim()) {
          errors.push("Slug is required");
        } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values?.slug?.trim())) {
          errors.push(
            "Slug format is invalid (must be lowercase alphanumeric with hyphens)",
          );
        }
        if (!isTranslationComplete(values?.name))
          errors.push("Product name translations are incomplete");
        if (!isTranslationComplete(values?.description))
          errors.push("Product description translations are incomplete");
        const hasImages =
          values?.images?.length > 0 || values?.newFiles?.length > 0;
        if (!hasImages) errors.push("At least one product image is required");
      }

      if (stepIndex === 1) {
        const hasPrices =
          values?.basePrices?.length > 0 &&
          values?.basePrices?.every((b) => Number(b?.price) > 0);
        if (!hasPrices)
          errors.push(
            "Pricing configuration: every selected segment must have a price > 0",
          );
        if (!values?.categoryId) errors.push("Category selection is required");
        const effectiveSub =
          hasSubcategories === false
            ? values?.categoryId
            : values?.subcategoryId;
        if (hasSubcategories !== false && !effectiveSub)
          errors.push("Subcategory selection is required");
        if (!values?.manufacturerId)
          errors.push("Manufacturer/Brand is required");

        if (values?.isTaxable) {
          const isDynamicTax =
            (values?.taxCategory === TAX_CATEGORY.REDUCED ||
              values?.taxCategory === TAX_CATEGORY.STANDARD) &&
            values?.taxType === TAX_TYPE.PERCENTAGE;
          if (!isDynamicTax) {
            const tv = Number(values?.taxValue);
            if (Number.isNaN(tv) || tv < 0) {
              errors.push("Tax value must be a positive number");
            } else if (values?.taxType === TAX_TYPE.PERCENTAGE && tv > 100) {
              errors.push("Tax percentage cannot exceed 100%");
            }
          }
        }

        if (values?.timeDiscount?.isEnabled) {
          const dv = Number(values?.timeDiscount?.discountValue);
          if (Number.isNaN(dv) || dv <= 0) {
            errors.push("Discount value must be greater than 0");
          } else if (
            values?.timeDiscount?.discountType === DISCOUNT_TYPE.PERCENTAGE &&
            dv > 100
          ) {
            errors.push("Discount percentage cannot exceed 100%");
          }
          if (!values?.timeDiscount?.startTime)
            errors.push("Discount start time is required");
          if (!values?.timeDiscount?.endTime)
            errors.push("Discount end time is required");
        }
      }

      if (stepIndex === 2) {
        if (!values?.unit) errors.push("Measurement Unit is required");
        if (!values?.productType)
          errors.push("Product Storage Type (Dry/Frozen) is required");
        if (
          values?.netWeightKg === "" ||
          Number.isNaN(Number(values?.netWeightKg)) ||
          Number(values?.netWeightKg) < 0
        ) {
          errors.push("Valid Net Weight (KG) is required");
        }
        if (
          values?.caseQuantity === "" ||
          Number.isNaN(Number(values?.caseQuantity)) ||
          Number(values?.caseQuantity) < 1
        ) {
          errors.push("Case Quantity must be at least 1");
        }
        if (values?.sellingUnit === SELLING_UNIT.CASE && !values?.caseType) {
          errors.push("Case Type is required when Selling Unit is set to Case");
        }
        if (
          values?.stockQuantity === "" ||
          Number.isNaN(Number(values?.stockQuantity))
        ) {
          errors.push("Inventory Quantity is required");
        } else {
          const sq = Number(values?.stockQuantity);
          if (values?.stockStatus === STOCK_STATUS.OUT_OF_STOCK && sq !== 0) {
            errors.push(
              "Inventory Quantity must be 0 if Stock Status is Out of stock",
            );
          } else if (values?.stockStatus === STOCK_STATUS.IN_STOCK && sq < 1) {
            errors.push(
              "Inventory Quantity must be at least 1 if Stock Status is In stock",
            );
          }
        }
        if (!values?.sellingUnit) errors.push("Selling Unit is required");
        if (!values?.stockStatus) errors.push("Stock Status is required");
      }

      return errors;
    },
    [values, hasSubcategories],
  );

  const goNext = () => {
    const stepErrors = getStepValidationErrors(step);
    if (stepErrors.length > 0) {
      stepErrors.forEach((err) => toast.error(err));
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all steps for detailed validation errors
    const allErrors = [0, 1, 2].flatMap((idx) => getStepValidationErrors(idx));
    if (allErrors.length > 0) {
      allErrors.forEach((err) => toast.error(err));
      return;
    }

    let finalImages = [...values.images];

    if (values.newFiles?.length > 0) {
      setIsUploading(true);
      toast.loading("Uploading images...", { id: "upload-toast" });
      try {
        const newlyUploadedUrls = await processPendingUploads();
        finalImages = [...finalImages, ...newlyUploadedUrls];
        setValues((p) => ({
          ...p,
          images: finalImages,
          newFiles: [],
        }));
        toast.success("Images uploaded successfully.", { id: "upload-toast" });
      } catch (error: any) {
        setIsUploading(false);
        toast.error(error?.message || "Failed to upload images.", {
          id: "upload-toast",
        });
        return; // Halt submission
      }
    }

    const basePrices = values.basePrices
      ?.filter((b) => Number(b?.price) > 0)
      ?.map((b) => ({ ...b, price: Number(b?.price) }));

    const isUnit = values.sellingUnit === SELLING_UNIT.UNIT;

    const base: Record<string, unknown> = {
      sku: values.sku.trim(),
      slug: values.slug.trim(),
      name: values.name,
      description: values.description,
      category: values.categoryId,
      subcategory: effectiveSubcategoryId,
      manufacturer: values.manufacturerId,
      basePrices,
      unit: values.unit,
      netWeightKg: Number(values.netWeightKg),
      caseQuantity: isUnit ? 1 : Number(values.caseQuantity),
      caseType: isUnit ? null : values.caseType || undefined,
      productType: values.productType,
      tags: values.tags,
      stockQuantity: Number(values.stockQuantity),
      sellingUnit: values.sellingUnit,
      stockStatus: values.stockStatus,
      isActive: values.isActive,
      isGiftItem: values.isGiftItem,
      badges: values.badges,
      relatedProducts: values.relatedProducts,
      restrictions: values.restrictions,
      isTaxable: values.isTaxable,
      taxConfig: values.isTaxable
        ? {
            category: (values.taxCategory as TAX_CATEGORY) || undefined,
            taxType: values.taxType as TAX_TYPE,
            taxValue: Number(values.taxValue),
          }
        : undefined,
      timeDiscount: {
        isEnabled: values.timeDiscount.isEnabled,
        startTime: values.timeDiscount.startTime as string,
        endTime: values.timeDiscount.endTime as string,
        discountType: values.timeDiscount.discountType,
        discountValue: Number(values.timeDiscount.discountValue),
      },
    };

    if (isEdit) {
      const updatePayload = {
        ...base,
        images: finalImages,
      } as UpdateProductPayload;
      await onSubmit(updatePayload);
    } else {
      await onSubmit({
        ...base,
        images: finalImages,
      } as CreateProductPayload);
    }

    setIsUploading(false);
  };

  return {
    values,
    isUploading,
    setValues,
    step,
    complete,
    stepValid,
    isFormValid,
    supers,
    hasSubcategories,
    setHasSubcategories,
    imagePreviews,
    toggleSuperCategory,
    setSuperPrice,
    toggleTag,
    handleImage,
    removeImage,
    removeNewFile,
    goNext,
    goBack,
    handleSubmit,
    productId,
  };
}
