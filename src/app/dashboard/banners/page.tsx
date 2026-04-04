"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useBanners,
  useDeleteBanner,
  useToggleBannerStatus,
} from "@/services/banner/banner.hooks";
import { IBanner } from "@/types/banner/banner.types";
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
import { MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/constants/routes";
import { dateUtils } from "@/lib/utils";
import { FilterBar } from "@/components/common/FilterBar";

type ConfirmAction = {
  type: "delete" | "toggle";
  banner: IBanner;
} | null;

export default function BannersPage() {
  const router = useRouter();
  const limit = 10;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = useBanners({
    search: debouncedSearch || undefined,
    page,
    limit,
  });

  const deleteMutation = useDeleteBanner();
  const toggleMutation = useToggleBannerStatus();

  const banners = data?.banners ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handleConfirm = useCallback(() => {
    if (!confirmAction) return;
    if (confirmAction?.type === "delete") {
      deleteMutation.mutate(confirmAction?.banner?._id, {
        onSettled: () => setConfirmAction(null),
      });
    } else {
      toggleMutation.mutate(
        {
          id: confirmAction?.banner?._id,
          isActive: !confirmAction?.banner?.isActive,
        },
        { onSettled: () => setConfirmAction(null) },
      );
    }
  }, [confirmAction, deleteMutation, toggleMutation]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const columns: Column<IBanner>[] = useMemo(
    () => [
      {
        key: "image",
        label: "Image",
        width: "120px",
        render: (_: any, row: IBanner) => (
          <div className="w-20 h-10 rounded overflow-hidden bg-gray-100 border">
            <img
              src={row?.image}
              alt={row?.title?.en || "Banner"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/200x100?text=Banner";
              }}
            />
          </div>
        ),
      },
      {
        key: "title",
        label: "Title",
        render: (_: any, row: IBanner) => (
          <span className="font-medium">{row?.title?.en || "—"}</span>
        ),
      },
      {
        key: "link",
        label: "Link",
        render: (_: any, row: IBanner) => (
          <span className="text-gray-500 truncate max-w-[200px] overflow-hidden whitespace-nowrap inline-block align-bottom">
            {row?.link || "—"}
          </span>
        ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (_: any, row: IBanner) => (
          <Badge variant={row?.isActive ? "success" : "secondary"}>
            {row?.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        key: "createdAt",
        label: "Created",
        render: (_: any, row: IBanner) => (
          <span className="text-gray-500">
            {dateUtils.format(row?.createdAt)}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: "100px",
        render: (_: any, row: IBanner) => (
          <div
            className="flex justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router?.push(ROUTES.BANNERS.EDIT(row?._id))}
                >
                  <Pencil size={14} className="mr-2 hover:text-white" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setConfirmAction({ type: "toggle", banner: row })
                  }
                >
                  <Power size={14} className="mr-2 hover:text-white" />
                  {row?.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 hover:text-white!"
                  onClick={() =>
                    setConfirmAction({ type: "delete", banner: row })
                  }
                >
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
        title="Banners"
        description="Manage app banners and promotions"
        addRoute={ROUTES.BANNERS.NEW}
        addLabel="Add Banner"
        showBack={false}
      />

      <FilterBar
        search={{
          value: search,
          onChange: (val) => {
            setSearch(val);
            setPage(1);
          },
          placeholder: "Search banners...",
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
            data={banners}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onRowClick={(row) => router?.push(ROUTES.BANNERS.DETAIL(row?._id))}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{banners?.length}</span> of
            <span className="font-medium">{total}</span> banners
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
            ? `Delete Banner?`
            : `${confirmAction?.banner?.isActive ? "Deactivate" : "Activate"} Banner "${confirmAction?.banner?.title?.en}"?`
        }
        description={
          confirmAction?.type === "delete"
            ? "This will permanently delete the banner. This action cannot be undone."
            : confirmAction?.banner?.isActive
              ? "This will deactivate the banner and hide it from the app."
              : "This will activate the banner and show it on the app."
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
