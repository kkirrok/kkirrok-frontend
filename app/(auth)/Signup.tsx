import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import { StyleSheet, View } from "react-native";

export default function Signup() {
  return (
    <KkBackground>
      <KkHeader title="회원가입" variant="close" />
      <View style={styles.content}>{/* 나머지 회원가입 콘텐츠 */}</View>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
});
