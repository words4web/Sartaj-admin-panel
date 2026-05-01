"use client";

import { useEffect, useRef } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { NOTIFICATION_STATUS } from "@/lib/constants";
import { EPlatformType } from "@/enums/device.enum";
import { useDeviceStore } from "@/stores/deviceStore";
import {
  useRemoveDeviceMutation,
  useSyncDeviceMutation,
} from "@/services/deviceManager/useDeviceMutations";
import { User } from "@/types/auth/auth.types";

/**
 * Hook that manages the full FCM token lifecycle for the Admin Panel.
 *
 * - Syncs the token immediately when the user is present (on mount or user change).
 * - Re-syncs when the user returns to the tab via the Page Visibility API,
 *   which catches Firebase token rotation that may have happened in the background.
 * - Listens for permission changes via the Permissions API, automatically syncing
 *   if the user grants permission manually in their browser settings.
 */
export const useFcmLifecycle = (user: User | null) => {
  const { mutate: syncDevice } = useSyncDeviceMutation();
  const { mutate: removeDevice } = useRemoveDeviceMutation();
  const { fcmToken: lastSyncedToken, setFcmToken } = useDeviceStore();
  const isSyncing = useRef(false);

  useEffect(() => {
    if (!user) return;

    const performSync = async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        if (typeof window === "undefined") return;

        // Request permission if it hasn't been granted or denied yet
        if (Notification.permission === NOTIFICATION_STATUS.DEFAULT) {
          await Notification.requestPermission();
        }

        if (Notification.permission !== NOTIFICATION_STATUS.GRANTED) {
          // Clear token locally and on backend if permission is denied or reset
          if (lastSyncedToken) {
            removeDevice(lastSyncedToken, {
              onSettled: () => {
                setFcmToken(null);
              },
            });
          }
          return;
        }

        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        // Explicitly register the service worker to avoid race conditions
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );

        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!currentToken) return;

        // Only hit the backend if the token is new or has rotated
        if (currentToken !== lastSyncedToken) {
          syncDevice(
            { fcmToken: currentToken, platform: EPlatformType.WEB },
            {
              onSuccess: () => {
                setFcmToken(currentToken);
              },
            },
          );
        }
      } catch (err) {
        console.error("FCM Sync Error:", err);
      } finally {
        isSyncing.current = false;
      }
    };

    // 1. Sync immediately on mount
    performSync();

    // 2. Re-sync on tab focus (Visibility API)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        performSync();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 3. Listen for permission changes (Permissions API)
    let permissionStatus: PermissionStatus | undefined;
    const handlePermissionChange = () => {
      if (Notification.permission === "granted") {
        performSync();
      } else {
        if (lastSyncedToken) {
          removeDevice(lastSyncedToken, {
            onSettled: () => {
              setFcmToken(null);
            },
          });
        }
      }
    };

    const setupPermissionListener = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          permissionStatus = await navigator.permissions.query({
            name: "notifications" as PermissionName,
          });
          permissionStatus.addEventListener("change", handlePermissionChange);
        }
      } catch (err) {}
    };

    setupPermissionListener();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (permissionStatus) {
        permissionStatus.removeEventListener("change", handlePermissionChange);
      }
    };
  }, [user]); // Removed lastSyncedToken and mutation functions to prevent re-triggering loop
};
