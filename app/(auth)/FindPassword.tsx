import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import KkTextBox from "@/components/KkTextBox";
import { sendEmailVerification, verifyEmailCode } from "@/utils/api/authApi";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function FindPassword() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const isSubmitEnabled = name && verified;

  const handleSendCode = async () => {
    if (sendingCode || !email) return;
    setSendingCode(true);
    try {
      await sendEmailVerification(email);
      setVerified(false);
      setCode("");
    } catch (err: any) {
      setErrorMessage(err?.message ?? "인증 메일 발송에 실패했습니다.");
      setErrorModalVisible(true);
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerify = async () => {
    if (verifying || !code) return;
    setVerifying(true);
    try {
      const ok = await verifyEmailCode(email, code);
      if (ok) {
        setVerified(true);
      } else {
        setErrorMessage("인증번호가 올바르지 않습니다.");
        setErrorModalVisible(true);
      }
    } catch (err: any) {
      setErrorMessage(err?.message ?? "인증에 실패했습니다.");
      setErrorModalVisible(true);
    } finally {
      setVerifying(false);
    }
  };

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
          onChangeText={(text) => {
            setEmail(text);
            setVerified(false);
          }}
          placeholder="이메일을 입력해 주세요."
          rightButton={
            <KkButton
              title={sendingCode ? "발송 중..." : "이메일 인증"}
              size="small"
              disabled={!email || sendingCode}
              onPress={handleSendCode}
            />
          }
        />
        <KkTextBox
          label="인증번호"
          value={code}
          onChangeText={setCode}
          placeholder="인증번호를 입력해 주세요."
          error={verified ? undefined : undefined}
          rightButton={
            <KkButton
              title={
                verified ? "인증완료" : verifying ? "확인 중..." : "인증하기"
              }
              size="small"
              disabled={!code || verifying || verified}
              onPress={handleVerify}
            />
          }
        />

        <View style={styles.bottom}>
          <KkButton
            title="비밀번호 찾기"
            disabled={!isSubmitEnabled}
            onPress={() =>
              router.push({
                pathname: "/(auth)/ResetPassword",
                params: { email, name },
              })
            }
          />
        </View>
      </View>

      <KkModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        message={errorMessage}
        buttonText="확인"
        onButtonPress={() => setErrorModalVisible(false)}
      />
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
