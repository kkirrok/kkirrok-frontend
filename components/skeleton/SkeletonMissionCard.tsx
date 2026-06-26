import { Colors } from "@/constants/colors";
import { StyleSheet, View } from "react-native";
import SkeletonBox from "./SkeletonBox";

export default function SkeletonMissionCard() {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <SkeletonBox width={60} height={14} borderRadius={6} />
        <SkeletonBox width={50} height={24} borderRadius={999} />
      </View>
      <View style={styles.titleRow}>
        <SkeletonBox width={28} height={28} borderRadius={999} />
        <SkeletonBox width="50%" height={20} borderRadius={8} />
        <SkeletonBox width={28} height={28} borderRadius={999} />
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.avatarRow}>
          {[0, 1, 2].map((i) => (
            <SkeletonBox
              key={i}
              width={32}
              height={32}
              borderRadius={16}
              style={{ marginLeft: i === 0 ? 0 : -10 }}
            />
          ))}
        </View>
        <SkeletonBox width={60} height={28} borderRadius={999} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: Colors.gray[800],
    borderRadius: 24,
    padding: 16,
    gap: 16,
    backgroundColor: `${Colors.gray[100]}14`,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarRow: { flexDirection: "row", alignItems: "center" },
});
