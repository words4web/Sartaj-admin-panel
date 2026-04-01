"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { useCreateCustomer } from "@/services/customer/customer.mutations";
import { useSuperCategories } from "@/services/superCategory/superCategory.hooks";
import CustomerForm from "../_components/CustomerForm";
import { CustomerFormValues } from "@/types/customer/customer.types";
import { CommonLoader } from "@/components/ui/common-loader";
import { ROUTES } from "@/constants/routes";
import { defaultAddress } from "@/schemas/customer/customer.default";

export default function CustomerCreatePage() {
  const router = useRouter();
  const { data: superCategoriesData, isLoading: isSuperLoading } =
    useSuperCategories();
  const superCategories = superCategoriesData ?? [];

  const createMutation = useCreateCustomer();

  const [superCategory, setSuperCategory] = useState<string>("");

  useEffect(() => {
    if (!superCategory && superCategories.length > 0) {
      setSuperCategory(superCategories[0]._id);
    }
  }, [superCategory, superCategories]);

  const initialValues: CustomerFormValues = useMemo(
    () => ({
      fullName: "",
      email: "",
      mobileNumber: "",
      superCategory,
      addresses: [defaultAddress],
    }),
    [superCategory],
  );

  const handleSubmit = (values: CustomerFormValues) => {
    createMutation.mutate(
      {
        fullName: values.fullName,
        email: values.email,
        mobileNumber: values.mobileNumber,
        superCategory: values.superCategory,
        addresses: values.addresses,
      },
      {
        onSuccess: () => router.push(ROUTES.CUSTOMERS.LIST),
      },
    );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Create Customer"
        description="Create a customer for your business"
        backRoute={ROUTES.CUSTOMERS.LIST}
      />

      <Card className="p-6">
        {isSuperLoading ? (
          <CommonLoader fullScreen={false} />
        ) : (
          <CustomerForm
            superCategories={superCategories}
            initialValues={initialValues}
            isSubmitting={createMutation.isPending}
            submitLabel="Create Customer"
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
