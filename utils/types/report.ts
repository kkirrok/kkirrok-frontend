type NutrientFeedback = {
  nutrient: string;
  avgAmount: number;
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
    avgDailyKcal: number;
    totalWeeklyKcal: number;

    dailyKcals: Record<DayOfWeek,number>;

    kcalFeedback: string;
    kcalStatus: "UNDER" | "NORMAL" | "OVER";

    nutrientFeedbacks: NutrientFeedback[];

    slotCounts: Record<string, number>;

    mealPatternDescription: string;

    nextWeekSuggestions: Suggestion[];
  };
}