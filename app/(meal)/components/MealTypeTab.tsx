import KkButton from "@/components/KkButton";
import { StyleSheet, View } from "react-native";

export type MealType = "아침" | "점심" | "저녁" | "간식";

const MEAL_TYPES: MealType[] = ["아침", "점심", "저녁", "간식"];

type Props = {
  mealType: MealType;
  onSelect: (type: MealType) => void;
};

export default function MealTypeTab({ mealType, onSelect }: Props) {
  return (
    <View style={styles.tabRow}>
      {MEAL_TYPES.map((type) => (
        <KkButton
          key={type}
          title={type}
          size="tag"
          selected={mealType === type}
          onPress={() => onSelect(type)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    gap: 8,
  },
});
