import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { StyleSheet, Text, View } from "react-native";
import { DayNutrition } from "./types";

type Props = {
  dateLabel: string;
  nutrition: DayNutrition;
};

function NutrientBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <View style={styles.barWrap}>
      <View style={styles.barLabelRow}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>
          {value}/{max}g
        </Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

export default function NutritionCard({ dateLabel, nutrition }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <Text style={styles.calorieText}>
          {nutrition.calories}/{nutrition.maxCalories}kcal
        </Text>
      </View>
      <NutrientBar
        label="탄수화물"
        value={nutrition.carbs}
        max={nutrition.maxCarbs}
      />
      <NutrientBar
        label="단백질"
        value={nutrition.protein}
        max={nutrition.maxProtein}
      />
      <NutrientBar label="지방" value={nutrition.fat} max={nutrition.maxFat} />
    </View>
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
  dateText: {
    ...Typography.title.xs,
    color: Colors.gray[100],
  },
  calorieText: {
    ...Typography.title.xs,
    color: Colors.gray[200],
  },
  barWrap: {
    gap: 6,
  },
  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  barLabel: {
    ...Typography.body.m,
    color: Colors.gray[100],
  },
  barValue: {
    ...Typography.body.m,
    color: Colors.gray[200],
  },
  barBg: {
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gray[600],
  },
  barFill: {
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.main[500],
  },
});
