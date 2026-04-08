"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCmsList, useDeleteCms } from "@/services/cms/cms.hooks";
import { ICMS } from "@/types/cms/cms.types";
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
import { MoreHorizontal, Pencil, FileText } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/constants/routes";
import { dateUtils } from "@/utils/common.utils";

export default function CmsPage() {
  const router = useRouter();
  const limit = 10;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<ICMS | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = useCmsList({
    search: debouncedSearch || undefined,
    page,
    limit,
  });

  const deleteMutation = useDeleteCms();

  const cmsList = (data as any)?.cms ?? [];
  const total = (data as any)?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handleConfirmDelete = useCallback(() => {
    if (!confirmDelete) return;
    deleteMutation?.mutate(confirmDelete?._id, {
      onSettled: () => setConfirmDelete(null),
    });
  }, [confirmDelete, deleteMutation]);

  const columns: Column<ICMS>[] = useMemo(
    () => [
      {
        key: "title",
        label: "Page Title",
        render: (_: any, row: ICMS) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-primary/5 text-primary rounded-lg shrink-0">
              <FileText size={18} />
            </div>
            <span className="font-bold text-gray-900 tracking-tight capitalize truncate">
              {typeof row?.title === "string"
                ? row?.title
                : row?.title?.en || "Untitled Page"}
            </span>
          </div>
        ),
      },
      {
        key: "slug",
        label: "URL Slug",
        render: (_: any, row: ICMS) => (
          <div className="max-w-[250px]">
            <span className="font-medium text-primary/70 bg-gray-100/80 px-2 py-0.5 rounded-md text-xs font-mono truncate block">
              /{row?.slug}
            </span>
          </div>
        ),
      },
      {
        key: "updatedAt",
        label: "Last Modified",
        render: (_: any, row: ICMS) => (
          <span className="text-gray-500 text-sm">
            {row?.updatedAt ? dateUtils?.format(row?.updatedAt) : "—"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: "100px",
        render: (_: any, row: ICMS) => (
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
                  onClick={() => router?.push(ROUTES?.CMS?.EDIT(row?._id))}>
                  <Pencil size={14} className="mr-2 hover:text-white" /> Edit
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 hover:text-white!"
                  onClick={() => setConfirmDelete(row)}
                >
                  <Trash2 size={14} className="mr-2 hover:text-white" /> Delete
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
        title="CMS Pages"
        description="Manage dynamic content pages like Privacy Policy and Terms"
        showBack={false}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError ? (
          <CommonError onRetry={refetch} />
        ) : (
          <DataTable
            columns={columns}
            data={cmsList}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onRowClick={(row) => router?.push(ROUTES?.CMS?.DETAIL(row?._id))}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{cmsList?.length}</span> of
            <span className="font-medium">{total}</span> pages
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
        title={`Delete Page?`}
        description={`This will permanently delete the page "${confirmDelete?.title}". This action cannot be undone.`}
        destructive={true}
        confirmLabel="Delete"
        isLoading={deleteMutation?.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
