"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import CouponForm from "../../_components/CouponForm";
import { useCoupon, useUpdateCoupon } from "@/services/coupon/coupon.hooks";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";

export default function EditCouponPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: coupon, isLoading, isError, refetch } = useCoupon(id);
  const updateMutation = useUpdateCoupon();

  const handleSubmit = async (values: any) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          ...values,
        },
      });
      toast.success("Coupon updated successfully");
      router.push(ROUTES.COUPONS.LIST);
    } catch (error) {
      toast.error("Failed to update coupon");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit Coupon"
        description="Update coupon code or discount details"
        showBack={true}
        backRoute={ROUTES.COUPONS.LIST}
      />

      <Card className="p-6">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError || !coupon ? (
          <CommonError
            message="Failed to load coupon details. Please try again."
            onRetry={refetch}
          />
        ) : (
          <CouponForm
            initialValues={{
              title: coupon?.title || "",
              code: coupon?.code || "",
              type: coupon?.type,
              limitPerUser: coupon?.limitPerUser || 1,
              discountType: coupon?.discountType,
              discountAmount: coupon?.discountAmount || 0,
              minPurchase: coupon?.minPurchase || 0,
              maxDiscount: coupon?.maxDiscount || 0,
              startDate: coupon?.startDate
                ? new Date(coupon?.startDate)?.toISOString()?.split("T")?.[0]
                : "",
              expiryDate: coupon?.expiryDate
                ? new Date(coupon?.expiryDate)?.toISOString()?.split("T")?.[0]
                : "",
              isActive: coupon?.isActive ?? true,
            }}
            isSubmitting={updateMutation.isPending}
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
