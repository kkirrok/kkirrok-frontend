import type { WeeklyReportResponse } from "@/utils/types/report";
import { StyleSheet, Text, View } from "react-native";
import { styles } from "./styles";

type NutrientStatus = "UNDER" | "NORMAL" | "OVER";

const STATUS_LABEL: Record<NutrientStatus, string> = {
  UNDER: "부족",
  NORMAL: "적정",
  OVER: "과다",
};

const STATUS_COLOR: Record<NutrientStatus, string> = {
  UNDER: "#6DA0FF",
  NORMAL: "#5AC97A",
  OVER: "#FF6B6B",
};

type Props = {
  nutrients: WeeklyReportResponse["data"]["nutrient_feedbacks"];
};

export default function WeeklyNutrientsCard({ nutrients }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>평균적으로 다음과 같이 섭취했어요.</Text>

      <View style={styles.nutrientList}>
        {nutrients.map((nutrient) => (
          <View key={nutrient.nutrient} style={nutrientStyles.row}>
            <Text style={styles.nutrientLabel}>{nutrient.nutrient}</Text>

            <Text style={styles.nutrientValue}>
              {nutrient.avg_amount}
              {nutrient.unit}
            </Text>

            <View
              style={[
                nutrientStyles.badge,
                { backgroundColor: STATUS_COLOR[nutrient.status] + "33" },
              ]}
            >
              <Text
                style={[
                  nutrientStyles.badgeText,
                  { color: STATUS_COLOR[nutrient.status] },
                ]}
              >
                {STATUS_LABEL[nutrient.status]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const nutrientStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: "Pretendard-SemiBold",
  },
});
