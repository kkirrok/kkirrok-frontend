import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CalendarIcon from "@/assets/icons/CalendarIcon.svg";
import { useLocalSearchParams } from "expo-router";
import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";

const WEEK_DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const DAILY_CALORIES = [1980, 1600, 1450, 830, 1480, 1240, 1080];
const MAX_DAILY_CALORIES = 2400;

const NUTRIENTS = [
  { label: "단백질", value: 60, max: 80, unit: "g" },
  { label: "탄수화물", value: 60, max: 100, unit: "g" },
  { label: "당", value: 60, max: 90, unit: "g" },
  { label: "지방", value: 60, max: 105, unit: "g" },
  { label: "나트륨", value: 60, max: 90, unit: "mg" },
];

const PATTERN_TEXTS = [
  "하루 식사 중 특정 시간대에 섭취가 집중되는 경향",
  "전체 칼로리 섭취가 한 끼에 치우쳐 있는 패턴",
  "식사 이후 추가적인 간식 또는 야식 섭취가 이어짐",
];

function toNumberParam(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const numberValue = Number(rawValue);

  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function getWeekOfMonth(date: Date) {
  return Math.ceil(date.getDate() / 7);
}

export default function WeeklyReportPage() {
  const params = useLocalSearchParams();

  const selectedDate = useMemo(() => {
    const year = toNumberParam(params.year);
    const month = toNumberParam(params.month);
    const day = toNumberParam(params.day);
    const today = new Date();

    if (year && month) {
      const fallbackDay =
        today.getFullYear() === year && today.getMonth() + 1 === month
          ? today.getDate()
          : 1;

      return new Date(year, month - 1, day ?? fallbackDay);
    }

    return today;
  }, [params.day, params.month, params.year]);

  const weekTitle = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const week = getWeekOfMonth(selectedDate);

    return `${year}년 ${String(month).padStart(2, "0")}월 ${week}주차`;
  }, [selectedDate]);

  const totalCalories = DAILY_CALORIES.reduce(
    (total, calories) => total + calories,
    0
  );

  return (
    <KkBackground>
      <KkHeader title="주간 리포트" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.weekSelector}>
          <Text style={styles.weekSelectorText}>{weekTitle}</Text>
          <CalendarIcon />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>일주일동안</Text>
          <Text style={styles.summaryText}>
            평균 <Text style={styles.highlight}>1,980kcal</Text>를
            섭취했어요!
          </Text>

          <View style={styles.chart}>
            {DAILY_CALORIES.map((calories, index) => {
              const barHeight = Math.max(
                32,
                (calories / MAX_DAILY_CALORIES) * 116
              );

              return (
                <View key={`${WEEK_DAYS[index]}-${calories}`} style={styles.day}>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: barHeight }]} />
                  </View>
                  <Text style={styles.dayText}>{WEEK_DAYS[index]}</Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.totalText}>
            총 섭취 칼로리: {totalCalories.toLocaleString()}kcal
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>평균적으로 다음과 같이 섭취했어요.</Text>

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

        <View style={styles.card}>
          <Text style={styles.cardTitle}>칼로리 섭취 패턴</Text>

          <View style={styles.patternRow}>
            <View style={styles.patternTextBox}>
              {PATTERN_TEXTS.map((text) => (
                <Text key={text} style={styles.patternText}>
                  · {text}
                </Text>
              ))}
            </View>
            <View style={styles.imagePlaceholder} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>다음에는 이렇게 해보아요:)</Text>

          <View style={styles.tipRow}>
            <View style={styles.smallImagePlaceholder} />
            <View style={styles.tipTextBox}>
              <Text style={styles.tipTitle}>영양소는 고르게 섭취해요</Text>
              <Text style={styles.tipBody}>
                다양한 식품군을 포함하여 영양소의 균형을 맞추는 것이
                중요합니다.
              </Text>
            </View>
          </View>

          <View style={styles.tipRow}>
            <View style={styles.tipTextBox}>
              <Text style={styles.tipTitle}>저녁과 야식은 라이트하게!</Text>
              <Text style={styles.tipBody}>
                저녁과 식사는 가볍고 소화가 잘되는 음식으로 구성하여 건강을
                지킵시다.
              </Text>
            </View>
            <View style={styles.smallImagePlaceholder} />
          </View>
        </View>
      </ScrollView>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 14,
    paddingBottom: 28,
  },
  weekSelector: {
    marginTop: 16,
    marginBottom: 22,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: "#FDFCFC0A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  weekSelectorText: {
    color: Colors.gray[100],
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
  },
  card: {
    marginBottom: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: "#FDFCFC0A",
  },
  cardTitle: {
    color: Colors.gray[100],
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    marginBottom: 6,
    textAlign: "center",
  },
  summaryText: {
    color: Colors.gray[100],
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    marginBottom: 18,
    textAlign: "center",
  },
  highlight: {
    color: Colors.main[400],
    fontFamily: "Pretendard-SemiBold",
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  day: {
    width: 26,
    alignItems: "center",
  },
  barTrack: {
    width: 26,
    height: 128,
    borderRadius: 7,
    overflow: "hidden",
    backgroundColor: "#FDFCFC1A",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    backgroundColor: Colors.main[400],
  },
  dayText: {
    color: Colors.gray[200],
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    marginTop: 8,
  },
  totalText: {
    color: Colors.gray[200],
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    marginTop: 14,
    textAlign: "center",
  },
  nutrientList: {
    marginTop: 10,
    gap: 14,
  },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nutrientLabel: {
    minWidth: 60,
    color: Colors.gray[200],
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
  },
  nutrientTrack: {
    flex: 1,
    height: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  nutrientFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: Colors.main[300],
  },
  nutrientValue: {
    minWidth: 55,
    color: Colors.gray[200],
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    textAlign: "right",
  },
  description: {
    color: Colors.gray[200],
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    lineHeight: 18,
    marginTop: 16,
  },
  patternRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 10,
  },
  patternTextBox: {
    flex: 1,
    gap: 5,
  },
  patternText: {
    color: Colors.gray[100],
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    lineHeight: 20,
  },
  imagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 7,
    backgroundColor: Colors.gray[900],
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 14,
  },
  smallImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 7,
    backgroundColor: Colors.gray[900],
  },
  tipTextBox: {
    flex: 1,
  },
  tipTitle: {
    color: Colors.gray[100],
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    marginBottom: 4,
  },
  tipBody: {
    color: Colors.gray[200],
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    lineHeight: 19,
  },
});
