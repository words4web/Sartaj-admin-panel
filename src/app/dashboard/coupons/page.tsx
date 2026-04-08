"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useCoupons,
  useDeleteCoupon,
  useToggleCouponStatus,
} from "@/services/coupon/coupon.hooks";
import { ICoupon, EDiscountType } from "@/types/coupon/coupon.types";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/common/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, Column } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { dateUtils, formatYen } from "@/utils/common.utils";
import { MoreHorizontal, Pencil, Power, Trash2, Ticket } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/constants/routes";
import { FilterBar } from "@/components/common/FilterBar";

type ConfirmAction = {
  type: "delete" | "toggle";
  coupon: ICoupon;
} | null;

export default function CouponsPage() {
  const router = useRouter();
  const limit = 10;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = useCoupons({
    search: debouncedSearch || undefined,
    page,
    limit,
  });

  const deleteMutation = useDeleteCoupon();
  const toggleMutation = useToggleCouponStatus();

  const coupons = data?.coupons ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handleConfirm = useCallback(() => {
    if (!confirmAction) return;
    if (confirmAction?.type === "delete") {
      deleteMutation.mutate(confirmAction?.coupon?._id, {
        onSettled: () => setConfirmAction(null),
      });
    } else {
      toggleMutation.mutate(
        {
          id: confirmAction?.coupon?._id,
          isActive: !confirmAction?.coupon?.isActive,
        },
        { onSettled: () => setConfirmAction(null) },
      );
    }
  }, [confirmAction, deleteMutation, toggleMutation]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const columns: Column<ICoupon>[] = useMemo(
    () => [
      {
        key: "code",
        label: "Coupon Code",
        render: (_: any, row: ICoupon) => (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Ticket size={16} />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">
              {row?.code}
            </span>
          </div>
        ),
      },
      {
        key: "title",
        label: "Title",
        render: (_: any, row: ICoupon) => (
          <span className="font-medium text-gray-700">{row?.title || "—"}</span>
        ),
      },
      {
        key: "discount",
        label: "Discount",
        render: (_: any, row: ICoupon) => (
          <span className="font-semibold text-green-600">
            {row?.discountType === EDiscountType.PERCENT
              ? `${row?.discountAmount}% OFF`
              : `${formatYen(Number(row?.discountAmount) || 0)} OFF`}
          </span>
        ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (_: any, row: ICoupon) => (
          <Badge variant={row?.isActive ? "success" : "secondary"}>
            {row?.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        key: "expiryDate",
        label: "Expires",
        render: (_: any, row: ICoupon) => (
          <span className="text-gray-500 text-sm">
            {row?.expiryDate ? dateUtils?.format(row?.expiryDate) : "—"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: "100px",
        render: (_: any, row: ICoupon) => (
          <div
            className="flex justify-end"
            onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router?.push(ROUTES?.COUPONS?.EDIT(row?._id))}>
                  <Pencil size={14} className="mr-2 hover:text-white" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setConfirmAction({ type: "toggle", coupon: row })
                  }>
                  <Power size={14} className="mr-2 hover:text-white" />
                  {row?.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 hover:text-white!"
                  onClick={() =>
                    setConfirmAction({ type: "delete", coupon: row })
                  }>
                  <Trash2 size={14} className="mr-2 hover:text-white" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [router],
  );

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        title="Coupons"
        description="Manage promotional codes and discounts"
        addRoute={ROUTES.COUPONS.NEW}
        addLabel="Add Coupon"
        showBack={false}
      />

      <FilterBar
        search={{
          value: search,
          onChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          placeholder: "Search coupons...",
        }}
        onReset={resetFilters}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError ? (
          <CommonError onRetry={refetch} />
        ) : (
          <DataTable
            columns={columns}
            data={coupons}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onRowClick={(row) =>
              router?.push(ROUTES?.COUPONS?.DETAIL(row?._id))
            }
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{coupons?.length}</span> of
            <span className="font-medium">{total}</span> coupons
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </div>
      )}

      <ConfirmModal
        open={!!confirmAction}
        title={
          confirmAction?.type === "delete"
            ? `Delete Coupon?`
            : `${confirmAction?.coupon?.isActive ? "Deactivate" : "Activate"} Coupon?`
        }
        description={
          confirmAction?.type === "delete"
            ? "This will permanently delete the coupon. This action cannot be undone."
            : confirmAction?.coupon?.isActive
              ? "This will deactivate the coupon and it will no longer be usable by customers."
              : "This will activate the coupon and make it available for customers."
        }
        destructive={confirmAction?.type === "delete"}
        confirmLabel={confirmAction?.type === "delete" ? "Delete" : "Confirm"}
        isLoading={deleteMutation?.isPending || toggleMutation?.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
