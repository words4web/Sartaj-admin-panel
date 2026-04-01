"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useCategoryList,
  useDeleteCategory,
  useToggleCategoryStatus,
} from "@/services/category/category.hooks";
import { ICategory } from "@/types/category/category.types";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/constants/routes";

type ConfirmAction = {
  type: "delete" | "toggle";
  category: ICategory;
} | null;

export default function CategoriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError } = useCategoryList({
    search: debouncedSearch || undefined,
    page,
    limit: 10,
  });

  const deleteMutation = useDeleteCategory();
  const toggleMutation = useToggleCategoryStatus();

  const categories: ICategory[] = (data as any)?.categories ?? [];
  const total: number = (data as any)?.total ?? 0;
  const totalPages = Math.ceil(total / 10);

  const handleConfirm = useCallback(() => {
    if (!confirmAction) return;
    if (confirmAction.type === "delete") {
      deleteMutation.mutate(confirmAction.category._id, {
        onSettled: () => setConfirmAction(null),
      });
    } else {
      toggleMutation.mutate(
        {
          id: confirmAction.category._id,
          isActive: !confirmAction.category.isActive,
        },
        { onSettled: () => setConfirmAction(null) },
      );
    }
  }, [confirmAction, deleteMutation, toggleMutation]);

  const columns: Column<ICategory>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        render: (_: any, row: ICategory) => (
          <span className="font-medium">{row?.name}</span>
        ),
      },
      {
        key: "description",
        label: "Description",
        render: (_: any, row: ICategory) => (
          <span className="text-gray-500 truncate max-w-[250px] overflow-hidden whitespace-nowrap inline-block align-bottom">
            {row?.description || "—"}
          </span>
        ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (_: any, row: ICategory) => (
          <Badge variant={row?.isActive ? "default" : "secondary"}>
            {row?.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        key: "createdAt",
        label: "Created",
        render: (_: any, row: ICategory) => (
          <span className="text-gray-500">
            {new Date(row?.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: "100px",
        render: (_: any, row: ICategory) => (
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
                  onClick={() =>
                    router.push(ROUTES.CATEGORIES.DETAIL(row?._id))
                  }>
                  <Eye size={14} className="mr-2" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(ROUTES.CATEGORIES.EDIT(row?._id))}>
                  <Pencil size={14} className="mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setConfirmAction({ type: "toggle", category: row })
                  }>
                  <Power size={14} className="mr-2" />
                  {row?.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() =>
                    setConfirmAction({ type: "delete", category: row })
                  }>
                  <Trash2 size={14} className="mr-2" /> Delete
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <PageHeader
        title="Categories"
        description="Manage product categories"
        addRoute={ROUTES.CATEGORIES.NEW}
        addLabel="Add Category"
        showBack={false}
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          isError={isError}
          onRowClick={(row) => router.push(ROUTES.CATEGORIES.DETAIL(row?._id))}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{categories?.length}</span> of
            <span className="font-medium">{total}</span> categories
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!confirmAction}
        title={
          confirmAction?.type === "delete"
            ? `Delete "${confirmAction?.category.name}"?`
            : `${confirmAction?.category.isActive ? "Deactivate" : "Activate"} "${confirmAction?.category.name}"?`
        }
        description={
          confirmAction?.type === "delete"
            ? "This will permanently delete the category, all its subcategories, and their products. This action cannot be undone."
            : confirmAction?.category.isActive
              ? "This will deactivate the category and hide all related subcategories and products."
              : "This will activate the category and its subcategories and products."
        }
        destructive={confirmAction?.type === "delete"}
        confirmLabel={confirmAction?.type === "delete" ? "Delete" : "Confirm"}
        isLoading={deleteMutation.isPending || toggleMutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
