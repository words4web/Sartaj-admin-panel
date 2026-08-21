"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetBundles, useDeleteBundle } from "@/services/bundle/bundle.hooks";
import { IBundle } from "@/types/bundle/bundle.types";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { formatYen } from "@/utils/common.utils";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BundlesPage() {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: bundles = [], isLoading, isError, refetch } = useGetBundles();
  const deleteMutation = useDeleteBundle();

  const handleConfirmDelete = useCallback(() => {
    if (!confirmDeleteId) return;
    deleteMutation.mutate(confirmDeleteId, {
      onSuccess: () => setConfirmDeleteId(null),
    });
  }, [confirmDeleteId, deleteMutation]);

  const columns: Column<IBundle>[] = useMemo(
    () => [
      {
        key: "title",
        label: "Title",
        render: (_: any, row: IBundle) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{row.title}</span>
            <span className="text-xs text-gray-400">ID: {row._id}</span>
          </div>
        ),
      },
      {
        key: "productIds",
        label: "Products",
        render: (_: any, row: IBundle) => {
          const productList = Array.isArray(row?.productIds)
            ? row.productIds
            : [];
          return (
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              {productList.map((p: any, idx: number) => {
                const name =
                  typeof p?.name === "object" ? p?.name?.en : p?.name;
                return (
                  <span
                    key={p?._id || idx}
                    className="line-clamp-1 max-w-md font-medium">
                    • {name || p?.sku || String(p)}
                  </span>
                );
              })}
            </div>
          );
        },
      },
      {
        key: "discountValue",
        label: "Discount",
        width: "140px",
        render: (_: any, row: IBundle) => (
          <span className="inline-flex items-center text-xs font-bold bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
            {formatYen(Number(row?.discountValue) || 0)} OFF
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: "100px",
        render: (_: any, row: IBundle) => (
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
                  onClick={() => router.push(ROUTES.BUNDLES.EDIT(row._id))}>
                  <Pencil size={14} className="mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 hover:text-white!"
                  onClick={() => setConfirmDeleteId(row._id)}>
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
    <div className="space-y-6 p-6">
      <PageHeader
        title="Product Bundles"
        description="Manage product bundle combos and discounts for the sale page"
        addRoute={ROUTES.BUNDLES.NEW}
        addLabel="Create Bundle"
        showBack={false}
      />

      {isLoading ? (
        <CommonLoader fullScreen={false} />
      ) : isError ? (
        <CommonError message="Failed to load bundles." onRetry={refetch} />
      ) : (
        <DataTable data={bundles} columns={columns} />
      )}

      <ConfirmModal
        open={!!confirmDeleteId}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Bundle"
        description="Are you sure you want to delete this bundle? This action cannot be undone."
        confirmLabel="Delete"
        destructive={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
