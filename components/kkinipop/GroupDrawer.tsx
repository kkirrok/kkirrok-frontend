import KkModal from "@/components/KkModal";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import {
  createGroup,
  deleteGroup,
  fetchGroupMembers,
  joinGroup,
  kickMember,
  quitGroup,
} from "@/utils/api/kkinipopApi";
import { getDownloadUrl } from "@/utils/api/r2Api";
import { Group, GroupMember } from "@/utils/types/kkinipop";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DRAWER_WIDTH = Dimensions.get("window").width * 0.68;

type Props = {
  visible: boolean;
  onClose: () => void;
  groups: Group[];
  selectedGroupId: number | null;
  onSelectGroup: (groupId: number) => void;
  onGroupCreated: (group: Group) => void;
  onGroupJoined: (group: Group) => void;
  onGroupDeleted: (groupId: number) => void;
  onGroupLeft: (groupId: number) => void;
  onMemberKicked: (groupId: number) => void;
};

export default function GroupDrawer({
  visible,
  onClose,
  groups,
  selectedGroupId,
  onSelectGroup,
  onGroupCreated,
  onGroupJoined,
  onGroupDeleted,
  onGroupLeft,
  onMemberKicked,
}: Props) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"main" | "manage" | "create" | "join">(
    "main",
  );
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [memberImages, setMemberImages] = useState<Record<number, string>>({});
  const [membersLoading, setMembersLoading] = useState(false);
  const [kickTarget, setKickTarget] = useState<GroupMember | null>(null);
  const [kicking, setKicking] = useState(false);

  const activeGroup =
    groups.find((g) => g.group_id === selectedGroupId) ?? groups[0];

  useEffect(() => {
    if (view !== "manage" || !activeGroup) return;
    const controller = new AbortController();
    let cancelled = false;
    setMembersLoading(true);
    setMembers([]);
    setMemberImages({});
    fetchGroupMembers(activeGroup.group_id, controller.signal)
      .then(async (data) => {
        if (cancelled) return;
        setMembers(data);
        const entries = await Promise.all(
          data
            .filter((m) => m.profile_image)
            .map(async (m) => {
              try {
                const url = await getDownloadUrl(m.profile_image!);
                return [m.member_id, url] as [number, string];
              } catch {
                return null;
              }
            }),
        );
        const imageMap: Record<number, string> = {};
        for (const entry of entries) {
          if (entry) imageMap[entry[0]] = entry[1];
        }
        if (!cancelled) setMemberImages(imageMap);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => {
        if (!cancelled) setMembersLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, activeGroup?.group_id]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMounted(false);
        setView("main");
        setCreateName("");
        setJoinCode("");
      });
    }
  }, [visible, slideAnim, fadeAnim]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {/* 배경 딤 */}
        <Animated.View
          style={[styles.backdrop, { opacity: fadeAnim }]}
          pointerEvents={visible ? "auto" : "none"}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>

        {/* 드로어 */}
        <Animated.View
          style={[
            styles.drawer,
            {
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 16,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {view === "create" ? (
            <>
              {/* 그룹 생성 뷰 헤더 */}
              <View style={styles.manageHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setView("main");
                    setCreateName("");
                  }}
                  style={styles.backBtn}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={Colors.gray[100]}
                  />
                </TouchableOpacity>
                <Text style={styles.manageTitle}>그룹 생성</Text>
                <View style={styles.backBtn} />
              </View>

              <View style={styles.createField}>
                <Text style={styles.createLabel}>그룹 이름</Text>
                <TextInput
                  style={styles.createInput}
                  value={createName}
                  onChangeText={setCreateName}
                  placeholder="그룹 이름을 입력하세요"
                  placeholderTextColor={Colors.gray[400]}
                  maxLength={20}
                  returnKeyType="done"
                />
              </View>

              <View style={{ flex: 1 }} />

              <TouchableOpacity
                style={[
                  styles.createBtn,
                  (!createName.trim() || creating) && styles.createBtnDisabled,
                ]}
                disabled={!createName.trim() || creating}
                onPress={async () => {
                  setCreating(true);
                  try {
                    const group = await createGroup(createName.trim());
                    onGroupCreated(group);
                    setCreateName("");
                    setView("main");
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setCreating(false);
                  }
                }}
              >
                {creating ? (
                  <ActivityIndicator color={Colors.gray[100]} />
                ) : (
                  <Text style={styles.createBtnText}>그룹 만들기</Text>
                )}
              </TouchableOpacity>
            </>
          ) : view === "join" ? (
            <>
              {/* 그룹 참여 뷰 헤더 */}
              <View style={styles.manageHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setView("main");
                    setJoinCode("");
                  }}
                  style={styles.backBtn}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={Colors.gray[100]}
                  />
                </TouchableOpacity>
                <Text style={styles.manageTitle}>그룹 참여</Text>
                <View style={styles.backBtn} />
              </View>

              <View style={styles.createField}>
                <Text style={styles.createLabel}>초대 코드</Text>
                <TextInput
                  style={styles.createInput}
                  value={joinCode}
                  onChangeText={setJoinCode}
                  placeholder="초대 코드를 입력하세요"
                  placeholderTextColor={Colors.gray[400]}
                  autoCapitalize="characters"
                  returnKeyType="done"
                />
              </View>

              <View style={{ flex: 1 }} />

              <TouchableOpacity
                style={[
                  styles.createBtn,
                  (!joinCode.trim() || joining) && styles.createBtnDisabled,
                ]}
                disabled={!joinCode.trim() || joining}
                onPress={async () => {
                  setJoining(true);
                  try {
                    const group = await joinGroup(joinCode.trim());
                    onGroupJoined(group);
                    setJoinCode("");
                    setView("main");
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setJoining(false);
                  }
                }}
              >
                {joining ? (
                  <ActivityIndicator color={Colors.gray[100]} />
                ) : (
                  <Text style={styles.createBtnText}>참여하기</Text>
                )}
              </TouchableOpacity>
            </>
          ) : view === "main" ? (
            <>
              {/* 메인 뷰 헤더 */}
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>끼니팝</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color={Colors.gray[100]} />
                </TouchableOpacity>
              </View>

              {/* 그룹 목록 */}
              <View style={styles.groupList}>
                {groups.map((group) => {
                  const isActive = group.group_id === selectedGroupId;
                  return (
                    <View
                      key={group.group_id}
                      style={[
                        styles.groupItem,
                        isActive && styles.groupItemActive,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => onSelectGroup(group.group_id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.groupRow}>
                          <Text style={styles.groupName}>{group.name}</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.groupRow}>
                        <Text style={styles.groupMemberCount}>
                          {group.member_count}명 참여중
                        </Text>
                        {isActive && group.is_leader && (
                          <TouchableOpacity
                            style={styles.managePill}
                            onPress={() => setView("manage")}
                          >
                            <Text style={styles.managePillText}>그룹 관리</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.divider} />

              {/* 그룹 생성 / 참여 */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setView("create")}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color={Colors.gray[100]}
                  />
                  <Text style={styles.actionLabel}>그룹 생성</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setView("join")}
                >
                  <Ionicons
                    name="person-add"
                    size={20}
                    color={Colors.gray[100]}
                  />
                  <Text style={styles.actionLabel}>그룹 참여</Text>
                </TouchableOpacity>
              </View>

              {/* 초대코드 */}
              {activeGroup && (
                <View style={styles.inviteRow}>
                  <View style={styles.inviteLeft}>
                    <Text style={styles.inviteLabel}>초대코드</Text>
                    <Text style={styles.inviteCode}>
                      {activeGroup.invite_code}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.copyPill}
                    onPress={() =>
                      Clipboard.setStringAsync(activeGroup.invite_code)
                    }
                  >
                    <Text style={styles.copyPillText}>복사</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{ flex: 1 }} />

              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.leaveBtn}
                onPress={() => setShowLeaveConfirm(true)}
                disabled={leaving || !activeGroup}
              >
                {leaving ? (
                  <ActivityIndicator size="small" color={Colors.gray[400]} />
                ) : (
                  <>
                    <Ionicons
                      name="exit-outline"
                      size={20}
                      color={Colors.gray[400]}
                    />
                    <Text style={styles.leaveText}>그룹 나가기</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : view === "manage" ? (
            <>
              {/* 그룹 관리 뷰 헤더 */}
              <View style={styles.manageHeader}>
                <TouchableOpacity
                  onPress={() => setView("main")}
                  style={styles.backBtn}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={Colors.gray[100]}
                  />
                </TouchableOpacity>
                <Text style={styles.manageTitle}>{activeGroup.name}</Text>
                <View style={styles.backBtn} />
              </View>

              {/* 초대코드 */}
              {activeGroup && (
                <View style={styles.inviteRow}>
                  <View style={styles.inviteLeft}>
                    <Text style={styles.inviteLabel}>초대코드</Text>
                    <Text style={styles.inviteCode}>
                      {activeGroup.invite_code}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.copyPill}
                    onPress={() =>
                      Clipboard.setStringAsync(activeGroup.invite_code)
                    }
                  >
                    <Text style={styles.copyPillText}>복사</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.divider} />

              {/* 멤버 목록 */}
              {membersLoading ? (
                <ActivityIndicator color={Colors.gray[300]} />
              ) : (
                <View style={styles.memberList}>
                  {members.map((member) => {
                    const imageUri = memberImages[member.member_id];
                    return (
                      <View key={member.member_id} style={styles.memberRow}>
                        <View style={styles.memberAvatarRow}>
                          {imageUri ? (
                            <Image
                              source={{ uri: imageUri }}
                              style={styles.memberAvatar}
                            />
                          ) : (
                            <View style={styles.memberAvatar} />
                          )}
                          <Text style={styles.memberName}>
                            {member.nickname}
                          </Text>
                          {member.leader && (
                            <Text style={styles.leaderBadge}>방장</Text>
                          )}
                        </View>
                        {!member.is_me && activeGroup?.is_leader && (
                          <TouchableOpacity
                            style={styles.deletePill}
                            onPress={() => setKickTarget(member)}
                            disabled={kicking}
                          >
                            <Text style={styles.deletePillText}>삭제</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}

              <View style={{ flex: 1 }} />

              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.leaveBtn}
                onPress={() => setShowDeleteConfirm(true)}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color={Colors.gray[300]} />
                ) : (
                  <>
                    <Ionicons name="trash" size={16} color={Colors.gray[300]} />
                    <Text style={styles.leaveText}>그룹 삭제하기</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : null}
        </Animated.View>
      </View>

      <KkModal
        visible={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        title={activeGroup?.is_leader ? "그룹에서 나가시겠습니까?" : undefined}
        message={
          activeGroup?.is_leader
            ? `방장이 나가면 그룹이 즉시 삭제됩니다.\n모든 구성원이 더 이상 접근할 수 없으며,\n저장된 기록도 모두 사라집니다.`
            : `'${activeGroup?.name ?? ""}'\n그룹에서 나갈까요?`
        }
        buttonText={activeGroup?.is_leader ? "삭제하기" : "나가기"}
        onButtonPress={async () => {
          if (!activeGroup) return;
          setShowLeaveConfirm(false);
          setLeaving(true);
          try {
            await quitGroup(activeGroup.group_id);
            onGroupLeft(activeGroup.group_id);
          } catch (err) {
            console.error(err);
          } finally {
            setLeaving(false);
          }
        }}
        cancelText="취소"
        onCancelPress={() => setShowLeaveConfirm(false)}
      />

      <KkModal
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        message={`'${activeGroup?.name ?? ""}'\n그룹을 삭제할까요?\n삭제 후 복구할 수 없습니다.`}
        buttonText="삭제하기"
        onButtonPress={async () => {
          if (!activeGroup) return;
          setShowDeleteConfirm(false);
          setDeleting(true);
          try {
            await deleteGroup(activeGroup.group_id);
            onGroupDeleted(activeGroup.group_id);
            setView("main");
          } catch (err) {
            console.error(err);
          } finally {
            setDeleting(false);
          }
        }}
        cancelText="취소"
        onCancelPress={() => setShowDeleteConfirm(false)}
      />

      <KkModal
        visible={kickTarget !== null}
        onClose={() => setKickTarget(null)}
        message={`'${kickTarget?.nickname ?? ""}' 님을\n그룹에서 추방할까요?`}
        buttonText="추방하기"
        onButtonPress={async () => {
          if (!activeGroup || !kickTarget) return;
          setKickTarget(null);
          setKicking(true);
          try {
            await kickMember(activeGroup.group_id, kickTarget.member_id);
            setMembers((prev) =>
              prev.filter((m) => m.member_id !== kickTarget.member_id),
            );
            setMemberImages((prev) => {
              const next = { ...prev };
              delete next[kickTarget.member_id];
              return next;
            });
            onMemberKicked(activeGroup.group_id);
          } catch (err) {
            console.error(err);
          } finally {
            setKicking(false);
          }
        }}
        cancelText="취소"
        onCancelPress={() => setKickTarget(null)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${Colors.gray[1000]}99`,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: Colors.gray[800],
    paddingHorizontal: 20,
  },

  // 메인 헤더
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  drawerTitle: {
    ...Typography.title.xs,
    color: Colors.gray[100],
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  // 그룹 관리 헤더
  manageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  manageTitle: {
    ...Typography.title.xs,
    color: Colors.gray[100],
  },

  groupList: { gap: 16 },
  groupItemActive: {
    backgroundColor: Colors.gray[900],
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  groupItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  groupName: {
    ...Typography.title.xs,
    color: Colors.gray[100],
  },
  groupLevel: {
    ...Typography.caption[1],
    color: Colors.gray[200],
  },
  groupMemberCount: {
    ...Typography.caption[1],
    color: Colors.gray[200],
  },
  managePill: {
    backgroundColor: Colors.gray[700],
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  managePillText: {
    ...Typography.caption[1],
    color: Colors.gray[100],
  },

  divider: {
    height: 1,
    backgroundColor: Colors.gray[600],
    marginVertical: 24,
  },

  actionRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  actionLabel: {
    ...Typography.caption[1],
    color: Colors.gray[200],
  },

  inviteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inviteLeft: { gap: 4 },
  inviteLabel: {
    ...Typography.caption[2],
    color: Colors.gray[400],
  },
  inviteCode: {
    ...Typography.body.m,
    color: Colors.gray[100],
  },
  copyPill: {
    backgroundColor: Colors.gray[600],
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  copyPillText: {
    ...Typography.caption[1],
    color: Colors.gray[100],
  },

  memberList: { gap: 16 },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  memberAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray[300],
  },
  memberName: {
    ...Typography.body.m,
    color: Colors.gray[100],
  },
  leaderBadge: {
    ...Typography.caption[2],
    color: Colors.main[500],
    marginLeft: 4,
  },
  deletePill: {
    backgroundColor: Colors.gray[700],
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deletePillText: {
    ...Typography.caption[2],
    color: Colors.gray[100],
  },

  leaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 4,
  },
  leaveText: {
    ...Typography.caption[1],
    color: Colors.gray[300],
  },

  createField: { gap: 8, marginTop: 8 },
  createLabel: {
    ...Typography.caption[1],
    color: Colors.gray[300],
  },
  createInput: {
    backgroundColor: Colors.gray[700],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Typography.body.m,
    color: Colors.gray[100],
  },
  createBtn: {
    backgroundColor: Colors.main[500],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  createBtnDisabled: {
    backgroundColor: Colors.gray[600],
  },
  createBtnText: {
    ...Typography.title.xs,
    color: Colors.gray[100],
  },
});
