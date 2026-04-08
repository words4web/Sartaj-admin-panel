"use client";

import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/services/product/product.hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import ProductForm from "../_components/ProductForm";
import { Card } from "@/components/ui/card";
import {
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types/product/product.types";

export default function NewProductPage() {
  const router = useRouter();
  const createMutation = useCreateProduct();

  const handleCreate = async (
    payload: CreateProductPayload | UpdateProductPayload,
  ) => {
    await createMutation.mutateAsync(payload as CreateProductPayload, {
      onSuccess: () => router.push(ROUTES.PRODUCTS.LIST),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="New product"
        description="Add a product with pricing per super category"
        showBack
        backRoute={ROUTES.PRODUCTS.LIST}
      />

      <Card className="p-0 border-0 shadow-none overflow-hidden">
        <ProductForm
          isSubmitting={createMutation.isPending}
          submitLabel="Create product"
          onSubmit={handleCreate}
        />
      </Card>
    </div>
  );
}
