"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useManufacturerList,
  useDeleteManufacturer,
} from "@/services/manufacturer/manufacturer.hooks";
import { IManufacturer } from "@/types/manufacturer/manufacturer.types";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/common/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, Column } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/constants/routes";
import { dateUtils } from "@/lib/utils";

export default function ManufacturersPage() {
  const router = useRouter();
  const limit = 10;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<IManufacturer | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = useManufacturerList({
    search: debouncedSearch || undefined,
    page,
    limit,
  });

  const deleteMutation = useDeleteManufacturer();

  const manufacturers = (data as any)?.manufacturers ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handleConfirmDelete = useCallback(() => {
    if (!confirmDelete) return;
    deleteMutation?.mutate(confirmDelete?._id, {
      onSettled: () => setConfirmDelete(null),
    });
  }, [confirmDelete, deleteMutation]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const columns: Column<IManufacturer>[] = useMemo(
    () => [
      {
        key: "image",
        label: "Logo",
        width: "100px",
        render: (_: any, row: IManufacturer) => (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border p-1">
            <img
              src={row?.image}
              alt={row?.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                if (e?.currentTarget) {
                  e.currentTarget.src = "https://placehold.co/100x100?text=Logo";
                }
              }}
            />
          </div>
        ),
      },
      {
        key: "name",
        label: "Manufacturer Name",
        render: (_: any, row: IManufacturer) => (
          <span className="font-medium text-gray-900">{row?.name}</span>
        ),
      },
      {
        key: "createdAt",
        label: "Created Date",
        render: (_: any, row: IManufacturer) => (
          <span className="text-gray-500 text-sm">
            {dateUtils?.format(row?.createdAt)}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: "100px",
        render: (_: any, row: IManufacturer) => (
          <div
            className="flex justify-end"
            onClick={(e) => e?.stopPropagation?.()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    router?.push(ROUTES?.MANUFACTURERS?.EDIT(row?._id))
                  }>
                  <Pencil size={14} className="mr-2 hover:text-white" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 hover:text-white!"
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
        title="Manufacturers"
        description="Manage product manufacturers and brands"
        addRoute={ROUTES?.MANUFACTURERS?.NEW}
        addLabel="Add Manufacturer"
        showBack={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
            Search
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search manufacturers..."
              value={search}
              onChange={(e) => {
                setSearch(e?.target?.value);
                setPage(1);
              }}
              className="pl-10 h-10"
            />
          </div>
        </div>

        <div className="flex items-center h-10">
          <Button
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-2 border-gray-200 h-10 px-3 transition-color cursor-pointer">
            <RotateCcw size={16} />
            <span className="text-sm font-medium">Reset</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={manufacturers}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          onRowClick={(row) =>
            router?.push(ROUTES?.MANUFACTURERS?.DETAIL(row?._id))
          }
        />
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{manufacturers?.length}</span>{" "}
            of <span className="font-medium">{total}</span> manufacturers
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
        title={`Delete "${confirmDelete?.name}"?`}
        description="This will permanently delete this manufacturer. This action cannot be undone."
        destructive={true}
        confirmLabel="Delete"
        isLoading={deleteMutation?.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
