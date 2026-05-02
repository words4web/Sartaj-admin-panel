"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { onForegroundMessage } from "@/lib/firebase";
import { toast } from "sonner";
import { orderKeys } from "@/services/order/order.queries";
import { FCM_EVENT_TYPES } from "@/lib/constants";
import { useNotificationStore } from "@/stores/notificationStore";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function NotificationListener() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const incrementUnread = useNotificationStore(
    (state) => state.incrementUnreadCount,
  );

  useEffect(() => {
    // 1. Audio Unlocker
    const unlockAudio = () => {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          window.removeEventListener("click", unlockAudio);
        })
        .catch(() => {});
    };
    window.addEventListener("click", unlockAudio);

    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      const unsub = await onForegroundMessage((payload) => {
        console.log("Foreground message received:", payload);

        const data = payload.data || {};
        const title = data?.title;
        const body = data?.body;
        const type = data?.type;
        const orderId = data?.orderId;

        if (title) {
          toast.info(title, {
            description: body,
            duration: 5000,
            action: orderId
              ? {
                  label: "View Details",
                  onClick: () => router.push(ROUTES.ORDERS.DETAIL(orderId)),
                }
              : undefined,
          });

          const audio = new Audio("/notification.mp3");
          audio.volume = 1.0;
          audio.play().catch((e) => console.warn("Sound blocked by browser:"));
        }

        incrementUnread();

        const orderEvents: string[] = [
          FCM_EVENT_TYPES.NEW_ORDER,
          FCM_EVENT_TYPES.ORDER_PLACED,
          FCM_EVENT_TYPES.ORDER_CONFIRMED,
          FCM_EVENT_TYPES.ORDER_PROCESSING,
          FCM_EVENT_TYPES.ORDER_SHIPPED,
          FCM_EVENT_TYPES.ORDER_DELIVERED,
          FCM_EVENT_TYPES.ORDER_CANCELLED,
          FCM_EVENT_TYPES.ORDER_CANCELLED_ADMIN,
        ];

        if (type && orderEvents.includes(type)) {
          // Invalidate all order-related data
          queryClient.invalidateQueries({ queryKey: orderKeys.all });
          // Invalidate dashboard stats as they depend on orders
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          // Invalidate products as stock levels might have changed
          queryClient.invalidateQueries({ queryKey: ["products"] });
        }
      });

      if (typeof unsub === "function") {
        unsubscribe = unsub;
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [queryClient, incrementUnread, router]);

  return null;
}
