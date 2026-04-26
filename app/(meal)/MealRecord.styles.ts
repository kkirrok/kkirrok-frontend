import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },

  // Donut chart
  chartSection: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  chartContainer: {
    width: 248,
    height: 248,
  },
  chartCenterIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  chartPhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  cameraContent: {
    alignItems: "center",
    gap: 8,
  },
  recognitionFailed: {
    ...Typography.caption[1],
    color: Colors.gray[400],
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendLabel: {
    ...Typography.caption[1],
    color: Colors.gray[300],
  },
  legendValue: {
    ...Typography.caption[1],
    color: Colors.gray[300],
    marginLeft: 2,
  },

  // Meal type tabs
  tabRow: {
    flexDirection: "row",
    gap: 8,
  },

  // Cards
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

  // Shared underlined value style (칼로리, 끼록 시간, 식사명)
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

  // 칼로리 + 기록 시간 row
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

  // 영양성분 rows
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

  submitButton: {
    marginTop: 8,
  },
});
