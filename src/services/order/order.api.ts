import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  Order,
  OrderFilters,
  OrderListResponse,
  UpdateOrderStatusPayload,
} from "@/types/order/order.types";

export const orderApi = {
  getOrders: async (filters?: OrderFilters): Promise<OrderListResponse> => {
    return axiosInstance.get<any, OrderListResponse>(API_ROUTES.ORDERS.LIST, {
      params: filters,
    });
  },

  getOrderById: async (id: string): Promise<Order> => {
    return axiosInstance.get<any, Order>(API_ROUTES.ORDERS.DETAIL(id));
  },

  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusPayload,
  ): Promise<Order> => {
    return axiosInstance.patch<any, Order>(API_ROUTES.ORDERS.UPDATE_STATUS(id), data);
  },
};
