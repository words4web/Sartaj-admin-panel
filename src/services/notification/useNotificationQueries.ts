import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "./notification.api";
import { useNotificationStore } from "@/stores/notificationStore";
import { toast } from "sonner";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params: { page: number; limit: number }) =>
    [...notificationKeys.lists(), params] as const,
};

export function useNotificationsQuery(params: { page: number; limit: number }) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: async () => {
      const response = await notificationService.getNotifications(params);
      return response;
    },
  });
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();
  const decrementUnreadCount = useNotificationStore(
    (state) => state.decrementUnreadCount,
  );

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      decrementUnreadCount();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to mark notification as read");
    },
  });
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to mark all as read");
    },
  });
}
