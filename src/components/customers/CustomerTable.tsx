"use client";

import { useRouter } from "next/navigation";
import { MoreVertical, Edit2, Trash2, Eye } from "lucide-react";
import { Customer } from "@/types/customer/customer.types";
import { DataTable, Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/routes";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  isLoading?: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
  isLoading,
  page,
  limit,
  total,
  onPageChange,
}: CustomerTableProps) {
  const router = useRouter();
  const totalPages = Math.ceil(total / limit);

  const columns: Column<Customer>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value, customer) => (
        <button
          onClick={() => router.push(ROUTES.CUSTOMERS.DETAIL(customer.id))}
          className="font-medium text-blue-600 hover:text-blue-700 transition">
          {value}
        </button>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "city",
      label: "City",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-700"
          }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "80px",
      render: (_, customer) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded transition">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() =>
                  router.push(ROUTES.CUSTOMERS.DETAIL(customer?.id))
                }
                className="flex items-center gap-2 cursor-pointer">
                <Eye size={16} />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(customer)}
                className="flex items-center gap-2 cursor-pointer">
                <Edit2 size={16} />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(customer)}
                className="flex items-center gap-2 cursor-pointer text-red-600">
                <Trash2 size={16} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={customers} isLoading={isLoading} />

      {/* Pagination Info and Controls */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-600">
          Showing {customers.length === 0 ? 0 : (page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, total)} of {total} customers
        </p>
        {total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
