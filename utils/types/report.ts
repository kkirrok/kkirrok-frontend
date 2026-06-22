type NutrientFeedback = {
  nutrient: string;
  avg_amount: number;
  unit: string;
  status: string;
  feedback: string;
};

type Suggestion = {
  title: string;
  content: string;
};

export interface WeeklyReportResponse {
  code: string;
  status: number;
  message: string;
  data: {
    avg_daily_kcal: number;
    kcal_feedback: string;
    kcal_status: "LOW" | "NORMAL" | "HIGH";
    nutrient_feedback: NutrientFeedback[];
    slot_counts: Record<
      "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK",
      number
    >;
    meal_pattern_description: string;
    next_week_suggestions: Suggestion[];
  };
}