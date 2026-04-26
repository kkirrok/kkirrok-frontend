import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type FoodItem = {
  id: string;
  name: string;
  calories: string;
  badge?: string;
  image: string | null;
};

type Props = {
  foods: FoodItem[];
  title?: string;
  timeLabel?: string;
  onPressFood?: (food: FoodItem) => void;
};

export default function FoodItemScroll({
  foods,
  title,
  timeLabel,
  onPressFood,
}: Props) {
  return (
    <View style={styles.section}>
      {(title || timeLabel) && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.time}>{timeLabel}</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {foods.map((food) => (
          <TouchableOpacity
            key={food.id}
            style={styles.item}
            activeOpacity={0.85}
            onPress={() => onPressFood?.(food)}
          >
            {/* 이미지 카드 */}
            <View style={styles.imageBox}>
              {food.image ? (
                <Image source={{ uri: food.image }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.placeholder]} />
              )}

              <LinearGradient
                colors={["transparent", "rgba(26,22,20,0.9)"]}
                style={styles.gradient}
              />

              <View style={styles.innerPadding}>
                <Text style={styles.foodName}>{food.name}</Text>
              </View>
            </View>

            {/* kcal */}
            <Text style={styles.calories}>🔥 {food.calories} kcal</Text>

            {/* 뱃지 */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {food.badge ?? "탄수화물 높음"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const CARD_WIDTH = 86;
const IMAGE_HEIGHT = 82;

const styles = StyleSheet.create({
  section: {
    gap: 18,
  },

  header: {
    gap: 6,
  },

  title: {
    ...Typography.title.s,
    color: Colors.gray[100],
  },

  time: {
    ...Typography.caption[1],
    color: Colors.gray[200],
    textAlign: "right",
  },

  container: {
    gap: 20,
    paddingBottom: 4,
  },

  item: {
    width: CARD_WIDTH,
    gap: 10,
  },

  imageBox: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 22,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  innerPadding: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
  },

  foodName: {
    ...Typography.title.xs,
    color: Colors.gray[100],
  },

  calories: {
    ...Typography.body.m,
    color: Colors.gray[100],
    fontFamily: "Pretendard-SemiBold",
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#B83A1D",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  badgeText: {
    ...Typography.caption[1],
    color: Colors.gray[100],
    fontFamily: "Pretendard-SemiBold",
  },
  placeholder: {
    backgroundColor: Colors.gray[800],
  },
});
