import { StyleSheet, View } from "react-native";
import SkeletonBox from "./SkeletonBox";

function SkeletonProfileCard() {
  return (
    <View style={styles.card}>
      <SkeletonBox
        width="40%"
        height={22}
        borderRadius={8}
        style={styles.center}
      />
      <SkeletonBox
        width="30%"
        height={20}
        borderRadius={8}
        style={[styles.center, { marginTop: 8 }]}
      />
    </View>
  );
}

function SkeletonNutrientCard() {
  return (
    <View style={styles.card}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[styles.nutrientRow, i < 4 && { marginBottom: 8 }]}
        >
          <SkeletonBox width="20%" height={16} borderRadius={6} />
          <SkeletonBox
            width={undefined}
            height={20}
            borderRadius={8}
            style={styles.barFlex}
          />
          <SkeletonBox width={90} height={14} borderRadius={6} />
        </View>
      ))}
    </View>
  );
}

function SkeletonFeedbackCards() {
  return (
    <View style={styles.row}>
      {[0, 1].map((i) => (
        <View key={i} style={styles.feedbackCard}>
          <SkeletonBox width="70%" height={16} borderRadius={6} />
          <SkeletonBox
            width="90%"
            height={12}
            borderRadius={6}
            style={{ marginTop: 6 }}
          />
          <View style={styles.tagRow}>
            <SkeletonBox width={50} height={24} borderRadius={16} />
            <SkeletonBox width={32} height={32} borderRadius={16} />
          </View>
        </View>
      ))}
    </View>
  );
}

export default function SkeletonHome() {
  return (
    <View style={styles.container}>
      {/* 프로필 카드 */}
      <SkeletonProfileCard />

      {/* 섹션 타이틀 */}
      <SkeletonBox
        width={120}
        height={20}
        borderRadius={8}
        style={{ marginTop: 16 }}
      />

      {/* 영양성분 카드 */}
      <SkeletonNutrientCard />

      {/* 피드백 섹션 타이틀 */}
      <SkeletonBox
        width={100}
        height={20}
        borderRadius={8}
        style={{ marginTop: 16 }}
      />
      <SkeletonBox width="60%" height={18} borderRadius={6} />

      {/* 운동 추천 카드 2개 */}
      <SkeletonFeedbackCards />

      <SkeletonBox width="65%" height={18} borderRadius={6} />

      {/* 음식 추천 카드 2개 */}
      <SkeletonFeedbackCards />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 15,
  },
  center: {
    alignSelf: "center",
  },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barFlex: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  feedbackCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 15,
    gap: 4,
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },
});
