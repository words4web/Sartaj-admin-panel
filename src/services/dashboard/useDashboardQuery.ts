import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "./dashboard.api";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

export function useDashboardQuery() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardService.getStats,
  });
}
