import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import { consumeMealPhoto } from "@/utils/mealPhotoStore";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import MealCards, { NutrientKey } from "./components/MealCards";
import MealDonutChart from "./components/MealDonutChart";
import MealTypeTab, { MealType } from "./components/MealTypeTab";

function formatTime(date: Date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

const defaultNutrients = (): Record<NutrientKey, string> => ({
  단백질: "0",
  탄수화물: "0",
  당: "0",
  지방: "0",
  나트륨: "0",
});

export default function MealRecord() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [recognitionFailed, setRecognitionFailed] = useState(false);
  const [mealType, setMealType] = useState<MealType>("간식");
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("0");
  const [nutrients, setNutrients] =
    useState<Record<NutrientKey, string>>(defaultNutrients());
  const [recordTime, setRecordTime] = useState("00:00 AM");

  const analyzePhoto = async (_uri: string) => {
    // TODO: 실제 AI API 연동
    setMealName("");
    setCalories("0");
    setNutrients(defaultNutrients());
    setRecognitionFailed(true);
  };

  useFocusEffect(
    useCallback(() => {
      const uri = consumeMealPhoto();
      if (uri) {
        setPhoto(uri);
        setRecordTime(formatTime(new Date()));
        setRecognitionFailed(false);
        analyzePhoto(uri);
      }
    }, []),
  );

  return (
    <KkBackground>
      <KkHeader title="끼니 기록" variant="back" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MealDonutChart
          photo={photo}
          recognitionFailed={recognitionFailed}
          onCameraPress={() =>
            router.push({ pathname: "/camera", params: { source: "meal" } })
          }
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
          title="끼록하기"
          size="large"
          onPress={() => {}}
          style={styles.submitButton}
        />
      </ScrollView>
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
