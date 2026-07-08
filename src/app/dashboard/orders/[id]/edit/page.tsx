"use client";

import { useRouter } from "next/navigation";
import { useOrderEditFlow } from "@/hooks/useOrderEditFlow";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { OrderEditLeftPanel } from "../../_components/OrderEditLeftPanel";
import { OrderEditRightPanel } from "../../_components/OrderEditRightPanel";

export default function EditOrderPage() {
  const router = useRouter();
  const {
    id,
    order,
    isLoading,
    isError,
    refetch,
    items,
    couponCode,
    setCouponCode,
    selectedProduct,
    setSelectedProduct,
    validationResult,
    setValidationResult,
    validationError,
    isValidating,
    isSaving,
    handleSelectProduct,
    handleQtyChange,
    handleRemoveItem,
    handleValidate,
    handleSave,
  } = useOrderEditFlow();

  if (isLoading) return <CommonLoader />;
  if (isError) return <CommonError onRetry={refetch} />;

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <PageHeader
          title={`Edit Order — ${order?.orderId}`}
          description="Modify items, adjust quantities, change promotional coupons, and preview pricing changes."
        />
        <Button
          variant="outline"
          onClick={() => router.push(ROUTES.ORDERS.DETAIL(id))}
          className="h-10 rounded-xl font-bold border-gray-200 text-gray-600 hover:text-gray-900 cursor-pointer flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Order
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Search & Items list */}
        <OrderEditLeftPanel
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          handleSelectProduct={handleSelectProduct}
          items={items}
          handleQtyChange={handleQtyChange}
          handleRemoveItem={handleRemoveItem}
        />

        {/* Right: Sidebar calculation & controls */}
        <OrderEditRightPanel
          order={order}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          setValidationResult={setValidationResult}
          validationResult={validationResult}
          validationError={validationError}
          isValidating={isValidating}
          isSaving={isSaving}
          handleValidate={handleValidate}
          handleSave={handleSave}
          itemsLength={items?.length || 0}
        />
      </div>
    </div>
  );
}
