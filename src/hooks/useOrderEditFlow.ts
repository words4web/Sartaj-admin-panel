"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrder } from "@/services/order/order.queries";
import {
  useValidateOrderEdit,
  useEditOrderItems,
} from "@/services/order/order.mutations";
import { productApi } from "@/services/product/product.api";
import { ROUTES } from "@/constants/routes";
import { LocalItem } from "@/types/order/order.types";

export function useOrderEditFlow() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const router = useRouter();

  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const validateMutation = useValidateOrderEdit();
  const editMutation = useEditOrderItems();

  const [items, setItems] = useState<LocalItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const [validationResult, setValidationResult] = useState<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize page state
  useEffect(() => {
    if (order) {
      // Guard status: only placed or processing can be edited
      if (order?.status !== "placed" && order?.status !== "processing") {
        router.replace(ROUTES.ORDERS.DETAIL(id));
        return;
      }

      const localItems: LocalItem[] = order?.items?.map((item) => {
        const prodId =
          item?.productSnapshot?.productId || item?.product?._id || "";
        const sku = item?.productSnapshot?.sku || item?.product?.sku || "";
        const name =
          item?.productSnapshot?.name || item?.product?.name || "Product";
        return {
          productId: prodId,
          sku,
          name,
          price: item?.price,
          quantity: item?.quantity,
        };
      });
      setItems(localItems);
      setCouponCode(order?.coupon?.code || "");
      setValidationResult(null);
      setValidationError(null);
    }
  }, [order, id, router]);

  // Handle product selection from PaginatedDropdown
  const handleSelectProduct = async (productId: string) => {
    if (!productId) return;

    // Check if product is already added
    if (items?.some((item: LocalItem) => item?.productId === productId)) {
      setItems(
        items?.map((item: LocalItem) =>
          item?.productId === productId
            ? { ...item, quantity: item?.quantity + 1 }
            : item,
        ),
      );
      setValidationResult(null);
      setSelectedProduct("");
      return;
    }

    try {
      const fullProduct = await productApi.getProductById(productId);
      const basePrice = fullProduct?.basePrices?.[0]?.price || 0;
      let price = basePrice;

      if (fullProduct?.timeDiscount?.isEnabled) {
        const val = Number(fullProduct?.timeDiscount?.discountValue);
        if (fullProduct?.timeDiscount?.discountType === "PERCENTAGE") {
          price = basePrice * (1 - val / 100);
        } else if (fullProduct?.timeDiscount?.discountType === "FIXED") {
          price = Math.max(0, basePrice - val);
        }
      }

      setItems([
        ...items,
        {
          productId,
          sku: fullProduct?.sku,
          name: fullProduct?.name?.en || "Product",
          price,
          quantity: 1,
        },
      ]);
      setValidationResult(null);
    } catch (err) {
      console.error("Failed to load product details", err);
    } finally {
      setSelectedProduct("");
    }
  };

  // Adjust item quantity
  const handleQtyChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(
      items?.map((item) =>
        item?.productId === productId ? { ...item, quantity } : item,
      ),
    );
    setValidationResult(null);
  };

  // Delete item from list
  const handleRemoveItem = (productId: string) => {
    if (items?.length <= 1) return;
    setItems(items?.filter((item) => item?.productId !== productId));
    setValidationResult(null);
  };

  const handleValidate = () => {
    setValidationError(null);
    setValidationResult(null);

    const payloadItems = items?.map((it) => ({
      productId: it?.productId,
      quantity: it?.quantity,
    }));

    validateMutation.mutate(
      {
        id,
        data: {
          items: payloadItems,
          couponCode: couponCode?.trim() || null,
        },
      },
      {
        onSuccess: (res) => {
          setValidationResult(res);
          // Sync corrected unit prices returned by the backend
          if (res?.calculation?.orderItems) {
            const updatedItems = items?.map((localItem) => {
              const matchedCalculated = res?.calculation?.orderItems?.find(
                (calcItem: any) =>
                  (calcItem?.product?._id || calcItem?.product) ===
                  localItem?.productId,
              );
              return {
                ...localItem,
                price: matchedCalculated
                  ? matchedCalculated.price
                  : localItem?.price,
              };
            });
            setItems(updatedItems);
          }
        },
        onError: (err: any) => {
          setValidationError(err?.message || "Validation failed");
        },
      },
    );
  };

  // Save changes and navigate back
  const handleSave = () => {
    const payloadItems = items?.map((it) => ({
      productId: it?.productId,
      quantity: it?.quantity,
    }));

    editMutation.mutate(
      {
        id,
        data: {
          items: payloadItems,
          couponCode: couponCode?.trim() || null,
        },
      },
      {
        onSuccess: () => {
          router.push(ROUTES.ORDERS.DETAIL(id));
        },
      },
    );
  };

  return {
    id,
    order,
    isLoading,
    isError,
    refetch,
    items,
    setItems,
    couponCode,
    setCouponCode,
    selectedProduct,
    setSelectedProduct,
    validationResult,
    setValidationResult,
    validationError,
    setValidationError,
    isValidating: validateMutation.isPending,
    isSaving: editMutation.isPending,
    handleSelectProduct,
    handleQtyChange,
    handleRemoveItem,
    handleValidate,
    handleSave,
  };
}
