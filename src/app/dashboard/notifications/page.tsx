"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Package, Info } from "lucide-react";
import {
  useNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "@/services/notification/useNotificationQueries";
import { cn } from "@/utils/common.utils";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { Pagination } from "@/components/common/Pagination";

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError, error, refetch } = useNotificationsQuery({
    page,
    limit,
  });
  const { mutate: markAsRead, isPending: isMarkingRead } =
    useMarkNotificationAsReadMutation();
  const { mutate: markAllAsRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsAsReadMutation();

  const notifications = data?.data || [];
  const meta = data?.meta;

  const getNotificationIcon = (type: string) => {
    if (type?.includes("ORDER"))
      return <Package className="w-5 h-5 text-blue-500" />;
    return <Info className="w-5 h-5 text-gray-500" />;
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification?._id);
    }

    if (notification?.metadata?.orderId) {
      router.push(ROUTES.ORDERS.DETAIL(notification?.metadata?.orderId));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">
              Stay updated with your latest alerts
            </p>
          </div>
        </div>

        <button
          onClick={() => markAllAsRead()}
          disabled={isMarkingAllRead || notifications?.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <CommonLoader
              fullScreen={false}
              message="Loading notifications..."
            />
          </div>
        ) : isError ? (
          <div className="p-8">
            <CommonError
              fullScreen={false}
              message={
                (error as any)?.message || "Failed to load notifications"
              }
              onRetry={refetch}
            />
          </div>
        ) : notifications?.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No notifications
            </h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications?.map((notification: any) => (
              <div
                key={notification?._id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "p-4 sm:p-5 transition-colors cursor-pointer hover:bg-gray-50 flex items-start gap-4",
                  !notification?.isRead ? "bg-blue-50/40" : "bg-white",
                )}>
                <div
                  className={cn(
                    "p-2 rounded-full shrink-0",
                    !notification?.isRead ? "bg-blue-100" : "bg-gray-100",
                  )}>
                  {getNotificationIcon(notification?.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p
                      className={cn(
                        "text-sm font-semibold truncate",
                        !notification?.isRead
                          ? "text-gray-900"
                          : "text-gray-700",
                      )}>
                      {notification?.title}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                      {formatDistanceToNow(new Date(notification?.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-sm line-clamp-2",
                      !notification?.isRead ? "text-gray-700" : "text-gray-500",
                    )}>
                    {notification?.body}
                  </p>
                </div>

                {!notification?.isRead && (
                  <div className="shrink-0 w-2 h-2 mt-2 bg-blue-600 rounded-full" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta?.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <Pagination
              currentPage={page}
              totalPages={meta?.totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
