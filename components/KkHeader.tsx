import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface KkHeaderProps {
  title: string;
  variant?: "back" | "close";
  onBackPress?: () => void;
  onClose?: () => void;
}

export default function KkHeader({
  title,
  variant = "back",
  onBackPress,
  onClose,
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

        <Text style={styles.title}>{title}</Text>

        {variant === "close" ? (
          <TouchableOpacity onPress={handleClosePress} style={styles.button}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  button: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
  },
});
