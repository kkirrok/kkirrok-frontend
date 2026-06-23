import { tokenStore } from "@/utils/store/tokenStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL) throw new Error("EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");

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

export async function fetchDailyCalendar(
  date: string,
  signal?: AbortSignal,
): Promise<DailyCalendarData> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/calendar/daily?date=${date}`, {
    signal,
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "일별 캘린더 조회에 실패했습니다.");

  return json.data as DailyCalendarData;
}

export async function fetchCalendar(
  year: number,
  month: number,
  signal?: AbortSignal,
): Promise<CalendarData> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    startDayOfWeek: "0",
  });

  const res = await fetch(`${BASE_URL}/v1/calendar?${params}`, {
    signal,
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "캘린더 조회에 실패했습니다.");

  return json.data as CalendarData;
}
