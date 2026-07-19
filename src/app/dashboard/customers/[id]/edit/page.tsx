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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CustomerEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const updateMutation = useUpdateCustomer();
  const [superCategory, setSuperCategory] = useState<string>("");
  const [isRetailerBlocked, setIsRetailerBlocked] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

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

  // Check if customer superCategory is RETAILER
  useEffect(() => {
    if (superCategories && customerData?.superCategory) {
      const parentId = extractId(customerData?.superCategory);
      const matchedCategory = superCategories?.find(
        (cat: any) => cat?._id === parentId,
      );

      if ((matchedCategory?.name as string) === "Retailer") {
        setIsRetailerBlocked(true);
      }
    }
  }, [customerData, superCategories]);

  useEffect(() => {
    if (isRetailerBlocked) {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRetailerBlocked]);

  useEffect(() => {
    if (isRetailerBlocked && countdown === 0) {
      router.replace(ROUTES.CUSTOMERS.LIST);
    }
  }, [isRetailerBlocked, countdown, router]);

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

  const initialPriceListLabel =
    typeof customerData?.priceList === "object"
      ? customerData?.priceList?.name
      : undefined;

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
        ) : (
          <CustomerForm
            superCategories={superCategories}
            initialValues={initialValues}
            initialPriceListLabel={initialPriceListLabel}
            isSubmitting={updateMutation.isPending}
            submitLabel="Update Customer"
            onSubmit={handleSubmit}
          />
        )}
      </Card>

      <Dialog open={isRetailerBlocked} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-destructive font-semibold">
              Edit Not Allowed
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-700">
              Editing Retailer customer details is not allowed from the admin
              panel.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center text-sm font-medium text-muted-foreground bg-muted/30 rounded-lg">
            Redirecting to customer listings in{" "}
            <span className="font-bold text-destructive text-base px-1">
              {countdown}
            </span>{" "}
            seconds...
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
