import type { NutritionSummary } from "./meal";

export type MemberInfo = {
  meal_style: string;
  meal_style_label: string;
  nickname: string;
};

export type HomeReminder = {
  is_time_to_kkirok: boolean;
  title: string;
  description: string;
};

export type HomeFeedback = {
  kcal_status: string;
  title: string;
  comment: string;
};

export type HomeData = {
  member_info: MemberInfo | null;
  reminder: HomeReminder | null;
  nutrition: NutritionSummary | null;
  feedback: HomeFeedback | null;
};

export type ExerciseRecommend = {
  exercise_name: string;
  description: string;
  category: string;
  emoji: string;
};

export type FoodRecommend = {
  food_name: string;
  description: string;
  target_nutrient_type: string;
  emoji: string;
};

export type RecommendationsData = {
  target_exercise_kcal: number;
  exercise_recommend: ExerciseRecommend[];
  remaining_food_kcal: number;
  food_recommend: FoodRecommend[];
};
