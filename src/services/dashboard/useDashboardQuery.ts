import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "./dashboard.api";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: (params?: { from?: string; to?: string }) =>
    [...dashboardKeys.all, "stats", params] as const,
};

export function useDashboardQuery(dateRange?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: dashboardKeys.stats(dateRange),
    queryFn: () => dashboardService.getStats(dateRange),
  });
}
