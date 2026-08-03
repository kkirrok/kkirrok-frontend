import { tokenStore } from "@/utils/store/tokenStore";
import { CalendarData, DailyCalendarData } from "@/utils/types/calendar";

export type {
  DayStatus,
  DayInfo,
  MonthInfo,
  CalendarData,
  MealItem,
  DailyCalendarData,
} from "@/utils/types/calendar";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL)
  throw new Error("EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");

async function parseJson(
  res: Response,
): Promise<{ message?: string; data?: unknown }> {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

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

  const json = await parseJson(res);
  if (!res.ok)
    throw new Error(json.message ?? "일별 캘린더 조회에 실패했습니다.");

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

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "캘린더 조회에 실패했습니다.");

  return json.data as CalendarData;
}
