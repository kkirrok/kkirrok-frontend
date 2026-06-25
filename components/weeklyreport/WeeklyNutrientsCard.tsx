import { Text, View } from "react-native";
import { styles } from "./styles";
import type { WeeklyReportResponse } from "@/utils/types/report";

type Props = {
  nutrients: WeeklyReportResponse["data"]["nutrientFeedbacks"];
};

export default function WeeklyNutrientsCard({ nutrients }: Props) {


  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        평균적으로 다음과 같이 섭취했어요.
      </Text>

      <View style={styles.nutrientList}>
        {nutrients.map((nutrient) => (
          <View key={nutrient.nutrient} style={styles.nutrientRow}>
            <Text style={styles.nutrientLabel}>{nutrient.nutrient}</Text>

            <View style={styles.nutrientTrack}>
              <View
                style={[
                  styles.nutrientFill,
                  {
                    width: `${Math.min(100, nutrient.avgAmount)}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.nutrientValue}>
              {nutrient.avgAmount}
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