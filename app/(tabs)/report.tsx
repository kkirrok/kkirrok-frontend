import KkBackground from "@/components/KkBackground";
import KkLogoHeader from "@/components/KkLogoHeader";
import MealSection from "@/components/report/MealSection";
import MonthCalendar from "@/components/report/MonthCalendar";
import NutritionCard from "@/components/report/NutritionCard";
import SkeletonReport from "@/components/skeleton/SkeletonReport";
import { useCalendar, useDailyCalendar, useRecordMealManual } from "@/hooks/useCalendar";
import { MealItem } from "@/utils/api/calendarApi";
import { DayNutrition, MealRecord, MealType } from "@/utils/types/meal";
import QuickAddFoodSheet, {
  QuickAddFormData,
} from "@/components/quickAdd/QuickAddFoodSheet";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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

function mapMealItem(
  item: MealItem,
  mealType: MealRecord["mealType"],
): MealRecord {
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
  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const [quickAddMealType, setQuickAddMealType] = useState<MealType>("아침");

  const { data: calendarData } = useCalendar(year, month);
  const dateStr = formatDate(year, month, selectedDay);
  const {
    data: dailyData,
    isLoading: isLoadingDaily,
    refetch: refetchDaily,
  } = useDailyCalendar(dateStr);
  const { mutateAsync: addMeal } = useRecordMealManual();

  useFocusEffect(
    useCallback(() => {
      refetchDaily();
    }, [refetchDaily]),
  );

  const markedDays = useMemo(
    () =>
      calendarData?.day_infos
        .filter((d) => d.status === "ENERGETIC")
        .map((d) => d.day_of_month) ?? [],
    [calendarData],
  );

  const meals = useMemo<MealRecord[]>(() => {
    if (!dailyData) return [];
    return [
      ...dailyData.breakfast_meals.map((m) => mapMealItem(m, "아침")),
      ...dailyData.lunch_meals.map((m) => mapMealItem(m, "점심")),
      ...dailyData.dinner_meals.map((m) => mapMealItem(m, "저녁")),
      ...dailyData.snack_meals.map((m) => mapMealItem(m, "간식")),
      ...dailyData.midnight_snack_meals.map((m) => mapMealItem(m, "야식")),
    ];
  }, [dailyData]);

  const nutrition = useMemo<DayNutrition | null>(() => {
    if (!dailyData || dailyData.total_kcal === 0) return null;
    return {
      calories: dailyData.total_kcal,
      maxCalories: MAX_CALORIES,
      carbs: dailyData.total_carbohydrate_g,
      maxCarbs: MAX_CARBS,
      protein: dailyData.total_protein_g,
      maxProtein: MAX_PROTEIN,
      fat: dailyData.total_fat_g,
      maxFat: MAX_FAT,
      sugar: dailyData.total_sugar_g,
      maxSugar: MAX_SUGAR,
      sodium: dailyData.total_sodium_mg,
      maxSodium: MAX_SODIUM,
    };
  }, [dailyData]);

  const todayDay = useMemo(() => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() + 1 === month
      ? now.getDate()
      : -1;
  }, [year, month]);

  const dateLabel = toDateLabel(month, selectedDay);
  const nutritionDateLabel = formatDate(year, month, selectedDay).replace(
    /-/g,
    ".",
  );

  const handleAddMeal = useCallback((mealType: MealType) => {
    setQuickAddMealType(mealType);
    setQuickAddVisible(true);
  }, []);

  const handleQuickAddSubmit = useCallback(
    async (data: QuickAddFormData) => {
      try {
        await addMeal({
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
      } catch (err) {
        console.error(err);
      }
    },
    [year, month, selectedDay, addMeal],
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
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {isLoadingDaily ? (
          <SkeletonReport />
        ) : (
          <>
            {nutrition && (
              <NutritionCard
                dateLabel={nutritionDateLabel}
                nutrition={nutrition}
              />
            )}
            <MealSection
              key={`${year}-${month}-${selectedDay}`}
              dateLabel={dateLabel}
              meals={meals}
              onAdd={handleAddMeal}
            />
          </>
        )}
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
