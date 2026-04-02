import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkTextBox from "@/components/KkTextBox";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Signup() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  return (
    <KkBackground>
      <KkHeader title="회원가입" variant="close" />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View style={styles.content}>
          <KkTextBox
            label="이메일"
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력해 주세요."
            error={email && !email.includes('@') ? '올바르지 않은 형태의 이메일입니다.' : undefined}
            rightButton={
              <KkButton
                title="이메일 인증"
                disabled={!email}
                size="small"
              />
            }
          />
          <KkTextBox
            label="인증번호"
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="인증번호를 입력해 주세요."
            error={verificationCode && verificationCode.length !== 6 ? '올바르지 않은 인증번호입니다.' : undefined}
            rightButton={
              <KkButton
                title="인증하기"
                disabled={!verificationCode}
                size="small"
              />
            }
          />

          <View style={{ marginTop: "auto", marginBottom: 12 }}>
            <KkButton
              title="다음"
              disabled={!email || !verificationCode}
              onPress={() => { }}
            />
          </View>
        </View>
      </SafeAreaView>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 24,
  },
});