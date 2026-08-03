import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 14,
    paddingBottom: 28,
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
    color: Colors.gray[100],
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
  },
  card: {
    marginBottom: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: "#FDFCFC0A",
  },
  cardTitle: {
    color: Colors.gray[100],
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    marginBottom: 6,
    textAlign: "center",
  },
  summaryText: {
    color: Colors.gray[100],
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    marginBottom: 18,
    textAlign: "center",
  },
  highlight: {
    color: Colors.main[400],
    fontFamily: "Pretendard-SemiBold",
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
    width: 26,
    height: 128,
    borderRadius: 7,
    overflow: "hidden",
    backgroundColor: "#FDFCFC1A",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    backgroundColor: Colors.main[400],
  },
  dayText: {
    color: Colors.gray[200],
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    marginTop: 8,
  },
  totalText: {
    color: Colors.gray[200],
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
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
    minWidth: 60,
    color: Colors.gray[200],
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
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
    minWidth: 55,
    color: Colors.gray[200],
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    textAlign: "right",
  },
  description: {
    color: Colors.gray[200],
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    lineHeight: 18,
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
    color: Colors.gray[100],
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
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
    color: Colors.gray[100],
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    marginBottom: 4,
  },
  tipBody: {
    color: Colors.gray[200],
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    lineHeight: 19,
  },
});
