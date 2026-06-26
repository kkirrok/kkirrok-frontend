import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { MissionSuccessMember } from "@/utils/types/kkinipop";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AVATAR_BG = [
  Colors.gray[300],
  Colors.gray[400],
  Colors.gray[500],
  Colors.gray[600],
];

function useIsLive(startAt: string | null, endAt: string | null) {
  const check = () => {
    const now = Date.now();
    const start = startAt ? new Date(startAt).getTime() : null;
    const end = endAt ? new Date(endAt).getTime() : null;
    return start != null && end != null && now >= start && now < end;
  };
  const [isLive, setIsLive] = useState(check);

  useEffect(() => {
    const id = setInterval(() => setIsLive(check()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAt, endAt]);

  return isLive;
}

function useCountdown(endAt: string | null) {
  const calc = () =>
    endAt
      ? Math.max(0, Math.floor((new Date(endAt).getTime() - Date.now()) / 1000))
      : 0;
  const [sec, setSec] = useState(calc);

  useEffect(() => {
    if (!endAt) return;
    const id = setInterval(() => {
      const r = calc();
      setSec(r);
      if (r <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endAt]);

  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type Props = {
  title: string;
  startAt: string | null;
  endAt: string | null;
  successMembers?: MissionSuccessMember[];
  successMemberCount?: number;
  hasPrev?: boolean;
  hasNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onKkirok?: () => void;
  onMoabogi?: () => void;
  moabogiActive?: boolean;
};

export default function MissionCard({
  title,
  startAt,
  endAt,
  successMembers = [],
  successMemberCount = 0,
  hasPrev = false,
  hasNext = false,
  onPrev,
  onNext,
  onKkirok,
  onMoabogi,
  moabogiActive = false,
}: Props) {
  const isLive = useIsLive(startAt, endAt);
  const countdown = useCountdown(endAt);

  const borderAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isLive) {
      borderAnim.stopAnimation();
      borderAnim.setValue(0);
      return;
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [isLive, borderAnim]);

  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.gray[100], Colors.main[500]],
  });

  const endTimeLabel = endAt
    ? new Date(endAt).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "--:--";

  return (
    <Animated.View
      style={[styles.missionCard, { borderColor: animatedBorderColor }]}
    >
      {/* 상단 행 */}
      <View style={styles.missionTopRow}>
        {isLive ? (
          <View style={styles.liveLabel}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabelText}>끼니팝!</Text>
          </View>
        ) : (
          <Text style={styles.endLabel}>미션 종료</Text>
        )}
        <View style={styles.timePill}>
          <Text style={styles.timePillText}>
            {isLive ? countdown : endTimeLabel}
          </Text>
        </View>
      </View>

      {/* 타이틀 행 */}
      <View style={styles.missionTitleRow}>
        <TouchableOpacity
          style={[styles.chevronBtn, !hasPrev && styles.chevronDisabled]}
          onPress={onPrev}
          disabled={!hasPrev}
        >
          <Ionicons name="chevron-back" size={18} color={Colors.gray[100]} />
        </TouchableOpacity>
        <Text style={styles.missionTitle}>{title}</Text>
        <TouchableOpacity
          style={[styles.chevronBtn, !hasNext && styles.chevronDisabled]}
          onPress={onNext}
          disabled={!hasNext}
        >
          <Ionicons name="chevron-forward" size={18} color={Colors.gray[100]} />
        </TouchableOpacity>
      </View>

      {/* 하단 행 */}
      <View style={styles.missionBottomRow}>
        <View style={styles.avatarStack}>
          {successMembers.slice(0, 4).map((m, i) =>
            m.profile_image ? (
              <Image
                key={m.member_id}
                source={{ uri: m.profile_image }}
                style={[styles.avatar, { marginLeft: i === 0 ? 0 : -10 }]}
              />
            ) : (
              <View
                key={m.member_id}
                style={[
                  styles.avatar,
                  {
                    backgroundColor: AVATAR_BG[i],
                    marginLeft: i === 0 ? 0 : -10,
                  },
                ]}
              />
            ),
          )}
        </View>
        {isLive ? (
          <Text style={styles.memberCountText}>
            현재 {successMemberCount}명 작성
          </Text>
        ) : (
          <TouchableOpacity
            style={[
              styles.moabogiPill,
              moabogiActive && { backgroundColor: Colors.main[600] },
            ]}
            onPress={onMoabogi}
          >
            <Text style={styles.moabogiText}>모아보기</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 끼록하기 버튼 — 라이브일 때만 */}
      {isLive && (
        <TouchableOpacity
          style={styles.kkirokBtn}
          onPress={onKkirok}
          activeOpacity={0.85}
        >
          <Text style={styles.kkirokText}>끼록하기</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  missionCard: {
    borderWidth: 1,
    borderColor: Colors.main[100],
    borderRadius: 24,
    padding: 16,
    gap: 16,
    backgroundColor: `${Colors.gray[100]}14`,
  },
  missionTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  endLabel: { ...Typography.body.m, color: Colors.gray[300] },
  liveLabel: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.main[500],
  },
  liveLabelText: { ...Typography.body.m, color: Colors.main[400] },
  timePill: {
    backgroundColor: Colors.gray[900],
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  timePillText: { ...Typography.caption[2], color: Colors.gray[100] },
  missionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chevronBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gray[900],
    borderRadius: 999,
  },
  chevronDisabled: { opacity: 0.3 },
  missionTitle: { ...Typography.title.s, color: Colors.gray[100] },
  missionBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarStack: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  memberCountText: { ...Typography.caption[1], color: Colors.gray[300] },
  moabogiPill: {
    backgroundColor: Colors.gray[900],
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  moabogiText: { ...Typography.caption[2], color: Colors.gray[100] },
  kkirokBtn: {
    backgroundColor: Colors.main[500],
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  kkirokText: { ...Typography.title.xs, color: Colors.gray[100] },
});
