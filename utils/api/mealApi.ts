import { tokenStore } from "@/utils/store/tokenStore";
import type { MealType } from "@/utils/types/meal";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL) throw new Error("EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");

type MealTimeSlot = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "MIDNIGHT_SNACK";

const MEAL_TIME_SLOT_MAP: Record<MealType, MealTimeSlot> = {
  아침: "BREAKFAST",
  점심: "LUNCH",
  저녁: "DINNER",
  간식: "SNACK",
  야식: "MIDNIGHT_SNACK",
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

export async function recordMealManual(params: RecordMealManualParams): Promise<void> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const now = new Date();
  const recordedAt = new Date(
    `${params.date}T${now.toTimeString().slice(0, 8)}`,
  ).toISOString();

  const res = await fetch(`${BASE_URL}/v1/meals/record/manual`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      recorded_at: recordedAt,
      meal_time_slot: MEAL_TIME_SLOT_MAP[params.mealType],
      category: "MEAL",
      food_name: params.foodName,
      kcal: params.kcal,
      carbohydrate_g: params.carbohydrateG,
      protein_g: params.proteinG,
      fat_g: params.fatG,
      sugar_g: params.sugarG,
      sodium_mg: params.sodiumMg,
      memo: null,
    }),
  });

  let json: { message?: string } = {};
  try { json = await res.json(); } catch {}
  if (!res.ok) throw new Error(json.message ?? "식단 기록에 실패했습니다.");
}
