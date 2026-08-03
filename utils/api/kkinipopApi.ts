import { tokenStore } from "@/utils/store/tokenStore";
import {
  Group,
  GroupEmoji,
  GroupEmojiList,
  GroupMember,
  Mission,
  MyKkirokStatus,
  Post,
  PostDay,
  SystemEmoji,
} from "@/utils/types/kkinipop";

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
  if (!res.ok)
    throw new Error(json.message ?? "그룹 목록 조회에 실패했습니다.");

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

  const res = await fetch(
    `${BASE_URL}/v1/kkinipop/groups/join?code=${encodeURIComponent(code)}`,
    {
      method: "POST",
      headers: {
        accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  );

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

export async function fetchGroupMembers(
  groupId: number,
  signal?: AbortSignal,
): Promise<GroupMember[]> {
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
  if (!res.ok)
    throw new Error(json.message ?? "멤버 목록 조회에 실패했습니다.");

  return json.data as GroupMember[];
}

export async function kickMember(
  groupId: number,
  memberId: number,
): Promise<void> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(
    `${BASE_URL}/v1/kkinipop/groups/${groupId}/members/${memberId}`,
    {
      method: "DELETE",
      headers: {
        accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "멤버 추방에 실패했습니다.");
}

export async function fetchPosts(
  groupId: number,
  missionId?: number,
  signal?: AbortSignal,
): Promise<PostDay[]> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const query = missionId != null ? `?missionId=${missionId}` : "";
  const res = await fetch(
    `${BASE_URL}/v1/kkinipop/groups/${groupId}/posts${query}`,
    {
      signal,
      headers: {
        accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "게시글 조회에 실패했습니다.");

  return json.data as PostDay[];
}

export async function createPost(
  groupId: number,
  imageUri: string,
  options: {
    saveToPersonalLog?: boolean;
    scanType?: "CAMERA" | "IMAGE" | "DIRECT";
  } = {},
): Promise<Post> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const { saveToPersonalLog = false, scanType = "CAMERA" } = options;

  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: "kkirok.jpg",
  } as any);
  formData.append("save_to_personal_log", String(saveToPersonalLog));

  const query = `?saveToPersonalLog=${saveToPersonalLog}&scanType=${scanType}`;
  const res = await fetch(
    `${BASE_URL}/v1/kkinipop/groups/${groupId}/posts${query}`,
    {
      method: "POST",
      headers: {
        accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "게시글 작성에 실패했습니다.");

  return json.data as Post;
}

export async function deletePost(
  groupId: number,
  postId: number,
): Promise<void> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(
    `${BASE_URL}/v1/kkinipop/groups/${groupId}/posts/${postId}`,
    {
      method: "DELETE",
      headers: {
        accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "게시글 삭제에 실패했습니다.");
}

type ReactionResult = {
  emoji_code: string;
  label: string;
  count: number;
  emoji_type: string;
  reacted: boolean;
};

export async function addReaction(
  groupId: number,
  postId: number,
  emojiCode: string,
): Promise<ReactionResult> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(
    `${BASE_URL}/v1/kkinipop/groups/${groupId}/posts/${postId}/reaction?emojiCode=${encodeURIComponent(emojiCode)}`,
    {
      method: "POST",
      headers: {
        accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "리액션에 실패했습니다.");

  return json.data as ReactionResult;
}

export async function fetchMyKkirokStatus(
  groupId: number,
  signal?: AbortSignal,
): Promise<MyKkirokStatus> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(
    `${BASE_URL}/v1/kkinipop/groups/${groupId}/posts/my-kkirok/status`,
    {
      signal,
      headers: {
        accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const json = await parseJson(res);
  if (!res.ok)
    throw new Error(json.message ?? "끼록 상태 조회에 실패했습니다.");

  return json.data as MyKkirokStatus;
}

export async function fetchGroupEmojis(
  groupId: number,
  signal?: AbortSignal,
): Promise<GroupEmojiList> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/kkinipop/groups/${groupId}/emojis`, {
    signal,
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "이모지 조회에 실패했습니다.");

  return json.data as GroupEmojiList;
}

export async function createGroupEmoji(
  groupId: number,
  imageUri: string,
): Promise<GroupEmoji> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: "kkimoji.jpg",
  } as any);

  const res = await fetch(`${BASE_URL}/v1/kkinipop/groups/${groupId}/emojis`, {
    method: "POST",
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "끼모지 생성에 실패했습니다.");

  return json.data as GroupEmoji;
}

export async function deleteGroupEmoji(
  groupId: number,
  emojiId: number,
): Promise<void> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(
    `${BASE_URL}/v1/kkinipop/groups/${groupId}/emojis/${emojiId}`,
    {
      method: "DELETE",
      headers: {
        accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "끼모지 삭제에 실패했습니다.");
}

export async function fetchSystemEmojis(
  signal?: AbortSignal,
): Promise<SystemEmoji[]> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const res = await fetch(`${BASE_URL}/v1/kkinipop/emojis/system`, {
    signal,
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await parseJson(res);
  if (!res.ok)
    throw new Error(json.message ?? "시스템 이모지 조회에 실패했습니다.");

  return json.data as SystemEmoji[];
}

export async function fetchMissions(
  groupId: number,
  date?: string,
  signal?: AbortSignal,
): Promise<Mission[]> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");

  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  const res = await fetch(
    `${BASE_URL}/v1/kkinipop/groups/${groupId}/missions${query}`,
    {
      signal,
      headers: {
        accept: "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const json = await parseJson(res);
  if (!res.ok) throw new Error(json.message ?? "미션 조회에 실패했습니다.");

  return (json.data as { missions: Mission[] }).missions;
}
