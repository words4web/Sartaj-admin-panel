"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Power,
  Trash2,
  RotateCcw,
} from "lucide-react";
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
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useDebounce } from "@/hooks/useDebounce";
import { useCategoryList } from "@/services/category/category.hooks";
import {
  useDeleteSubCategory,
  useToggleSubCategoryStatus,
  useSubCategoryList,
} from "@/services/subCategory/subCategory.hooks";
import {
  ISubCategory,
  subCategoryConfirmAction,
} from "@/types/subCategory/subCategory.types";
import { ROUTES } from "@/constants/routes";
import { ICategory } from "@/types/category/category.types";

export default function SubCategoriesPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] =
    useState<subCategoryConfirmAction>(null);

  const deleteMutation = useDeleteSubCategory();
  const toggleMutation = useToggleSubCategoryStatus();

  const debouncedSearch = useDebounce(search, 400);

  const { data: categoryData } = useCategoryList({ page: 1, limit: 100 });
  const topLevelCategories = (categoryData as any)?.categories ?? [];

  const { data, isLoading, isError } = useSubCategoryList({
    search: debouncedSearch || undefined,
    parent: parentId || undefined,
    page,
    limit: 10,
  });

  const subCategories: ISubCategory[] = data?.subCategories ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = useMemo(() => Math.ceil(total / 10), [total]);

  const handleConfirm = useCallback(() => {
    if (!confirmAction) return;

    if (confirmAction.type === "delete") {
      deleteMutation.mutate(confirmAction.subCategory?._id, {
        onSettled: () => setConfirmAction(null),
      });
      return;
    }

    toggleMutation.mutate(
      {
        id: confirmAction.subCategory?._id,
        isActive: !confirmAction.subCategory?.isActive,
      },
      { onSettled: () => setConfirmAction(null) },
    );
  }, [confirmAction, deleteMutation, toggleMutation]);

  const columns: Column<ISubCategory>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        render: (_: any, row: ISubCategory) => (
          <span className="font-medium">{row?.name?.en}</span>
        ),
      },
      {
        key: "parent",
        label: "Parent",
        render: (_: any, row: ISubCategory) => (
          <span className="text-gray-500 truncate max-w-[200px] overflow-hidden whitespace-nowrap inline-block align-bottom">
            {(row?.parent as ICategory)?.name?.en || "N/A"}
          </span>
        ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (_: any, row: ISubCategory) => (
          <Badge variant={row?.isActive ? "default" : "secondary"}>
            {row?.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: "100px",
        render: (_: any, row: ISubCategory) => (
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
                    router.push(ROUTES.SUBCATEGORIES.EDIT(row?._id))
                  }>
                  <Pencil size={14} className="mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setConfirmAction({ type: "toggle", subCategory: row })
                  }>
                  <Power size={14} className="mr-2" />
                  {row.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() =>
                    setConfirmAction({ type: "delete", subCategory: row })
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
      <PageHeader
        title="SubCategories"
        description="Manage subcategories under categories"
        addRoute={ROUTES.SUBCATEGORIES.NEW}
        addLabel="Add SubCategory"
        showBack={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
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
              placeholder="Search subcategories..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
            Parent Category
          </label>
          <select
            value={parentId}
            onChange={(e) => {
              setParentId(e.target.value);
              setPage(1);
            }}
            className="h-10 border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm">
            <option value="">All Categories</option>
            {topLevelCategories?.map((c: any) => (
              <option key={c?._id} value={c?._id}>
                {c?.name?.en}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center h-10">
          <Button
            size="sm"
            onClick={() => {
              setSearch("");
              setParentId("");
              setPage(1);
            }}
            className="flex items-center gap-2 border-gray-200 h-10 px-3 transition-color cursor-pointer">
            <RotateCcw size={16} />
            <span className="text-sm font-medium">Reset</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={subCategories}
          isLoading={isLoading}
          isError={isError}
          onRowClick={(row) =>
            router.push(ROUTES.SUBCATEGORIES.DETAIL(row._id))
          }
        />
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{subCategories?.length}</span>{" "}
            of <span className="font-medium">{total}</span> subcategories
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
            ? `Delete "${confirmAction?.subCategory?.name?.en}"?`
            : `${confirmAction?.subCategory?.isActive ? "Deactivate" : "Activate"} "${confirmAction?.subCategory?.name?.en}"?`
        }
        description={
          confirmAction?.type === "delete"
            ? "This will delete the subcategory and all related products. This action cannot be undone."
            : confirmAction?.subCategory.isActive
              ? "This will deactivate the subcategory and hide related products."
              : "This will activate the subcategory and its products."
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
