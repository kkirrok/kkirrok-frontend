import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import KkTextBox from "@/components/KkTextBox";
import { findEmail } from "@/utils/api/authApi";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const BIRTH_REGEX = /^\d{4}\.(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])$/;

const formatBirthDate = (text: string) => {
  const digits = text.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
};

export default function FindId() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [foundEmail, setFoundEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isBirthInvalid = birthDate.length > 0 && !BIRTH_REGEX.test(birthDate);
  const isSubmitEnabled = name && BIRTH_REGEX.test(birthDate) && phone;

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const email = await findEmail({
        name,
        birth: birthDate.replace(/\./g, "-"),
        phone,
      });
      setFoundEmail(email);
      setModalVisible(true);
    } catch (err: any) {
      setErrorMessage(err?.message ?? "이메일 찾기에 실패했습니다.");
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KkBackground>
      <KkHeader title="이메일 찾기" variant="close" />
      <View style={styles.content}>
        <KkTextBox
          label="이름"
          value={name}
          onChangeText={setName}
          placeholder="이름을 입력해 주세요."
        />
        <KkTextBox
          label="생년월일"
          value={birthDate}
          onChangeText={(text) => setBirthDate(formatBirthDate(text))}
          placeholder="생년월일을 입력해 주세요."
          error={
            isBirthInvalid ? "올바르지 않은 형태의 생년월일입니다." : undefined
          }
        />
        <KkTextBox
          label="전화번호"
          value={phone}
          onChangeText={setPhone}
          placeholder="전화번호를 입력해 주세요."
        />

        <View style={styles.bottom}>
          <KkButton
            title="이메일 찾기"
            disabled={!isSubmitEnabled || loading}
            onPress={handleSubmit}
          />
        </View>
      </View>

      <KkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={`${name}님의 아이디는`}
        highlight={foundEmail}
        buttonText="로그인하기"
        onButtonPress={() => router.push("/(auth)/Login")}
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
