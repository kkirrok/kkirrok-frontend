type NutrientFeedback = {
  nutrient: string;
  avgAmount: number;
  unit: string;
  status: "UNDER" | "NORMAL" | "OVER" | "GOOD";
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

// 주의: 서버 실제 응답은 camelCase. Swagger에는 snake_case로 표기되어 있지만 실제와 다름
// (snake_case로 바꿨다가 화면이 깨져 되돌린 이력 있음, 2026-10-13 실기기 확인)
export interface WeeklyReportResponse {
  code: string;
  status: number;
  message: string;
  data: {
    avgDailyKcal: number;
    totalWeeklyKcal: number;
    dailyKcals: Record<DayOfWeek, number>;
    kcalFeedback: string;
    kcalStatus: "UNDER" | "NORMAL" | "OVER";
    nutrientFeedbacks: NutrientFeedback[];
    slotCounts: Record<string, number>;
    mealPatternDescription: string;
    nextWeekSuggestions: Suggestion[];
  };
}
