import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { useNotificationsInfinite } from "@/hooks/useNotificationsInfinite";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/utils/api/notificationApi";
import type {
  NotificationItem,
  NotificationType,
} from "@/utils/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { ComponentProps, useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type IconType =
  | "record"
  | "kkinipop"
  | "group-join"
  | "group-react"
  | "group-chat";

const TYPE_TO_ICON: Partial<Record<NotificationType, IconType>> = {
  RECORD: "record",
  KKINIPOP: "kkinipop",
  KKINIPOP_REACTION: "kkinipop",
  GROUP_JOIN: "group-join",
  GROUP_REACT: "group-react",
  GROUP_CHAT: "group-chat",
};

const ICON_MAP: Record<
  IconType,
  { name: ComponentProps<typeof Ionicons>["name"]; bg: string }
> = {
  record: { name: "camera-outline", bg: Colors.gray[900] },
  kkinipop: { name: "people-outline", bg: Colors.gray[900] },
  "group-join": { name: "fast-food-outline", bg: Colors.gray[900] },
  "group-react": { name: "happy-outline", bg: Colors.gray[900] },
  "group-chat": { name: "chatbubbles-outline", bg: Colors.gray[900] },
};

const FALLBACK_ICON: IconType = "record";

function formatTimeAgo(isoString: string | null): string {
  if (!isoString) return "";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return `${Math.floor(days / 7)}주 전`;
}

function NotificationRow({
  item,
  onPress,
}: {
  item: NotificationItem;
  onPress: (id: number) => void;
}) {
  const iconType = TYPE_TO_ICON[item.type] ?? FALLBACK_ICON;
  const icon = ICON_MAP[iconType];
  const isNew = !item.is_read;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(item.notification_id)}
      style={[styles.card, isNew && styles.cardNew]}
    >
      <View style={[styles.thumbnail, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={28} color={Colors.gray[300]} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, isNew && styles.titleNew]}>
          {item.title}
        </Text>
        <View style={styles.bodyRow}>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(item.sent_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Ionicons
        name="notifications-outline"
        size={104}
        color={Colors.gray[300]}
      />
      <Text style={styles.emptyText}>아직은 알림이 없어요</Text>
    </View>
  );
}

export default function NotificationPage() {
  const {
    data: notificationPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useNotificationsInfinite();

  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const isFirstFocus = useRef(true);

  const rawNotifications = useMemo(
    () =>
      notificationPages?.pages.flatMap((page) => page.notifications ?? []) ??
      [],
    [notificationPages],
  );

  const notifications = useMemo(
    () =>
      rawNotifications.map((n) =>
        readIds.has(n.notification_id) ? { ...n, is_read: true } : n,
      ),
    [rawNotifications, readIds],
  );

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handlePress = useCallback((id: number) => {
    setReadIds((prev) => new Set([...prev, id]));
    markNotificationRead(id).catch(() => {
      setReadIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    });
  }, []);

  const handleReadAll = useCallback(() => {
    setReadIds(
      (prev) =>
        new Set([...prev, ...rawNotifications.map((n) => n.notification_id)]),
    );
    markAllNotificationsRead().catch(() => {});
  }, [rawNotifications]);

  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <KkBackground>
      <KkHeader
        title="알림"
        rightAction={
          hasUnread ? (
            <TouchableOpacity onPress={handleReadAll} hitSlop={8}>
              <Text style={styles.readAllBtn}>모두 읽음</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />
      {isLoading ? (
        <ActivityIndicator
          color={Colors.main[400]}
          style={styles.loadingMore}
        />
      ) : notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.notification_id)}
          renderItem={({ item }) => (
            <NotificationRow item={item} onPress={handlePress} />
          )}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                color={Colors.main[400]}
                style={styles.loadingMore}
              />
            ) : null
          }
        />
      )}
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDFCFC14",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardNew: {
    backgroundColor: "#FDFCFC29",
    borderColor: Colors.main[400],
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...Typography.title.xs,
    color: Colors.gray[200],
  },
  titleNew: {
    color: Colors.gray[100],
  },
  bodyRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  body: {
    ...Typography.caption[1],
    color: Colors.gray[200],
    flex: 1,
  },
  timeAgo: {
    ...Typography.caption[1],
    color: Colors.gray[100],
    flexShrink: 0,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingBottom: 64,
  },
  emptyText: {
    ...Typography.title.m,
    color: Colors.gray[100],
  },
  readAllBtn: {
    color: Colors.main[400],
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
  },
  loadingMore: {
    paddingVertical: 16,
  },
});
