"use client";

import { useRouter } from "next/navigation";
import { useCreateCoupon } from "@/services/coupon/coupon.hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import {
  CouponFormValues,
  ECouponVisibility,
  EDiscountType,
} from "@/types/coupon/coupon.types";
import CouponForm from "../_components/CouponForm";
import { Card } from "@/components/ui/card";
import dayjs from "dayjs";

export default function NewCouponPage() {
  const router = useRouter();
  const createMutation = useCreateCoupon();

  const handleCreate = (values: CouponFormValues) => {
    createMutation.mutate(
      {
        ...values,
      },
      {
        onSuccess: () => router.push(ROUTES.COUPONS.LIST),
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
            title: { en: "", hi: "", ne: "", ja: "", bn: "" },
            code: "",
            visibility: ECouponVisibility.PUBLIC,
            superCategory: "",
            discountType: EDiscountType.PERCENT,
            discountValue: 0,
            minPurchase: 0,
            maxDiscount: 0,
            startDate: dayjs().format("YYYY-MM-DD"),
            expiryDate: dayjs().add(30, "day").format("YYYY-MM-DD"),
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
