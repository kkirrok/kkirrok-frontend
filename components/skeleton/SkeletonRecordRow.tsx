import { Colors } from "@/constants/colors";
import { StyleSheet, View } from "react-native";
import SkeletonBox from "./SkeletonBox";

function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatarRow}>
          <SkeletonBox width={24} height={24} borderRadius={12} />
          <SkeletonBox width={48} height={12} borderRadius={6} />
        </View>
      </View>
    </View>
  );
}

export default function SkeletonRecordRow() {
  return (
    <View style={styles.row}>
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 24,
    backgroundColor: Colors.gray[800],
    borderWidth: 1,
    borderColor: Colors.gray[700],
    padding: 10,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between" },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 6 },
});
