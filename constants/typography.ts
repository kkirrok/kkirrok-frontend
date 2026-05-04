import { TextStyle } from "react-native";

const SemiBold = "Pretendard-SemiBold";
const Regular = "Pretendard-Regular";
const Bold = "Pretendar-Regular";

export const Typography = {
  display: {
    l: {
      fontFamily: Bold,
      fontSize: 32,
      letterSpacing: -0.64,
      lineHeight: 38.4,
    } as TextStyle,
  },
  title: {
    l: {
      fontFamily: SemiBold,
      fontSize: 22,
      letterSpacing: -0.44,
      lineHeight: 30.8,
    } as TextStyle,
    m: {
      fontFamily: SemiBold,
      fontSize: 20,
      letterSpacing: -0.4,
      lineHeight: 28,
    } as TextStyle,
    s: {
      fontFamily: SemiBold,
      fontSize: 18,
      letterSpacing: -0.36,
      lineHeight: 25.2,
    } as TextStyle,
    xs: {
      fontFamily: SemiBold,
      fontSize: 16,
      letterSpacing: -0.32,
      lineHeight: 22.4,
    } as TextStyle,
  },
  body: {
    l: {
      fontFamily: Regular,
      fontSize: 16,
      letterSpacing: -0.16,
      lineHeight: 25.6,
    } as TextStyle,
    m: {
      fontFamily: Regular,
      fontSize: 14,
      letterSpacing: -0.14,
      lineHeight: 22.4,
    } as TextStyle,
  },
  caption: {
    1: {
      fontFamily: Regular,
      fontSize: 12,
      letterSpacing: -0.12,
      lineHeight: 16.8,
    } as TextStyle,
    2: {
      fontFamily: Regular,
      fontSize: 10,
      letterSpacing: -0.1,
      lineHeight: 14,
    } as TextStyle,
  },
} as const;

export const Effects = {
  shadowMain: {
    shadowColor: "#FF8868",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  shadowGray: {
    shadowColor: "#D0C7C2",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
} as const;
