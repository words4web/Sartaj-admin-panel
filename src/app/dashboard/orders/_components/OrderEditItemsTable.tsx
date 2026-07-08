"use client";

import { LocalItem } from "@/types/order/order.types";
import { formatYen } from "@/utils/common.utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface OrderEditItemsTableProps {
  items: LocalItem[];
  handleQtyChange: (productId: string, quantity: number) => void;
  handleRemoveItem: (productId: string) => void;
}

export function OrderEditItemsTable({
  items,
  handleQtyChange,
  handleRemoveItem,
}: OrderEditItemsTableProps) {
  return (
    <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">
          Selected Items ({items?.length})
        </h3>
      </div>

      {items?.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-400">
          No items in the order. Search and add a product to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-4 text-center">Quantity</th>
                <th className="py-4 px-4 text-right">Unit Price</th>
                <th className="py-4 px-4 text-right">Total Price</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {items?.map((item) => (
                <tr
                  key={item?.productId}
                  className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6 max-w-[280px]">
                    <p className="font-bold text-gray-900 truncate">
                      {item?.name}
                    </p>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">
                      SKU: {item?.sku}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden h-9 w-28 mx-auto">
                      <button
                        type="button"
                        onClick={() =>
                          handleQtyChange(item?.productId, item?.quantity - 1)
                        }
                        disabled={item?.quantity <= 1}
                        className="px-2.5 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-bold h-full cursor-pointer">
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-black text-gray-900">
                        {item?.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQtyChange(item?.productId, item?.quantity + 1)
                        }
                        className="px-2.5 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-bold h-full cursor-pointer">
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">
                    {formatYen(item?.price)}
                  </td>
                  <td className="py-4 px-4 text-right font-black text-gray-900">
                    {formatYen(item?.price * item?.quantity)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={items?.length <= 1}
                      onClick={() => handleRemoveItem(item?.productId)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 w-9 rounded-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer">
                      <Trash2 className="w-4.5 h-4.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
