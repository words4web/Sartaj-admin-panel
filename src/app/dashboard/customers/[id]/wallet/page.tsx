"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Wallet2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { DataTable, Column } from "@/components/common/DataTable";
import {
  useCustomerWallet,
  useCustomer,
} from "@/services/customer/customer.queries";
import { ROUTES } from "@/constants/routes";
import { dateUtils } from "@/utils/common.utils";

const LIMIT = 10;

const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  ORDER_REWARD: "Order Reward",
  ORDER_PAYMENT: "Order Payment",
  ORDER_PAYMENT_REFUND: "Payment Refund",
  ORDER_REWARD_CLAWBACK: "Reward Clawback",
  MANUAL_CREDIT: "Manual Credit",
  MANUAL_DEBIT: "Manual Debit",
};

type WalletTransaction = {
  _id: string;
  type: string;
  direction: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  orderDisplayId?: string;
  description?: string;
  createdAt?: string;
};

const columns: Column<WalletTransaction>[] = [
  {
    key: "type",
    label: "Type",
    render: (_, row) => (
      <div>
        <span className="text-sm font-medium text-gray-700">
          {TRANSACTION_TYPE_LABELS[row?.type] ?? row?.type}
        </span>
        {row?.orderDisplayId && (
          <p className="text-xs text-gray-400 mt-0.5">
            Order #{row?.orderDisplayId}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "direction",
    label: "Direction",
    render: (_, row) => {
      const isCredit = row?.direction === "CREDIT";
      return (
        <Badge
          variant={isCredit ? "success" : "destructive"}
          className="flex items-center gap-1 w-fit text-xs">
          {isCredit ? (
            <ArrowDownLeft className="w-3 h-3" />
          ) : (
            <ArrowUpRight className="w-3 h-3" />
          )}
          {isCredit ? "Credit" : "Debit"}
        </Badge>
      );
    },
  },
  {
    key: "amount",
    label: "Amount",
    render: (_, row) => {
      const isCredit = row?.direction === "CREDIT";
      return (
        <span
          className={`font-semibold text-sm ${
            isCredit ? "text-emerald-600" : "text-red-500"
          }`}>
          {isCredit ? "+" : "-"}¥{row?.amount?.toLocaleString() ?? 0}
        </span>
      );
    },
  },
  {
    key: "balanceBefore",
    label: "Balance Before",
    render: (_, row) => (
      <span className="text-sm text-gray-600">
        ¥{row?.balanceBefore?.toLocaleString() ?? 0}
      </span>
    ),
  },
  {
    key: "balanceAfter",
    label: "Balance After",
    render: (_, row) => (
      <span className="text-sm text-gray-600">
        ¥{row?.balanceAfter?.toLocaleString() ?? 0}
      </span>
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (_, row) => (
      <span className="text-sm text-gray-500 max-w-[200px] truncate block">
        {row?.description ?? "—"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Date",
    render: (_, row) => (
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {row?.createdAt ? dateUtils.formatDateTime(row?.createdAt) : "—"}
      </span>
    ),
  },
];

export default function CustomerWalletPage() {
  const params = useParams();
  const id = params?.id as string;
  const [page, setPage] = useState(1);

  const { data: customer } = useCustomer(id);
  const { data, isLoading, isError, refetch } = useCustomerWallet(
    id,
    page,
    LIMIT,
  );

  const balance: number = data?.balance ?? 0;
  const transactions: WalletTransaction[] = data?.transactions ?? [];
  const meta = data?.meta ?? {};
  const totalPages: number = meta?.totalPages ?? 0;
  const total: number = meta?.total ?? 0;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Customer Wallet"
        description={
          customer?.fullName
            ? `Wallet overview for ${customer?.fullName}`
            : "Wallet balance and transaction history"
        }
        backRoute={id ? ROUTES.CUSTOMERS.DETAIL(id) : ROUTES.CUSTOMERS.LIST}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="sm:col-span-1 border-0 shadow-md bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Wallet2 className="w-4 h-4" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-9 w-28 bg-white/20 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold tracking-tight">
                ¥{balance?.toLocaleString()}
              </p>
            )}
            <p className="text-xs text-white/60 mt-1">Available coins</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-9 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{total}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-500" />
              Showing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-9 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">
                {transactions?.length}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Page {page} of {totalPages || 1}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-500" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <DataTable
            columns={columns}
            data={transactions}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <p className="text-sm text-gray-500 text-center sm:text-left">
                Showing{" "}
                <span className="font-medium">{transactions?.length}</span> of{" "}
                <span className="font-medium">{total}</span> transactions
              </p>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                isLoading={isLoading}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
