import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  CustomerListResponse,
  CustomerFilters,
} from "@/types/customer/customer.types";

export const customerApi = {
  getCustomers: async (
    filters?: CustomerFilters,
  ): Promise<CustomerListResponse> => {
    const response = await axiosInstance.get<CustomerListResponse>(
      API_ROUTES.CUSTOMERS.LIST,
      {
        params: filters,
      },
    );
    return response.data;
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await axiosInstance.get<Customer>(
      API_ROUTES.CUSTOMERS.DETAIL(id),
    );
    return response.data;
  },

  createCustomer: async (data: CreateCustomerPayload): Promise<Customer> => {
    const response = await axiosInstance.post<Customer>(
      API_ROUTES.CUSTOMERS.CREATE,
      data,
    );
    return response.data;
  },

  updateCustomer: async (
    id: string,
    data: UpdateCustomerPayload,
  ): Promise<Customer> => {
    const response = await axiosInstance.put<Customer>(
      API_ROUTES.CUSTOMERS.UPDATE(id),
      data,
    );
    return response.data;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ROUTES.CUSTOMERS.DELETE(id));
  },

  updateStatus: async (
    id: string,
    status: Customer["status"],
  ): Promise<Customer> => {
    const response = await axiosInstance.patch<Customer>(
      API_ROUTES.CUSTOMERS.UPDATE(id),
      { status },
    );
    return response.data;
  },

  batchDelete: async (ids: string[]): Promise<void> => {
    await axiosInstance.post(
      `${API_ROUTES.CUSTOMERS.LIST.replace("/get-all-customers", "/batch-delete")}`,
      { ids },
    );
  },
};
