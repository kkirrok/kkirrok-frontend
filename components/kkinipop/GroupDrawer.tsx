import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DRAWER_WIDTH = Dimensions.get("window").width * 0.68;

const MOCK_GROUPS = [
  { id: "1", name: "돼지모임", level: 4, memberCount: 4, isOwner: true },
  { id: "2", name: "맛잘알모임", level: 4, memberCount: 4, isOwner: false },
];

const MOCK_MEMBERS = [
  { id: "me", name: "나", isMe: true },
  { id: "2", name: "성은", isMe: false },
  { id: "3", name: "준용", isMe: false },
];

const INVITE_CODE = "JAJDFDLKS;LD";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function GroupDrawer({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState("1");
  const [view, setView] = useState<"main" | "manage">("main");

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
      });
    }
  }, [visible]);

  const activeGroup = MOCK_GROUPS.find((g) => g.id === activeGroupId) ?? MOCK_GROUPS[0];

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
          {view === "main" ? (
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
                {MOCK_GROUPS.map((group) => {
                  const isActive = group.id === activeGroupId;
                  return (
                    <View
                      key={group.id}
                      style={[
                        styles.groupItem,
                        isActive && styles.groupItemActive,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => setActiveGroupId(group.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.groupRow}>
                          <Text style={styles.groupName}>{group.name}</Text>
                          <Text style={styles.groupLevel}>LV.{group.level}</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.groupRow}>
                        <Text style={styles.groupMemberCount}>
                          {group.memberCount}명 참여중
                        </Text>
                        {isActive && group.isOwner && (
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
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color={Colors.gray[100]}
                  />
                  <Text style={styles.actionLabel}>그룹 생성</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons
                    name="person-add"
                    size={20}
                    color={Colors.gray[100]}
                  />
                  <Text style={styles.actionLabel}>그룹 참여</Text>
                </TouchableOpacity>
              </View>

              {/* 초대코드 */}
              <View style={styles.inviteRow}>
                <View style={styles.inviteLeft}>
                  <Text style={styles.inviteLabel}>초대코드</Text>
                  <Text style={styles.inviteCode}>{INVITE_CODE}</Text>
                </View>
                <TouchableOpacity style={styles.copyPill}>
                  <Text style={styles.copyPillText}>복사</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }} />

              <View style={styles.divider} />
              <TouchableOpacity style={styles.leaveBtn}>
                <Ionicons
                  name="exit-outline"
                  size={20}
                  color={Colors.gray[400]}
                />
                <Text style={styles.leaveText}>그룹 나가기</Text>
              </TouchableOpacity>
            </>
          ) : (
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
              <View style={styles.inviteRow}>
                <View style={styles.inviteLeft}>
                  <Text style={styles.inviteLabel}>초대코드</Text>
                  <Text style={styles.inviteCode}>{INVITE_CODE}</Text>
                </View>
                <TouchableOpacity style={styles.copyPill}>
                  <Text style={styles.copyPillText}>복사</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* 멤버 목록 */}
              <View style={styles.memberList}>
                {MOCK_MEMBERS.map((member) => (
                  <View key={member.id} style={styles.memberRow}>
                    <View style={styles.memberAvatarRow}>
                      <View style={styles.memberAvatar} />
                      <Text style={styles.memberName}>{member.name}</Text>
                    </View>
                    {!member.isMe && (
                      <TouchableOpacity style={styles.deletePill}>
                        <Text style={styles.deletePillText}>삭제</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              <View style={{ flex: 1 }} />

              <View style={styles.divider} />
              <TouchableOpacity style={styles.leaveBtn}>
                <Ionicons name="trash" size={16} color={Colors.gray[300]} />
                <Text style={styles.leaveText}>그룹 삭제하기</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
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
});
