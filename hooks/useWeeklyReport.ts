import { getWeeklyReport } from "@/utils/api/reportApi";
import { useQuery } from "@tanstack/react-query";

export function useWeeklyReport(weekStart: string) {
  return useQuery({
    queryKey: ["weeklyReport", weekStart],
    queryFn: () => getWeeklyReport(weekStart),
  });
}
