import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appConfigService, IAppConfig } from "./appConfig.service";
import { toast } from "sonner";

export const useAppConfig = () => {
  return useQuery({
    queryKey: ["appConfig"],
    queryFn: appConfigService.getConfig,
  });
};

export const useUpdateAppConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appConfigService.updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appConfig"] });
      toast.success("Configuration updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update configuration",
      );
    },
  });
};
