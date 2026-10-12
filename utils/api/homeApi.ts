import { tokenStore } from "@/utils/store/tokenStore";
import type {
  ExerciseRecommend,
  FoodRecommend,
  HomeFeedback,
  HomeData,
  HomeReminder,
  MemberInfo,
  RecommendationsData,
} from "@/utils/types/home";

export type {
  ExerciseRecommend,
  FoodRecommend,
  HomeFeedback,
  HomeData,
  HomeReminder,
  MemberInfo,
  RecommendationsData,
};

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL)
  throw new Error("EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");

export async function fetchHome(signal?: AbortSignal): Promise<HomeData> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/home`, {
    signal,
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = {};
  }
  if (!res.ok) {
    throw new Error(
      (body as { message?: string }).message ?? "홈 정보 조회에 실패했습니다.",
    );
  }

  return body as HomeData;
}

export async function fetchRecommendations(
  signal?: AbortSignal,
): Promise<RecommendationsData> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/meals/recommendations`, {
    method: "POST",
    signal,
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
    throw new Error(json.message ?? "추천 정보 조회에 실패했습니다.");

  if (!json.data) throw new Error("추천 정보 응답 데이터가 없습니다.");
  return json.data as RecommendationsData;
}
