import { fetchDailyCalendar } from "@/utils/api/calendarApi";
import {
  deleteMeal,
  fetchTodayMeals,
  fetchYesterdayPicks,
} from "@/utils/api/mealApi";
import type { TodayMealRecord } from "@/utils/types/meal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTodayMealsQuery(enabled = true) {
  return useQuery({
    queryKey: ["todayMeals"],
    queryFn: fetchTodayMeals,
    enabled,
  });
}

export function useDailyMealsQuery(date: string, enabled = true) {
  return useQuery({
    queryKey: ["dailyCalendar", date],
    queryFn: () => fetchDailyCalendar(date),
    select: (data): TodayMealRecord[] => [
      ...data.breakfast_meals,
      ...data.lunch_meals,
      ...data.dinner_meals,
      ...data.snack_meals,
      ...data.midnight_snack_meals,
    ] as TodayMealRecord[],
    enabled: enabled && date.length > 0,
  });
}

export function useYesterdayPicks() {
  return useQuery({
    queryKey: ["yesterdayPicks"],
    queryFn: fetchYesterdayPicks,
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mealId: number) => deleteMeal(mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayMeals"] });
      queryClient.invalidateQueries({ queryKey: ["nutritionSummary"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["dailyCalendar"] });
    },
  });
}
