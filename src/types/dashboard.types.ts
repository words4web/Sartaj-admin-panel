export interface DashboardStats {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
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
    createdAt: string;
    customerName: string;
  }[];
}
