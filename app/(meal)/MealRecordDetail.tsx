import KkBackground from "@/components/KkBackground";
import KkModal from "@/components/KkModal";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
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
import MealDonutChart from "./components/MealDonutChart";
import MealTypeTab, { MealType } from "./components/MealTypeTab";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 20;
const CHART_AREA_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;

const MOCK_RECORDS = [
  {
    id: "1",
    mealType: "아침" as MealType,
    mealName: "에그 토스트",
    calories: "455",
    recordTime: "08:30 AM",
    nutrients: {
      단백질: "18",
      탄수화물: "46",
      당: "10",
      지방: "23",
      나트륨: "720",
    } as Record<NutrientKey, string>,
    photo:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=500&h=500&fit=crop",
    title: "디저트 집착 유형 끼록이들의 어제 이 시간대 픽!",
    timeLabel: "18:00 기준",
    foods: [
      {
        id: "b1",
        name: "토스트",
        calories: "250",
        badge: "탄수화물 높음",
        image:
          "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=300&h=300&fit=crop",
      },
      {
        id: "b2",
        name: "시리얼",
        calories: "200",
        badge: "당류 높음",
        image:
          "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=300&h=300&fit=crop",
      },
      {
        id: "b3",
        name: "김밥",
        calories: "400",
        badge: "나트륨 높음",
        image:
          "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=300&h=300&fit=crop",
      },
      {
        id: "b4",
        name: "베이글",
        calories: "320",
        badge: "탄수화물 높음",
        image:
          "https://images.unsplash.com/photo-1533243232422-0bb12bb388c7?q=80&w=300&h=300&fit=crop",
      },
      {
        id: "b5",
        name: "오트밀",
        calories: "150",
        badge: "지방 낮음",
        image:
          "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=300&h=300&fit=crop",
      },
    ] as FoodItem[],
  },
  {
    id: "2",
    mealType: "점심" as MealType,
    mealName: "떡볶이",
    calories: "685",
    recordTime: "12:15 PM",
    nutrients: {
      단백질: "14",
      탄수화물: "118",
      당: "32",
      지방: "17",
      나트륨: "1580",
    } as Record<NutrientKey, string>,
    photo:
      "https://images.unsplash.com/photo-1635363638580-c2809d049eee?q=80&w=500&h=500&fit=crop",
    title: "디저트 집착 유형 끼록이들의 어제 이 시간대 픽!",
    timeLabel: "18:00 기준",
    foods: [
      {
        id: "l1",
        name: "제육덮밥",
        calories: "750",
        badge: "단백질 많음",
        image:
          "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=300&h=300&fit=crop",
      },
      {
        id: "l2",
        name: "돈까스",
        calories: "850",
        badge: "지방 높음",
        image:
          "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=300&h=300&fit=crop",
      },
      {
        id: "l3",
        name: "비빔밥",
        calories: "500",
        badge: "탄수화물 높음",
        image:
          "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=300&h=300&fit=crop",
      },
      {
        id: "l4",
        name: "김치찌개",
        calories: "450",
        badge: "나트륨 높음",
        image:
          "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=300&h=300&fit=crop",
      },
      {
        id: "l5",
        name: "샌드위치",
        calories: "400",
        badge: "단백질 많음",
        image:
          "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=300&h=300&fit=crop",
      },
    ] as FoodItem[],
  },
];

export default function MealRecordDetail() {
  const insets = useSafeAreaInsets();
  const chartListRef = useRef<FlatList<(typeof MOCK_RECORDS)[number]>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const record = MOCK_RECORDS[currentIndex];
  const total = MOCK_RECORDS.length;

  const moveToIndex = (index: number) => {
    const nextIndex = Math.max(0, Math.min(total - 1, index));

    setCurrentIndex(nextIndex);

    chartListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });
  };

  const handlePrev = () => {
    moveToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    moveToIndex(currentIndex + 1);
  };

  const handleChartSwipe = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(x / CHART_AREA_WIDTH);

    setCurrentIndex(nextIndex);
  };

  const handleDelete = () => {
    setDeleteModalVisible(false);

    // TODO: 실제 삭제 API
    // DELETE /meals/{id}

    router.back(); // 삭제 후 뒤로
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chartArea}>
          <FlatList
            ref={chartListRef}
            data={MOCK_RECORDS}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleChartSwipe}
            renderItem={({ item }) => (
              <View style={styles.chartPage}>
                <MealDonutChart
                  photo={item.photo}
                  mealName={item.mealName}
                  recognitionFailed={false}
                  onCameraPress={() => {}}
                />
              </View>
            )}
          />

          <TouchableOpacity
            onPress={handlePrev}
            style={[
              styles.sideNavBtn,
              styles.leftNavBtn,
              currentIndex === 0 && styles.sideNavBtnDisabled,
            ]}
            disabled={currentIndex === 0}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.gray[100]} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
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
          {MOCK_RECORDS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>

        <MealTypeTab mealType={record.mealType} onSelect={() => {}} />

        <MealCards
          mealName={record.mealName}
          onMealNameChange={() => {}}
          calories={record.calories}
          recordTime={record.recordTime}
          nutrients={record.nutrients}
          onNutrientChange={() => {}}
        />

        <FoodItemScroll
          foods={record.foods}
          title={record.title}
          timeLabel={record.timeLabel}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() =>
              router.push({
                pathname: "/MealEdit",
                params: {
                  id: record.id,
                  mealName: record.mealName,
                  calories: record.calories,
                  recordTime: record.recordTime,
                  mealType: record.mealType,
                  protein: record.nutrients.단백질,
                  carb: record.nutrients.탄수화물,
                  sugar: record.nutrients.당,
                  fat: record.nutrients.지방,
                  sodium: record.nutrients.나트륨,
                  photo: record.photo ?? "",
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
      </ScrollView>
      <KkModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        message="끼니 기록을 삭제하시겠습니까?"
        cancelText="뒤로 가기"
        buttonText="삭제하기"
        onCancelPress={() => setDeleteModalVisible(false)}
        onButtonPress={handleDelete}
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
