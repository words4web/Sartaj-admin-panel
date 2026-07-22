"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  useProductList,
  useDeleteProduct,
  useToggleProductStatus,
} from "@/services/product/product.hooks";
import { useCategoryById } from "@/services/category/category.hooks";
import { categoryApi } from "@/services/category/category.api";
import { IProduct } from "@/types/product/product.types";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/common/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, Column } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Power,
  Loader2,
  Star,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { FilterBar } from "@/components/common/FilterBar";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = 10;

  // Extract filters from URL
  const page = Number(searchParams.get("page")) || 1;
  const categoryId = searchParams.get("category") || "";
  const urlSearch = searchParams.get("search") || "";

  // Local state for instant typing responsive input
  const [searchInput, setSearchInput] = useState(urlSearch);

  // Sync local input with URL parameter changes (e.g. back button / reset)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const pathname = usePathname();
  const [confirmDelete, setConfirmDelete] = useState<IProduct | null>(null);
  const [confirmStatusChange, setConfirmStatusChange] =
    useState<IProduct | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Helper to update the router URL parameters
  const updateParams = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(window.location.search);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`${pathname}?${params?.toString()}`);
    },
    [router, pathname],
  );

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchInput(val);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        if (val) {
          params.set("search", val);
        } else {
          params.delete("search");
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }, 400);
    },
    [router, pathname],
  );

  const { data: parentCategory } = useCategoryById(categoryId);

  const { data, isLoading, isError, refetch } = useProductList({
    search: urlSearch || undefined,
    category: categoryId || undefined,
    page,
    limit,
  });

  const deleteMutation = useDeleteProduct();
  const toggleMutation = useToggleProductStatus();

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handleConfirmDelete = useCallback(() => {
    if (!confirmDelete?._id) return;
    deleteMutation.mutate(confirmDelete._id, {
      onSettled: () => setConfirmDelete(null),
    });
  }, [confirmDelete, deleteMutation]);

  const handleConfirmStatusChange = useCallback(() => {
    if (!confirmStatusChange?._id) return;
    toggleMutation.mutate(confirmStatusChange._id, {
      onSettled: () => setConfirmStatusChange(null),
    });
  }, [confirmStatusChange, toggleMutation]);

  const resetFilters = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setSearchInput("");
    router.push(pathname);
  }, [router, pathname]);

  const columns: Column<IProduct>[] = useMemo(
    () => [
      {
        key: "images",
        label: "Image",
        width: "80px",
        render: (_: unknown, row: IProduct) => (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row?.images?.[0]}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/80?text=—";
              }}
            />
          </div>
        ),
      },
      {
        key: "sku",
        label: "SKU",
        render: (_: unknown, row: IProduct) => (
          <span className="font-mono text-sm">{row?.sku}</span>
        ),
      },
      {
        key: "name",
        label: "Name",
        render: (_: unknown, row: IProduct) => (
          <span
            className="font-medium text-gray-900 line-clamp-2 wrap-break-word max-w-56 sm:max-w-xs"
            title={row?.name?.en ?? undefined}>
            {row?.name?.en ?? "—"}
          </span>
        ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (_: unknown, row: IProduct) => {
          const isToggling =
            toggleMutation.isPending && toggleMutation.variables === row._id;
          return (
            <Badge
              variant={row?.isActive ? "success" : "secondary"}
              className="gap-1.5">
              {isToggling && <Loader2 className="w-3 h-3 animate-spin" />}
              {row?.isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        key: "stock",
        label: "Stock",
        render: (_: unknown, row: IProduct) => (
          <span className="text-sm text-gray-600">
            {row?.stockQuantity ?? "—"} ({row?.sellingUnit ?? "—"})
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (_: unknown, row: IProduct) => {
          return (
            <span className="text-xs capitalize text-gray-600">
              {row?.stockStatus ?? "—"}
            </span>
          );
        },
      },
      {
        key: "labels",
        label: "Labels",
        render: (_: unknown, row: IProduct) => {
          const badges = row?.badges || [];
          const hasAgeRestriction = row?.restrictions?.age20Plus;

          if (!badges?.length && !hasAgeRestriction) {
            return <span className="text-xs text-gray-400">—</span>;
          }

          return (
            <span className="flex flex-wrap gap-1">
              {badges?.map((b) => (
                <span
                  key={b}
                  className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {b?.replace("_", " ")}
                </span>
              ))}
              {hasAgeRestriction && (
                <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                  20+ Only
                </span>
              )}
            </span>
          );
        },
      },
      {
        key: "actions",
        label: "Actions",
        width: "100px",
        render: (_: unknown, row: IProduct) => (
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
                  className="focus:text-white focus:[&_svg]:text-white group"
                  onClick={() => router.push(ROUTES.PRODUCTS.EDIT(row._id))}>
                  <Pencil size={14} className="mr-2 group-focus:text-white" />{" "}
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:text-white focus:[&_svg]:text-white group"
                  onClick={() => router.push(ROUTES.PRODUCTS.REVIEWS(row._id))}>
                  <Star size={14} className="mr-2 group-focus:text-white" />{" "}
                  Reviews
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:text-white focus:[&_svg]:text-white group"
                  onClick={() => setConfirmStatusChange(row)}
                  disabled={toggleMutation.isPending}>
                  {toggleMutation.isPending &&
                  toggleMutation.variables === row._id ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Power size={14} className="mr-2 group-focus:text-white" />
                  )}
                  {row.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  className="text-red-600 focus:text-white focus:[&_svg]:text-white group"
                  onClick={() => setConfirmDelete(row)}
                  disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending &&
                  deleteMutation.variables === row._id ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Trash2 size={14} className="mr-2 group-focus:text-white" />
                  )}
                  Delete
                </DropdownMenuItem> */}
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
        title="Products"
        description="Create and manage catalog products"
        addRoute={ROUTES.PRODUCTS.NEW}
        addLabel="Add product"
        showBack={false}
      />

      <FilterBar
        search={{
          value: searchInput,
          onChange: (val) => {
            handleSearchChange(val);
          },
          placeholder: "Search by SKU or name…",
        }}
        filters={[
          {
            key: "category",
            label: "Category",
            value: categoryId,
            selectedLabel: parentCategory?.name?.en,
            onChange: (val) => {
              updateParams({ category: val, page: 1 });
            },
            fetchData: async ({ search, page, limit }) => {
              const res = await categoryApi.getCategories({
                search,
                page,
                limit,
              });
              return {
                options: res?.categories?.map((c) => ({
                  value: c._id,
                  label: c?.name?.en || c?._id,
                })),
                hasMore: res?.categories?.length === limit,
              };
            },
            queryKey: ["categories", "filter"],
          },
        ]}
        onReset={resetFilters}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError ? (
          <CommonError onRetry={() => refetch()} />
        ) : (
          <DataTable
            columns={columns}
            data={products}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            onRowClick={(row) => router.push(ROUTES.PRODUCTS.DETAIL(row._id))}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{products?.length}</span> of{" "}
            <span className="font-medium">{total}</span> products
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(val) => updateParams({ page: val })}
            isLoading={isLoading}
          />
        </div>
      )}

      <ConfirmModal
        open={!!confirmDelete}
        title={`Delete product "${confirmDelete?.name?.en ?? confirmDelete?.sku}"?`}
        description="This will soft-delete the product."
        destructive
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <ConfirmModal
        open={!!confirmStatusChange}
        title={`${confirmStatusChange?.isActive ? "Deactivate" : "Activate"} product "${confirmStatusChange?.sku}"?`}
        description={
          confirmStatusChange?.isActive
            ? "This will hide the product from the customers."
            : "This will make the product visible to customers and allow it to be ordered."
        }
        confirmLabel={confirmStatusChange?.isActive ? "Deactivate" : "Activate"}
        destructive={confirmStatusChange?.isActive}
        isLoading={toggleMutation.isPending}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setConfirmStatusChange(null)}
      />
    </div>
  );
}
