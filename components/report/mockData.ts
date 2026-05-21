import { DayNutrition, MealRecord } from "./types";

export const MOCK_MEALS: Record<string, MealRecord[]> = {
  "2026-05-03": [
    { id: "1", name: "메뉴메뉴", calories: 450, carbs: 50, protein: 80, fat: 30, sodium: 30, sugar: 30, mealType: "아침", image: "https://via.placeholder.com/60" },
    { id: "2", name: "메뉴메뉴", calories: 450, carbs: 50, protein: 80, fat: 30, sodium: 30, sugar: 30, mealType: "아침", image: "https://via.placeholder.com/60" },
    { id: "3", name: "메뉴메뉴몇글자들어갈", calories: 1450, carbs: 50, protein: 80, fat: 30, sodium: 30, sugar: 30, mealType: "아침" },
  ],
  "2026-05-09": [
    { id: "4", name: "비빔밥", calories: 560, carbs: 80, protein: 20, fat: 10, sodium: 500, sugar: 5, mealType: "점심", image: "https://via.placeholder.com/60" },
  ],
  "2026-05-13": [
    { id: "5", name: "삼겹살", calories: 720, carbs: 10, protein: 40, fat: 55, sodium: 800, sugar: 2, mealType: "저녁", image: "https://via.placeholder.com/60" },
  ],
};

export const MOCK_NUTRITION: Record<string, DayNutrition> = {
  "2026-05-03": { calories: 1600, maxCalories: 2000, carbs: 89, maxCarbs: 120, protein: 89, maxProtein: 120, fat: 89, maxFat: 120 },
  "2026-05-09": { calories: 560, maxCalories: 2000, carbs: 80, maxCarbs: 120, protein: 20, maxProtein: 120, fat: 10, maxFat: 120 },
  "2026-05-13": { calories: 720, maxCalories: 2000, carbs: 10, maxCarbs: 120, protein: 40, maxProtein: 120, fat: 55, maxFat: 120 },
};
