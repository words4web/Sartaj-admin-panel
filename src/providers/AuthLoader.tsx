"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";

export function AuthLoader({ children }: { children: React.ReactNode }) {
  const { getProfile, token, _hasHydrated } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (_hasHydrated && token && !initialized.current) {
      initialized.current = true;
      getProfile();
    }
  }, [_hasHydrated, token, getProfile]);

  return <>{children}</>;
}
