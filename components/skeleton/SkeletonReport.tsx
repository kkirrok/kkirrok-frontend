import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/colors";
import SkeletonBox from "./SkeletonBox";

function SkeletonNutritionCard() {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <SkeletonBox width={80} height={16} borderRadius={6} />
        <SkeletonBox width={100} height={16} borderRadius={6} />
      </View>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.barWrap}>
          <View style={styles.barLabelRow}>
            <SkeletonBox width={50} height={14} borderRadius={4} />
            <SkeletonBox width={70} height={14} borderRadius={4} />
          </View>
          <SkeletonBox width="100%" height={12} borderRadius={6} />
        </View>
      ))}
    </View>
  );
}

function SkeletonMealSection() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <SkeletonBox width={120} height={20} borderRadius={6} />
      </View>
      <View style={styles.tabs}>
        {[0, 1, 2, 3, 4].map((i) => (
          <SkeletonBox key={i} width={44} height={24} borderRadius={4} />
        ))}
      </View>
      {[0, 1].map((i) => (
        <SkeletonBox
          key={i}
          width="100%"
          height={64}
          borderRadius={12}
          style={{ marginBottom: 12 }}
        />
      ))}
    </View>
  );
}

export default function SkeletonReport() {
  return (
    <>
      <SkeletonNutritionCard />
      <SkeletonMealSection />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    backgroundColor: Colors.gray[900],
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barWrap: {
    gap: 6,
  },
  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabs: {
    flexDirection: "row",
    gap: 24,
  },
});
