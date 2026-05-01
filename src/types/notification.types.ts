export interface NotificationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  userModel: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: NotificationItem[];
  meta: NotificationMeta;
}
