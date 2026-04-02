"use client";

import { useRouter } from "next/navigation";
import { useCreateCoupon } from "@/services/coupon/coupon.hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { CouponFormValues, ECouponType, EDiscountType } from "@/types/coupon/coupon.types";
import CouponForm from "../_components/CouponForm";
import { Card } from "@/components/ui/card";

export default function NewCouponPage() {
  const router = useRouter();
  const createMutation = useCreateCoupon();

  const handleCreate = async (values: CouponFormValues) => {
    await createMutation?.mutateAsync?.(
      {
        ...values,
      },
      {
        onSuccess: () => router?.push?.(ROUTES?.COUPONS?.LIST),
      },
    );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="New Coupon"
        description="Create a new promotional discount or coupon code"
        showBack={true}
        backRoute={ROUTES.COUPONS.LIST}
      />

      <Card className="p-6">
        <CouponForm
          initialValues={{
            title: "",
            code: "",
            type: ECouponType.DEFAULT,
            limitPerUser: 1,
            discountType: EDiscountType.PERCENT,
            discountAmount: 0,
            minPurchase: 0,
            maxDiscount: 0,
            startDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isActive: true,
          }}
          isSubmitting={createMutation.isPending}
          onSubmit={handleCreate}
          submitLabel="Create Coupon"
        />
      </Card>
    </div>
  );
}
