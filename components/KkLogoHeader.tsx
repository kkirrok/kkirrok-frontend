import KkirokWhiteLogo from "@/assets/logo/kkirok_white_logo.svg";
import BellIcon from "@/assets/icons/bell.svg";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KkLogoHeader() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <KkirokWhiteLogo width={100} height={19} />

        <TouchableOpacity
          onPress={() => router.push("/notification")}
          accessibilityRole="button"
          accessibilityLabel="알림 화면으로 이동"
          accessibilityHint="알림 목록 화면을 엽니다"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <BellIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 22,
    paddingVertical: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
