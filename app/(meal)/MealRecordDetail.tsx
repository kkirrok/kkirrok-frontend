import KkBackground from "@/components/KkBackground";
import KkModal from "@/components/KkModal";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import {
  deleteMeal,
  fetchTodayMeals,
  fetchYesterdayPicks,
  MEAL_TIME_SLOT_TO_TYPE,
  TodayMealRecord,
  YesterdayPicksResult,
} from "@/utils/api/mealApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FoodItemScroll, { FoodItem } from "./components/FoodItemScroll";
import MealCards, { NutrientKey } from "./components/MealCards";
import MealDonutChart, { DonutSegment } from "./components/MealDonutChart";
import MealTypeTab from "./components/MealTypeTab";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 20;
const CHART_AREA_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;

function formatRecordedAt(recordedAt: string | null): string {
  if (!recordedAt) return "--:-- --";
  const date = new Date(recordedAt);
  const h = date.getHours();
  const m = date.getMinutes();
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

function makeSegments(r: TodayMealRecord): DonutSegment[] | undefined {
  if (
    r.carbohydrate_percent == null ||
    r.protein_percent == null ||
    r.fat_percent == null
  )
    return undefined;
  return [
    { label: "탄수화물", color: "#F6623B", pct: r.carbohydrate_percent / 100 },
    { label: "단백질", color: "#F99B85", pct: r.protein_percent / 100 },
    { label: "지방", color: "#FECFC6", pct: r.fat_percent / 100 },
  ];
}

export default function MealRecordDetail() {
  const { mealId } = useLocalSearchParams<{ mealId?: string }>();
  const insets = useSafeAreaInsets();
  const chartListRef = useRef<FlatList<TodayMealRecord>>(null);
  const [records, setRecords] = useState<TodayMealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [yesterdayPicks, setYesterdayPicks] =
    useState<YesterdayPicksResult | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);

      const loadData = async () => {
        const [mealsResult, picksResult] = await Promise.allSettled([
          fetchTodayMeals(),
          fetchYesterdayPicks(),
        ]);
        if (cancelled) return;

        if (mealsResult.status === "fulfilled") {
          const meals = mealsResult.value;
          setRecords(meals);
          const targetIndex = mealId
            ? Math.max(
                0,
                meals.findIndex((m) => m.meal_id === Number(mealId)),
              )
            : 0;
          setCurrentIndex(targetIndex);
          if (targetIndex > 0) {
            setTimeout(() => {
              chartListRef.current?.scrollToIndex({
                index: targetIndex,
                animated: false,
              });
            }, 0);
          }
        } else {
          setRecords([]);
          const msg =
            mealsResult.reason?.message ?? "식사 기록을 불러오지 못했어요.";
          if (msg.includes("인증 토큰")) {
            router.replace("/(auth)/SocialLogin");
            return;
          }
          setErrorMessage(msg);
        }

        if (picksResult.status === "fulfilled") {
          setYesterdayPicks(picksResult.value);
        } else {
          setYesterdayPicks(null);
        }

        setLoading(false);
      };

      loadData();
      return () => {
        cancelled = true;
      };
    }, [mealId]),
  );

  const record = records[currentIndex];
  const total = records.length;

  const moveToIndex = (index: number) => {
    const nextIndex = Math.max(0, Math.min(total - 1, index));
    setCurrentIndex(nextIndex);
    chartListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handleChartSwipe = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / CHART_AREA_WIDTH));
  };

  const handleDelete = async () => {
    setDeleteModalVisible(false);
    if (!record) return;
    try {
      await deleteMeal(record.meal_id);
      router.back();
    } catch (err: any) {
      setErrorMessage(err?.message ?? "삭제에 실패했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <KkBackground>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
        >
          <Ionicons name="chevron-back" size={28} color={Colors.gray[100]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>끼니 기록</Text>
        <View style={styles.headerRightBlank} />
      </View>

      {loading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={Colors.main[500]} />
        </View>
      ) : total === 0 ? (
        <View style={styles.centerFill}>
          <Text style={styles.emptyText}>오늘 기록된 식사가 없어요.</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.chartArea}>
            <FlatList
              ref={chartListRef}
              data={records}
              keyExtractor={(item) => String(item.meal_id)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleChartSwipe}
              renderItem={({ item }) => (
                <View style={styles.chartPage}>
                  <MealDonutChart
                    photo={null}
                    mealName={item.food_name}
                    recognitionFailed={false}
                    onCameraPress={() => {}}
                    segments={makeSegments(item)}
                  />
                </View>
              )}
            />

            <TouchableOpacity
              onPress={() => moveToIndex(currentIndex - 1)}
              style={[
                styles.sideNavBtn,
                styles.leftNavBtn,
                currentIndex === 0 && styles.sideNavBtnDisabled,
              ]}
              disabled={currentIndex === 0}
              activeOpacity={0.8}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={Colors.gray[100]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => moveToIndex(currentIndex + 1)}
              style={[
                styles.sideNavBtn,
                styles.rightNavBtn,
                currentIndex === total - 1 && styles.sideNavBtnDisabled,
              ]}
              disabled={currentIndex === total - 1}
              activeOpacity={0.8}
            >
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.gray[100]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.dots}>
            {records.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentIndex && styles.dotActive]}
              />
            ))}
          </View>

          {record && (
            <>
              <MealTypeTab
                mealType={MEAL_TIME_SLOT_TO_TYPE[record.meal_time_slot]}
                onSelect={() => {}}
              />

              <MealCards
                mealName={record.food_name}
                onMealNameChange={() => {}}
                calories={String(record.kcal)}
                recordTime={formatRecordedAt(record.recorded_at)}
                nutrients={
                  {
                    단백질: String(record.protein_g),
                    탄수화물: String(record.carbohydrate_g),
                    당: String(record.sugar_g),
                    지방: String(record.fat_g),
                    나트륨: String(record.sodium_mg),
                  } as Record<NutrientKey, string>
                }
                onNutrientChange={() => {}}
              />

              {yesterdayPicks != null && yesterdayPicks.picks.length > 0 && (
                <FoodItemScroll
                  title={`${yesterdayPicks.meal_style} 유형 끼록이들의 어제 이 시간대 픽!`}
                  timeLabel={
                    MEAL_TIME_SLOT_TO_TYPE[
                      yesterdayPicks.time_slot as keyof typeof MEAL_TIME_SLOT_TO_TYPE
                    ] ?? yesterdayPicks.time_slot
                  }
                  foods={yesterdayPicks.picks.map((p): FoodItem => ({
                    id: String(p.meal_id),
                    name: p.food_name,
                    calories: String(p.kcal),
                    image: p.image_url ?? null,
                  }))}
                />
              )}

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() =>
                    router.push({
                      pathname: "/MealEdit",
                      params: {
                        id: String(record.meal_id),
                        mealName: record.food_name,
                        calories: String(record.kcal),
                        recordTime: formatRecordedAt(record.recorded_at),
                        mealType: MEAL_TIME_SLOT_TO_TYPE[record.meal_time_slot],
                        protein: String(record.protein_g),
                        carb: String(record.carbohydrate_g),
                        sugar: String(record.sugar_g),
                        fat: String(record.fat_g),
                        sodium: String(record.sodium_mg),
                        photo: "",
                      },
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionBtnText}>수정하기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => setDeleteModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionBtnText}>삭제하기</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      )}

      <KkModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        message="끼니 기록을 삭제하시겠습니까?"
        cancelText="뒤로 가기"
        buttonText="삭제하기"
        onCancelPress={() => setDeleteModalVisible(false)}
        onButtonPress={handleDelete}
      />
      <KkModal
        visible={errorMessage != null}
        onClose={() => setErrorMessage(null)}
        message={errorMessage ?? ""}
        buttonText="확인"
        onButtonPress={() => setErrorMessage(null)}
      />
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 88,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    ...Typography.title.m,
    color: Colors.gray[100],
    textAlign: "center",
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRightBlank: {
    width: 40,
  },

  centerFill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    ...Typography.body.l,
    color: Colors.gray[400],
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 40,
    gap: 16,
  },

  chartArea: {
    width: CHART_AREA_WIDTH,
    position: "relative",
    alignSelf: "center",
  },
  chartPage: {
    width: CHART_AREA_WIDTH,
    alignItems: "center",
  },

  sideNavBtn: {
    position: "absolute",
    top: "42%",
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  leftNavBtn: {
    left: 0,
  },
  rightNavBtn: {
    right: 0,
  },
  sideNavBtnDisabled: {
    opacity: 0,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: -8,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray[700],
  },
  dotActive: {
    backgroundColor: Colors.gray[200],
  },

  actionRow: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editBtn: {
    backgroundColor: Colors.main[500],
  },
  deleteBtn: {
    backgroundColor: Colors.gray[900],
  },
  actionBtnText: {
    ...Typography.caption[1],
    color: Colors.gray[200],
  },
});
