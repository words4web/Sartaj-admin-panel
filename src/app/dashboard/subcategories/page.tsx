"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
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
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useDebounce } from "@/hooks/useDebounce";
import { useCategoryById } from "@/services/category/category.hooks";
import { categoryApi } from "@/services/category/category.api";
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
import { FilterBar } from "@/components/common/FilterBar";

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

  const { data: parentCategory } = useCategoryById(parentId);

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
                  className="focus:text-white focus:[&_svg]:text-white group"
                  onClick={() =>
                    router.push(ROUTES.SUBCATEGORIES.EDIT(row?._id))
                  }>
                  <Pencil size={14} className="mr-2 group-focus:text-white" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="focus:text-white focus:[&_svg]:text-white group"
                  onClick={() =>
                    setConfirmAction({ type: "toggle", subCategory: row })
                  }>
                  <Power size={14} className="mr-2 group-focus:text-white" />
                  {row.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-white focus:[&_svg]:text-white group"
                  onClick={() =>
                    setConfirmAction({ type: "delete", subCategory: row })
                  }>
                  <Trash2 size={14} className="mr-2 group-focus:text-white" /> Delete
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

      <FilterBar
        search={{
          value: search,
          onChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          placeholder: "Search subcategories...",
        }}
        filters={[
          {
            key: "parentCategory",
            label: "Parent Category",
            value: parentId,
            selectedLabel: (parentCategory as any)?.name?.en,
            onChange: (val) => {
              setParentId(val);
              setPage(1);
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
        onReset={() => {
          setSearch("");
          setParentId("");
          setPage(1);
        }}
      />

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
