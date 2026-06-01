"use client";
import { User, Truck, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { resolveCustomerName } from "../../../../utils/order.utils";
import { getPrefectureName } from "@/constants/prefectures";
import { CustomerInfoCardProps } from "@/types/order/order.types";

export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
  const customer = order?.customer;
  const customerName = resolveCustomerName(order);
  const address = customer?.addresses?.find(
    (address) => address._id === order?.shippingAddress?.addressId,
  );

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col transition-all hover:shadow-md h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Customer Details</h3>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-900">Name</p>
            <p className="text-sm font-semibold text-gray-900">
              {customerName}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Phone</p>
            <p className="text-sm font-medium text-black">
              {customer?.mobileNumber || "—"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Shipping Address
          </p>
          {address ? (
            <div
              key={address?._id}
              className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-gray-900">{address?.fullName}</p>
              </div>

              <div className="mt-2 text-sm text-black space-y-1">
                <div>
                  <span className="text-black">Postal : </span>
                  {address?.postalCode}
                </div>
                <div>
                  <span className="text-black">Prefecture : </span>
                  {getPrefectureName(address?.prefecture)}
                </div>
                <div>
                  <span className="text-black">City : </span>
                  {address?.city}
                </div>
                <div>
                  <span className="text-black">Street : </span>
                  {address?.streetAddress}
                </div>
                {address?.building && (
                  <div>
                    <span className="text-black">Building : </span>
                    {address?.building}
                  </div>
                )}
                <div>
                  <span className="text-black">Phone : </span>
                  {address?.phone}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-900 italic">
              No shipping address found
            </p>
          )}
        </div>
      </div>

      <div className="mt-2 border-gray-100">
        <Link
          href={
            customer?._id
              ? ROUTES.CUSTOMERS.DETAIL(customer?._id)
              : ROUTES.CUSTOMERS.LIST
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-primary hover:opacity-80 flex items-center gap-1">
          View Full Profile <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
