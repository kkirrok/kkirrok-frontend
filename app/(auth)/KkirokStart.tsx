import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import KkTextBox from "@/components/KkTextBox";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatBirthdate = (digits: string): string => {
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
};

const formatPhone = (digits: string): string => {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export default function KkirokStart() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthdateRaw, setBirthdateRaw] = useState("");
  const [phoneRaw, setPhoneRaw] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleBirthdateChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 8);
    setBirthdateRaw(digits);
  };

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 11);
    setPhoneRaw(digits);
  };

  const birthdateForApi =
    birthdateRaw.length === 8
      ? `${birthdateRaw.slice(0, 4)}-${birthdateRaw.slice(4, 6)}-${birthdateRaw.slice(6)}`
      : "";

  return (
    <KkBackground>
      <KkHeader title="끼록 시작하기" variant="back" onBackPress={() => setModalVisible(true)} />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <View style={styles.content}>
          <View style={styles.fields}>
            <KkTextBox
              label="이름"
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력해 주세요."
            />
            <KkTextBox
              label="생년월일"
              value={formatBirthdate(birthdateRaw)}
              onChangeText={handleBirthdateChange}
              placeholder="생년월일 8자리를 입력해 주세요."
              keyboardType="numeric"
            />
            <KkTextBox
              label="전화번호"
              value={formatPhone(phoneRaw)}
              onChangeText={handlePhoneChange}
              placeholder="전화번호를 입력해 주세요."
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.bottom}>
            <KkButton
              title="다음"
              disabled={!name || birthdateRaw.length !== 8 || phoneRaw.length < 10}
              onPress={() =>
                router.push({
                  pathname: "/(auth)/ProfileSetting",
                  params: { name, birthdate: birthdateForApi, phone: phoneRaw },
                })
              }
            />
          </View>
        </View>
      </SafeAreaView>

      <KkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={"아직 가입이 완료되지 않았어요.\n지금 나가면 작성된 정보가 사라져요."}
        cancelText="홈으로 이동"
        onCancelPress={() => router.replace("/(auth)/Login")}
        buttonText="계속 작성하기"
        onButtonPress={() => setModalVisible(false)}
      />
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  fields: {
    gap: 24,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 12,
  },
});
