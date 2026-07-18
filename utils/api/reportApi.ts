import { tokenStore } from "../store/tokenStore";
import { WeeklyReportResponse } from "../types/report";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL)
  throw new Error("EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");

async function getRequiredToken(): Promise<string> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");
  return token;
}

export async function getWeeklyReport(
  weekStart: string,
): Promise<WeeklyReportResponse> {
  const token = await getRequiredToken();

  const res = await fetch(
    `${BASE_URL}/v1/reports/weekly-report?weekStart=${weekStart}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    let message = "주간 리포트 조회에 실패했습니다.";
    try {
      const json = await res.json();
      if (json.message) message = json.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}
