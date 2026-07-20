import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import KkTextBox from "@/components/KkTextBox";
import { loginLocal } from "@/utils/api/authApi";
import { tokenStore } from "@/utils/store/tokenStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await loginLocal(email, password);
      await tokenStore.save(res.data.access_token);
      await tokenStore.setOnboarding(res.data.onboarding_completed);
      if (res.data.onboarding_completed) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/KkirokStart");
      }
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
      <KkHeader title="로그인 하기" />
      <View style={styles.content}>
        <KkTextBox
          label="이메일"
          value={email}
          onChangeText={setEmail}
          placeholder="이메일을 입력해 주세요."
        />
        <KkTextBox
          label="비밀번호"
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호를 입력해 주세요."
          secureTextEntry
        />

        <View style={styles.button}>
          <KkButton
            title="로그인 하기"
            disabled={!email || !password || loading}
            onPress={handleLogin}
          />
        </View>

        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.push("/(auth)/FindId")}>
            <Text style={styles.text}>아이디 찾기</Text>
          </TouchableOpacity>

          <Text style={styles.text}> | </Text>

          <TouchableOpacity onPress={() => router.push("/(auth)/FindPassword")}>
            <Text style={styles.text}>비밀번호 찾기</Text>
          </TouchableOpacity>

          <Text style={styles.text}> | </Text>

          <TouchableOpacity onPress={() => router.push("/(auth)/Signup")}>
            <Text style={styles.text}>회원가입</Text>
          </TouchableOpacity>
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
  button: {
    paddingTop: 16,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 8,
    gap: 12,
  },
  text: {
    fontSize: 14,
    color: "#8D786D",
  },
});
