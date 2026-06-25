type NutrientFeedback = {
  nutrient: string;
  avg_amount: number;
  unit: string;
  status: "UNDER" | "NORMAL" | "OVER";
  feedback: string;
};

type Suggestion = {
  title: string;
  content: string;
};

type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface WeeklyReportResponse {
  code: string;
  status: number;
  message: string;
  data: {
    avg_daily_kcal: number;
    total_weekly_kcal: number;

    daily_kcals: Record<DayOfWeek, number>;

    kcal_feedback: string;
    kcal_status: "UNDER" | "NORMAL" | "OVER";

    nutrient_feedbacks: NutrientFeedback[];

    slot_counts: Record<string, number>;

    meal_pattern_description: string;

    next_week_suggestions: Suggestion[];
  };
}