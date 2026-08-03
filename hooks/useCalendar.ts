import { fetchCalendar, fetchDailyCalendar } from "@/utils/api/calendarApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recordMealManual, type RecordMealManualParams } from "@/utils/api/mealApi";

export function useCalendar(year: number, month: number) {
  return useQuery({
    queryKey: ["calendar", year, month],
    queryFn: () => fetchCalendar(year, month),
  });
}

export function useDailyCalendar(dateStr: string) {
  return useQuery({
    queryKey: ["dailyCalendar", dateStr],
    queryFn: () => fetchDailyCalendar(dateStr),
  });
}

export function useRecordMealManual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: RecordMealManualParams) => recordMealManual(params),
    onSuccess: (_, variables) => {
      const [year, month] = variables.date.split("-").map(Number);
      queryClient.invalidateQueries({ queryKey: ["dailyCalendar", variables.date] });
      queryClient.invalidateQueries({ queryKey: ["calendar", year, month] });
      queryClient.invalidateQueries({ queryKey: ["todayMeals"] });
      queryClient.invalidateQueries({ queryKey: ["nutritionSummary"] });
    },
  });
}
