import KkBackground from "@/components/KkBackground";
import KkBellButton from "@/components/KkBellButton";
import GroupDrawer from "@/components/kkinipop/GroupDrawer";
import MissionCard from "@/components/kkinipop/MissionCard";
import RecordCard from "@/components/kkinipop/RecordCard";
import WeekCalendar from "@/components/kkinipop/WeekCalendar";
import SkeletonMissionCard from "@/components/skeleton/SkeletonMissionCard";
import SkeletonRecordRow from "@/components/skeleton/SkeletonRecordRow";
import { useKkinipopSSE } from "@/hooks/useKkinipopSSE";
import { r2ImageQueryOptions, useR2ImageUrls } from "@/hooks/useR2ImageUrl";
import { Colors } from "@/constants/colors";
import { SYSTEM_EMOJI_CHAR } from "@/constants/kkinipop";
import { Typography } from "@/constants/typography";
import {
  addReaction,
  deleteGroupEmoji,
  deletePost,
  fetchGroupEmojis,
  fetchGroupMembers,
  fetchGroups,
  fetchMissions,
  fetchPosts,
  fetchSystemEmojis,
} from "@/utils/api/kkinipopApi";
import { alertError } from "@/utils/alertError";
import { tokenStore } from "@/utils/store/tokenStore";
import {
  Group,
  GroupEmoji,
  MealRecord,
  Mission,
  PostDay,
  SystemEmoji,
} from "@/utils/types/kkinipop";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function formatDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

// 게시글 API는 기준 날짜가 속한 주(월~일) 단위로 응답하므로 해당 주의 월요일을 키로 사용
function getWeekStart(date: Date) {
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return formatDate(monday);
}

export default function KkinipopPage() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [kkimojiModalVisible, setKkimojiModalVisible] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [missionIndex, setMissionIndex] = useState(0);
  const [moabogiMissionId, setMoabogiMissionId] = useState<number | null>(null);
  const [postDays, setPostDays] = useState<PostDay[]>([]);
  const [myMemberId, setMyMemberId] = useState<number | null>(null);
  const [globalSystemEmojis, setGlobalSystemEmojis] = useState<SystemEmoji[]>(
    [],
  );
  const [customEmojiList, setCustomEmojiList] = useState<
    (GroupEmoji & { imageUrl: string | null })[]
  >([]);
  const [drawerInitialView, setDrawerInitialView] = useState<"main" | "create" | "join">("main");
  const [groupsLoading, setGroupsLoading] = useState(true);
  const groupsVersionRef = useRef(0);
  const groupsFetchingRef = useRef(0);
  const [contentLoading, setContentLoading] = useState(false);
  const [missionLoading, setMissionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const postsControllerRef = useRef<AbortController | null>(null);
  const emojiControllerRef = useRef<AbortController | null>(null);
  const skipNextFocusRef = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const rowRefs = useRef<(View | null)[]>([]);
  const selectedGroupIdRef = useRef<number | null>(selectedGroupId);
  const systemEmojisRef = useRef<SystemEmoji[]>([]);
  const customEmojisRef = useRef<typeof customEmojiList>([]);

  const selectedDateStr = formatDate(selectedDate);
  const selectedWeekStart = getWeekStart(selectedDate);
  const selectedDateStrRef = useRef(selectedDateStr);

  useEffect(() => { selectedGroupIdRef.current = selectedGroupId; }, [selectedGroupId]);
  useEffect(() => { selectedDateStrRef.current = selectedDateStr; }, [selectedDateStr]);
  useEffect(() => { systemEmojisRef.current = globalSystemEmojis; }, [globalSystemEmojis]);
  useEffect(() => { customEmojisRef.current = customEmojiList; }, [customEmojiList]);


  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const token = await tokenStore.get();
      if (!token) {
        router.replace("/(auth)/Login");
        return;
      }
      Promise.all([
        fetchGroups(controller.signal),
        fetchSystemEmojis(controller.signal),
      ])
        .then(([groups, systemEmojis]) => {
          setGroups(groups);
          if (groups.length > 0) setSelectedGroupId(groups[0].group_id);
          setGlobalSystemEmojis(systemEmojis);
        })
        .catch((err) => alertError(err, "그룹 목록을 불러오지 못했어요."))
        .finally(() => setGroupsLoading(false));
    })();
    return () => controller.abort();
  }, []);

  const queryClient = useQueryClient();
  // R2 key → 다운로드 URL (useR2ImageUrl과 같은 캐시를 사용해 중복 요청 방지)
  const resolveImageUrl = useCallback(
    async (key: string) => {
      try {
        return await queryClient.fetchQuery(r2ImageQueryOptions(key));
      } catch {
        return null;
      }
    },
    [queryClient],
  );

  const loadGroupEmojis = useCallback(async (groupId: number) => {
    emojiControllerRef.current?.abort();
    const controller = new AbortController();
    emojiControllerRef.current = controller;
    try {
      const data = await fetchGroupEmojis(groupId, controller.signal);
      if (controller.signal.aborted) return;
      const withUrls = await Promise.all(
        data.custom_emojis.map(async (e) => ({
          ...e,
          imageUrl: e.image ? await resolveImageUrl(e.image) : null,
        })),
      );
      if (!controller.signal.aborted) setCustomEmojiList(withUrls);
    } catch (err) {
      alertError(err, "이모지 목록을 불러오지 못했어요.");
    }
  }, [resolveImageUrl]);

  const missionControllerRef = useRef<AbortController | null>(null);

  const loadMissions = useCallback(async (groupId: number, date: string) => {
    missionControllerRef.current?.abort();
    const controller = new AbortController();
    missionControllerRef.current = controller;
    setMissionLoading(true);
    try {
      const data = await fetchMissions(groupId, date, controller.signal);
      if (controller.signal.aborted) return;
      const resolvedData = await Promise.all(
        data.map(async (mission) => ({
          ...mission,
          success_members: await Promise.all(
            mission.success_members.map(async (member) => {
              if (!member.profile_image) return member;
              const url = await resolveImageUrl(member.profile_image);
              return url ? { ...member, profile_image: url } : member;
            }),
          ),
        })),
      );
      if (controller.signal.aborted) return;
      setMissions(resolvedData);
      const realTimeIdx = resolvedData.findIndex((m) => m.is_real_time);
      setMissionIndex(realTimeIdx >= 0 ? realTimeIdx : 0);
    } catch (err) {
      alertError(err, "미션을 불러오지 못했어요.");
    } finally {
      if (!controller.signal.aborted) setMissionLoading(false);
    }
  }, [resolveImageUrl]);

  const loadPosts = useCallback(async (groupId: number) => {
    postsControllerRef.current?.abort();
    const controller = new AbortController();
    postsControllerRef.current = controller;
    try {
      const days = await fetchPosts(
        groupId,
        { date: selectedDateStrRef.current },
        controller.signal,
      );
      if (!controller.signal.aborted) setPostDays(days);
    } catch (err) {
      alertError(err, "게시글을 불러오지 못했어요.");
    } finally {
      if (!controller.signal.aborted) setContentLoading(false);
    }
  }, []);

  const refreshGroups = useCallback(async (signal?: AbortSignal) => {
    const version = ++groupsVersionRef.current;
    groupsFetchingRef.current += 1;
    try {
      const data = await fetchGroups(signal);
      // 조회 중에 더 최신 조회나 로컬 변경(삭제·탈퇴·인원 수 반영)이 있었다면 오래된 응답은 버림
      if (signal?.aborted || version !== groupsVersionRef.current) return;
      setGroups(data);
      // 선택 중인 그룹이 사라졌으면 첫 번째 그룹으로 전환
      setSelectedGroupId((cur) =>
        cur != null && data.some((g) => g.group_id === cur)
          ? cur
          : (data[0]?.group_id ?? null),
      );
    } catch (err) {
      if ((err as Error).name !== "AbortError") console.error(err);
    } finally {
      groupsFetchingRef.current -= 1;
    }
  }, []);

  // 로컬에서 그룹 목록을 바꿀 때는 진행 중인 조회 응답을 무효화하고,
  // 무효화한 조회가 있었다면 변경이 반영된 서버 상태로 다시 조회
  const applyGroupsChange = useCallback(
    (update: (prev: Group[]) => Group[]) => {
      const hadPendingFetch = groupsFetchingRef.current > 0;
      groupsVersionRef.current += 1;
      setGroups(update);
      if (hadPendingFetch) refreshGroups();
    },
    [refreshGroups],
  );

  useEffect(() => {
    if (!drawerOpen) return;
    const controller = new AbortController();
    refreshGroups(controller.signal);
    return () => controller.abort();
  }, [drawerOpen, refreshGroups]);

  const removeGroup = (groupId: number) => {
    const next = groups.filter((g) => g.group_id !== groupId);
    applyGroupsChange(() => next);
    if (selectedGroupId === groupId) {
      setSelectedGroupId(next[0]?.group_id ?? null);
    }
  };

  const handleMemberChange = useCallback(() => {
    if (selectedGroupIdRef.current != null) loadPosts(selectedGroupIdRef.current);
    refreshGroups();
  }, [loadPosts, refreshGroups]);

  useKkinipopSSE({
    selectedGroupIdRef,
    setPostDays,
    setMissions,
    onMemberChange: handleMemberChange,
    systemEmojisRef,
    customEmojisRef,
  });

  useEffect(() => {
    if (selectedGroupId == null) return;
    skipNextFocusRef.current = true;
    setPostDays([]);
    setMissions([]);
    setMyMemberId(null);
    setMoabogiMissionId(null);
    setMissionIndex(0);
    setCustomEmojiList([]);
    setContentLoading(true);
    loadPosts(selectedGroupId);
    loadGroupEmojis(selectedGroupId);
    const membersCtrl = new AbortController();
    fetchGroupMembers(selectedGroupId, membersCtrl.signal)
      .then((members) => {
        if (membersCtrl.signal.aborted) return;
        const me = members.find((m) => m.is_me);
        if (me) setMyMemberId(me.member_id);
      })
      .catch(() => {});
    return () => {
      postsControllerRef.current?.abort();
      emojiControllerRef.current?.abort();
      membersCtrl.abort();
    };
  }, [selectedGroupId, loadPosts, loadGroupEmojis]);

  useEffect(() => {
    if (selectedGroupId == null) return;
    setMissions([]);
    setMissionIndex(0);
    setMoabogiMissionId(null);
    loadMissions(selectedGroupId, selectedDateStr);
    return () => missionControllerRef.current?.abort();
  }, [selectedGroupId, selectedDateStr, loadMissions]);

  // 다른 주의 날짜를 선택하면 그 주의 게시글을 다시 조회 (같은 주 안에서는 이미 받은 데이터 사용)
  const loadedWeekStartRef = useRef(selectedWeekStart);
  useEffect(() => {
    if (loadedWeekStartRef.current === selectedWeekStart) return;
    loadedWeekStartRef.current = selectedWeekStart;
    if (selectedGroupId == null) return;
    setPostDays([]);
    setContentLoading(true);
    loadPosts(selectedGroupId);
  }, [selectedWeekStart, selectedGroupId, loadPosts]);

  useFocusEffect(
    useCallback(() => {
      if (skipNextFocusRef.current) {
        skipNextFocusRef.current = false;
        return;
      }
      if (selectedGroupId != null) {
        loadPosts(selectedGroupId);
        loadGroupEmojis(selectedGroupId);
      }
    }, [selectedGroupId, loadPosts, loadGroupEmojis]),
  );

  const todayPosts =
    postDays.find((d) => d.date.startsWith(selectedDateStr))?.posts ?? [];

  // 게시글 사진·작성자 프로필 URL (캐시 기간이 지나면 자동으로 새 URL을 받음)
  const imageUrls = useR2ImageUrls(
    todayPosts.flatMap((p) => [p.image, p.profile_image]),
  );

  const visibleMissions = missions.filter((m) => {
    if (!m.start_at) return true;
    return new Date(m.start_at).getTime() <= Date.now();
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
    image: p.image ? (imageUrls[p.image] ?? null) : null,
    profileImage: p.profile_image ? (imageUrls[p.profile_image] ?? null) : null,
    isOwn: p.member_id === myMemberId,
    missionId: p.mission_id,
    reactions: p.reactions.map((r) => {
      const customEmoji = customEmojiList.find((e) => e.emoji_code === r.emoji_code);
      return {
        emoji:
          SYSTEM_EMOJI_CHAR[r.emoji_code] ??
          globalSystemEmojis.find((e) => e.emoji_code === r.emoji_code)?.label ??
          customEmoji?.label ??
          r.emoji_code,
        emoji_code: r.emoji_code,
        count: r.count,
        reacted: r.reacted,
        imageUrl: customEmoji?.imageUrl ?? null,
      };
    }),
  }));

  const activeGroup =
    groups.find((g) => g.group_id === selectedGroupId) ?? null;

  const handleTogglePicker = (id: string) =>
    setOpenPickerId((prev) => (prev === id ? null : id));

  const handleAddReaction = async (id: string, emojiCode: string) => {
    if (!selectedGroupId) return;
    const postId = parseInt(id);

    // 한 사람당 하나 규칙: API 호출 전에 현재 반응 중인 다른 이모지 코드를 기억
    const prevReactedCode =
      postDays
        .flatMap((d) => d.posts)
        .find((p) => p.post_id === postId)
        ?.reactions.find((r) => r.reacted && r.emoji_code !== emojiCode)
        ?.emoji_code ?? null;

    setOpenPickerId(null);
    try {
      const result = await addReaction(selectedGroupId, postId, emojiCode);
      setPostDays((prev) =>
        prev.map((day) => ({
          ...day,
          posts: day.posts.map((p) => {
            if (p.post_id !== postId) return p;

            // 새 이모지 추가 시 이전 반응 제거 (한 사람당 하나)
            let reactions = p.reactions;
            if (result.reacted && prevReactedCode) {
              reactions = reactions
                .map((r) => {
                  if (r.emoji_code !== prevReactedCode) return r;
                  const newCount = r.count - 1;
                  return newCount > 0
                    ? { ...r, count: newCount, reacted: false }
                    : null;
                })
                .filter((r): r is NonNullable<typeof r> => r !== null);
            }

            const existing = reactions.find(
              (r) => r.emoji_code === result.emoji_code,
            );
            if (existing) {
              if (result.count === 0) {
                return {
                  ...p,
                  reactions: reactions.filter(
                    (r) => r.emoji_code !== result.emoji_code,
                  ),
                };
              }
              return {
                ...p,
                reactions: reactions.map((r) =>
                  r.emoji_code === result.emoji_code
                    ? { ...r, count: result.count, reacted: result.reacted }
                    : r,
                ),
              };
            }
            return {
              ...p,
              reactions: [
                ...reactions,
                {
                  emoji_code: result.emoji_code,
                  label: result.label,
                  count: result.count,
                  emoji_type: result.emoji_type,
                  reacted: result.reacted,
                },
              ],
            };
          }),
        })),
      );
    } catch (err) {
      alertError(err, "이모지 반응에 실패했어요.");
    }
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
      alertError(err, "게시글 삭제에 실패했어요.");
    }
  };

  const handleRefresh = useCallback(async () => {
    if (!selectedGroupId) return;
    setRefreshing(true);
    try {
      await Promise.all([
        loadPosts(selectedGroupId),
        loadGroupEmojis(selectedGroupId),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [selectedGroupId, loadPosts, loadGroupEmojis]);

  const handleDeleteCustomEmoji = async (emojiId: number) => {
    if (!selectedGroupId) return;
    try {
      await deleteGroupEmoji(selectedGroupId, emojiId);
      setCustomEmojiList((prev) => prev.filter((e) => e.emoji_id !== emojiId));
    } catch (err) {
      alertError(err, "이모지 삭제에 실패했어요.");
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
              <Text style={styles.headerGroupName}>
                {activeGroup?.name ?? "끼니팝"}
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
            <KkBellButton />
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setOpenPickerId(null)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.main[400]}
          />
        }
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
          {groups.length === 0 ? (
            <View style={styles.emptyGroupWrap}>
              <Text style={styles.emptyGroupEmoji}>🍽️</Text>
              <Text style={styles.emptyGroupTitle}>
                아직 참여한 그룹이 없어요
              </Text>
              <Text style={styles.emptyGroupSub}>
                그룹을 만들거나 초대 코드로{"\n"}참여해 보세요!
              </Text>
              <TouchableOpacity
                style={styles.emptyGroupBtnPrimary}
                onPress={() => { setDrawerInitialView("create"); setDrawerOpen(true); }}
              >
                <Ionicons name="add" size={18} color={Colors.gray[100]} />
                <Text style={styles.emptyGroupBtnText}>그룹 만들기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.emptyGroupBtnOutline}
                onPress={() => { setDrawerInitialView("join"); setDrawerOpen(true); }}
              >
                <Ionicons name="enter-outline" size={18} color={Colors.gray[100]} />
                <Text style={styles.emptyGroupBtnText}>초대 코드로 참여</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {contentLoading || missionLoading ? (
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
                      isRealTime={m.is_real_time}
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
                      highlighted={
                        moabogiMissionId != null &&
                        record.missionId === moabogiMissionId
                      }
                      onOpenKkimoji={() => setKkimojiModalVisible(true)}
                      systemEmojis={globalSystemEmojis.map((e) => ({
                        emoji_code: e.emoji_code,
                        display: SYSTEM_EMOJI_CHAR[e.emoji_code] ?? e.label,
                      }))}
                      customGroupEmojis={customEmojiList}
                      onDeleteCustomEmoji={handleDeleteCustomEmoji}
                    />
                  ))}
                  {row.length === 1 && (
                    <View style={styles.cardPlaceholderSlot} />
                  )}
                </View>
              ))}
            </View>
          )}
          </>
          )}
        </Pressable>
      </ScrollView>

      <GroupDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialView={drawerInitialView}
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        onGroupCreated={(group) => {
          setGroups((prev) => [...prev, group]);
          setSelectedGroupId(group.group_id);
          // 생성/참여 응답의 인원 수가 최신이 아닐 수 있어 목록을 다시 조회
          // (새 조회가 시작되면 그 전에 진행 중이던 조회 응답은 무시됨)
          refreshGroups();
        }}
        onGroupJoined={(group) => {
          setGroups((prev) =>
            prev.some((g) => g.group_id === group.group_id)
              ? prev
              : [...prev, group],
          );
          setSelectedGroupId(group.group_id);
          refreshGroups();
        }}
        onGroupDeleted={removeGroup}
        onGroupLeft={removeGroup}
        onMemberCountChange={(groupId, count) => {
          applyGroupsChange((prev) =>
            prev.map((g) =>
              g.group_id === groupId ? { ...g, member_count: count } : g,
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
                  router.push({
                    pathname: "/camera/kkimoji",
                    params: { groupId: selectedGroupId },
                  });
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
                      params: {
                        uri: result.assets[0].uri,
                        groupId: selectedGroupId,
                      },
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
    paddingHorizontal: 22,
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
  emptyGroupWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  emptyGroupEmoji: { fontSize: 56 },
  emptyGroupTitle: { ...Typography.title.m, color: Colors.gray[100] },
  emptyGroupSub: {
    ...Typography.body.m,
    color: Colors.gray[300],
    textAlign: "center",
    marginBottom: 8,
  },
  emptyGroupBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.main[500],
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyGroupBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.gray[500],
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyGroupBtnText: { ...Typography.title.xs, color: Colors.gray[100] },
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
    ...Typography.title.xs,
    color: Colors.gray[100],
  },
});
