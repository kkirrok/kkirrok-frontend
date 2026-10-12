import BellIcon from "@/assets/icons/bell.svg";
import { Colors } from "@/constants/colors";
import {
  UNREAD_NOTIFICATION_COUNT_KEY,
  useUnreadNotificationCount,
} from "@/hooks/useUnreadNotificationCount";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  style?: StyleProp<ViewStyle>;
};

// 알림 화면으로 이동하는 벨 버튼. 읽지 않은 알림이 있으면 주황색 점을 표시
export default function KkBellButton({ style }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const hasUnread = unreadCount > 0;

  // 탭 이동이나 알림 화면에서 돌아올 때 갱신. 방금 조회·갱신한 값이면(stale 아님) 다시 요청하지 않음
  useFocusEffect(
    useCallback(() => {
      queryClient.refetchQueries({
        queryKey: UNREAD_NOTIFICATION_COUNT_KEY,
        stale: true,
      });
    }, [queryClient]),
  );

  return (
    <TouchableOpacity
      style={style}
      onPress={() => router.push("/notification")}
      accessibilityRole="button"
      accessibilityLabel={
        hasUnread ? "알림 화면으로 이동, 읽지 않은 알림 있음" : "알림 화면으로 이동"
      }
      accessibilityHint="알림 목록 화면을 엽니다"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View>
        <BellIcon width={24} height={24} />
        {hasUnread && <View style={styles.badge} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 0,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.main[500],
  },
});
