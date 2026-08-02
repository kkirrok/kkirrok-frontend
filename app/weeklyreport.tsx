import CalendarIcon from "@/assets/icons/CalendarIcon.svg";
import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import WeeklyCaloriesCard from "@/components/weeklyreport/WeeklyCaloriesCard";
import WeeklyNutrientsCard from "@/components/weeklyreport/WeeklyNutrientsCard";
import WeeklyPatternCard from "@/components/weeklyreport/WeeklyPatternCard";
import WeeklySuggestionsCard from "@/components/weeklyreport/WeeklySuggestionsCard";
import { styles } from "@/components/weeklyreport/styles";
import { getWeeklyReport } from "@/utils/api/reportApi";
import type { WeeklyReportResponse } from "@/utils/types/report";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const WEEK_DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const DAY_OF_WEEK_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;
const MAX_DAILY_CALORIES = 2400;

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
  const [report, setReport] = useState<WeeklyReportResponse["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedWeekRef = useRef<string | null>(null);

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

  const weekStart = useMemo(() => {
    const date = new Date(selectedDate);

    const day = date.getDay(); // 일:0 ~ 토:6
    const diff = day === 0 ? -6 : 1 - day;

    date.setDate(date.getDate() + diff);

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  const weekTitle = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const week = getWeekOfMonth(selectedDate);

    return `${year}년 ${String(month).padStart(2, "0")}월 ${week}주차`;
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();

      const fetchWeeklyReport = async () => {
        if (lastFetchedWeekRef.current !== weekStart) setLoading(true);
        setError(null);
        try {
          const response = await getWeeklyReport(weekStart);
          if (!controller.signal.aborted) {
            lastFetchedWeekRef.current = weekStart;
            setReport(response.data);
          }
        } catch (err) {
          if (!controller.signal.aborted) {
            const message =
              err instanceof Error ? err.message : "오류가 발생했습니다.";
            if (message.includes("인증 토큰")) {
              router.replace("/(auth)/SocialLogin");
              return;
            }
            setError(message);
          }
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      };

      fetchWeeklyReport();
      return () => controller.abort();
    }, [weekStart]),
  );

  const dailyCalories = useMemo(() => {
    if (!report) return [];

    return DAY_OF_WEEK_ORDER.map((day) => report.daily_kcals[day] ?? 0);
  }, [report]);

  if (loading) {
    return (
      <KkBackground>
        <KkHeader title="주간 리포트" />
      </KkBackground>
    );
  }

  if (error) {
    return (
      <KkBackground>
        <KkHeader title="주간 리포트" />
        <View style={errorStyles.container}>
          <Text style={errorStyles.message}>{error}</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={errorStyles.button}
          >
            <Text style={errorStyles.buttonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </KkBackground>
    );
  }

  if (!report) {
    return null;
  }

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

        <WeeklyCaloriesCard
          dailyCalories={dailyCalories}
          weekDays={WEEK_DAYS}
          maxCalories={MAX_DAILY_CALORIES}
        />
        <WeeklyNutrientsCard nutrients={report.nutrient_feedbacks} />
        <WeeklyPatternCard description={report.meal_pattern_description} />
        <WeeklySuggestionsCard suggestions={report.next_week_suggestions} />
      </ScrollView>
    </KkBackground>
  );
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  message: {
    color: "#E7E2DF",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Pretendard-Regular",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  buttonText: {
    color: "#E7E2DF",
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
  },
});
