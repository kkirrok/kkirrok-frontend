import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkTextBox from "@/components/KkTextBox";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function FindPassword() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const isSubmitEnabled = name && email && code;

  return (
    <KkBackground>
      <KkHeader title="비밀번호 찾기" variant="close" />
      <View style={styles.content}>
        <KkTextBox
          label="이름"
          value={name}
          onChangeText={setName}
          placeholder="이름을 입력해 주세요."
        />
        <KkTextBox
          label="이메일"
          value={email}
          onChangeText={setEmail}
          placeholder="이메일을 입력해 주세요."
          rightButton={
            <KkButton
              title="이메일 인증"
              size="small"
              disabled={!email}
              onPress={() => {}}
            />
          }
        />
        <KkTextBox
          label="인증번호"
          value={code}
          onChangeText={setCode}
          placeholder="인증번호를 입력해 주세요."
          rightButton={
            <KkButton
              title="인증하기"
              size="small"
              disabled={!code}
              onPress={() => {}}
            />
          }
        />

        <View style={styles.bottom}>
          <KkButton
            title="비밀번호 찾기"
            disabled={!isSubmitEnabled}
            onPress={() => router.push("/(auth)/ResetPassword")}
          />
        </View>
      </View>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    gap: 16,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 32,
  },
});
