"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { useSuperCategories } from "@/services/superCategory/superCategory.hooks";
import { useCreatePriceList } from "@/services/priceList/priceList.hooks";
import PriceListForm from "../_components/PriceListForm";
import { CommonLoader } from "@/components/ui/common-loader";
import { PriceListFormValues } from "@/types/priceList/priceList.types";
import { SUPER_CATEGORIES } from "@/lib/constants";

export default function NewPriceListPage() {
  const router = useRouter();
  const { data: superCategoriesData, isLoading } = useSuperCategories();
  const superCategories = superCategoriesData ?? [];
  const createMutation = useCreatePriceList();
  const [superCategoryId, setSuperCategoryId] = useState("");

  useEffect(() => {
    if (!superCategoryId && superCategories?.length > 0) {
      const first = superCategories?.find(
        (sc) => String(sc?.name) !== SUPER_CATEGORIES.RETAILER,
      );
      if (first) setSuperCategoryId(first?._id);
    }
  }, [superCategoryId, superCategories]);

  const initialValues: PriceListFormValues = useMemo(
    () => ({
      name: "",
      superCategoryId,
      items: [],
    }),
    [superCategoryId],
  );

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="New price list"
        description="Override unit prices for specific products in a segment"
        backRoute={ROUTES.PRICE_LISTS.LIST}
      />

      <Card className="p-6">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : (
          <PriceListForm
            superCategories={superCategories}
            initialValues={initialValues}
            isSubmitting={createMutation.isPending}
            submitLabel="Create price list"
            onSubmit={(payload) =>
              createMutation.mutate(payload, {
                onSuccess: () => router.push(ROUTES.PRICE_LISTS.LIST),
              })
            }
          />
        )}
      </Card>
    </div>
  );
}
