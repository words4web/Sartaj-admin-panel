importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

firebase.initializeApp({
  apiKey: "AIzaSyDcIbh40fb0s0No1gt-K0zlcTnfpNy8gMA",
  authDomain: "sartaj-food-booking-app.firebaseapp.com",
  projectId: "sartaj-food-booking-app",
  storageBucket: "sartaj-food-booking-app.firebasestorage.app",
  messagingSenderId: "625924457356",
  appId: "1:625924457356:web:5b5757ed68f0a65f25cca9",
});

const messaging = firebase.messaging();

const FCM_EVENT_TYPES = {
  NEW_ORDER: "NEW_ORDER",
  ORDER_PLACED: "ORDER_PLACED",
  ORDER_CONFIRMED: "ORDER_CONFIRMED",
  ORDER_PROCESSING: "ORDER_PROCESSING",
  ORDER_SHIPPED: "ORDER_SHIPPED",
  ORDER_DELIVERED: "ORDER_DELIVERED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
};

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  if (!payload.notification && payload.data) {
    const title = payload.data.title || "Sartaj Admin Update";
    const body = payload.data.body || "You have a new update in the dashboard.";

    const notificationOptions = {
      body,
      icon: "/sartaj_logo.svg",
      badge: "/sartaj_logo.svg",
      // image: payload.data.image || "/sartaj_logo.svg",
      color: "#2563eb",
      data: payload.data,
      vibrate: [200, 100, 200],
      requireInteraction: true,
      timestamp: Date.now(),
      tag: payload.data.orderId || payload.data.type || "admin-general",
      renotify: true,
      actions: [
        {
          action: "view",
          title: "View Details",
        },
      ],
    };

    self.registration.showNotification(title, notificationOptions);
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const data = event.notification.data || {};
  let targetPath = data.url || "/";

  // If we have an orderId but no specific URL, direct to order detail
  if (!data.url && data.orderId) {
    targetPath = `/dashboard/orders/${data.orderId}`;
  } else if (!data.url && data.type?.includes("PROFILE")) {
    targetPath = "/dashboard/settings/profile";
  } else if (!data.url) {
    // Fallback to notifications list
    targetPath = "/dashboard/notifications";
  }

  const targetUrl = new URL(targetPath, self.location.origin);

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Try to find an existing window with this path
        for (const client of clientList) {
          try {
            const clientUrl = new URL(client.url);
            if (clientUrl.pathname === targetPath && "focus" in client) {
              return client.focus();
            }
          } catch (urlErr) {
            console.error("Failed to parse client URL:", urlErr);
          }
        }

        // If no existing window, or if it's a different path, open new or navigate
        if (clients.openWindow) {
          return clients.openWindow(targetUrl.href);
        }
      })
      .catch((err) => {
        console.error("Notification click handler failed:", err);
      }),
  );
});
