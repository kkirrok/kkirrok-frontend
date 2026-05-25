import { File, Paths } from "expo-file-system/next";
import { tokenStore } from "@/utils/store/tokenStore";
import { AuthResponse, SetProfileParams } from "@/utils/types/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL) throw new Error("EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");

export async function sendEmailVerification(email: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/users/email-verification/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "이메일 발송에 실패했습니다.");
}

export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/v1/users/email-verification/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ email, code }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "인증에 실패했습니다.");

  return json.data.verified;
}

export async function setProfile(params: SetProfileParams, imageUri?: string): Promise<void> {
  const token = await tokenStore.get();

  // React Native FormData doesn't serialize Blob correctly at the native layer.
  // Writing JSON to a temp file and using its URI is the reliable multipart approach in RN.
  const tempFile = new File(Paths.cache, "profile_request.json");
  await tempFile.write(JSON.stringify(params));

  const formData = new FormData();
  formData.append("request", {
    uri: tempFile.uri,
    type: "application/json",
    name: "request.json",
  } as any);

  if (imageUri) {
    formData.append("image", { uri: imageUri, type: "image/jpeg", name: "profile.jpg" } as any);
  }

  const res = await fetch(`${BASE_URL}/v1/users/profile`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "프로필 설정에 실패했습니다.");
}

export async function signUpLocal(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/v1/users/sign-up/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "회원가입에 실패했습니다.");

  return json;
}

export async function loginLocal(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/v1/users/login/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "로그인에 실패했습니다.");

  return json;
}

export async function getUserRole(): Promise<string> {
  const token = await tokenStore.get();
  const res = await fetch(`${BASE_URL}/v1/users/auth/role`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "권한 조회에 실패했습니다.");

  return json.data.role;
}

export async function signOut(): Promise<void> {
  const token = await tokenStore.get();
  const res = await fetch(`${BASE_URL}/v1/users/sign-out`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "로그아웃에 실패했습니다.");
}
