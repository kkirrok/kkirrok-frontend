import { fetchUnreadCount } from "@/utils/api/notificationApi";
import { useQuery } from "@tanstack/react-query";

export const UNREAD_NOTIFICATION_COUNT_KEY = ["unreadNotificationCount"];

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: UNREAD_NOTIFICATION_COUNT_KEY,
    queryFn: ({ signal }) => fetchUnreadCount(signal),
  });
}
