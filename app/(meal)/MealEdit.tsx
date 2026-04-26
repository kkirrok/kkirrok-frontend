import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { BackHandler, ScrollView, StyleSheet } from "react-native";
import MealCards, { NutrientKey } from "./components/MealCards";
import MealDonutChart from "./components/MealDonutChart";
import MealTypeTab, { MealType } from "./components/MealTypeTab";

const defaultNutrients = (
  protein?: string,
  carb?: string,
  sugar?: string,
  fat?: string,
  sodium?: string,
): Record<NutrientKey, string> => ({
  단백질: protein ?? "0",
  탄수화물: carb ?? "0",
  당: sugar ?? "0",
  지방: fat ?? "0",
  나트륨: sodium ?? "0",
});

export default function MealEdit() {
  const params = useLocalSearchParams<{
    id?: string;
    mealName?: string;
    calories?: string;
    recordTime?: string;
    mealType?: MealType;
    protein?: string;
    carb?: string;
    sugar?: string;
    fat?: string;
    sodium?: string;
    photo?: string;
  }>();

  const [exitModalVisible, setExitModalVisible] = useState(false);

  const [mealType, setMealType] = useState<MealType>(params.mealType ?? "간식");
  const [mealName, setMealName] = useState(params.mealName ?? "");
  const [calories, setCalories] = useState(params.calories ?? "0");
  const [recordTime] = useState(params.recordTime ?? "00:00 AM");
  const [photo] = useState<string | null>(params.photo ? params.photo : null);

  const [nutrients, setNutrients] = useState<Record<NutrientKey, string>>(
    defaultNutrients(
      params.protein,
      params.carb,
      params.sugar,
      params.fat,
      params.sodium,
    ),
  );

  const openExitModal = () => {
    setExitModalVisible(true);
  };

  const handleExit = () => {
    setExitModalVisible(false);
    router.back();
  };

  const handleContinue = () => {
    setExitModalVisible(false);
  };

  const handleSave = () => {
    // TODO: PATCH API 연결
    router.back();
  };

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          openExitModal();
          return true;
        },
      );

      return () => subscription.remove();
    }, []),
  );

  return (
    <KkBackground>
      <KkHeader title="끼니 수정" variant="back" onBackPress={openExitModal} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MealDonutChart
          photo={photo}
          mealName={mealName}
          recognitionFailed={false}
          onCameraPress={() => {}}
        />

        <MealTypeTab mealType={mealType} onSelect={setMealType} />

        <MealCards
          mealName={mealName}
          onMealNameChange={setMealName}
          calories={calories}
          onCaloriesChange={setCalories}
          recordTime={recordTime}
          nutrients={nutrients}
          onNutrientChange={(key, value) =>
            setNutrients((prev) => ({ ...prev, [key]: value }))
          }
        />

        <KkButton
          title="수정 완료"
          size="large"
          onPress={handleSave}
          style={styles.submitButton}
        />
      </ScrollView>

      <KkModal
        visible={exitModalVisible}
        onClose={handleContinue}
        message={
          "끼니 기록을 변경 중이에요.\n지금 나가면 작성된 정보가 사라져요."
        }
        cancelText="나가기"
        buttonText="계속 작성하기"
        onCancelPress={handleExit}
        onButtonPress={handleContinue}
      />
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});
