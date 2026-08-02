import { tokenStore } from "@/utils/store/tokenStore";
import type {
  NotificationItem,
  NotificationListData,
} from "@/utils/types/notification";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL)
  throw new Error("EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");

async function authFetch(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  const token = await tokenStore.get();
  if (!token) throw new Error("인증 토큰이 없습니다. 다시 로그인해 주세요.");
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      accept: "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
}

export async function registerDeviceToken(
  deviceToken: string,
  platform: "IOS" | "ANDROID",
): Promise<void> {
  const res = await authFetch("/v1/notifications/devices", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ token: deviceToken, platform }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      (json as { message?: string }).message ??
        "디바이스 토큰 등록에 실패했습니다.",
    );
}

export async function unregisterDeviceToken(
  deviceToken: string,
): Promise<void> {
  const res = await authFetch("/v1/notifications/devices", {
    method: "DELETE",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ token: deviceToken }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      (json as { message?: string }).message ??
        "디바이스 토큰 해제에 실패했습니다.",
    );
}

export async function fetchNotifications(
  page = 0,
  size = 20,
  signal?: AbortSignal,
): Promise<NotificationListData> {
  const res = await authFetch(
    `/v1/notifications?page=${page}&size=${size}`,
    { signal },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "알림 조회에 실패했습니다.");
  return json.data as NotificationListData;
}

export async function fetchUnreadCount(signal?: AbortSignal): Promise<number> {
  const res = await authFetch("/v1/notifications/unread-count", { signal });
  const json = await res.json();
  if (!res.ok)
    throw new Error(json.message ?? "읽지 않은 알림 수 조회에 실패했습니다.");
  return ((json.data as { unread_count?: number })?.unread_count ?? 0);
}

export async function markNotificationRead(
  notificationId: number,
): Promise<void> {
  const res = await authFetch(`/v1/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      (json as { message?: string }).message ?? "알림 읽음 처리에 실패했습니다.",
    );
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await authFetch("/v1/notifications/read-all", {
    method: "PATCH",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      (json as { message?: string }).message ?? "전체 읽음 처리에 실패했습니다.",
    );
}

export type NotificationAgreeType =
  | "KKIROK"
  | "GROUP_JOIN_AND_QUIT"
  | "KKINIPOP"
  | "REACTION";

export type NotificationAgree = {
  type: NotificationAgreeType;
  is_agree: boolean;
};

export type NotificationSettings = {
  is_all: boolean;
  agrees: NotificationAgree[];
};

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  is_all: false,
  agrees: [
    { type: "KKIROK", is_agree: false },
    { type: "KKINIPOP", is_agree: false },
    { type: "GROUP_JOIN_AND_QUIT", is_agree: false },
    { type: "REACTION", is_agree: false },
  ],
};

export async function fetchNotificationSettings(
  signal?: AbortSignal,
): Promise<NotificationSettings> {
  const res = await authFetch("/v1/users/notifications", { signal });
  const json = await res.json();
  if (res.status === 404) return DEFAULT_NOTIFICATION_SETTINGS;
  if (!res.ok)
    throw new Error(json.message ?? "알림 설정 조회에 실패했습니다.");
  return json.data as NotificationSettings;
}

export async function updateNotificationSettings(
  isAll: boolean,
  agrees: NotificationAgree[],
): Promise<NotificationSettings> {
  const res = await authFetch("/v1/users/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ is_all: isAll, agrees }),
  });
  const json = await res.json();
  if (!res.ok)
    throw new Error(json.message ?? "알림 설정 변경에 실패했습니다.");
  return json.data as NotificationSettings;
}

export type { NotificationItem };
