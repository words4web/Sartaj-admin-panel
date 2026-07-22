"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import ProductForm, {
  mapProductToFormValues,
} from "../../_components/ProductForm";
import { useProduct, useUpdateProduct } from "@/services/product/product.hooks";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { UpdateProductPayload } from "@/types/product/product.types";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const updateMutation = useUpdateProduct();

  const initialValues = useMemo(
    () => (product ? mapProductToFormValues(product) : undefined),
    [product],
  );

  const handleSubmit = async (payload: UpdateProductPayload) => {
    await updateMutation.mutateAsync(
      { id, data: payload },
      {
        onSuccess: () => router.push(ROUTES.PRODUCTS.LIST),
      },
    );
  };

  const handleBack = () => {
    setShowDiscardModal(true);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit product"
        description="Update product details"
        showBack
        onBackClick={handleBack}
      />

      <Card className="p-0 border-0 shadow-none overflow-hidden">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError || !product ? (
          <CommonError
            message="Failed to load product."
            onRetry={() => refetch()}
          />
        ) : (
          <ProductForm
            key={product._id}
            isEdit
            initialValues={initialValues}
            productId={id}
            isSubmitting={updateMutation.isPending}
            submitLabel="Update product"
            onSubmit={handleSubmit}
          />
        )}
      </Card>

      <ConfirmModal
        open={showDiscardModal}
        title="Discard Changes"
        description="Are you sure you want to discard your changes? Any unsaved modifications will be lost."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        destructive
        onConfirm={() => {
          setShowDiscardModal(false);
          router.back();
        }}
        onCancel={() => setShowDiscardModal(false)}
      />
    </div>
  );
}
