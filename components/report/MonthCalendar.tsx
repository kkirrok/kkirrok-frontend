import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

type Props = {
  year: number;
  month: number;
  markedDays: number[];
  todayDay: number;
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export default function MonthCalendar({
  year,
  month,
  markedDays,
  todayDay,
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const router = useRouter();
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const handlePressWeeklyReport = () => {
    router.push({
      pathname: "/weeklyreport",
      params: {
        year: String(year),
        month: String(month),
        ...(todayDay > 0 ? { day: String(todayDay) } : {}),
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevMonth} hitSlop={8}>
          <Ionicons name="chevron-back" size={20} color={Colors.gray[200]} />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {year}.{String(month).padStart(2, "0")}
        </Text>
        <TouchableOpacity onPress={onNextMonth} hitSlop={8}>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray[200]} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handlePressWeeklyReport} hitSlop={8}>
          <Ionicons name="bar-chart" size={22} color={Colors.gray[100]} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {WEEK_DAYS.map((d, i) => (
          <Text key={d} style={[styles.weekDay, i === 0 && styles.sunday]}>
            {d}
          </Text>
        ))}
      </View>

      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((day, ci) => {
            const isToday = !!day && day === todayDay;
            const isMarked = !!day && markedDays.includes(day);
            const isSelected = !!day && day === selectedDay;
            const isSunday = ci === 0;

            return (
              <TouchableOpacity
                key={ci}
                style={styles.cell}
                onPress={() => day && onSelectDay(day)}
                disabled={!day}
                activeOpacity={0.7}
              >
                <View style={styles.dayCircleWrap}>
                  <View
                    style={[
                      styles.dayCircle,
                      isMarked && styles.markedCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSunday &&
                          !isMarked &&
                          !isToday &&
                          !isSelected &&
                          styles.sundayText,
                      ]}
                    >
                      {day ?? ""}
                    </Text>
                  </View>
                  {!isMarked && isToday && (
                    <View style={styles.todayBorder} />
                  )}
                  {!isMarked && !isToday && isSelected && (
                    <View style={styles.selectedBorder} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  monthTitle: {
    ...Typography.title.m,
    color: Colors.gray[100],
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    ...Typography.body.m,
    color: Colors.gray[200],
  },
  sunday: {
    color: Colors.main[400],
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    gap: 3,
  },
  dayCircleWrap: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  markedCircle: {
    backgroundColor: Colors.main[500],
  },
  selectedBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  todayBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: Colors.main[500],
  },
  dayText: {
    ...Typography.body.l,
    color: Colors.gray[100],
  },
  sundayText: {
    color: Colors.main[400],
  },
});
