import KkBackground from "@/components/KkBackground";
import KkLogoHeader from "@/components/KkLogoHeader";
import SkeletonHome from "@/components/skeleton/SkeletonHome";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import KkirokSimpleLogo from "@/assets/logo/kkirok_white_simple_logo.svg";
import {
  fetchHome,
  fetchRecommendations,
  type HomeData,
  type HomeReminder,
  type RecommendationsData,
} from "@/utils/api/homeApi";
import {
  fetchTodayMeals,
  fetchTodayNutritionSummary,
  MEAL_TIME_SLOT_TO_TYPE,
} from "@/utils/api/mealApi";
import type { NutritionSummary, TodayMealRecord } from "@/utils/types/meal";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

function formatTime(isoString: string | null): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type NutrientBarProps = {
  label: string;
  actual: number;
  recommended?: number;
  unit: string;
};

function NutrientBar({ label, actual, recommended, unit }: NutrientBarProps) {
  const pct = recommended ? Math.min((actual / recommended) * 100, 100) : 0;
  const valueText = recommended
    ? `${actual}/${recommended}${unit}`
    : `${actual}${unit}`;
  return (
    <View style={styles.nutrientRow}>
      <Text style={styles.nutrientLabel}>{label}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.nutrientValue}>{valueText}</Text>
    </View>
  );
}

type TimelineItem =
  | { type: "meal"; data: TodayMealRecord }
  | { type: "reminder"; data: HomeReminder };

function MealTimeline({
  meals,
  reminder,
}: {
  meals: TodayMealRecord[];
  reminder: HomeReminder | null;
}) {
  const router = useRouter();
  const items: TimelineItem[] = [
    ...meals.map((m) => ({ type: "meal" as const, data: m })),
    ...(reminder?.is_time_to_kkirok
      ? [{ type: "reminder" as const, data: reminder }]
      : []),
  ];

  if (items.length === 0) return null;

  return (
    <View>
      {items.map((item, i) => {
        const isFirst = i === 0;
        const isLast = i === items.length - 1;
        const time =
          item.type === "meal"
            ? formatTime(item.data.recorded_at)
            : formatTime(new Date().toISOString());

        return (
          <View key={i} style={styles.tlRow}>
            <View style={styles.tlSpine}>
              <View
                style={isFirst ? styles.tlLineSpacer : styles.tlLineSegment}
              />
              <View style={styles.tlDot} />
              <View
                style={isLast ? styles.tlLineSpacer : styles.tlLineSegment}
              />
            </View>
            <View style={styles.tlTimeCol}>
              <Text style={styles.tlTime}>{time}</Text>
            </View>
            <View style={styles.tlCardCol}>
              {item.type === "meal" ? (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() =>
                    router.push({
                      pathname: "/(meal)/MealRecordDetail",
                      params: { mealId: item.data.meal_id },
                    })
                  }
                  style={styles.tlCard}
                >
                  <View style={styles.tlCardInner}>
                    <View style={styles.tlImageCircle}>
                      <KkirokSimpleLogo width={72} height={72} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.tlTitleRow}>
                        <Text style={styles.tlFoodName}>
                          {item.data.food_name}
                        </Text>
                        <View style={styles.tlMealTag}>
                          <Text style={styles.tlMealTagText}>
                            {MEAL_TIME_SLOT_TO_TYPE[item.data.meal_time_slot]}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.tlKcal}>{item.data.kcal}kcal</Text>
                      <Text style={styles.tlNutrients}>
                        단백질 {item.data.protein_g}g 탄수화물{" "}
                        {item.data.carbohydrate_g}g{"\n"}지방 {item.data.fat_g}g{" "}
                        당 {item.data.sugar_g}g 나트륨 {item.data.sodium_mg}
                        mg
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={[styles.tlCard, styles.tlReminderCard]}>
                  <Text style={styles.tlReminderTitle}>끼록할 시간이에요!</Text>
                  <Text style={styles.tlReminderSub}>
                    {item.data.description}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function Home() {
  const [home, setHome] = useState<HomeData | null>(null);
  const [nutrition, setNutrition] = useState<NutritionSummary | null>(null);
  const [recommendations, setRecommendations] =
    useState<RecommendationsData | null>(null);
  const [todayMeals, setTodayMeals] = useState<TodayMealRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setIsLoading(true);
      fetchHome()
        .then((data) => {
          if (!cancelled) setHome(data);
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
      fetchTodayNutritionSummary()
        .then((data) => {
          if (!cancelled) setNutrition(data);
        })
        .catch(() => {});
      fetchRecommendations()
        .then((data) => {
          if (!cancelled) setRecommendations(data);
        })
        .catch(() => {});
      fetchTodayMeals()
        .then((data) => {
          if (!cancelled) setTodayMeals(data);
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const exerciseRecs = recommendations?.exercise_recommend ?? [];
  const foodRecs = recommendations?.food_recommend ?? [];
  const showTimeline =
    todayMeals.length > 0 || home?.reminder?.is_time_to_kkirok === true;

  return (
    <KkBackground>
      <ScrollView>
        <KkLogoHeader />
        {isLoading ? (
          <SkeletonHome />
        ) : (
        <View style={styles.container}>
          {/* 프로필 카드 */}
          <Card style={{ borderWidth: 0.5, borderColor: "#FF8868" }}>
            <Text style={styles.title}>
              {home?.member_info?.meal_style_label ?? "식사 유형"}
            </Text>
            <Text style={styles.nickname}>
              {home?.member_info?.nickname
                ? `${home.member_info.nickname}님`
                : ""}
            </Text>
          </Card>

          {/* 오늘의 끼니 타임라인 */}
          {showTimeline && (
            <>
              <Text style={styles.sectionTitle}>오늘의 끼니</Text>
              <MealTimeline
                meals={todayMeals}
                reminder={home?.reminder ?? null}
              />
            </>
          )}

          {/* 오늘의 영양성분 */}
          <Text style={styles.sectionTitle}>오늘의 영양성분</Text>
          <Card>
            <NutrientBar
              label="단백질"
              actual={nutrition?.total_protein_g ?? 0}
              recommended={nutrition?.recommended_protein_g}
              unit="g"
            />
            <NutrientBar
              label="탄수화물"
              actual={nutrition?.total_carbohydrate_g ?? 0}
              recommended={nutrition?.recommended_carbohydrate_g}
              unit="g"
            />
            <NutrientBar
              label="지방"
              actual={nutrition?.total_fat_g ?? 0}
              recommended={nutrition?.recommended_fat_g}
              unit="g"
            />
            <NutrientBar
              label="당"
              actual={nutrition?.total_sugar_g ?? 0}
              unit="g"
            />
            <NutrientBar
              label="나트륨"
              actual={nutrition?.total_sodium_mg ?? 0}
              unit="mg"
            />
          </Card>

          {/* 오늘의 피드백 */}
          <Text style={styles.sectionTitle}>오늘의 피드백</Text>

          {exerciseRecs.length > 0 && (
            <>
              <Text style={styles.subTitle}>
                {recommendations?.target_exercise_kcal ?? 0}kcal에 딱 맞는 운동
              </Text>
              <View style={[styles.row, { marginBottom: 8 }]}>
                {exerciseRecs.slice(0, 2).map((ex, i) => (
                  <Card key={`${ex.exercise_name}-${i}`}>
                    <Text style={styles.cardTitle}>{ex.exercise_name}</Text>
                    <Text style={styles.cardDesc}>{ex.description}</Text>
                    <View style={styles.tagRow}>
                      <Text style={styles.tag}>{ex.category}</Text>
                      <Text style={styles.emojiIcon}>{ex.emoji}</Text>
                    </View>
                  </Card>
                ))}
              </View>
            </>
          )}

          {foodRecs.length > 0 && (
            <>
              <Text style={styles.subTitle}>
                남은 {recommendations?.remaining_food_kcal ?? 0}kcal는 이렇게
                채워봐요!
              </Text>
              <View style={[styles.row, { marginBottom: 16 }]}>
                {foodRecs.slice(0, 2).map((food, i) => (
                  <Card key={`${food.food_name}-${i}`}>
                    <Text style={styles.cardTitle}>{food.food_name}</Text>
                    <Text style={styles.cardDesc}>{food.description}</Text>
                    <View style={styles.tagRow}>
                      {food.target_nutrient_type ? (
                        <Text style={styles.tag}>
                          {food.target_nutrient_type}
                        </Text>
                      ) : (
                        <View />
                      )}
                      <Text style={styles.emojiIcon}>{food.emoji}</Text>
                    </View>
                  </Card>
                ))}
              </View>
            </>
          )}

          {/* 이전 기록 기반 피드백 */}
          {home?.feedback?.description ? (
            <Card>
              <Text style={styles.cardTitle}>이전 요일들 기록 기반 피드백</Text>
              <Text style={styles.cardDesc2}>{home.feedback.description}</Text>
            </Card>
          ) : null}

          <View style={{ height: 98 }} />
        </View>
        )}
      </ScrollView>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
    color: "#FDFCFC",
  },
  nickname: {
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
    marginBottom: 8,
    color: "#FDFCFC",
  },
  sectionTitle: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 20,
    color: "#FDFCFC",
    marginTop: 16,
  },
  subTitle: {
    fontFamily: "Pretendard-SemiBold",
    fontSize: 18,
    color: "#E7E2DF",
  },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  nutrientLabel: {
    width: "20%",
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    color: "#E7E2DF",
  },
  barBg: {
    flex: 1,
    height: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  barFill: {
    height: 20,
    backgroundColor: "#FF8868",
    borderRadius: 8,
  },
  nutrientValue: {
    color: "#E7E2DF",
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    width: 90,
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },
  tag: {
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#372E2A",
    color: "#E7E2DF",
    fontSize: 12,
    alignSelf: "flex-start",
  },
  emojiIcon: {
    fontSize: 32,
  },
  cardTitle: {
    color: "#E7E2DF",
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
  },
  cardDesc: {
    color: "#E7E2DF",
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    marginTop: 4,
  },
  cardDesc2: {
    color: "#E7E2DF",
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    marginTop: 4,
  },
  // 타임라인
  tlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tlTimeCol: {
    width: 40,
    alignItems: "flex-end",
  },
  tlTime: {
    color: Colors.gray[100],
    ...Typography.title.xs,
  },
  tlSpine: {
    width: 16,
    alignItems: "center",
    alignSelf: "stretch",
  },
  tlDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF8868",
  },
  tlLineSegment: {
    flex: 1,
    width: 2,
    backgroundColor: "#FF8868",
  },
  tlLineSpacer: {
    flex: 1,
  },
  tlCardCol: {
    flex: 1,
  },
  tlCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  tlCardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  tlImageCircle: {
    width: 72,
    height: 72,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.12)",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tlTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  tlFoodName: {
    color: Colors.main[100],
    ...Typography.title.xs,
  },
  tlMealTag: {
    backgroundColor: Colors.main[500],
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tlMealTagText: {
    color: Colors.main[100],
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
  },
  tlKcal: {
    color: Colors.gray[200],
    ...Typography.body.m,
  },
  tlNutrients: {
    color: Colors.gray[300],
    ...Typography.caption[1],
    lineHeight: 17,
  },
  tlReminderCard: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 70,
  },
  tlReminderTitle: {
    color: Colors.main[100],
    ...Typography.title.xs,
  },
  tlReminderSub: {
    color: Colors.gray[200],
    ...Typography.body.m,
  },
});
