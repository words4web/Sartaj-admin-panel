"use client";

import { useMemo } from "react";
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

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

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
        onSuccess: () => router.push(ROUTES.PRODUCTS.DETAIL(id)),
      },
    );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit product"
        description="Update product details"
        showBack
        backRoute={ROUTES.PRODUCTS.DETAIL(id)}
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
            isSubmitting={updateMutation.isPending}
            submitLabel="Update product"
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
