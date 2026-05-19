export type MealType = "아침" | "점심" | "저녁" | "간식";

export type MealRecord = {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sodium: number;
  sugar: number;
  mealType: MealType;
  image?: string;
};

export type DayNutrition = {
  calories: number;
  maxCalories: number;
  carbs: number;
  maxCarbs: number;
  protein: number;
  maxProtein: number;
  fat: number;
  maxFat: number;
};
