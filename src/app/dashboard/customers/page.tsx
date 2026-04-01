"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Power,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useSuperCategories } from "@/services/superCategory/superCategory.hooks";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useDeleteCustomer,
  useUpdateCustomerStatus,
} from "@/services/customer/customer.mutations";
import { Customer } from "@/types/customer/customer.types";
import { useCustomers as useCustomersQuery } from "@/services/customer/customer.queries";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { Pagination } from "@/components/common/Pagination";
import { ROUTES } from "@/constants/routes";
import { ConfirmAction, StatusFilter } from "@/types/customer/customer.types";

export default function CustomersPage() {
  const router = useRouter();
  const limit = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [superCategoryId, setSuperCategoryId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const debouncedSearch = useDebounce(search, 400);

  const deleteMutation = useDeleteCustomer();
  const toggleMutation = useUpdateCustomerStatus();

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const { data: superCategoriesData, isLoading: isSuperCategoriesLoading } =
    useSuperCategories();
  const superCategories = superCategoriesData ?? [];

  const { data, isLoading, isError, refetch } = useCustomersQuery({
    search: debouncedSearch || undefined,
    superCategory: superCategoryId || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    page,
    limit,
  });

  const customers: Customer[] = data?.data ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = useMemo(() => Math.ceil(total / limit), [total]);

  const handleConfirm = useCallback(() => {
    if (!confirmAction) return;

    if (confirmAction?.type === "delete") {
      deleteMutation.mutate(confirmAction?.customer?._id, {
        onSettled: () => setConfirmAction(null),
      });
      return;
    }

    toggleMutation.mutate(confirmAction?.customer?._id, {
      onSettled: () => setConfirmAction(null),
    });
  }, [confirmAction, deleteMutation, toggleMutation]);

  const superCategoryName = (c: Customer) => {
    const sc = c?.superCategory;
    return typeof sc === "string" ? sc : (sc?.name ?? "—");
  };

  const resetFilters = useCallback(() => {
    setSearch("");
    setSuperCategoryId("");
    setStatusFilter("all");
    setPage(1);
  }, []);

  const columns: Column<Customer>[] = useMemo(
    () => [
      {
        key: "fullName",
        label: "Full Name",
        render: (_: any, row: Customer) => (
          <span className="font-medium">{row?.fullName}</span>
        ),
      },
      {
        key: "email",
        label: "Email",
        render: (_: any, row: Customer) => (
          <span className="text-gray-500 truncate max-w-[200px] overflow-hidden whitespace-nowrap inline-block align-bottom">
            {row?.email}
          </span>
        ),
      },
      {
        key: "mobileNumber",
        label: "Phone",
        render: (_: any, row: Customer) => (
          <span className="text-gray-500 truncate max-w-[200px] overflow-hidden whitespace-nowrap inline-block align-bottom">
            {row?.mobileNumber}
          </span>
        ),
      },
      {
        key: "superCategory",
        label: "Super Category",
        render: (_: any, row: Customer) => (
          <span className="text-gray-500 truncate max-w-[200px] overflow-hidden whitespace-nowrap inline-block align-bottom">
            {superCategoryName(row)}
          </span>
        ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (_: any, row: Customer) => (
          <Badge variant={row?.isActive ? "success" : "secondary"}>
            {row?.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        width: "100px",
        render: (_: any, row: Customer) => (
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
                  onClick={() => router.push(ROUTES.CUSTOMERS.EDIT(row?._id))}>
                  <Pencil size={14} className="mr-2 hover:text-white" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setConfirmAction({ type: "toggle", customer: row })
                  }>
                  <Power size={14} className="mr-2 hover:text-white" />
                  {row?.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 hover:text-white!"
                  onClick={() =>
                    setConfirmAction({ type: "delete", customer: row })
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
        title="Customers"
        description="Manage customer accounts"
        addRoute={ROUTES.CUSTOMERS.NEW}
        addLabel="Add Customer"
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
              placeholder="Email or phone or name"
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
            Super Category
          </label>
          <select
            value={superCategoryId}
            disabled={isSuperCategoriesLoading}
            onChange={(e) => {
              setSuperCategoryId(e.target.value);
              setPage(1);
            }}
            className="h-10 border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm">
            <option value="">All Categories</option>
            {superCategories?.map((sc: any) => (
              <option key={sc?._id} value={sc?._id}>
                {sc?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter);
              setPage(1);
            }}
            className="h-10 border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm cursor-pointer">
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
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
          data={customers}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          onRowClick={(row) => router.push(ROUTES.CUSTOMERS.DETAIL(row?._id))}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{customers?.length}</span> of
            <span className="font-medium">{total}</span> customers
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
            ? `Delete "${confirmAction?.customer?.fullName}" account ?`
            : `${confirmAction?.customer?.isActive ? "Deactivate" : "Activate"} "${confirmAction?.customer?.fullName}"?`
        }
        description={
          confirmAction?.type === "delete"
            ? "This customer will be deleted. This action cannot be undone."
            : confirmAction?.customer?.isActive
              ? "This will deactivate the customer account."
              : "This will activate the customer account."
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
