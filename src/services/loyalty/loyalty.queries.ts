import { useQuery } from "@tanstack/react-query";
import { loyaltyApi } from "./loyalty.api";
import { LoyaltyMembersQueryParams } from "@/types/loyalty/loyalty.types";

export const LOYALTY_KEYS = {
  all: ["loyalty"] as const,
  members: (params?: LoyaltyMembersQueryParams) =>
    [...LOYALTY_KEYS.all, "members", params] as const,
  customer: (customerId: string) =>
    [...LOYALTY_KEYS.all, "customer", customerId] as const,
};

export function useLoyaltyMembers(params?: LoyaltyMembersQueryParams) {
  return useQuery({
    queryKey: LOYALTY_KEYS.members(params),
    queryFn: () => loyaltyApi.getMembers(params),
    staleTime: 1000 * 60 * 60,
  });
}

export function useCustomerLoyalty(customerId: string) {
  return useQuery({
    queryKey: LOYALTY_KEYS.customer(customerId),
    queryFn: () => loyaltyApi.getCustomerLoyalty(customerId),
    enabled: !!customerId,
  });
}
