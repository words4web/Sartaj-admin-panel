export interface DashboardStats {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    processingOrders: number;
    cancelledOrders: number;
  };
  statusBreakdown: {
    _id: string;
    count: number;
  }[];
  paymentBreakdown: {
    _id: string;
    count: number;
  }[];
  recentOrders: {
    _id: string;
    orderId: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    customerName: string;
  }[];
  revenueByDay: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  topProducts: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
    orders: number;
  }[];
}
