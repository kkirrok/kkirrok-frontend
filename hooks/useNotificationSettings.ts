import {
  fetchNotificationSettings,
  updateNotificationSettings,
  type NotificationAgree,
} from "@/utils/api/notificationApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useNotificationSettings() {
  return useQuery({
    queryKey: ["notificationSettings"],
    queryFn: ({ signal }) => fetchNotificationSettings(signal),
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      isAll,
      agrees,
    }: {
      isAll: boolean;
      agrees: NotificationAgree[];
    }) => updateNotificationSettings(isAll, agrees),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
    },
  });
}
