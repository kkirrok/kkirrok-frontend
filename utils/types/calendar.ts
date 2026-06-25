export type DayStatus = "ENERGETIC" | "NORMAL";

export type DayInfo = {
  day_of_month: number;
  status: DayStatus;
};

export type MonthInfo = {
  year: number;
  month: number;
  start_day_of_month: number;
  end_day_of_month: number;
  start_day_of_week: number;
  end_day_of_week: number;
};

export type CalendarData = {
  day_infos: DayInfo[];
  month_info: MonthInfo;
};

export type MealItem = {
  meal_id: number;
  recorded_at: string | null;
  meal_time_slot: string;
  category: string;
  scan_type: string;
  food_name: string;
  kcal: number;
  carbohydrate_g: number;
  protein_g: number;
  fat_g: number;
  sugar_g: number;
  sodium_mg: number;
  memo: string | null;
};

export type DailyCalendarData = {
  date: string;
  total_kcal: number;
  total_carbohydrate_g: number;
  total_protein_g: number;
  total_fat_g: number;
  total_sugar_g: number;
  total_sodium_mg: number;
  breakfast_meals: MealItem[];
  lunch_meals: MealItem[];
  dinner_meals: MealItem[];
  snack_meals: MealItem[];
  midnight_snack_meals: MealItem[];
};
