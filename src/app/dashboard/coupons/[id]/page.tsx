"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { useCoupon } from "@/services/coupon/coupon.hooks";
import { useSuperCategories } from "@/services/superCategory/superCategory.hooks";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { formatYen } from "@/utils/common.utils";
import { EDiscountType } from "@/types/coupon/coupon.types";
import { Ticket, Calendar, Calculator, Settings, Layers } from "lucide-react";
import dayjs from "dayjs";

export default function CouponDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: coupon, isLoading, isError, refetch } = useCoupon(id);
  const { data: superCategories = [] } = useSuperCategories();

  const superCategoryName = useMemo(() => {
    const targetId =
      typeof coupon?.superCategory === "object"
        ? (coupon.superCategory as any)?._id
        : coupon?.superCategory;

    const matched = superCategories.find((sc: any) => sc?._id === targetId);
    if (matched?.name) return matched.name;

    if (
      typeof coupon?.superCategory === "object" &&
      (coupon.superCategory as any)?.name
    ) {
      return (coupon.superCategory as any).name;
    }

    return typeof coupon?.superCategory === "string"
      ? coupon.superCategory
      : "General";
  }, [coupon, superCategories]);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Coupon Details"
        description="View coupon configuration and visibility settings"
        backRoute={ROUTES?.COUPONS?.LIST}
        editRoute={coupon?._id ? ROUTES?.COUPONS?.EDIT(coupon?._id) : undefined}
      />

      {isLoading ? (
        <Card className="p-6">
          <CommonLoader fullScreen={false} />
        </Card>
      ) : isError || !coupon ? (
        <Card className="p-6">
          <CommonError
            message="Failed to load coupon details. Please check your connection."
            onRetry={refetch}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="lg:col-span-2 p-6 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Ticket size={24} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  {coupon?.code}
                </h2>
                <Badge
                  variant={coupon?.isActive ? "success" : "secondary"}
                  className="ml-2">
                  {coupon?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-gray-500 text-lg">
                {coupon?.title?.en || "—"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  <Calculator size={14} />
                  Discount Rules
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Discount Value</p>
                    <p className="text-xl font-bold text-green-600">
                      {coupon?.discountType === EDiscountType.PERCENT
                        ? `${coupon?.discountValue}% OFF`
                        : `${formatYen(Number(coupon?.discountValue) || 0)} OFF`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Minimum Purchase</p>
                    <p className="font-semibold text-gray-900">
                      {formatYen(Number(coupon?.minPurchase) || 0)}
                    </p>
                  </div>
                  {coupon?.discountType === EDiscountType.PERCENT && (
                    <div>
                      <p className="text-sm text-gray-500">Maximum Discount</p>
                      <p className="font-semibold text-gray-900">
                        {coupon?.maxDiscount > 0
                          ? formatYen(Number(coupon?.maxDiscount) || 0)
                          : "Unlimited"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  <Calendar size={14} />
                  Validity Period
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-semibold text-gray-900">
                      {coupon?.startDate
                        ? dayjs(coupon.startDate).format("MMM DD, YYYY")
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-semibold text-red-600">
                      {coupon?.expiryDate
                        ? dayjs(coupon.expiryDate).format("MMM DD, YYYY")
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                <Settings size={14} />
                Usage & Meta
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Visibility</p>
                  <p className="font-medium text-gray-900">
                    {coupon?.visibility}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    <Layers size={14} />
                    Targeting
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Super Category
                    </p>
                    <p className="font-medium text-blue-600">
                      {superCategoryName}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
