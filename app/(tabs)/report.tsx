import KkBackground from "@/components/KkBackground";
import KkLogoHeader from "@/components/KkLogoHeader";
import MealSection from "@/components/report/MealSection";
import MonthCalendar from "@/components/report/MonthCalendar";
import NutritionCard from "@/components/report/NutritionCard";
import { DayNutrition, MealRecord, MealType } from "@/utils/types/meal";
import { fetchCalendar, fetchDailyCalendar, MealItem } from "@/utils/api/calendarApi";
import { recordMealManual } from "@/utils/api/mealApi";
import QuickAddFoodSheet, { QuickAddFormData } from "@/components/quickAdd/QuickAddFoodSheet";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_CALORIES = 2000;
const MAX_CARBS = 300;
const MAX_PROTEIN = 55;
const MAX_FAT = 54;
const MAX_SUGAR = 50;
const MAX_SODIUM = 2000;

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function toDateLabel(month: number, day: number) {
  return `${month}월 ${day}일`;
}

function mapMealItem(item: MealItem, mealType: MealRecord["mealType"]): MealRecord {
  return {
    id: String(item.meal_id),
    name: item.food_name,
    calories: item.kcal,
    carbs: item.carbohydrate_g,
    protein: item.protein_g,
    fat: item.fat_g,
    sodium: item.sodium_mg,
    sugar: item.sugar_g,
    mealType,
  };
}

export default function ReportPage() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === "ios" ? 60 + insets.bottom + 20 : 90;

  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());
  const [markedDays, setMarkedDays] = useState<number[]>([]);
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [nutrition, setNutrition] = useState<DayNutrition | null>(null);
  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const [quickAddMealType, setQuickAddMealType] = useState<MealType>("아침");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchCalendar(year, month, controller.signal)
      .then((data) => {
        const energeticDays = data.day_infos
          .filter((d) => d.status === "ENERGETIC")
          .map((d) => d.day_of_month);
        setMarkedDays(energeticDays);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setMarkedDays([]);
      });
    return () => controller.abort();
  }, [year, month, refreshKey]);

  useEffect(() => {
    setMeals([]);
    setNutrition(null);
    const controller = new AbortController();
    const dateStr = formatDate(year, month, selectedDay);
    fetchDailyCalendar(dateStr, controller.signal)
      .then((data) => {
        const allMeals: MealRecord[] = [
          ...data.breakfast_meals.map((m) => mapMealItem(m, "아침")),
          ...data.lunch_meals.map((m) => mapMealItem(m, "점심")),
          ...data.dinner_meals.map((m) => mapMealItem(m, "저녁")),
          ...data.snack_meals.map((m) => mapMealItem(m, "간식")),
          ...data.midnight_snack_meals.map((m) => mapMealItem(m, "야식")),
        ];
        setMeals(allMeals);
        setNutrition(
          data.total_kcal > 0
            ? {
                calories: data.total_kcal,
                maxCalories: MAX_CALORIES,
                carbs: data.total_carbohydrate_g,
                maxCarbs: MAX_CARBS,
                protein: data.total_protein_g,
                maxProtein: MAX_PROTEIN,
                fat: data.total_fat_g,
                maxFat: MAX_FAT,
                sugar: data.total_sugar_g,
                maxSugar: MAX_SUGAR,
                sodium: data.total_sodium_mg,
                maxSodium: MAX_SODIUM,
              }
            : null,
        );
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setMeals([]);
        setNutrition(null);
      });
    return () => controller.abort();
  }, [year, month, selectedDay, refreshKey]);

  const todayDay = useMemo(() => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() + 1 === month
      ? now.getDate()
      : -1;
  }, [year, month]);

  const dateLabel = toDateLabel(month, selectedDay);
  const nutritionDateLabel = formatDate(year, month, selectedDay).replace(/-/g, ".");

  const handleAddMeal = useCallback((mealType: MealType) => {
    setQuickAddMealType(mealType);
    setQuickAddVisible(true);
  }, []);

  const handleQuickAddSubmit = useCallback(
    async (data: QuickAddFormData) => {
      await recordMealManual({
        date: formatDate(year, month, selectedDay),
        mealType: data.mealType,
        foodName: data.name,
        kcal: Number(data.calories),
        carbohydrateG: Number(data.carbs),
        proteinG: Number(data.protein),
        fatG: Number(data.fat),
        sugarG: Number(data.sugar),
        sodiumMg: Number(data.sodium),
      });
      setRefreshKey((k) => k + 1);
    },
    [year, month, selectedDay],
  );

  const handlePrevMonth = useCallback(() => {
    setYear((y) => (month === 1 ? y - 1 : y));
    setMonth((m) => (m === 1 ? 12 : m - 1));
    setSelectedDay(1);
  }, [month]);

  const handleNextMonth = useCallback(() => {
    setYear((y) => (month === 12 ? y + 1 : y));
    setMonth((m) => (m === 12 ? 1 : m + 1));
    setSelectedDay(1);
  }, [month]);

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
          todayDay={todayDay}
          onSelectDay={setSelectedDay}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {nutrition && (
          <NutritionCard dateLabel={nutritionDateLabel} nutrition={nutrition} />
        )}

        <MealSection
          key={`${year}-${month}-${selectedDay}`}
          dateLabel={dateLabel}
          meals={meals}
          onAdd={handleAddMeal}
        />
      </ScrollView>
      <QuickAddFoodSheet
        visible={quickAddVisible}
        initialMealType={quickAddMealType}
        onClose={() => setQuickAddVisible(false)}
        onSubmit={handleQuickAddSubmit}
      />
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: 16,
  },
});
