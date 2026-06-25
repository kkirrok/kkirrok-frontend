import { tokenStore } from "@/utils/store/tokenStore";
import { Group, GroupMember } from "@/utils/types/kkinipop";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL) throw new Error("EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");

async function parseJson(res: Response): Promise<{ message?: string; data?: unknown }> {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function fetchGroups(signal?: AbortSignal): Promise<Group[]> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/kkinipop/groups`, {
    signal,
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "그룹 목록 조회에 실패했습니다.");

  return json.data as Group[];
}

export async function createGroup(name: string): Promise<Group> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/kkinipop/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "그룹 생성에 실패했습니다.");

  return json.data as Group;
}

export async function joinGroup(code: string): Promise<Group> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/kkinipop/groups/join?code=${encodeURIComponent(code)}`, {
    method: "POST",
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "그룹 참여에 실패했습니다.");

  return json.data as Group;
}

export async function deleteGroup(groupId: number): Promise<void> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/kkinipop/groups/${groupId}`, {
    method: "DELETE",
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "그룹 삭제에 실패했습니다.");
}

export async function quitGroup(groupId: number): Promise<void> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/kkinipop/groups/${groupId}/quit`, {
    method: "DELETE",
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "그룹 탈퇴에 실패했습니다.");
}

export async function fetchGroupMembers(groupId: number, signal?: AbortSignal): Promise<GroupMember[]> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/kkinipop/groups/${groupId}/members`, {
    signal,
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "멤버 목록 조회에 실패했습니다.");

  return json.data as GroupMember[];
}

export async function kickMember(groupId: number, memberId: number): Promise<void> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/kkinipop/groups/${groupId}/members/${memberId}`, {
    method: "DELETE",
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "멤버 추방에 실패했습니다.");
}
