import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { consumeMealPhoto } from "@/utils/mealPhotoStore";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import styles from "./MealRecord.styles";

type MealType = "아침" | "점심" | "저녁" | "간식";
type NutrientKey = "단백질" | "탄수화물" | "당" | "지방" | "나트륨";

const MEAL_TYPES: MealType[] = ["아침", "점심", "저녁", "간식"];
const NUTRIENT_UNITS: Record<NutrientKey, string> = {
  단백질: "g",
  탄수화물: "g",
  당: "g",
  지방: "g",
  나트륨: "mg",
};
const NUTRIENT_KEYS = Object.keys(NUTRIENT_UNITS) as NutrientKey[];

const CHART_SIZE = 248;
const CX = CHART_SIZE / 2;
const CY = CHART_SIZE / 2;
const OUTER_R = 118;
const INNER_R = 100;

const SEGMENTS = [
  { label: "탄수화물", color: Colors.main[500], pct: 0.55 },
  { label: "단백질", color: Colors.main[400], pct: 0.25 },
  { label: "지방", color: Colors.main[200], pct: 0.2 },
];

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(outerR: number, innerR: number, startDeg: number, endDeg: number) {
  const o1 = polarToCartesian(CX, CY, outerR, startDeg);
  const o2 = polarToCartesian(CX, CY, outerR, endDeg);
  const i1 = polarToCartesian(CX, CY, innerR, endDeg);
  const i2 = polarToCartesian(CX, CY, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${o1.x} ${o1.y} A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y} L ${i1.x} ${i1.y} A ${innerR} ${innerR} 0 ${large} 0 ${i2.x} ${i2.y} Z`;
}

function NutrientDonut() {
  let cursor = 0;
  return (
    <Svg width={CHART_SIZE} height={CHART_SIZE}>
      {SEGMENTS.map((seg) => {
        const startDeg = cursor * 360;
        cursor += seg.pct;
        const endDeg = cursor * 360;
        return <Path key={seg.label} d={arcPath(OUTER_R, INNER_R, startDeg, endDeg)} fill={seg.color} />;
      })}
      <Circle cx={CX} cy={CY} r={INNER_R - 3} fill={Colors.gray[1000]} />
    </Svg>
  );
}

function LegendDot({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

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
  const [nutrients, setNutrients] = useState<Record<NutrientKey, string>>(defaultNutrients());
  const [recordTime, setRecordTime] = useState("00:00AM");

  const analyzePhoto = async (_uri: string) => {
    // TODO: 실제 AI API 연동
    setMealName("");
    setCalories("0");
    setNutrients(defaultNutrients());
    setRecognitionFailed(true);
    // 인식 성공 시:
    // setMealName(result.name);
    // setCalories(String(result.calories));
    // setNutrients(result.nutrients);
    // setRecognitionFailed(false);
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
        <View style={styles.chartSection}>
          <View style={styles.chartContainer}>
            <NutrientDonut />
            <TouchableOpacity
              style={styles.chartCenterIcon}
              onPress={() => router.push({ pathname: "/camera", params: { source: "meal" } })}
              activeOpacity={0.7}
            >
              {photo ? (
                <Image source={{ uri: photo }} style={styles.chartPhoto} resizeMode="cover" />
              ) : (
                <View style={styles.cameraContent}>
                  <Ionicons name="camera" size={48} color={Colors.gray[100]} />
                  {recognitionFailed && (
                    <Text style={styles.recognitionFailed}>식사를 인식할 수 없어요.</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.legend}>
            {SEGMENTS.map((seg) => (
              <LegendDot key={seg.label} color={seg.color} label={seg.label} value="0%" />
            ))}
          </View>
        </View>

        <View style={styles.tabRow}>
          {MEAL_TYPES.map((type) => (
            <KkButton
              key={type}
              title={type}
              size="tag"
              selected={mealType === type}
              onPress={() => setMealType(type)}
            />
          ))}
        </View>

        <BlurView intensity={40} tint="dark" style={styles.card}>
          <Text style={styles.cardLabel}>식사명</Text>
          <TextInput
            value={mealName}
            onChangeText={setMealName}
            placeholder="메뉴이름"
            placeholderTextColor={Colors.gray[200]}
            style={[styles.inputValue, styles.mealInput]}
          />
        </BlurView>

        <View style={styles.infoRow}>
          <BlurView intensity={40} tint="dark" style={[styles.card, styles.flex]}>
            <Text style={styles.cardLabel}>칼로리</Text>
            <Text style={styles.inputValue}>{calories} Kcal</Text>
          </BlurView>
          <BlurView intensity={40} tint="dark" style={[styles.card, styles.flex]}>
            <Text style={styles.cardLabel}>끼록 시간</Text>
            <Text style={styles.inputValue}>{recordTime}</Text>
          </BlurView>
        </View>

        <BlurView intensity={40} tint="dark" style={styles.card}>
          <Text style={styles.nutrientCardLabel}>영양성분</Text>
          {NUTRIENT_KEYS.map((key) => (
            <View key={key} style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>{key}</Text>
              <View style={styles.nutrientValueRow}>
                <TextInput
                  value={nutrients[key]}
                  onChangeText={(v) => setNutrients((prev) => ({ ...prev, [key]: v }))}
                  keyboardType="numeric"
                  style={styles.nutrientValue}
                />
                <Text style={styles.nutrientUnit}>{NUTRIENT_UNITS[key]}</Text>
              </View>
            </View>
          ))}
        </BlurView>

        <KkButton title="끼록하기" size="large" onPress={() => {}} style={styles.submitButton} />
      </ScrollView>
    </KkBackground>
  );
}
