"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Crown,
  Gift,
  Sparkles,
  Truck,
  User,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  PackageCheck,
  PackageX,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useLoyaltyMembers } from "@/services/loyalty/loyalty.queries";
import { useMarkHamperSent } from "@/services/loyalty/loyalty.mutations";
import { LoyaltyMember } from "@/types/loyalty/loyalty.types";
import { ROUTES } from "@/constants/routes";
import { dateUtils, formatYen } from "@/utils/common.utils";

export default function LoyaltyMembersPage() {
  const limit = 20;
  const [page, setPage] = useState(1);
  const [hamperModal, setHamperModal] = useState<LoyaltyMember | null>(null);

  const { data, isLoading, isError, refetch } = useLoyaltyMembers({
    page,
    limit,
  });

  const markHamperMutation = useMarkHamperSent();

  const members: LoyaltyMember[] = data?.members ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = useMemo(
    () => Math.ceil(total / limit) || 1,
    [total, limit],
  );

  const handleConfirmHamper = () => {
    if (!hamperModal) return;
    markHamperMutation.mutate(hamperModal._id, {
      onSettled: () => setHamperModal(null),
    });
  };

  const columns: Column<LoyaltyMember>[] = [
    {
      key: "customer",
      label: "Customer",
      render: (_, row) => {
        const customer = row?.customer;
        if (!customer) {
          return (
            <span className="text-gray-400 italic">Deleted / Unknown User</span>
          );
        }

        return (
          <Link
            href={ROUTES.CUSTOMERS.DETAIL(customer?._id)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-900 hover:text-amber-600 inline-flex items-center gap-1.5 transition-colors group">
            {customer?.fullName || "Unnamed Customer"}
            <ExternalLink
              size={13}
              className="text-gray-400 group-hover:text-amber-600 transition-colors shrink-0"
            />
          </Link>
        );
      },
    },
    {
      key: "cumulativeSpend",
      label: "Total Spent",
      render: (val: number) => {
        const amount = typeof val === "number" ? val : 0;
        return (
          <div className="font-semibold text-gray-900">{formatYen(amount)}</div>
        );
      },
    },
    {
      key: "qualifiedAt",
      label: "VIP Since",
      render: (val) => {
        if (!val) return <span className="text-gray-400">—</span>;
        return (
          <div className="flex items-center gap-1.5 text-xs text-gray-700">
            <Calendar size={14} className="text-gray-400" />
            <span>{dateUtils.format(val)}</span>
          </div>
        );
      },
    },
    {
      key: "freeDeliveriesRemaining",
      label: "Free Deliveries (Perks)",
      render: (val: number, row) => {
        const remaining = typeof val === "number" ? val : 0;
        const totalPerYear = 4;
        const used = Math.max(0, totalPerYear - remaining);

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className={`flex items-center gap-1 px-2 py-0.5 font-medium text-xs ${
                  remaining > 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}>
                <Truck size={12} />
                {remaining} / {totalPerYear} Left
              </Badge>
              {row?.freeDeliveriesResetYear && (
                <span className="text-[11px] text-gray-400">
                  ({row?.freeDeliveriesResetYear})
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-900 font-medium">
              {used > 0 ? (
                <span>
                  Used:{" "}
                  <strong className="text-gray-900 font-semibold">
                    {used}
                  </strong>
                </span>
              ) : (
                <span>0 used this year</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "lastBirthdayDiscountYear",
      label: "Birthday 10% Perk",
      render: (val: number | null | undefined) => {
        const currentYear = new Date().getFullYear();
        const usedThisYear = val === currentYear;

        return (
          <div className="space-y-1">
            {usedThisYear ? (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 text-xs w-fit">
                <Gift size={12} />
                Used ({val})
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1 text-xs w-fit">
                <Sparkles size={12} className="text-emerald-500" />
                Available ({currentYear})
              </Badge>
            )}
            <div className="text-[11px] text-gray-900 font-medium">
              {usedThisYear ? "Annual coupon redeemed" : "1 order (¥4k - ¥10k)"}
            </div>
          </div>
        );
      },
    },
    {
      key: "hamperSent",
      label: "VIP Welcome Hamper",
      render: (val: boolean | undefined, row: LoyaltyMember) => {
        const isSent = Boolean(val);
        return (
          <div className="space-y-1">
            {isSent ? (
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1 text-xs w-fit font-medium">
                <CheckCircle2 size={12} className="text-purple-600" />
                Hamper Dispatched
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 text-xs w-fit font-medium">
                <Clock size={12} className="text-amber-600" />
                Pending Dispatch
              </Badge>
            )}
            <div className="text-[11px] text-gray-900 font-medium">
              {isSent && row?.hamperSentAt
                ? `Sent on ${dateUtils.format(row.hamperSentAt)}`
                : isSent
                  ? "Sent with order"
                  : "Include with next order"}
            </div>
          </div>
        );
      },
    },
    {
      key: "_id",
      label: "Actions",
      width: "60px",
      render: (_, row: LoyaltyMember) => {
        const isSent = Boolean(row?.hamperSent);
        if (isSent) {
          return (
            <span className="text-xs text-gray-400 italic px-2 select-none">
              —
            </span>
          );
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 cursor-pointer">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setHamperModal(row)}
                className="cursor-pointer text-purple-700 focus:text-purple-700">
                <PackageCheck size={14} className="mr-2 text-purple-600" />
                Mark Hamper Dispatched
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        title="VIP / Loyalty Program"
        description="Monitor qualified VIP customers, qualifying milestones, delivery perks, and welcome hampers."
        showBack={false}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="text-amber-500" size={18} />
            <h2 className="text-base font-semibold text-gray-900">
              Qualified VIP Customers
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            Showing {members.length} of {total}
          </span>
        </div>

        <DataTable
          columns={columns}
          data={members}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(hamperModal)}
        title="Mark Welcome Hamper as Dispatched?"
        description={`Are you sure you want to mark the 1-time VIP Welcome Hamper as dispatched for "${hamperModal?.customer?.fullName || "this customer"}"? This action cannot be repeated.`}
        confirmLabel="Mark Dispatched"
        isLoading={markHamperMutation.isPending}
        onConfirm={handleConfirmHamper}
        onCancel={() => setHamperModal(null)}
      />
    </div>
  );
}
