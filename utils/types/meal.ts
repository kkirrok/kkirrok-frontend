export type MealType = "아침" | "점심" | "저녁" | "간식" | "야식";

export type MealTimeSlot =
  "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "MIDNIGHT_SNACK";

export type TodayMealRecord = {
  meal_id: number;
  recorded_at: string | null;
  meal_time_slot: MealTimeSlot;
  category: string;
  scan_type: string;
  food_name: string;
  kcal: number;
  carbohydrate_g: number;
  protein_g: number;
  fat_g: number;
  sugar_g: number;
  sodium_mg: number;
  carbohydrate_percent: number | null;
  protein_percent: number | null;
  fat_percent: number | null;
  memo: string | null;
};

export type NutritionSummary = {
  total_kcal: number;
  total_carbohydrate_g: number;
  total_protein_g: number;
  total_fat_g: number;
  total_sugar_g: number;
  total_sodium_mg: number;
  recommended_kcal: number;
  recommended_carbohydrate_g: number;
  recommended_protein_g: number;
  recommended_fat_g: number;
  recommended_sugar_g: number;
  recommended_sodium_mg: number;
};

export type ScanMealResult = {
  image_key: string;
  food_name: string;
  meal_time_slot: MealTimeSlot;
  kcal: number;
  carbohydrate_g: number;
  protein_g: number;
  fat_g: number;
  sugar_g: number;
  sodium_mg: number;
  scan_type: string;
};

export type ConfirmScanParams = {
  imageKey: string;
  scanType: string;
  mealType: MealType;
  foodName: string;
  kcal: number;
  carbohydrateG: number;
  proteinG: number;
  fatG: number;
  sugarG: number;
  sodiumMg: number;
  memo?: string | null;
};

export type FoodSearchResult = {
  food_name: string;
  manufacturer: string;
  kcal: number;
  carbohydrate_g: number;
  protein_g: number;
  fat_g: number;
  sugar_g: number;
  sodium_mg: number;
  source_type: string;
};

type YesterdayPick = {
  meal_id: number;
  food_name: string;
  kcal: number;
  image_url: string;
};

export type YesterdayPicksResult = {
  meal_style: string;
  meal_style_label: string;
  time_slot: string;
  picks: YesterdayPick[];
};

export type RecordMealManualParams = {
  date: string;
  mealType: MealType;
  foodName: string;
  kcal: number;
  carbohydrateG: number;
  proteinG: number;
  fatG: number;
  sugarG: number;
  sodiumMg: number;
};

export type UpdateMealParams = {
  mealId: number;
  mealType: MealType;
  foodName: string;
  kcal: number;
  carbohydrateG: number;
  proteinG: number;
  fatG: number;
  sugarG: number;
  sodiumMg: number;
  memo?: string | null;
};

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
  sugar: number;
  maxSugar: number;
  sodium: number;
  maxSodium: number;
};
