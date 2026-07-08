"use client";

import { OrderEditLeftPanelProps } from "@/types/order/order.types";
import { PaginatedDropdown } from "@/components/common/PaginatedDropdown";
import { productApi } from "@/services/product/product.api";
import { ShoppingCart } from "lucide-react";
import { OrderEditItemsTable } from "./OrderEditItemsTable";

export function OrderEditLeftPanel({
  selectedProduct,
  setSelectedProduct,
  handleSelectProduct,
  items,
  handleQtyChange,
  handleRemoveItem,
}: OrderEditLeftPanelProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Product Search Card */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" /> Search & Add
          Products
        </h3>
        <div className="w-full">
          <PaginatedDropdown
            value={selectedProduct}
            onValueChange={handleSelectProduct}
            fetchData={productApi.searchProducts}
            queryKey={["products-order-edit-search"]}
            placeholder="Search products by SKU or Name to add..."
            searchPlaceholder="Type to search catalog..."
            className="rounded-xl border-gray-200"
          />
        </div>
      </div>

      {/* Items Table Card */}
      <OrderEditItemsTable
        items={items}
        handleQtyChange={handleQtyChange}
        handleRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
