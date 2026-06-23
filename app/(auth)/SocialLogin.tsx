import KakaoLogo from "@/assets/images/kakao_logo.svg";
import NaverLogo from "@/assets/images/naver_logo.svg";
import KkBackground from "@/components/KkBackground";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SocialLogin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNaver = () => {
    Alert.alert("준비중", "네이버 로그인은 준비 중입니다.");
  };

  const handleKakao = () => {
    Alert.alert("준비중", "카카오 로그인은 준비 중입니다.");
  };

  return (
    <KkBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.buttonArea}>
          <TouchableOpacity
            style={styles.naverBtn}
            activeOpacity={0.85}
            onPress={handleNaver}
          >
            <NaverLogo width={16} height={16} />
            <Text style={[styles.btnText, { color: "#fff" }]}>
              네이버 로그인
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.kakaoBtn}
            activeOpacity={0.85}
            onPress={handleKakao}
          >
            <KakaoLogo width={16} height={16} color="#000000" />
            <Text style={[styles.btnText, { color: "rgba(0,0,0,0.85)" }]}>
              카카오 로그인
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emailBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/(auth)/Login")}
          >
            <Text style={[styles.btnText, { color: "#fff" }]}>
              이메일로 로그인
            </Text>
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupLabel}>아직 계정이 없다면?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/Signup")}>
              <Text style={styles.signupLink}>회원가입하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KkBackground>
  );
}

const btnBase = {
  height: 52,
  borderRadius: 16,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  gap: 16,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonArea: {
    paddingHorizontal: 20,
    gap: 12,
  },
  naverBtn: {
    ...btnBase,
    backgroundColor: "#03A94D",
  },
  kakaoBtn: {
    ...btnBase,
    backgroundColor: "#FEE500",
  },
  emailBtn: {
    ...btnBase,
    backgroundColor: Colors.main[600],
  },
  btnText: {
    ...Typography.title.s,
  },
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 4,
  },
  signupLabel: {
    ...Typography.title.xs,
    color: Colors.main[100],
  },
  signupLink: {
    ...Typography.title.xs,
    color: Colors.gray[100],
  },
});
