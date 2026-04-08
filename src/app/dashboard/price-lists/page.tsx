"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  usePriceLists,
  useDeletePriceList,
} from "@/services/priceList/priceList.hooks";
import { useSuperCategories } from "@/services/superCategory/superCategory.hooks";
import { PriceList } from "@/types/priceList/priceList.types";
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/constants/routes";
import { FilterBar } from "@/components/common/FilterBar";
import { SUPER_CATEGORIES } from "@/lib/constants";

function itemCount(row: PriceList) {
  return row?.items?.length ?? 0;
}

function superCategoryLabel(row: PriceList) {
  const sc = row?.superCategory;
  if (typeof sc === "object" && sc && "name" in sc && sc?.name) {
    return String(sc?.name);
  }
  return "—";
}

export default function PriceListsPage() {
  const router = useRouter();
  const limit = 10;
  const [search, setSearch] = useState("");
  const [superCategoryFilter, setSuperCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<PriceList | null>(null);

  const debouncedSearch = useDebounce(search, 400);
  const { data: superCategoriesData } = useSuperCategories();
  const superCategories = superCategoriesData ?? [];

  const { data, isLoading, isError, refetch } = usePriceLists({
    search: debouncedSearch || undefined,
    superCategory: superCategoryFilter || undefined,
    page,
    limit,
  });

  const deleteMutation = useDeletePriceList();

  const lists = data?.lists ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handleConfirmDelete = useCallback(() => {
    if (!confirmDelete?._id) return;
    deleteMutation.mutate(confirmDelete._id, {
      onSettled: () => setConfirmDelete(null),
    });
  }, [confirmDelete, deleteMutation]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setSuperCategoryFilter("");
    setPage(1);
  }, []);

  const segmentFilterOptions = useMemo(
    () =>
      superCategories
        ?.filter((sc) => String(sc?.name) !== SUPER_CATEGORIES.RETAILER)
        ?.map((sc) => ({ label: String(sc?.name), value: sc?._id })),
    [superCategories],
  );

  const columns: Column<PriceList>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        render: (_: unknown, row: PriceList) => (
          <span className="font-semibold text-gray-900">{row.name}</span>
        ),
      },
      {
        key: "superCategory",
        label: "Segment",
        render: (_: unknown, row: PriceList) => (
          <span className="text-gray-700">{superCategoryLabel(row)}</span>
        ),
      },
      {
        key: "items",
        label: "Overrides",
        render: (_: unknown, row: PriceList) => (
          <span className="text-gray-600 tabular-nums">{itemCount(row)}</span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: "100px",
        render: (_: unknown, row: PriceList) => (
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
                  onClick={() => router.push(ROUTES.PRICE_LISTS.EDIT(row._id))}>
                  <Pencil size={14} className="mr-2 hover:text-white" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 hover:text-white!"
                  onClick={() => setConfirmDelete(row)}>
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
        title="Price lists"
        description="Named override prices per customer segment"
        addRoute={ROUTES.PRICE_LISTS.NEW}
        addLabel="New price list"
        showBack={false}
      />

      <FilterBar
        search={{
          value: search,
          onChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          placeholder: "Search by list name…",
        }}
        filters={[
          {
            key: "superCategory",
            label: "Segment",
            value: superCategoryFilter,
            onChange: (v) => {
              setSuperCategoryFilter(v);
              setPage(1);
            },
            options: segmentFilterOptions,
            placeholder: "Segment",
          },
        ]}
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
            data={lists}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onRowClick={(row) => router.push(ROUTES.PRICE_LISTS.EDIT(row._id))}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{lists?.length}</span> of
            <span className="font-medium"> {total}</span> lists
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
        open={!!confirmDelete}
        title="Delete price list?"
        description="Customers assigned to this list will fall back to segment base prices. This cannot be undone."
        destructive
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
