import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type Notification = {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  iconType: "record" | "kkinipop" | "group-join" | "group-react" | "group-chat";
  isNew?: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "지금 기록할 시간이에요",
    body: "오늘의 식사를 찍고 간단하게 남겨보세요",
    timeAgo: "3일 전",
    iconType: "record",
    isNew: true,
  },
  {
    id: "2",
    title: "끼니팝",
    body: "오늘의 디저트는?",
    timeAgo: "3일 전",
    iconType: "kkinipop",
  },
  {
    id: "3",
    title: "돼지 모임",
    body: "재영님이 '돼지모임'에 참여하셨습니다.",
    timeAgo: "3일 전",
    iconType: "group-join",
  },
  {
    id: "4",
    title: "돼지 모임",
    body: "재영님이 게시글에 반응하셨습니다.",
    timeAgo: "3일 전",
    iconType: "group-react",
  },
  {
    id: "5",
    title: "돼지 모임",
    body: "재영님이 '돼지모임'에 참여하셨습니다.\n재영님이 '돼지모임'에 참여하셨습니다.",
    timeAgo: "3일 전",
    iconType: "group-chat",
  },
];

const ICON_MAP: Record<
  Notification["iconType"],
  { name: ComponentProps<typeof Ionicons>["name"]; bg: string }
> = {
  record: { name: "camera-outline", bg: Colors.gray[900] },
  kkinipop: { name: "people-outline", bg: Colors.gray[900] },
  "group-join": { name: "fast-food-outline", bg: Colors.gray[900] },
  "group-react": { name: "happy-outline", bg: Colors.gray[900] },
  "group-chat": { name: "chatbubbles-outline", bg: Colors.gray[900] },
};

function NotificationItem({ item }: { item: Notification }) {
  const icon = ICON_MAP[item.iconType];
  return (
    <View style={[styles.card, item.isNew && styles.cardNew]}>
      <View style={[styles.thumbnail, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={28} color={Colors.gray[300]} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, item.isNew && styles.titleNew]}>
          {item.title}
        </Text>
        <View style={styles.bodyRow}>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>
      </View>
    </View>
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
  const notifications = MOCK_NOTIFICATIONS;

  return (
    <KkBackground>
      <KkHeader title="알림" />
      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          contentContainerStyle={styles.list}
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
});
