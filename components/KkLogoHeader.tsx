import { View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BellIcon from "@/assets/icons/bell.svg"; 

export default function KkLogoHeader() {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        {/* 임시 로고 이미지 */}
        <BellIcon width={24} height={24} />

        <BellIcon width={24} height={24} />
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
  }
});