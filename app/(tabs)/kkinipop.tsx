import KkBackground from "@/components/KkBackground";
import GroupDrawer from "@/components/kkinipop/GroupDrawer";
import MissionCard from "@/components/kkinipop/MissionCard";
import RecordCard from "@/components/kkinipop/RecordCard";
import WeekCalendar from "@/components/kkinipop/WeekCalendar";
import { MOCK_RECORDS } from "@/components/kkinipop/mockData";
import { MealRecord } from "@/components/kkinipop/types";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { fetchGroups } from "@/utils/api/kkinipopApi";
import { Group } from "@/utils/types/kkinipop";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
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
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchGroups(controller.signal)
      .then((data) => {
        setGroups(data);
        if (data.length > 0) setSelectedGroupId(data[0].group_id);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
    return () => controller.abort();
  }, []);

  const activeGroup =
    groups.find((g) => g.group_id === selectedGroupId) ?? null;

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
              <Text style={styles.headerLevel}>
                Lv.{activeGroup?.level ?? "-"}{" "}
              </Text>
              <Text style={styles.headerGroupName}>
                {activeGroup?.name ?? "그룹 없음"}
              </Text>
            </View>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: activeGroup
                      ? `${Math.round((activeGroup.cur_exp / activeGroup.max_exp) * 100)}%`
                      : "0%",
                  },
                ]}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.gray[100]}
            />
          </TouchableOpacity>
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

      <GroupDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        onGroupCreated={(group) => {
          setGroups((prev) => [...prev, group]);
          setSelectedGroupId(group.group_id);
        }}
        onGroupJoined={(group) => {
          setGroups((prev) => [...prev, group]);
          setSelectedGroupId(group.group_id);
        }}
        onGroupDeleted={(groupId) => {
          setGroups((prev) => {
            const next = prev.filter((g) => g.group_id !== groupId);
            setSelectedGroupId(next.length > 0 ? next[0].group_id : null);
            return next;
          });
        }}
        onGroupLeft={(groupId) => {
          setGroups((prev) => {
            const next = prev.filter((g) => g.group_id !== groupId);
            setSelectedGroupId(next.length > 0 ? next[0].group_id : null);
            return next;
          });
        }}
      />
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
});
