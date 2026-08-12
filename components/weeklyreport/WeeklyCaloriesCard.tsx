import { Text, View } from "react-native";
import { styles } from "./styles";

interface Props {
  dailyCalories: number[];
  weekDays: string[];
  maxCalories: number;
  avgDailyKcal: number;
  totalWeeklyKcal: number;
}

export default function WeeklyCaloriesCard({
  dailyCalories,
  weekDays,
  maxCalories,
  avgDailyKcal,
  totalWeeklyKcal,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>일주일동안</Text>
      <Text style={styles.summaryText}>
        평균{" "}
        <Text style={styles.highlight}>
          {avgDailyKcal.toLocaleString()}kcal
        </Text>
        를 섭취했어요!
      </Text>

      <View style={styles.chart}>
        {dailyCalories.map((calories, index) => {
          const barHeight = calories > 0 ? Math.max(32, (calories / maxCalories) * 116) : 0;

          return (
            <View key={index} style={styles.day}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: barHeight }]} />
              </View>

              <Text style={styles.dayText}>{weekDays[index]}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.totalText}>
        총 섭취 칼로리: {totalWeeklyKcal.toLocaleString()}kcal
      </Text>
    </View>
  );
}
