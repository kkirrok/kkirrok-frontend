import KkBackground from "@/components/KkBackground";
import KkLogoHeader from "@/components/KkLogoHeader";
import MealSection from "@/components/report/MealSection";
import MonthCalendar from "@/components/report/MonthCalendar";
import NutritionCard from "@/components/report/NutritionCard";
import { MOCK_MEALS, MOCK_NUTRITION } from "@/components/report/mockData";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function toMonthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function getMarkedDays(year: number, month: number): number[] {
  const prefix = toMonthKey(year, month);
  return Object.keys(MOCK_MEALS)
    .filter((k) => k.startsWith(prefix))
    .map((k) => parseInt(k.split("-")[2], 10));
}

function toDateLabel(month: number, day: number) {
  return `${month}월 ${day}일`;
}

export default function ReportPage() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === "ios" ? 60 + insets.bottom + 20 : 90;

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(9);

  const markedDays = getMarkedDays(year, month);
  const dateKey = toDateKey(year, month, selectedDay);
  const nutrition = MOCK_NUTRITION[dateKey] ?? null;
  const meals = MOCK_MEALS[dateKey] ?? [];
  const dateLabel = toDateLabel(month, selectedDay);
  const nutritionDateLabel = `${year}.${String(month).padStart(2, "0")}.${String(selectedDay).padStart(2, "0")}`;

  const handlePrevMonth = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
    setSelectedDay(1);
  };

  return (
    <KkBackground>
      <KkLogoHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight }]}
      >
        <MonthCalendar
          year={year}
          month={month}
          markedDays={markedDays}
          todayDay={today.getMonth() + 1 === month && today.getFullYear() === year ? today.getDate() : -1}
          onSelectDay={setSelectedDay}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {nutrition && (
          <NutritionCard dateLabel={nutritionDateLabel} nutrition={nutrition} />
        )}

        <MealSection dateLabel={dateLabel} meals={meals} />
      </ScrollView>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: 16,
  },
});
