import { tokenStore } from "@/utils/store/tokenStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

async function getRequiredToken() {
  const token = await tokenStore.get();

  if (!token) {
    throw new Error("인증 토큰이 없습니다.");
  }

  return token;
}

export async function getDownloadUrl(key: string) {
  const token = await getRequiredToken();

  const res = await fetch(
    `${BASE_URL}/v1/r2/${key}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json.message ?? "다운로드 URL 조회 실패"
    );
  }

  return json.data.download_url;
}