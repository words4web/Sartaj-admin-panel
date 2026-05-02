import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";

interface DeviceStore {
  fcmToken: string | null;
  setFcmToken: (token: string | null) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useDeviceStore = create<DeviceStore>()(
  persist(
    (set) => ({
      fcmToken: null,
      _hasHydrated: false,
      setFcmToken: (fcmToken) => set({ fcmToken }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: STORAGE_KEYS.DEVICE_STORE,
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    },
  ),
);
