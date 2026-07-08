"use client";

import { useState } from "react";
import {
  OrderEditHistoryEntry,
  EditHistoryCardProps,
} from "@/types/order/order.types";
import { History } from "lucide-react";
import { dateUtils } from "@/utils/common.utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditHistoryItem } from "./EditHistoryItem";
import { EditHistoryItemList } from "./EditHistoryItemList";
import { EditHistoryPriceComparison } from "./EditHistoryPriceComparison";

export function EditHistoryCard({ history }: EditHistoryCardProps) {
  const [selectedEntry, setSelectedEntry] =
    useState<OrderEditHistoryEntry | null>(null);

  if (!history || history?.length === 0) return null;

  const sortedHistory = [...history]?.reverse();

  return (
    <div className="bg-white border border-gray-150 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
      <div className="mb-4 border-b border-gray-100 pb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Order Edit History
        </h3>
      </div>

      <div className="space-y-4">
        {sortedHistory?.map((entry, index) => (
          <EditHistoryItem
            key={index}
            entry={entry}
            onClick={() => setSelectedEntry(entry)}
          />
        ))}
      </div>

      {/* History Details Modal */}
      <Dialog
        open={!!selectedEntry}
        onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-[1200px] w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto p-8 text-black bg-white">
          {selectedEntry && (
            <>
              <DialogHeader className="border-b border-gray-100 pb-4">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Edit Snapshot Details
                </DialogTitle>
                <p className="text-sm text-gray-500 font-semibold mt-1">
                  Changes made on{" "}
                  {dateUtils.format(selectedEntry?.editedAt, "YYYY-MM-DD")} at{" "}
                  {dateUtils.formatTime(selectedEntry?.editedAt, "hh:mm A")}
                </p>
              </DialogHeader>

              <div className="space-y-6 py-4 text-sm">
                {/* 1. Items Comparison section */}
                <div>
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-3">
                    Items Comparison
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditHistoryItemList
                      title="Before Edit"
                      items={selectedEntry?.previousItems}
                      variant="before"
                    />
                    <EditHistoryItemList
                      title="After Edit"
                      items={selectedEntry?.newItems}
                      variant="after"
                    />
                  </div>
                </div>

                {/* 2. Price Snapshot Comparison section */}
                <div>
                  <h4 className="font-bold text-gray-400 mb-3 uppercase tracking-wider text-xs">
                    Price Breakdown Comparison
                  </h4>
                  {selectedEntry?.previousCalculationSnapshot &&
                  selectedEntry?.newCalculationSnapshot ? (
                    <EditHistoryPriceComparison
                      previousSnapshot={
                        selectedEntry.previousCalculationSnapshot
                      }
                      newSnapshot={selectedEntry.newCalculationSnapshot}
                      previousTotalAmount={selectedEntry.previousTotalAmount}
                      newTotalAmount={selectedEntry.newTotalAmount}
                    />
                  ) : (
                    <div className="p-5 border border-gray-100 bg-gray-50/50 rounded-xl text-center text-xs text-gray-450 font-medium">
                      Detailed financial breakdown snapshot is only available
                      for newer edits.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
