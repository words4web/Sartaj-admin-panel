"use client";

import { useState, useEffect } from "react";
import { useCustomerStore } from "@/stores/customerStore";
import { Customer } from "@/types/customer/customer.types";
import { useCustomers } from "@/services/customerService";
import CustomerTable from "@/components/customers/CustomerTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

// Mock customer data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    country: "India",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 9876543211",
    address: "456 Park Avenue",
    city: "Delhi",
    state: "Delhi",
    zipCode: "110001",
    country: "India",
    status: "active",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit@example.com",
    phone: "+91 9876543212",
    address: "789 Business Park",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560001",
    country: "India",
    status: "inactive",
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25",
  },
];

export default function CustomersPage() {
  const { search, setSearch, page, setPage, limit } = useCustomerStore();
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(MOCK_CUSTOMERS);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter customers based on search query
  useEffect(() => {
    const query = (search || "").toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query),
    );
    setFilteredCustomers(filtered);
    setIsLoading(false);
  }, [search, customers]);

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    toast.info(`Editing ${customer.name}`);
  };

  const handleDelete = (customer: Customer) => {
    setCustomers(customers.filter((c) => c.id !== customer.id));
    toast.success(`${customer.name} deleted successfully`);
  };

  const handleAddNew = () => {
    setEditingId("new");
    toast.info("Add new customer form would open here");
  };

  const total = filteredCustomers.length;
  const safePage = page || 1;
  const safeLimit = limit || 10;
  const start = (safePage - 1) * safeLimit;
  const paginatedCustomers = filteredCustomers.slice(start, start + safeLimit);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">
            Manage all your customers in one place
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg h-10 px-4">
          <Plus size={20} />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <Input
          placeholder="Search by name or email..."
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <CustomerTable
          customers={paginatedCustomers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          page={safePage}
          limit={safeLimit}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
