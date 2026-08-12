import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import type { WeeklyReportResponse } from "@/utils/types/report";
import { StyleSheet, Text, View } from "react-native";
import { styles } from "./styles";

// 영양소별 일일 권장량 (바 최대값 기준)
const NUTRIENT_DAILY_MAX: Record<string, number> = {
  단백질: 55,
  탄수화물: 300,
  지방: 54,
  당: 50,
  나트륨: 2000,
};

type Props = {
  nutrients: WeeklyReportResponse["data"]["nutrientFeedbacks"];
  kcalFeedback?: string;
};

export default function WeeklyNutrientsCard({
  nutrients,
  kcalFeedback,
}: Props) {
  const maxFallback = Math.max(...nutrients.map((n) => n.avgAmount), 1);

  return (
    <View style={styles.card}>
      <Text style={[styles.cardTitle, { marginBottom: 16 }]}>
        평균적으로 다음과 같이 섭취했어요.
      </Text>

      <View style={nutrientStyles.list}>
        {nutrients.map((nutrient) => {
          const max = NUTRIENT_DAILY_MAX[nutrient.nutrient] ?? maxFallback;
          const pct = Math.min((nutrient.avgAmount / max) * 100, 100);

          return (
            <View key={nutrient.nutrient} style={nutrientStyles.row}>
              <Text style={nutrientStyles.label}>{nutrient.nutrient}</Text>
              <View style={nutrientStyles.barTrack}>
                <View style={[nutrientStyles.barFill, { width: `${pct}%` }]} />
              </View>
              <Text style={nutrientStyles.value}>
                {nutrient.avgAmount}
                {nutrient.unit}
              </Text>
            </View>
          );
        })}
      </View>

      {kcalFeedback ? (
        <Text style={nutrientStyles.feedback}>{kcalFeedback}</Text>
      ) : null}
    </View>
  );
}

const nutrientStyles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    ...Typography.title.xs,
    width: 55,
    color: Colors.gray[200],
  },
  barTrack: {
    flex: 1,
    height: 20,
    borderRadius: 8,
    backgroundColor: Colors.gray[900],
    overflow: "hidden",
  },
  barFill: {
    height: 20,
    borderRadius: 8,
    backgroundColor: Colors.main[500],
  },
  value: {
    ...Typography.body.m,
    width: 52,
    textAlign: "right",
    color: Colors.gray[200],
  },
  feedback: {
    ...Typography.caption[1],
    color: Colors.gray[600],
    marginTop: 16,
    textAlign: "center",
  },
});
