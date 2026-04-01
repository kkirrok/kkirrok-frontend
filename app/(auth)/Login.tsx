import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import { StyleSheet, View } from "react-native";

export default function Login() {
  return (
    <KkBackground>
      <KkHeader title="로그인 하기" variant="back" />
      <View style={styles.content}>{/* 나머지 로그인 콘텐츠 */}</View>
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
