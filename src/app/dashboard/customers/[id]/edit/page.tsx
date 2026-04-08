"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { extractId } from "@/utils/common.utils";
import { useSuperCategories } from "@/services/superCategory/superCategory.hooks";
import { useCustomer } from "@/services/customer/customer.queries";
import { useUpdateCustomer } from "@/services/customer/customer.mutations";
import CustomerForm from "../../_components/CustomerForm";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { ROUTES } from "@/constants/routes";
import { defaultAddress } from "@/schemas/customer/customer.default";
import { CustomerFormValues } from "@/types/customer/customer.types";

export default function CustomerEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const updateMutation = useUpdateCustomer();
  const [superCategory, setSuperCategory] = useState<string>("");

  const {
    data: customerData,
    isLoading: isCustomerLoading,
    isError: isCustomerError,
    refetch,
  } = useCustomer(id);
  const { data: superCategories, isLoading: isSuperLoading } =
    useSuperCategories();

  useEffect(() => {
    if (!superCategory && customerData?.superCategory) {
      setSuperCategory(extractId(customerData?.superCategory));
    }
  }, [customerData, superCategory]);

  const initialValues: CustomerFormValues = useMemo(() => {
    const priceListId = extractId(customerData?.priceList);
    return {
      fullName: customerData?.fullName ?? "",
      email: customerData?.email ?? "",
      mobileNumber: customerData?.mobileNumber ?? "",
      superCategory: superCategory,
      priceList: priceListId,
      addresses: customerData?.addresses ?? [defaultAddress],
    };
  }, [customerData, superCategory]);

  const handleSubmit = (values: CustomerFormValues) => {
    updateMutation.mutate(
      {
        id,
        data: {
          fullName: values.fullName,
          email: values.email,
          mobileNumber: values.mobileNumber,
          superCategory: values.superCategory,
          addresses: values.addresses,
          priceList: values.priceList?.trim() ? values.priceList : null,
        },
      },
      {
        onSuccess: () => router.push(ROUTES.CUSTOMERS.LIST),
      },
    );
  };

  const ready =
    !isCustomerLoading && !isSuperLoading && !!customerData && !!superCategory;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit Customer"
        description="Update profile and addresses"
        backRoute={ROUTES.CUSTOMERS.DETAIL(id)}
      />

      <Card className="p-6">
        {isCustomerLoading || isSuperLoading ? (
          <div className="space-y-4">
            <CommonLoader fullScreen={false} />
          </div>
        ) : isCustomerError || !customerData || !superCategories ? (
          <CommonError
            message="Failed to load customer details. Please check your connection."
            onRetry={refetch}
          />
        ) : !ready ? (
          <div className="space-y-4">
            <CommonLoader fullScreen={false} />
          </div>
        ) : (
          <CustomerForm
            superCategories={superCategories}
            initialValues={initialValues}
            isSubmitting={updateMutation.isPending}
            submitLabel="Update Customer"
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
