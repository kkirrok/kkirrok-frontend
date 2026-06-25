import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import KkTextBox from "@/components/KkTextBox";
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
  const [foundId, setFoundId] = useState("");

  const isBirthInvalid = birthDate.length > 0 && !BIRTH_REGEX.test(birthDate);
  const isSubmitEnabled = name && BIRTH_REGEX.test(birthDate) && phone;

  const handleSubmit = () => {
    // TODO: API 연동 후 실제 아이디로 교체
    setFoundId("HJHJHJHJJF");
    setModalVisible(true);
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
            disabled={!isSubmitEnabled}
            onPress={handleSubmit}
          />
        </View>
      </View>

      <KkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={`${name}님의 아이디는`}
        highlight={foundId}
        buttonText="로그인하기"
        onButtonPress={() => router.push("/(auth)/Login")}
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
