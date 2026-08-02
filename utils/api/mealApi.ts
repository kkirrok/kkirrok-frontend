import { tokenStore } from "@/utils/store/tokenStore";
import type {
  ConfirmScanParams,
  FoodSearchResult,
  MealTimeSlot,
  MealType,
  NutritionSummary,
  RecordMealManualParams,
  ScanMealResult,
  TodayMealRecord,
  UpdateMealParams,
  YesterdayPicksResult,
} from "@/utils/types/meal";

export type {
  ConfirmScanParams,
  FoodSearchResult,
  NutritionSummary,
  RecordMealManualParams,
  ScanMealResult,
  TodayMealRecord,
  UpdateMealParams,
  YesterdayPicksResult,
};

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL)
  throw new Error("EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");

const MEAL_TIME_SLOT_MAP: Record<MealType, MealTimeSlot> = {
  아침: "BREAKFAST",
  점심: "LUNCH",
  저녁: "DINNER",
  간식: "SNACK",
  야식: "MIDNIGHT_SNACK",
};

export const MEAL_TIME_SLOT_TO_TYPE: Record<MealTimeSlot, MealType> = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
  SNACK: "간식",
  MIDNIGHT_SNACK: "야식",
};

export async function scanMeal(
  imageUri: string,
  scanType: "CAMERA" | "IMAGE" | "DIRECT" = "CAMERA",
): Promise<ScanMealResult> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "meal.jpg",
  } as any);

  const res = await fetch(`${BASE_URL}/v1/meals/scan?scanType=${scanType}`, {
    method: "POST",
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  let json: { message?: string; data?: unknown } = {};
  try {
    json = await res.json();
  } catch {}
  if (!res.ok) throw new Error(json.message ?? "음식 스캔에 실패했습니다.");

  return json.data as ScanMealResult;
}

export async function confirmScanMeal(
  params: ConfirmScanParams,
): Promise<TodayMealRecord> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/meals/scan/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      image_key: params.imageKey,
      scan_type: params.scanType,
      meal_time_slot: MEAL_TIME_SLOT_MAP[params.mealType],
      category: "MEAL",
      food_name: params.foodName,
      kcal: params.kcal,
      carbohydrate_g: params.carbohydrateG,
      protein_g: params.proteinG,
      fat_g: params.fatG,
      sugar_g: params.sugarG,
      sodium_mg: params.sodiumMg,
      memo: params.memo ?? null,
    }),
  });

  let json: { message?: string; data?: unknown } = {};
  try {
    json = await res.json();
  } catch {}
  if (!res.ok) throw new Error(json.message ?? "식단 기록에 실패했습니다.");

  return json.data as TodayMealRecord;
}

export async function fetchTodayNutritionSummary(): Promise<NutritionSummary> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/meals/nutrition/summary/today`, {
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  let json: { message?: string; data?: unknown } = {};
  try {
    json = await res.json();
  } catch {}
  if (!res.ok)
    throw new Error(json.message ?? "영양성분 요약 조회에 실패했습니다.");

  return json.data as NutritionSummary;
}

export async function searchFoods(
  keyword: string,
): Promise<FoodSearchResult[]> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(
    `${BASE_URL}/v1/meals/foods/search?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: {
        accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  let json: { message?: string; data?: unknown } = {};
  try {
    json = await res.json();
  } catch {}
  if (!res.ok) throw new Error(json.message ?? "음식 검색에 실패했습니다.");

  return json.data as FoodSearchResult[];
}

export async function fetchYesterdayPicks(): Promise<YesterdayPicksResult> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/meals/community/yesterday-picks`, {
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  let json: { message?: string; data?: unknown } = {};
  try {
    json = await res.json();
  } catch {}
  if (!res.ok) throw new Error(json.message ?? "어제 픽 조회에 실패했습니다.");

  return json.data as YesterdayPicksResult;
}

export async function fetchTodayMeals(): Promise<TodayMealRecord[]> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/meals`, {
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  let json: { message?: string; data?: unknown } = {};
  try {
    json = await res.json();
  } catch {}
  if (!res.ok)
    throw new Error(json.message ?? "식사 기록 조회에 실패했습니다.");

  return json.data as TodayMealRecord[];
}

export async function updateMeal(
  params: UpdateMealParams,
): Promise<TodayMealRecord> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/meals/${params.mealId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      meal_time_slot: MEAL_TIME_SLOT_MAP[params.mealType],
      category: "MEAL",
      food_name: params.foodName,
      kcal: params.kcal,
      carbohydrate_g: params.carbohydrateG,
      protein_g: params.proteinG,
      fat_g: params.fatG,
      sugar_g: params.sugarG,
      sodium_mg: params.sodiumMg,
      memo: params.memo ?? null,
    }),
  });

  let json: { message?: string; data?: unknown } = {};
  try {
    json = await res.json();
  } catch {}
  if (!res.ok) throw new Error(json.message ?? "식단 수정에 실패했습니다.");

  return json.data as TodayMealRecord;
}

export async function deleteMeal(mealId: number): Promise<void> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/meals/${mealId}`, {
    method: "DELETE",
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  let json: { message?: string } = {};
  try {
    json = await res.json();
  } catch {}
  if (!res.ok) throw new Error(json.message ?? "식단 삭제에 실패했습니다.");
}

export async function recordMealManual(
  params: RecordMealManualParams,
): Promise<void> {
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
  try {
    json = await res.json();
  } catch {}
  if (!res.ok) throw new Error(json.message ?? "식단 기록에 실패했습니다.");
}
