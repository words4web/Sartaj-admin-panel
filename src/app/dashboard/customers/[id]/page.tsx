"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

// Mock customer data - in real app, fetch from API
const MOCK_CUSTOMER = {
  id: "1",
  name: "Rajesh Kumar",
  email: "rajesh@example.com",
  phone: "+91 9876543210",
  address: "123 Main Street",
  city: "Mumbai",
  state: "Maharashtra",
  zipCode: "400001",
  status: "active",
  createdAt: "2024-01-15",
  updatedAt: "2024-01-15",
};

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  // In real app, fetch customer based on customerId
  const customer = MOCK_CUSTOMER;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
          <p className="text-gray-600 mt-1">
            View and manage customer information
          </p>
        </div>
      </div>

      {/* Customer Info Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <p className="text-lg text-gray-900 mt-1">{customer.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <p className="text-lg text-gray-900 mt-1">{customer.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <p className="text-lg text-gray-900 mt-1">{customer.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    customer.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                  {customer.status.charAt(0).toUpperCase() +
                    customer.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <p className="text-lg text-gray-900 mt-1">{customer.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <p className="text-lg text-gray-900 mt-1">{customer.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">State</label>
              <p className="text-lg text-gray-900 mt-1">{customer.state}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <p className="text-lg text-gray-900 mt-1">{customer.zipCode}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Created Date
            </label>
            <p className="text-gray-900 mt-1">{customer.createdAt}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Last Updated
            </label>
            <p className="text-gray-900 mt-1">{customer.updatedAt}</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline">Edit Customer</Button>
        <Button
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50">
          Delete Customer
        </Button>
      </div>
    </div>
  );
}
