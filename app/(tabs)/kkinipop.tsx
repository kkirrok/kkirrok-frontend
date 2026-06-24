import KkBackground from "@/components/KkBackground";
import GroupDrawer from "@/components/kkinipop/GroupDrawer";
import MissionCard from "@/components/kkinipop/MissionCard";
import RecordCard from "@/components/kkinipop/RecordCard";
import WeekCalendar from "@/components/kkinipop/WeekCalendar";
import { MOCK_RECORDS } from "@/components/kkinipop/mockData";
import { MealRecord } from "@/components/kkinipop/types";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MISSION = { title: "오늘의 첫끼는?", endsAt: "10:00" };

export default function KkinipopPage() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [records, setRecords] = useState<MealRecord[]>(MOCK_RECORDS);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const [reactedIds, setReactedIds] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [kkimojiModalVisible, setKkimojiModalVisible] = useState(false);

  const handleTogglePicker = (id: string) =>
    setOpenPickerId((prev) => (prev === id ? null : id));

  const handleAddReaction = (id: string, emoji: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const existing = r.reactions.find((rx) => rx.emoji === emoji);
        if (existing) {
          return {
            ...r,
            reactions: r.reactions.map((rx) =>
              rx.emoji === emoji ? { ...rx, count: rx.count + 1 } : rx,
            ),
          };
        }
        return { ...r, reactions: [...r.reactions, { emoji, count: 1 }] };
      }),
    );
    setReactedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setOpenPickerId(null);
  };

  const handleDelete = (id: string) =>
    setRecords((prev) => prev.filter((r) => r.id !== id));

  const rows: MealRecord[][] = [];
  for (let i = 0; i < records.length; i += 2) {
    rows.push(records.slice(i, i + 2));
  }

  return (
    <KkBackground>
      <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setDrawerOpen(true)}
          >
            <Ionicons name="menu" size={24} color={Colors.gray[100]} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerLevel}>Lv.4 </Text>
              <Text style={styles.headerGroupName}>그룹명입력</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: "45%" }]} />
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push("/camera/kkinipop")}>
              <Ionicons
                name="camera-outline"
                size={24}
                color={Colors.gray[100]}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={Colors.gray[100]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setOpenPickerId(null)}
      >
        <Pressable
          style={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100, flex: 1 },
          ]}
          onPress={() => {
            if (openPickerId) setOpenPickerId(null);
          }}
        >
          <MissionCard title={MISSION.title} endsAt={MISSION.endsAt} />

          <WeekCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {records.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>기록이 없습니다.</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {rows.map((row, rowIdx) => (
                <View key={rowIdx} style={styles.gridRow}>
                  {row.map((record) => (
                    <RecordCard
                      key={record.id}
                      record={record}
                      pickerOpen={openPickerId === record.id}
                      onTogglePicker={() => handleTogglePicker(record.id)}
                      onAddReaction={(emoji) =>
                        handleAddReaction(record.id, emoji)
                      }
                      onDelete={() => handleDelete(record.id)}
                      hasReacted={reactedIds.includes(record.id)}
                      onOpenKkimoji={() => setKkimojiModalVisible(true)}
                    />
                  ))}
                  {row.length === 1 && (
                    <View style={styles.cardPlaceholderSlot} />
                  )}
                </View>
              ))}
            </View>
          )}
        </Pressable>
      </ScrollView>

      <GroupDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Modal
        visible={kkimojiModalVisible}
        animationType="fade"
        onRequestClose={() => setKkimojiModalVisible(false)}
      >
        <KkBackground>
          <TouchableOpacity
            style={[styles.modalCloseBtn, { top: insets.top + 8 }]}
            onPress={() => setKkimojiModalVisible(false)}
          >
            <Ionicons name="close" size={28} color={Colors.gray[100]} />
          </TouchableOpacity>
          <View style={styles.modalContent}>
            <View style={styles.modalImageCard}>
              <Text style={styles.modalEmoji}>📷</Text>
            </View>
            <Text style={styles.modalTitle}>나만의 끼모지 만들기</Text>
            <Text style={styles.modalSubtitle}>
              오늘의 내 표정을 찍거나 갤러리에서 선택해{"\n"}리액션으로
              사용해보세요.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                activeOpacity={0.8}
                onPress={() => {
                  setKkimojiModalVisible(false);
                  setOpenPickerId(null);
                  router.push("/camera/kkimoji");
                }}
              >
                <Text style={styles.modalBtnText}>촬영하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnGray}
                activeOpacity={0.8}
                onPress={async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: "images",
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                  });
                  if (!result.canceled) {
                    setKkimojiModalVisible(false);
                    setOpenPickerId(null);
                    router.push({
                      pathname: "/camera/kkimoji",
                      params: { uri: result.assets[0].uri },
                    });
                  }
                }}
              >
                <Text style={styles.modalBtnText}>갤러리 선택</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KkBackground>
      </Modal>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  headerWrap: { width: "100%" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerBtn: { width: 36, alignItems: "center" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 16 },
  headerCenter: { flex: 1, alignItems: "center", gap: 4 },
  headerTitleRow: { flexDirection: "row", alignItems: "center" },
  headerLevel: { ...Typography.body.l, color: Colors.gray[100] },
  headerGroupName: { ...Typography.title.s, color: Colors.gray[100] },
  progressBg: {
    width: 132,
    height: 4,
    borderRadius: 999,
    backgroundColor: Colors.gray[300],
  },
  progressFill: {
    height: 4,
    borderRadius: 999,
    backgroundColor: Colors.main[500],
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, gap: 24 },
  emptyWrap: { flex: 1, alignItems: "center", paddingTop: 80 },
  emptyText: { ...Typography.title.s, color: Colors.gray[300] },
  grid: { gap: 12 },
  gridRow: { flexDirection: "row", gap: 12 },
  cardPlaceholderSlot: { flex: 1 },
  modalCloseBtn: {
    position: "absolute",
    right: 20,
    zIndex: 10,
  },
  modalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  modalImageCard: {
    width: 256,
    height: 192,
    backgroundColor: Colors.gray[900],
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  modalEmoji: {
    fontSize: 96,
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  modalTitle: {
    ...Typography.title.l,
    color: Colors.gray[100],
  },
  modalSubtitle: {
    ...Typography.body.m,
    color: Colors.gray[100],
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    width: 256,
  },
  modalBtnPrimary: {
    width: 120,
    backgroundColor: Colors.main[500],
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnGray: {
    width: 120,
    backgroundColor: Colors.gray[700],
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnText: {
    color: Colors.gray[100],
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
  },
});
