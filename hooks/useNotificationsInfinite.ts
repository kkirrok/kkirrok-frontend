import { fetchNotifications } from "@/utils/api/notificationApi";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 20;

export function useNotificationsInfinite() {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => fetchNotifications(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page_info.has_next ? lastPage.page_info.page + 1 : undefined,
  });
}
