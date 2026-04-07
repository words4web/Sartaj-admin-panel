"use client";

import { ReactNode } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/utils/common.utils";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";

export interface Column<T> {
  key: keyof T | "actions" | string;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  errorContent?: ReactNode;
  onRetry?: () => void;
  onSort?: (key: string, order: "asc" | "desc") => void;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id?: string | number; _id?: string }>({
  columns,
  data,
  isLoading = false,
  isError = false,
  errorContent,
  onRetry,
  onSort,
  sortKey,
  sortOrder = "asc",
  onRowClick,
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    onSort(key, newOrder);
  };

  const getRowId = (row: T) => (row?._id || row?.id) as string | number;

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 min-h-[400px]">
        <CommonLoader fullScreen={false} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 min-h-[200px]">
        {errorContent || (
          <CommonError
            message="Failed to load data. Please try again."
            onRetry={onRetry}
          />
        )}
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns?.map((column) => (
                <th
                  key={String(column?.key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={{ width: column?.width }}>
                  <button
                    onClick={() =>
                      column?.sortable && handleSort(String(column?.key))
                    }
                    className={cn(
                      "flex items-center gap-1 hover:text-gray-900",
                      column?.sortable ? "cursor-pointer" : "cursor-default",
                    )}>
                    {column?.label}
                    {column?.sortable &&
                      sortKey === column?.key &&
                      (sortOrder === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, idx) => {
              const rowId = getRowId(row);
              return (
                <tr
                  key={rowId}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-gray-200 transition-colors",
                    idx === data.length - 1 && "border-b-0",
                    onRowClick
                      ? "cursor-pointer hover:bg-gray-50"
                      : "hover:bg-gray-50",
                  )}>
                  {columns?.map((column) => (
                    <td
                      key={`${rowId}-${String(column?.key)}`}
                      className="px-4 py-3 text-sm text-gray-900"
                      style={{ width: column?.width }}>
                      {column?.render
                        ? column?.render(
                            (row as any)?.[column?.key as keyof typeof row],
                            row,
                          )
                        : (row as any)?.[column?.key as keyof typeof row]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
