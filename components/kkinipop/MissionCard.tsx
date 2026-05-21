import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AVATAR_COLORS = [
  Colors.gray[300],
  Colors.gray[400],
  Colors.gray[500],
  Colors.gray[600],
];

type Props = {
  title: string;
  endsAt: string;
};

export default function MissionCard({ title, endsAt }: Props) {
  return (
    <View style={styles.missionCard}>
      <View style={styles.missionTopRow}>
        <Text style={styles.missionEndLabel}>미션 종료</Text>
        <View style={styles.timePill}>
          <Text style={styles.timePillText}>{endsAt}</Text>
        </View>
      </View>

      <View style={styles.missionTitleRow}>
        <TouchableOpacity style={styles.chevronBtn}>
          <Ionicons name="chevron-back" size={18} color={Colors.gray[100]} />
        </TouchableOpacity>
        <Text style={styles.missionTitle}>{title}</Text>
        <TouchableOpacity style={styles.chevronBtn}>
          <Ionicons name="chevron-forward" size={18} color={Colors.gray[100]} />
        </TouchableOpacity>
      </View>

      <View style={styles.missionBottomRow}>
        <View style={styles.avatarStack}>
          {[...AVATAR_COLORS].reverse().map((color, i) => (
            <View
              key={i}
              style={[
                styles.avatar,
                { backgroundColor: color, marginLeft: i === 0 ? 0 : -10 },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.moabogiPill}>
          <Text style={styles.moabogiText}>모아보기</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  missionEndLabel: { ...Typography.body.m, color: Colors.gray[300] },
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
  missionTitle: { ...Typography.title.s, color: Colors.gray[100] },
  missionBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarStack: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  moabogiPill: {
    backgroundColor: Colors.gray[900],
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  moabogiText: { ...Typography.caption[2], color: Colors.gray[100] },
});
