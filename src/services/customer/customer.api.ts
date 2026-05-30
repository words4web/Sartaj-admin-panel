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
    // Need pagination meta, so request the full backend wrapper.
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.CUSTOMERS.LIST,
      {
        params: filters,
        _returnWrapper: true,
      } as any,
    );

    return {
      data: response?.data ?? [],
      total: response?.meta?.total ?? 0,
      page: response?.meta?.page ?? 1,
      limit: response?.meta?.limit ?? 10,
    };
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    return axiosInstance.get<any, Customer>(API_ROUTES.CUSTOMERS.DETAIL(id));
  },

  createCustomer: async (data: CreateCustomerPayload): Promise<Customer> => {
    return axiosInstance.post<any, Customer>(API_ROUTES.CUSTOMERS.CREATE, data);
  },

  updateCustomer: async (
    id: string,
    data: UpdateCustomerPayload,
  ): Promise<Customer> => {
    return axiosInstance.put<any, Customer>(
      API_ROUTES.CUSTOMERS.UPDATE(id),
      data,
    );
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await axiosInstance.delete<any, void>(API_ROUTES.CUSTOMERS.DELETE(id));
  },

  toggleStatus: async (id: string): Promise<Customer> => {
    // Backend toggles internally; body is unused by controller validation.
    return axiosInstance.patch<any, Customer>(
      API_ROUTES.CUSTOMERS.TOGGLE_STATUS(id),
      {},
    );
  },

  getCustomerWallet: async (
    id: string,
    params: { page?: number; limit?: number },
  ): Promise<any> => {
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.CUSTOMERS.WALLET(id),
      { params, _returnWrapper: true } as any,
    );
    return {
      balance: response?.data?.balance ?? 0,
      transactions: response?.data?.transactions ?? [],
      meta: response?.meta ?? {},
    };
  },
};
