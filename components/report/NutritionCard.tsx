import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DayNutrition } from "@/utils/types/meal";

type Props = {
  dateLabel: string;
  nutrition: DayNutrition;
};

function NutrientBar({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const isOver = value > max;
  return (
    <View style={styles.barWrap}>
      <View style={styles.barLabelRow}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={[styles.barValue, isOver && styles.barValueOver]}>
          {value}/{max}
          {unit}
        </Text>
      </View>
      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${pct}%` },
            isOver && styles.barFillOver,
          ]}
        />
      </View>
    </View>
  );
}

export default function NutritionCard({ dateLabel, nutrition }: Props) {
  const sortedNutrients = useMemo(
    () =>
      [
        {
          label: "탄수화물",
          value: nutrition.carbs,
          max: nutrition.maxCarbs,
          unit: "g",
        },
        {
          label: "지방",
          value: nutrition.fat,
          max: nutrition.maxFat,
          unit: "g",
        },
        {
          label: "단백질",
          value: nutrition.protein,
          max: nutrition.maxProtein,
          unit: "g",
        },
        {
          label: "당",
          value: nutrition.sugar,
          max: nutrition.maxSugar,
          unit: "g",
        },
        {
          label: "나트륨",
          value: nutrition.sodium,
          max: nutrition.maxSodium,
          unit: "mg",
        },
      ]
        .sort((a, b) => b.value / b.max - a.value / a.max)
        .slice(0, 3),
    [nutrition],
  );

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <Text style={styles.calorieText}>
          {nutrition.calories}/{nutrition.maxCalories}kcal
        </Text>
      </View>
      {sortedNutrients.map((n) => (
        <NutrientBar
          key={n.label}
          label={n.label}
          value={n.value}
          max={n.max}
          unit={n.unit}
        />
      ))}
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
  barValueOver: {
    color: "#E05A3A",
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
  barFillOver: {
    backgroundColor: "#E05A3A",
  },
});
