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
import {
  ComponentProps,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

// getItemLayout을 위해 알림 카드 높이를 고정
const THUMBNAIL_SIZE = 64;
const CARD_PADDING = 16;
const CARD_BORDER = 1;
const CONTENT_GAP = 4;
const ITEM_GAP = 12;
const LIST_PADDING_TOP = 12;
// 제목 1줄 + 본문 최대 2줄
const CONTENT_TEXT_HEIGHT =
  (Typography.title.xs.lineHeight ?? 0) +
  (Typography.caption[1].lineHeight ?? 0) * 2;

// 시스템 글자 크기 설정에 따라 텍스트가 썸네일보다 커질 수 있어 fontScale을 반영
function getItemHeight(fontScale: number) {
  const contentHeight = CONTENT_TEXT_HEIGHT * fontScale + CONTENT_GAP;
  return Math.ceil(
    Math.max(THUMBNAIL_SIZE, contentHeight) + (CARD_PADDING + CARD_BORDER) * 2,
  );
}

const keyExtractor = (item: NotificationItem) => String(item.notification_id);

const ItemSeparator = () => <View style={styles.separator} />;

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

type NotificationRowProps = {
  item: NotificationItem;
  height: number;
  onPress: (id: number) => void;
};

const NotificationRow = memo(
  function NotificationRow({ item, height, onPress }: NotificationRowProps) {
    const iconType = TYPE_TO_ICON[item.type] ?? FALLBACK_ICON;
    const icon = ICON_MAP[iconType];
    const isNew = !item.is_read;

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => onPress(item.notification_id)}
        style={[styles.card, { height }, isNew && styles.cardNew]}
      >
        <View style={[styles.thumbnail, { backgroundColor: icon.bg }]}>
          <Ionicons name={icon.name} size={28} color={Colors.gray[300]} />
        </View>
        <View style={styles.content}>
          <Text
            style={[styles.title, isNew && styles.titleNew]}
            numberOfLines={1}
          >
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
  },
  // 읽음 처리 시 해당 알림 객체만 새로 만들어지므로, 표시 값이 바뀐 행만 다시 렌더
  (prev, next) =>
    prev.height === next.height &&
    prev.onPress === next.onPress &&
    prev.item.notification_id === next.item.notification_id &&
    prev.item.is_read === next.item.is_read &&
    prev.item.title === next.item.title &&
    prev.item.body === next.item.body &&
    prev.item.type === next.item.type &&
    prev.item.sent_at === next.item.sent_at,
);

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
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const itemHeight = useMemo(() => getItemHeight(fontScale), [fontScale]);
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

  const renderItem = useCallback<ListRenderItem<NotificationItem>>(
    ({ item }) => (
      <NotificationRow item={item} height={itemHeight} onPress={handlePress} />
    ),
    [itemHeight, handlePress],
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<NotificationItem> | null | undefined, index: number) => ({
      length: itemHeight,
      offset: LIST_PADDING_TOP + (itemHeight + ITEM_GAP) * index,
      index,
    }),
    [itemHeight],
  );

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
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={ItemSeparator}
          // 한 페이지(20개) 기준: 첫 화면 + 여유분만 렌더하고, 화면 밖은 위아래 3화면까지만 유지
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 32 },
          ]}
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
    paddingTop: LIST_PADDING_TOP,
  },
  separator: {
    height: ITEM_GAP,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDFCFC14",
    borderRadius: 16,
    padding: CARD_PADDING,
    gap: 14,
    borderWidth: CARD_BORDER,
    borderColor: "transparent",
  },
  cardNew: {
    backgroundColor: "#FDFCFC29",
    borderColor: Colors.main[400],
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: CONTENT_GAP,
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
    ...Typography.body.m,
    color: Colors.main[400],
    fontFamily: "Pretendard-SemiBold",
  },
  loadingMore: {
    paddingVertical: 16,
  },
});
