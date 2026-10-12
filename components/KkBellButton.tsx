import BellIcon from "@/assets/icons/bell.svg";
import { Colors } from "@/constants/colors";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
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
  const { data: unreadCount = 0, refetch } = useUnreadNotificationCount();
  const hasUnread = unreadCount > 0;

  // 탭 이동이나 알림 화면에서 돌아올 때마다 최신 개수로 갱신
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
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
