import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 14,
  },
  weekSelector: {
    marginTop: 16,
    marginBottom: 22,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: "#FDFCFC0A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  weekSelectorText: {
    ...Typography.title.s,
    color: Colors.gray[100],
  },
  card: {
    marginBottom: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: "#FDFCFC0A",
  },
  cardTitle: {
    ...Typography.title.s,
    color: Colors.gray[100],
    marginBottom: 6,
    textAlign: "center",
  },
  summaryText: {
    ...Typography.title.s,
    color: Colors.gray[100],
    marginBottom: 18,
    textAlign: "center",
  },
  highlight: {
    ...Typography.title.s,
    color: Colors.main[400],
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  day: {
    width: 26,
    alignItems: "center",
  },
  barTrack: {
    width: 28,
    height: 128,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FDFCFC1A",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    backgroundColor: Colors.main[400],
  },
  dayText: {
    ...Typography.body.l,
    color: Colors.gray[200],
    marginTop: 8,
  },
  totalText: {
    ...Typography.title.xs,
    color: Colors.gray[200],
    marginTop: 14,
    textAlign: "center",
  },
  nutrientList: {
    marginTop: 10,
    gap: 14,
  },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nutrientLabel: {
    ...Typography.title.xs,
    minWidth: 60,
    color: Colors.gray[200],
  },
  nutrientTrack: {
    flex: 1,
    height: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  nutrientFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: Colors.main[300],
  },
  nutrientValue: {
    ...Typography.body.m,
    minWidth: 55,
    color: Colors.gray[200],
    textAlign: "right",
  },
  description: {
    ...Typography.caption[1],
    color: Colors.gray[200],
    marginTop: 16,
  },
  patternRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 10,
  },
  patternTextBox: {
    flex: 1,
    gap: 5,
  },
  patternText: {
    ...Typography.body.m,
    color: Colors.gray[100],
    lineHeight: 20,
  },
  imagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 7,
    backgroundColor: Colors.gray[900],
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 14,
  },
  smallImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 7,
    backgroundColor: Colors.gray[900],
  },
  tipTextBox: {
    flex: 1,
  },
  tipTitle: {
    ...Typography.title.xs,
    color: Colors.gray[100],
    marginBottom: 4,
  },
  tipBody: {
    ...Typography.body.m,
    color: Colors.gray[200],
    lineHeight: 19,
  },
});
