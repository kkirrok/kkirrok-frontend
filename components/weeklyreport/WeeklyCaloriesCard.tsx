import { Text, View } from "react-native";
import { styles } from "./styles";

interface Props {
  dailyCalories: number[];
  weekDays: string[];
  maxCalories: number;
}

export default function WeeklyCaloriesCard({
  dailyCalories,
  weekDays,
  maxCalories,
}: Props) {
  const totalCalories = dailyCalories.reduce(
    (total, calories) => total + calories,
    0,
  );

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>일주일동안</Text>
      <Text style={styles.summaryText}>
        평균{" "}
        <Text style={styles.highlight}>
          {(totalCalories / dailyCalories.length).toFixed(0)}kcal
        </Text>
        를 섭취했어요!
      </Text>

      <View style={styles.chart}>
        {dailyCalories.map((calories, index) => {
          const barHeight = Math.max(32, (calories / maxCalories) * 116);

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
        총 섭취 칼로리: {totalCalories.toLocaleString()}kcal
      </Text>
    </View>
  );
}
