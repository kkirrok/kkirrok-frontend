import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import KkTextBox from "@/components/KkTextBox";
import { signUpLocal } from "@/utils/api/authApi";
import { tokenStore } from "@/utils/store/tokenStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function SignupPassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isSubmitEnabled = password.length >= 8 && password === confirmPassword;

  const handleSignUp = async () => {
    if (!email) {
      setErrorMessage("이메일 정보가 없습니다. 처음부터 다시 시도해 주세요.");
      setErrorModalVisible(true);
      return;
    }
    setLoading(true);
    try {
      const res = await signUpLocal(email, password);
      await tokenStore.save(res.data.access_token);
      await tokenStore.setOnboarding(false);
      router.replace("/(auth)/KkirokStart");
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.",
      );
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KkBackground>
      <KkHeader
        title="회원가입"
        variant="close"
        onClose={() => setModalVisible(true)}
      />
      <View style={styles.content}>
        <KkTextBox
          label="비밀번호 설정하기"
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
            title="회원가입"
            disabled={!isSubmitEnabled || loading}
            onPress={handleSignUp}
          />
        </View>
      </View>

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
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        message={errorMessage}
        buttonText="확인"
        onButtonPress={() => {
          setErrorModalVisible(false);
          if (!email) router.replace("/(auth)/Signup");
        }}
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
