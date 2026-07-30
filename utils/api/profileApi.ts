import { tokenStore } from "@/utils/store/tokenStore";
import { UserProfile } from "@/utils/types/profile";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");
}

async function getRequiredToken(): Promise<string> {
  const token = await tokenStore.get();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");
  }

  return token;
}

export async function getProfile(): Promise<UserProfile> {
  const token = await getRequiredToken();

  const res = await fetch(`${BASE_URL}/v1/users/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message ?? "프로필 조회에 실패했습니다.");
  }

  return json;
}
