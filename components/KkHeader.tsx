import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface KkHeaderProps {
  title: string;
  variant?: "back" | "close";
  onBackPress?: () => void;
  onClose?: () => void;
  rightAction?: ReactNode;
}

export default function KkHeader({
  title,
  variant = "back",
  onBackPress,
  onClose,
  rightAction,
}: KkHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.back();
  };

  const handleClosePress = () => {
    if (onClose) {
      onClose();
      return;
    }

    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 좌우 영역을 같은 비율로 나눠 오른쪽 버튼 너비와 관계없이 제목을 가운데 정렬 */}
      <View style={styles.inner}>
        <View style={[styles.side, styles.sideLeft]}>
          {variant === "back" && (
            <TouchableOpacity onPress={handleBackPress} style={styles.button}>
              <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>{title}</Text>

        <View style={[styles.side, styles.sideRight]}>
          {variant === "close" ? (
            <TouchableOpacity onPress={handleClosePress} style={styles.button}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          ) : (
            rightAction
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inner: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  side: {
    flex: 1,
    minWidth: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  sideLeft: {
    justifyContent: "flex-start",
  },
  sideRight: {
    justifyContent: "flex-end",
  },
  button: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...Typography.title.m,
    flexShrink: 1,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
