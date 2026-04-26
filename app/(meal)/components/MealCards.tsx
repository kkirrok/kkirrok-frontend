import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, TextInput, View } from "react-native";

export type NutrientKey = "단백질" | "탄수화물" | "당" | "지방" | "나트륨";

const NUTRIENT_UNITS: Record<NutrientKey, string> = {
  단백질: "g",
  탄수화물: "g",
  당: "g",
  지방: "g",
  나트륨: "mg",
};
const NUTRIENT_KEYS = Object.keys(NUTRIENT_UNITS) as NutrientKey[];

const onlyNumber = (value: string) =>
  value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

type Props = {
  mealName: string;
  onMealNameChange: (v: string) => void;
  calories: string;
  onCaloriesChange?: (value: string) => void;
  recordTime: string;
  nutrients: Record<NutrientKey, string>;
  onNutrientChange: (key: NutrientKey, value: string) => void;
};

export default function MealCards({
  mealName,
  onMealNameChange,
  calories,
  onCaloriesChange,
  recordTime,
  nutrients,
  onNutrientChange,
}: Props) {
  return (
    <>
      <BlurView intensity={40} tint="dark" style={styles.card}>
        <Text style={styles.cardLabel}>식사명</Text>
        <TextInput
          value={mealName}
          onChangeText={onMealNameChange}
          placeholder="메뉴이름"
          placeholderTextColor={Colors.gray[200]}
          style={[styles.inputValue, styles.mealInput]}
        />
      </BlurView>

      <View style={styles.infoRow}>
        <BlurView intensity={40} tint="dark" style={[styles.card, styles.flex]}>
          <Text style={styles.cardLabel}>칼로리</Text>
          <View style={styles.calorieValueRow}>
            <TextInput
              value={calories}
              onChangeText={(v) => onCaloriesChange?.(onlyNumber(v))}
              keyboardType="numeric"
              style={[styles.inputValue, styles.calorieInput]}
            />
            <Text style={styles.calorieUnit}>Kcal</Text>
          </View>
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
                onChangeText={(v) => onNutrientChange(key, onlyNumber(v))}
                keyboardType="numeric"
                style={styles.nutrientValue}
              />
              <Text style={styles.nutrientUnit}>{NUTRIENT_UNITS[key]}</Text>
            </View>
          </View>
        ))}
      </BlurView>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: `${Colors.gray[100]}1A`,
    borderRadius: 24,
    padding: 16,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  cardLabel: {
    ...Typography.title.xs,
    color: Colors.gray[200],
  },
  inputValue: {
    ...Typography.title.xs,
    color: Colors.gray[200],
    alignSelf: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[500],
    paddingBottom: 4,
  },
  mealInput: {
    padding: 0,
    minWidth: 55,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
  },
  flex: {
    flex: 1,
  },
  nutrientCardLabel: {
    ...Typography.title.s,
    color: Colors.gray[100],
    marginBottom: 10,
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  nutrientLabel: {
    ...Typography.title.xs,
    color: Colors.gray[200],
  },
  nutrientValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  nutrientValue: {
    ...Typography.title.xs,
    color: Colors.gray[200],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[500],
    paddingBottom: 2,
    minWidth: 16,
    textAlign: "center",
  },
  nutrientUnit: {
    ...Typography.title.xs,
    color: Colors.gray[200],
    paddingBottom: 2,
  },
  calorieValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    gap: 4,
  },

  calorieInput: {
    padding: 0,
    minWidth: 12,
    textAlign: "right",
  },

  calorieUnit: {
    ...Typography.title.xs,
    color: Colors.gray[200],
    paddingBottom: 4,
  },
});
