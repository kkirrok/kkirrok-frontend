import { fetchHome, fetchRecommendations } from "@/utils/api/homeApi";
import { fetchTodayMeals } from "@/utils/api/mealApi";
import { useQuery } from "@tanstack/react-query";

export function useHomeData() {
  return useQuery({ queryKey: ["home"], queryFn: ({ signal }) => fetchHome(signal) });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: ({ signal }) => fetchRecommendations(signal),
  });
}

export function useTodayMeals() {
  return useQuery({ queryKey: ["todayMeals"], queryFn: () => fetchTodayMeals() });
}
