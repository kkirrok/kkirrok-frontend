import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function getWeekDays(today: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 6 + i);
    return d;
  });
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

type Props = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

export default function WeekCalendar({ selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const weekDays = getWeekDays(today);

  return (
    <View style={styles.dateSection}>
      <View style={styles.dateHeaderRow}>
        <Text style={styles.dateHeader}>
          {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
        </Text>
        <Ionicons name="calendar" size={20} color={Colors.gray[100]} />
      </View>

      <View style={styles.weekRow}>
        {weekDays.map((d, i) => {
          const active = isSameDay(d, selectedDate);
          return (
            <TouchableOpacity
              key={i}
              style={[styles.dayCell, active && styles.dayCellActive]}
              onPress={() => onSelectDate(d)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayNum, active && styles.dayNumActive]}>
                {d.getDate()}
              </Text>
              <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>
                {DAY_LABELS[d.getDay()]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dateSection: { gap: 16 },
  dateHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateHeader: { ...Typography.title.xs, color: Colors.gray[100] },
  weekRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  dayCell: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 3,
    borderRadius: 16,
    backgroundColor: Colors.gray[900],
    alignItems: "center",
    justifyContent: "center",
  },
  dayCellActive: { backgroundColor: Colors.main[500] },
  dayNum: { ...Typography.body.m, color: Colors.gray[200] },
  dayNumActive: { color: Colors.gray[100] },
  dayLabel: { ...Typography.caption[1], color: Colors.gray[200] },
  dayLabelActive: { color: Colors.gray[100] },
});
