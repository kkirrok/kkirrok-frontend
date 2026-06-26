import KkBackground from "@/components/KkBackground";
import GroupDrawer from "@/components/kkinipop/GroupDrawer";
import MissionCard from "@/components/kkinipop/MissionCard";
import RecordCard from "@/components/kkinipop/RecordCard";
import WeekCalendar from "@/components/kkinipop/WeekCalendar";
import SkeletonMissionCard from "@/components/skeleton/SkeletonMissionCard";
import SkeletonRecordRow from "@/components/skeleton/SkeletonRecordRow";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import {
  addReaction,
  deletePost,
  fetchGroupMembers,
  fetchGroups,
  fetchMissions,
  fetchPosts,
} from "@/utils/api/kkinipopApi";
import { getDownloadUrl } from "@/utils/api/r2Api";
import { tokenStore } from "@/utils/store/tokenStore";
import { Group, MealRecord, Mission, PostDay } from "@/utils/types/kkinipop";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function KkinipopPage() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const [imageCache, setImageCache] = useState<Record<number, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [kkimojiModalVisible, setKkimojiModalVisible] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [missionIndex, setMissionIndex] = useState(0);
  const [moabogiMissionId, setMoabogiMissionId] = useState<number | null>(null);
  const [postDays, setPostDays] = useState<PostDay[]>([]);
  const [myMemberId, setMyMemberId] = useState<number | null>(null);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const postsControllerRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const rowRefs = useRef<(View | null)[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const token = await tokenStore.get();
      if (!token) {
        router.replace("/(auth)/Login");
        return;
      }
      fetchGroups(controller.signal)
        .then((data) => {
          setGroups(data);
          if (data.length > 0) setSelectedGroupId(data[0].group_id);
        })
        .catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        })
        .finally(() => setGroupsLoading(false));
    })();
    return () => controller.abort();
  }, []);

  const loadPosts = useCallback(async (groupId: number) => {
    postsControllerRef.current?.abort();
    const controller = new AbortController();
    postsControllerRef.current = controller;
    try {
      const days = await fetchPosts(groupId, undefined, controller.signal);
      if (!controller.signal.aborted) setPostDays(days);
    } catch (err: any) {
      if (err?.name !== "AbortError") console.error(err);
    } finally {
      if (!controller.signal.aborted) setContentLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedGroupId == null) return;
    setContentLoading(true);
    loadPosts(selectedGroupId);
    fetchGroupMembers(selectedGroupId)
      .then((members) => {
        const me = members.find((m) => m.is_me);
        if (me) setMyMemberId(me.member_id);
      })
      .catch(() => {});
    const missionCtrl = new AbortController();
    fetchMissions(selectedGroupId, missionCtrl.signal)
      .then((data) => {
        setMissions(data);
        const realTimeIdx = data.findIndex((m) => m.is_real_time);
        setMissionIndex(realTimeIdx >= 0 ? realTimeIdx : 0);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") console.error(err);
      });
    return () => {
      postsControllerRef.current?.abort();
      missionCtrl.abort();
    };
  }, [selectedGroupId, loadPosts]);

  useFocusEffect(
    useCallback(() => {
      if (selectedGroupId != null) loadPosts(selectedGroupId);
    }, [selectedGroupId, loadPosts]),
  );

  const todayStr = selectedDate.toISOString().split("T")[0];
  const todayPosts =
    postDays.find((d) => d.date.startsWith(todayStr))?.posts ?? [];

  useEffect(() => {
    let cancelled = false;
    const needFetch = todayPosts.filter(
      (p) => p.image && !(p.post_id in imageCache),
    );
    if (!needFetch.length) return;
    Promise.all(
      needFetch.map(async (p) => {
        try {
          const url = await getDownloadUrl(p.image!);
          return [p.post_id, url] as [number, string];
        } catch {
          return null;
        }
      }),
    ).then((entries) => {
      if (cancelled) return;
      setImageCache((prev) => {
        const next = { ...prev };
        for (const e of entries) if (e) next[e[0]] = e[1];
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayPosts]);

  const reactedIds = todayPosts
    .filter((p) => p.reactions.some((r) => r.reacted))
    .map((p) => String(p.post_id));

  const visibleMissions = missions.filter((m) => {
    if (!m.start_at) return true;
    const mDate = new Date(m.start_at);
    const sameDay =
      mDate.getFullYear() === selectedDate.getFullYear() &&
      mDate.getMonth() === selectedDate.getMonth() &&
      mDate.getDate() === selectedDate.getDate();
    return sameDay && mDate.getTime() <= Date.now();
  });

  const records: MealRecord[] = todayPosts.map((p) => ({
    id: String(p.post_id),
    name: p.nickname,
    time: p.created_at
      ? new Date(p.created_at).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "--:--",
    image: imageCache[p.post_id] ?? null,
    isOwn: p.member_id === myMemberId,
    missionId: p.mission_id,
    reactions: p.reactions.map((r) => ({
      emoji: r.emoji_code,
      count: r.count,
    })),
  }));

  const activeGroup =
    groups.find((g) => g.group_id === selectedGroupId) ?? null;

  const handleTogglePicker = (id: string) =>
    setOpenPickerId((prev) => (prev === id ? null : id));

  const handleAddReaction = async (id: string, emoji: string) => {
    if (!selectedGroupId) return;
    const postId = parseInt(id);
    try {
      await addReaction(selectedGroupId, postId, emoji);
      setPostDays((prev) =>
        prev.map((day) => ({
          ...day,
          posts: day.posts.map((p) => {
            if (p.post_id !== postId) return p;
            const existing = p.reactions.find((r) => r.emoji_code === emoji);
            if (existing) {
              return {
                ...p,
                reactions: p.reactions.map((r) =>
                  r.emoji_code === emoji
                    ? { ...r, count: r.count + 1, reacted: true }
                    : r,
                ),
              };
            }
            return {
              ...p,
              reactions: [
                ...p.reactions,
                {
                  emoji_code: emoji,
                  label: emoji,
                  count: 1,
                  emoji_type: "CUSTOM",
                  reacted: true,
                },
              ],
            };
          }),
        })),
      );
    } catch (err) {
      console.error(err);
    }
    setOpenPickerId(null);
  };

  const handleDelete = async (id: string) => {
    if (!selectedGroupId) return;
    const postId = parseInt(id);
    try {
      await deletePost(selectedGroupId, postId);
      setPostDays((prev) =>
        prev.map((day) => ({
          ...day,
          posts: day.posts.filter((p) => p.post_id !== postId),
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const rows: MealRecord[][] = [];
  for (let i = 0; i < records.length; i += 2) {
    rows.push(records.slice(i, i + 2));
  }

  useEffect(() => {
    if (moabogiMissionId == null) return;
    const targetRowIdx = rows.findIndex((row) =>
      row.some((r) => r.missionId === moabogiMissionId),
    );
    if (targetRowIdx < 0) return;
    const rowView = rowRefs.current[targetRowIdx];
    if (!rowView || !scrollRef.current) return;
    rowView.measureLayout(
      scrollRef.current as any,
      (_x, y) => scrollRef.current?.scrollTo({ y: y - 12, animated: true }),
      () => {},
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moabogiMissionId]);

  if (groupsLoading) {
    return (
      <KkBackground>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.main[500]} />
        </View>
      </KkBackground>
    );
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
                    width:
                      activeGroup && activeGroup.max_exp > 0
                        ? `${Math.min(100, Math.round((activeGroup.cur_exp / activeGroup.max_exp) * 100))}%`
                        : "0%",
                  },
                ]}
              />
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() =>
                selectedGroupId != null &&
                router.push({
                  pathname: "/camera/kkinipop",
                  params: { groupId: selectedGroupId },
                })
              }
            >
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
        ref={scrollRef}
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
          {contentLoading ? (
            <SkeletonMissionCard />
          ) : (
            visibleMissions.length > 0 &&
            (() => {
              const safeIndex = Math.min(
                missionIndex,
                visibleMissions.length - 1,
              );
              const m = visibleMissions[safeIndex];
              return (
                <MissionCard
                  title={m.title}
                  startAt={m.start_at}
                  endAt={m.end_at}
                  successMembers={m.success_members}
                  successMemberCount={m.success_member_count}
                  hasPrev={safeIndex > 0}
                  hasNext={safeIndex < visibleMissions.length - 1}
                  onPrev={() => setMissionIndex((i) => i - 1)}
                  onNext={() => setMissionIndex((i) => i + 1)}
                  onKkirok={() =>
                    router.push({
                      pathname: "/camera/kkinipop",
                      params: { groupId: selectedGroupId },
                    })
                  }
                  moabogiActive={
                    moabogiMissionId ===
                    visibleMissions[
                      Math.min(missionIndex, visibleMissions.length - 1)
                    ].mission_id
                  }
                  onMoabogi={() =>
                    setMoabogiMissionId((prev) =>
                      prev ===
                      visibleMissions[
                        Math.min(missionIndex, visibleMissions.length - 1)
                      ].mission_id
                        ? null
                        : visibleMissions[
                            Math.min(missionIndex, visibleMissions.length - 1)
                          ].mission_id,
                    )
                  }
                />
              );
            })()
          )}

          <WeekCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {contentLoading ? (
            <>
              <SkeletonRecordRow />
              <SkeletonRecordRow />
            </>
          ) : records.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>기록이 없습니다.</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {rows.map((row, rowIdx) => (
                <View
                  key={rowIdx}
                  ref={(el) => {
                    rowRefs.current[rowIdx] = el;
                  }}
                  style={styles.gridRow}
                >
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
                      highlighted={
                        moabogiMissionId != null &&
                        record.missionId === moabogiMissionId
                      }
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
        onMemberKicked={(groupId) => {
          setGroups((prev) =>
            prev.map((g) =>
              g.group_id === groupId
                ? { ...g, member_count: Math.max(0, g.member_count - 1) }
                : g,
            ),
          );
        }}
      />

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
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
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
