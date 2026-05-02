"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useFcmLifecycle } from "@/hooks/useFcmLifecycle";
import NotificationListener from "./NotificationListener";

export function AuthLoader({ children }: { children: React.ReactNode }) {
  const { getProfile, token, user, _hasHydrated } = useAuthStore();
  const initialized = useRef(false);

  useFcmLifecycle(user);

  useEffect(() => {
    if (_hasHydrated && token && !initialized.current) {
      initialized.current = true;
      getProfile();
    }
  }, [_hasHydrated, token, getProfile]);

  return (
    <>
      <NotificationListener />
      {children}
    </>
  );
}
