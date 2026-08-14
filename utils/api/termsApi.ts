import { tokenStore } from "@/utils/store/tokenStore";
import { TermItem } from "@/utils/types/terms";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export async function getTermsList(): Promise<TermItem[]> {
  const res = await fetch(`${BASE_URL}/v1/terms`);
  const json = await res.json();
  if (!res.ok)
    throw new Error(json.message ?? "약관 목록 조회에 실패했습니다.");
  return json.data as TermItem[];
}

export async function agreeTerms(
  agrees: { type: string; is_agree: boolean }[],
): Promise<void> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");
  const res = await fetch(`${BASE_URL}/v1/terms/agree`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ agrees }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "약관 동의에 실패했습니다.");
}
