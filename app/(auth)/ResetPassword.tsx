import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import KkTextBox from "@/components/KkTextBox";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isSubmitEnabled = password.length >= 8 && password === confirmPassword;

  return (
    <KkBackground>
      <KkHeader
        title="비밀번호 재설정"
        variant="close"
        onClose={() => setModalVisible(true)}
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
            disabled={!isSubmitEnabled}
            onPress={() => {}}
          />
        </View>
      </View>

      <KkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={"비밀번호 변경 중이에요.\n지금 나가면 작성한 정보가 사라져요."}
        cancelText="홈으로 이동"
        onCancelPress={() => router.replace("/")}
        buttonText="계속 작성하기"
        onButtonPress={() => setModalVisible(false)}
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
