import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: `${Colors.gray[1000]}B3`,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: Colors.gray[900],
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...Typography.title.m,
    color: Colors.gray[100],
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tabActive: {
    backgroundColor: Colors.main[500],
    shadowColor: Colors.main[400],
    elevation: 4,
  },
  tabText: {
    ...Typography.body.l,
    color: Colors.gray[200],
  },
  tabTextActive: {
    ...Typography.body.l,
    color: Colors.gray[100],
  },
  formContainer: {
    backgroundColor: "#FDFCFC0A",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    ...Typography.title.xs,
    color: Colors.gray[200],
  },
  inputBox: {
    backgroundColor: "#FDFCFC1A",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.gray[700],
  },
  baseInput: {
    ...Typography.body.m,
    color: Colors.gray[100],
    padding: 0,
  },
  calorieBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  calorieInput: {
    flex: 1,
    textAlign: "right",
  },
  calorieUnit: {
    ...Typography.body.m,
    color: Colors.gray[100],
    marginLeft: 4,
  },
  nutrientRow: {
    flexDirection: "row",
    gap: 16,
  },
  nutrientSpacer: {
    flex: 1,
  },
});
