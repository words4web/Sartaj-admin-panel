import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  Order,
  OrderFilters,
  OrderListResponse,
  UpdateOrderTrackingPayload,
  UpdateOrderStatusPayload,
} from "@/types/order/order.types";

export const orderApi = {
  getOrders: async (filters?: OrderFilters): Promise<OrderListResponse> => {
    return axiosInstance.get<any, any>(API_ROUTES.ORDERS.LIST, {
      params: filters,
      _returnWrapper: true,
    } as any);
  },

  getOrderById: async (id: string): Promise<Order> => {
    return axiosInstance.get<any, Order>(API_ROUTES.ORDERS.DETAIL(id));
  },

  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusPayload,
  ): Promise<Order> => {
    return axiosInstance.patch<any, Order>(
      API_ROUTES.ORDERS.UPDATE_STATUS(id),
      data,
    );
  },

  updateOrderTracking: async (
    id: string,
    data: UpdateOrderTrackingPayload,
  ): Promise<void> => {
    return axiosInstance.patch<any, void>(
      API_ROUTES.ORDERS.UPDATE_TRACKING(id),
      data,
    );
  },
};
