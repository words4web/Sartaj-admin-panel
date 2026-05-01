import { useMutation } from "@tanstack/react-query";
import { deviceApi } from "./device.api";

export const useSyncDeviceMutation = () => {
  return useMutation({
    mutationFn: deviceApi.syncToken,
  });
};

export const useRemoveDeviceMutation = () => {
  return useMutation({
    mutationFn: deviceApi.removeToken,
  });
};
