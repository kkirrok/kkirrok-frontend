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
      <View style={styles.inner}>
        {variant === "back" ? (
          <TouchableOpacity onPress={handleBackPress} style={styles.button}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.button} />
        )}

        <Text style={styles.title} numberOfLines={1}>{title}</Text>

        {variant === "close" ? (
          <TouchableOpacity onPress={handleClosePress} style={styles.button}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        ) : rightAction ? (
          <View style={styles.rightAction}>{rightAction}</View>
        ) : (
          <View style={styles.button} />
        )}
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
  button: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  rightAction: {
    width: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
  },
});
