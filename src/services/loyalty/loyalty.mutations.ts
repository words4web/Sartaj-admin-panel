import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { loyaltyApi } from "./loyalty.api";
import { LOYALTY_KEYS } from "./loyalty.queries";

export function useMarkHamperSent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => loyaltyApi.markHamperSent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOYALTY_KEYS.all });
      toast.success("VIP Welcome Hamper marked as dispatched successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update welcome hamper status",
      );
    },
  });
}
