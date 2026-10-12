import { fetchUnreadCount } from "@/utils/api/notificationApi";
import { useQuery } from "@tanstack/react-query";

export const UNREAD_NOTIFICATION_COUNT_KEY = ["unreadNotificationCount"];

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: UNREAD_NOTIFICATION_COUNT_KEY,
    queryFn: ({ signal }) => fetchUnreadCount(signal),
    // 화면 포커스마다 중복 조회하지 않도록 짧은 시간 동안은 최신 값으로 간주
    staleTime: 10 * 1000,
  });
}
