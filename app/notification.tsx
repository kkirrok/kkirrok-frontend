import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { SYSTEM_EMOJI_CHAR } from "@/constants/kkinipop";
import { Typography } from "@/constants/typography";
import { useNotificationsInfinite } from "@/hooks/useNotificationsInfinite";
import { useR2ImageUrl } from "@/hooks/useR2ImageUrl";
import { UNREAD_NOTIFICATION_COUNT_KEY } from "@/hooks/useUnreadNotificationCount";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/utils/api/notificationApi";
import type {
  NotificationItem,
  NotificationType,
} from "@/utils/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
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

type IconType = "record" | "group" | "mission" | "reaction";

const TYPE_TO_ICON: Partial<Record<NotificationType, IconType>> = {
  MEAL_REMINDER_OVERDUE: "record",
  MEAL_REMINDER_NO_TODAY: "record",
  MISSION_START: "mission",
  KKINIPOP_REACTION: "reaction",
};

const ICON_MAP: Record<IconType, ComponentProps<typeof Ionicons>["name"]> = {
  record: "camera-outline",
  group: "people-outline",
  mission: "fast-food-outline",
  // 리액션 이모지 정보를 알 수 없을 때의 기본 아이콘
  reaction: "happy-outline",
};

const FALLBACK_ICON: IconType = "record";

function getIconType(type: NotificationType): IconType {
  // 그룹 참여/탈퇴/삭제 등 그룹 관련 알림은 모두 그룹 아이콘으로 고정
  if (type.startsWith("GROUP_")) return "group";
  return TYPE_TO_ICON[type] ?? FALLBACK_ICON;
}

// 리액션 알림 data: emojiCode, isCustom, customEmojiImageKey (data 값은 문자열로 내려옴)
function getReactionEmoji(item: NotificationItem) {
  if (item.type !== "KKINIPOP_REACTION" || !item.data) return null;
  const isCustom = String(item.data.isCustom) === "true";
  return {
    customImageKey: isCustom ? item.data.customEmojiImageKey || null : null,
    systemChar: isCustom ? null : (SYSTEM_EMOJI_CHAR[item.data.emojiCode] ?? null),
  };
}

function NotificationThumbnail({ item }: { item: NotificationItem }) {
  const reaction = getReactionEmoji(item);
  const { data: customImageUrl } = useR2ImageUrl(reaction?.customImageKey);

  let content;
  if (customImageUrl) {
    content = (
      <Image
        source={{ uri: customImageUrl }}
        style={styles.thumbnailImage}
        contentFit="cover"
      />
    );
  } else if (reaction?.systemChar) {
    content = <Text style={styles.thumbnailEmoji}>{reaction.systemChar}</Text>;
  } else {
    content = (
      <Ionicons
        name={ICON_MAP[getIconType(item.type)]}
        size={28}
        color={Colors.gray[300]}
      />
    );
  }

  return <View style={styles.thumbnail}>{content}</View>;
}

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
    const isNew = !item.is_read;

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => onPress(item.notification_id)}
        style={[styles.card, { height }, isNew && styles.cardNew]}
      >
        <NotificationThumbnail item={item} />
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
    prev.item.data === next.item.data &&
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

  const queryClient = useQueryClient();
  // 헤더 벨 아이콘의 읽지 않은 알림 표시를 서버 값으로 다시 맞춤
  const refreshUnreadCount = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: UNREAD_NOTIFICATION_COUNT_KEY });
  }, [queryClient]);

  const handlePress = useCallback(
    (id: number) => {
      setReadIds((prev) => new Set([...prev, id]));
      markNotificationRead(id)
        .catch(() => {
          setReadIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        })
        .finally(refreshUnreadCount);
    },
    [refreshUnreadCount],
  );

  const handleReadAll = useCallback(() => {
    setReadIds(
      (prev) =>
        new Set([...prev, ...rawNotifications.map((n) => n.notification_id)]),
    );
    queryClient.setQueryData(UNREAD_NOTIFICATION_COUNT_KEY, 0);
    markAllNotificationsRead()
      .catch(() => {})
      .finally(refreshUnreadCount);
  }, [rawNotifications, queryClient, refreshUnreadCount]);

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
              <Text style={styles.readAllBtn} numberOfLines={1}>
                모두 읽음
              </Text>
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
    overflow: "hidden",
    backgroundColor: Colors.gray[900],
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  thumbnailImage: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
  },
  thumbnailEmoji: {
    fontSize: 32,
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
