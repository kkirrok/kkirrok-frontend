import { Text, View } from "react-native";
import { styles } from "./styles";

const NUTRIENTS = [
  { label: "단백질", value: 60, max: 80, unit: "g" },
  { label: "탄수화물", value: 60, max: 100, unit: "g" },
  { label: "당", value: 60, max: 90, unit: "g" },
  { label: "지방", value: 60, max: 105, unit: "g" },
  { label: "나트륨", value: 60, max: 90, unit: "mg" },
];

export default function WeeklyNutrientsCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        평균적으로 다음과 같이 섭취했어요.
      </Text>

      <View style={styles.nutrientList}>
        {NUTRIENTS.map((nutrient) => (
          <View key={nutrient.label} style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>{nutrient.label}</Text>

            <View style={styles.nutrientTrack}>
              <View
                style={[
                  styles.nutrientFill,
                  {
                    width: `${Math.min(
                      100,
                      (nutrient.value / nutrient.max) * 100
                    )}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.nutrientValue}>
              {nutrient.value}
              {nutrient.unit}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.description}>
        일주일간의 식단은 총 505 kcal로 비교적 낮은 섭취량을 나타내며,
        탄수화물 비중이 84g으로 주요 에너지원으로 활용되었어요.
      </Text>
    </View>
  );
}