"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { extractId } from "@/utils/common.utils";
import { ROUTES } from "@/constants/routes";
import { useSuperCategories } from "@/services/superCategory/superCategory.hooks";
import {
  usePriceList,
  useUpdatePriceList,
} from "@/services/priceList/priceList.hooks";
import PriceListForm from "../../_components/PriceListForm";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import {
  PriceList,
  PriceListFormValues,
  PriceListItemRow,
} from "@/types/priceList/priceList.types";

function toFormValues(list: PriceList): PriceListFormValues {
  const superCategoryId = extractId(list.superCategory);

  const items: PriceListItemRow[] = (list.items ?? []).map((it: any) => {
    if ("productId" in it && it?.productId) {
      return {
        productId: String(it?.productId),
        sku: it?.sku ?? "",
        name: it?.name?.en ?? (typeof it?.name === "string" ? it?.name : null),
        price: Number(it?.price) || 0,
      };
    }
    return {
      productId: String(it?.product),
      sku: "",
      name: null,
      price: Number(it?.price) || 0,
    };
  });

  return {
    name: list?.name ?? "",
    superCategoryId,
    items,
  };
}

export default function EditPriceListPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: superCategoriesData, isLoading: scLoading } =
    useSuperCategories();
  const superCategories = superCategoriesData ?? [];
  const { data: list, isLoading, isError, refetch } = usePriceList(id);
  const updateMutation = useUpdatePriceList();

  const initialValues = useMemo(
    () => (list ? toFormValues(list) : null),
    [list],
  );

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit price list"
        description="Update name, segment, or product prices"
        backRoute={ROUTES.PRICE_LISTS.LIST}
      />

      <Card className="p-6">
        {isLoading || scLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError || !list || !initialValues ? (
          <CommonError
            message="Could not load this price list."
            onRetry={refetch}
          />
        ) : (
          <PriceListForm
            superCategories={superCategories}
            initialValues={initialValues}
            isSubmitting={updateMutation.isPending}
            submitLabel="Save changes"
            onSubmit={(payload) =>
              updateMutation.mutate(
                { id, data: payload },
                {
                  onSuccess: () => router.push(ROUTES.PRICE_LISTS.LIST),
                },
              )
            }
          />
        )}
      </Card>
    </div>
  );
}
