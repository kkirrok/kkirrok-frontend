import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { MealRecord } from "./types";

type Props = { record: MealRecord };

export default function MealCard({ record }: Props) {
  return (
    <View style={styles.card}>
      {record.image ? (
        <Image
          source={{ uri: record.image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="restaurant" size={32} color={Colors.gray[400]} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.nameCalories} numberOfLines={1}>
          {record.name} {record.calories}kcal
        </Text>
        <Text style={styles.nutrients}>
          🍚 {record.carbs}g | 🥩 {record.protein}g | 🐔 {record.fat}g | 🧂
          {record.sodium}mg | 🧁 {record.sugar}g
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.gray[900],
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  imagePlaceholder: {
    backgroundColor: Colors.gray[800],
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 8,
  },
  nameCalories: {
    ...Typography.title.xs,
    color: Colors.gray[200],
  },
  nutrients: {
    ...Typography.caption[2],
    color: Colors.gray[300],
  },
});
