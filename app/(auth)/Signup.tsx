import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import KkTextBox from "@/components/KkTextBox";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KkBackground>
      <KkHeader title="회원가입" variant="close" />
      <View style={styles.content}>
        <KkTextBox
          label="이메일"
          value={email}
          onChangeText={setEmail}
          placeholder="이메일을 입력해 주세요."
        />
        <KkTextBox
          label="비밀번호"
          value={email}
          onChangeText={setEmail}
          placeholder="비밀번호를 입력해 주세요."
        />
      </View>
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