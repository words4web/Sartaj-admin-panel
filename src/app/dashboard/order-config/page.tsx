"use client";

import { PageHeader } from "@/components/common/PageHeader";
import OrderSettings from "./_components/OrderSettings";

export default function OrderConfigPage() {
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Order & Shipping Configuration"
        description="Manage minimum order values, delivery fees, and special delivery zones."
      />
      <OrderSettings />
    </div>
  );
}
