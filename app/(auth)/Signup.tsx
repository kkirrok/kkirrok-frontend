import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import KkTextBox from "@/components/KkTextBox";
import { sendEmailVerification, verifyEmailCode } from "@/utils/api/authApi";
import { isValidEmail } from "@/utils/validation";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
  const router = useRouter();
  const { termsChecked } = useLocalSearchParams<{ termsChecked?: string }>();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(300);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleSendEmail = async () => {
    setSendingEmail(true);
    setIsVerified(false);
    try {
      await sendEmailVerification(email);
      setEmailSent(true);
      startTimer();
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.",
      );
      setErrorModalVisible(true);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const verified = await verifyEmailCode(email, verificationCode);
      setIsVerified(verified);
      if (verified) {
        setSuccessModalVisible(true);
      } else {
        setErrorMessage("인증번호를 다시 확인해 주세요.");
        setErrorModalVisible(true);
      }
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.",
      );
      setErrorModalVisible(true);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <KkBackground>
      <KkHeader
        title="회원가입"
        variant="close"
        onClose={() => (isVerified ? router.back() : setModalVisible(true))}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <View style={styles.content}>
          <KkTextBox
            label="이메일"
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력해 주세요."
            error={
              email && !isValidEmail(email)
                ? "올바르지 않은 형태의 이메일입니다."
                : undefined
            }
            rightButton={
              <KkButton
                title={sendingEmail ? "발송 중..." : emailSent ? "재발급" : "이메일 인증"}
                disabled={!email || !isValidEmail(email) || sendingEmail}
                size="small"
                onPress={handleSendEmail}
              />
            }
          />
          <KkTextBox
            label={timeLeft > 0 ? `인증번호 (${formatTime(timeLeft)})` : "인증번호"}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="인증번호를 입력해 주세요."
            error={
              verificationCode && verificationCode.length !== 6
                ? "올바르지 않은 인증번호입니다."
                : undefined
            }
            rightButton={
              <KkButton
                title={isVerified ? "인증완료" : "인증하기"}
                disabled={!verificationCode || verifying || isVerified}
                size="small"
                onPress={handleVerify}
              />
            }
          />

          <View style={{ marginTop: "auto", gap: 16, marginBottom: 12 }}>
            <KkButton
              title="다음"
              disabled={!email || !isValidEmail(email) || !verificationCode || !isVerified}
              onPress={() =>
                router.push({
                  pathname: "/(auth)/SignupPassword",
                  params: { email, termsChecked },
                })
              }
            />
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.replace("/(auth)/Login")}
            >
              <Text style={styles.loginText}>
                이미 계정이 있으신가요? 로그인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <KkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={
          "아직 가입이 완료되지 않았어요.\n지금 나가면 작성된 정보가 사라져요."
        }
        cancelText="홈으로 이동"
        onCancelPress={() => router.replace("/(auth)/Login")}
        buttonText="계속 작성하기"
        onButtonPress={() => setModalVisible(false)}
      />
      <KkModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        message="이메일 인증이 완료되었어요!"
        buttonText="확인"
        onButtonPress={() => setSuccessModalVisible(false)}
      />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 24,
  },
  loginLink: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#8D786D",
  },
});
