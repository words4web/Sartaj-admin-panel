"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { useCustomer } from "@/services/customer/customer.queries";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { dateUtils } from "@/utils/common.utils";
import { ROUTES } from "@/constants/routes";
import { getPrefectureName } from "@/constants/prefectures";

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: customer, isLoading, isError, refetch } = useCustomer(id);

  const superCategoryName = (() => {
    const sc: any = customer?.superCategory;
    if (!sc) return "—";
    if (typeof sc === "string") return sc;
    return sc?.name ?? "—";
  })();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Customer Details"
        description="Full profile and saved addresses"
        backRoute={ROUTES.CUSTOMERS.LIST}
        editRoute={
          customer?._id ? ROUTES.CUSTOMERS.EDIT(customer._id) : undefined
        }
      />

      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <CommonLoader fullScreen={false} />
          </div>
        ) : isError || !customer ? (
          <CommonError
            message="Failed to load customer details. Please check your connection."
            onRetry={refetch}
          />
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold">{customer?.fullName}</h2>
              <Badge variant={customer?.isActive ? "success" : "secondary"}>
                {customer?.isActive ? "Active" : "Inactive"}
              </Badge>
              {customer?.isDeleted && (
                <Badge variant="secondary">Deleted</Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{customer?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">
                  {customer?.mobileNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Super Category</p>
                <p className="font-medium text-gray-900">{superCategoryName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Addresses</p>
                <p className="font-medium text-gray-900">
                  {customer?.addresses?.length || "N/A"} saved
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Address List</h3>
              <div className="space-y-3">
                {customer?.addresses?.map((addr, idx) => (
                  <div
                    key={addr?._id || idx}
                    className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-gray-900">
                        {addr?.fullName}
                      </p>
                      <span className="text-xs text-gray-500">{idx + 1}</span>
                    </div>

                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      <div>
                        <span className="text-gray-500">Postal: </span>
                        {addr?.postalCode}
                      </div>
                      <div>
                        <span className="text-gray-500">Prefecture: </span>
                        {getPrefectureName(addr?.prefecture)}
                      </div>
                      <div>
                        <span className="text-gray-500">City: </span>
                        {addr?.city}
                      </div>
                      <div>
                        <span className="text-gray-500">Street: </span>
                        {addr?.streetAddress}
                      </div>
                      {addr?.building && (
                        <div>
                          <span className="text-gray-500">Building: </span>
                          {addr?.building}
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Phone: </span>
                        {addr?.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {customer?.createdAt
                    ? dateUtils.formatDateTime(customer?.createdAt)
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Updated</p>
                <p className="font-medium text-gray-900">
                  {customer?.updatedAt
                    ? dateUtils.formatDateTime(customer?.updatedAt)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
