import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import KkTextBox from "@/components/KkTextBox";
import { resetPassword } from "@/utils/api/authApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function ResetPassword() {
  const router = useRouter();
  const { email, name } = useLocalSearchParams<{
    email: string;
    name: string;
  }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isSubmitEnabled = password.length >= 8 && password === confirmPassword;

  const handleSubmit = async () => {
    if (loading || !email || !name) return;
    setLoading(true);
    try {
      await resetPassword({ email, name, newPassword: password });
      setSuccessModalVisible(true);
    } catch (err: any) {
      setErrorMessage(err?.message ?? "비밀번호 재설정에 실패했습니다.");
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KkBackground>
      <KkHeader
        title="비밀번호 재설정"
        variant="close"
        onClose={() => setExitModalVisible(true)}
      />
      <View style={styles.content}>
        <KkTextBox
          label="비밀번호 재설정하기"
          value={password}
          onChangeText={setPassword}
          placeholder="영문, 숫자, 특수문자 포함 8자 이상"
          secureTextEntry
        />
        <KkTextBox
          label="비밀번호 재입력하기"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="영문, 숫자, 특수문자 포함 8자 이상"
          secureTextEntry
          error={isMismatch ? "동일하지 않습니다." : undefined}
        />

        <View style={styles.bottom}>
          <KkButton
            title="비밀번호 재설정"
            disabled={!isSubmitEnabled || loading}
            onPress={handleSubmit}
          />
        </View>
      </View>

      <KkModal
        visible={exitModalVisible}
        onClose={() => setExitModalVisible(false)}
        message={"비밀번호 변경 중이에요.\n지금 나가면 작성한 정보가 사라져요."}
        cancelText="홈으로 이동"
        onCancelPress={() => router.replace("/(tabs)")}
        buttonText="계속 작성하기"
        onButtonPress={() => setExitModalVisible(false)}
      />
      <KkModal
        visible={successModalVisible}
        onClose={() => {}}
        message="비밀번호가 재설정되었습니다."
        buttonText="로그인하기"
        onButtonPress={() => router.replace("/(auth)/Login")}
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
