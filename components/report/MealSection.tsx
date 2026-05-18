import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MealCard from "./MealCard";
import { MealRecord, MealType } from "./types";

const MEAL_TYPES: MealType[] = ["아침", "점심", "저녁", "간식"];

type Props = {
  dateLabel: string;
  meals: MealRecord[];
};

export default function MealSection({ dateLabel, meals }: Props) {
  const [activeTab, setActiveTab] = useState<MealType>("아침");

  const filtered = meals.filter((m) => m.mealType === activeTab);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{dateLabel}의 식단</Text>
        <TouchableOpacity
          style={styles.addButton}
          hitSlop={8}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={Colors.gray[200]} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {MEAL_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, activeTab === type && styles.tabActive]}
            onPress={() => setActiveTab(type)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === type && styles.tabTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.list}>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>기록된 식단이 없습니다.</Text>
        ) : (
          filtered.map((record) => <MealCard key={record.id} record={record} />)
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 48,
    paddingHorizontal: 16,
    gap: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  headerTitle: {
    ...Typography.title.m,
    color: Colors.gray[100],
  },
  tabs: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  tab: {
    width: 44,
    height: 30,
    alignItems: "center",
    position: "relative",
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray[300],
  },
  tabActive: {
    borderBottomColor: Colors.gray[100],
  },
  tabText: {
    ...Typography.body.l,
    color: Colors.gray[300],
  },
  tabTextActive: {
    ...Typography.title.xs,
    color: Colors.gray[100],
  },
  tabIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.gray[100],
    borderRadius: 1,
  },
  list: {
    gap: 16,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gray[900],
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    ...Typography.body.l,
    color: Colors.gray[500],
    textAlign: "center",
    paddingVertical: 32,
  },
});
