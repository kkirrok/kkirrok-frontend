import KkirokWhiteLogo from "@/assets/logo/kkirok_white_logo.svg";
import KkBellButton from "@/components/KkBellButton";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KkLogoHeader() {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <KkirokWhiteLogo width={100} height={19} />

        <KkBellButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
