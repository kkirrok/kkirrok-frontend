import {
  deleteMeal,
  fetchTodayMeals,
  fetchYesterdayPicks,
} from "@/utils/api/mealApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTodayMealsQuery() {
  return useQuery({ queryKey: ["todayMeals"], queryFn: fetchTodayMeals });
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
