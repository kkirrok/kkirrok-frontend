import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import {
  confirmScanMeal,
  FoodSearchResult,
  recordMealManual,
  scanMeal,
  searchFoods,
} from "@/utils/api/mealApi";
import { consumeMealPhoto } from "@/utils/store/mealPhotoStore";
import { BlurView } from "expo-blur";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MealCards, { NutrientKey } from "./components/MealCards";
import MealDonutChart, { DonutSegment } from "./components/MealDonutChart";
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
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [scanType, setScanType] = useState<string | null>(null);
  const [recognitionFailed, setRecognitionFailed] = useState(false);
  const [mealType, setMealType] = useState<MealType>("간식");
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("0");
  const [nutrients, setNutrients] =
    useState<Record<NutrientKey, string>>(defaultNutrients());
  const [recordTime, setRecordTime] = useState("00:00 AM");
  const [segments, setSegments] = useState<DonutSegment[] | undefined>(
    undefined,
  );
  const [saving, setSaving] = useState(false);
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const analyzePhoto = async (uri: string) => {
    try {
      const result = await scanMeal(uri, "CAMERA");
      setImageKey(result.image_key);
      setScanType(result.scan_type);
      setMealName(result.food_name);
      setCalories(String(result.kcal));
      setNutrients({
        단백질: String(result.protein_g),
        탄수화물: String(result.carbohydrate_g),
        당: String(result.sugar_g),
        지방: String(result.fat_g),
        나트륨: String(result.sodium_mg),
      });
      setRecordTime(formatTime(new Date()));
      setSegments(undefined);
      setRecognitionFailed(false);
    } catch {
      setMealName("");
      setCalories("0");
      setNutrients(defaultNutrients());
      setSegments(undefined);
      setRecognitionFailed(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const uri = consumeMealPhoto();
      if (uri) {
        setPhoto(uri);
        setImageKey(null);
        setScanType(null);
        setSearchResults([]);
        setRecognitionFailed(false);
        analyzePhoto(uri);
      }
    }, []),
  );

  const handleMealNameChange = (text: string) => {
    setMealName(text);
    if (imageKey != null) return; // 카메라 모드에서는 검색 안 함
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (text.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    searchTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchFoods(text.trim());
        setSearchResults(results.slice(0, 5));
      } catch {
        setSearchResults([]);
      }
    }, 400);
  };

  const applySearchResult = (item: FoodSearchResult) => {
    setMealName(item.food_name);
    setCalories(String(item.kcal));
    setNutrients({
      단백질: String(item.protein_g),
      탄수화물: String(item.carbohydrate_g),
      당: String(item.sugar_g),
      지방: String(item.fat_g),
      나트륨: String(item.sodium_mg),
    });
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const kcal = Number(calories);
      if (imageKey != null && scanType != null) {
        await confirmScanMeal({
          imageKey,
          scanType,
          mealType,
          foodName: mealName,
          kcal,
          carbohydrateG: Number(nutrients.탄수화물),
          proteinG: Number(nutrients.단백질),
          fatG: Number(nutrients.지방),
          sugarG: Number(nutrients.당),
          sodiumMg: Number(nutrients.나트륨),
        });
      } else {
        const today = new Date();
        const date = [
          today.getFullYear(),
          String(today.getMonth() + 1).padStart(2, "0"),
          String(today.getDate()).padStart(2, "0"),
        ].join("-");
        await recordMealManual({
          date,
          mealType,
          foodName: mealName,
          kcal,
          carbohydrateG: Number(nutrients.탄수화물),
          proteinG: Number(nutrients.단백질),
          fatG: Number(nutrients.지방),
          sugarG: Number(nutrients.당),
          sodiumMg: Number(nutrients.나트륨),
        });
      }
      router.back();
    } catch (err: any) {
      Alert.alert(
        "끼니 기록",
        err?.message ?? "기록에 실패했어요. 다시 시도해 주세요.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KkBackground>
      <KkHeader title="끼니 기록" variant="back" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MealDonutChart
          photo={photo}
          recognitionFailed={recognitionFailed}
          onCameraPress={() =>
            router.push({ pathname: "/camera", params: { source: "meal" } })
          }
          segments={segments}
        />
        <MealTypeTab mealType={mealType} onSelect={setMealType} />
        <MealCards
          mealName={mealName}
          onMealNameChange={handleMealNameChange}
          calories={calories}
          onCaloriesChange={setCalories}
          recordTime={recordTime}
          nutrients={nutrients}
          onNutrientChange={(key, value) =>
            setNutrients((prev) => ({ ...prev, [key]: value }))
          }
        />
        {searchResults.length > 0 && (
          <BlurView intensity={40} tint="dark" style={styles.searchResults}>
            {searchResults.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.searchItem,
                  i < searchResults.length - 1 && styles.searchItemBorder,
                ]}
                onPress={() => applySearchResult(item)}
                activeOpacity={0.7}
              >
                <View style={styles.searchItemLeft}>
                  <Text style={styles.searchFoodName}>{item.food_name}</Text>
                  {!!item.manufacturer && (
                    <Text style={styles.searchManufacturer}>
                      {item.manufacturer}
                    </Text>
                  )}
                </View>
                <Text style={styles.searchKcal}>{item.kcal} kcal</Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        )}
        <KkButton
          title="끼록하기"
          size="large"
          disabled={saving}
          onPress={handleSubmit}
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
  searchResults: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: `${Colors.gray[100]}1A`,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray[700],
  },
  searchItemLeft: {
    flex: 1,
    gap: 2,
  },
  searchFoodName: {
    ...Typography.body.l,
    color: Colors.gray[100],
  },
  searchManufacturer: {
    ...Typography.caption[1],
    color: Colors.gray[400],
  },
  searchKcal: {
    ...Typography.body.m,
    color: Colors.main[400],
    marginLeft: 12,
  },
});
