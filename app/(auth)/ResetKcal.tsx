import { Typography } from "@/constants/typography";
import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import { updateKcal } from "@/utils/api/profileApi";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

export default function ResetKcal() {
  const router = useRouter();
  const [kcal, setKcal] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const kcalNum = Number(kcal);
  const isKcalValid = kcal.length > 0 && kcalNum > 0 && kcalNum <= 10000;
  const isKcalInvalid = kcal.length > 0 && !isKcalValid;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateKcal(Number(kcal));
      setModalVisible(true);
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "권장 칼로리 수정에 실패했습니다.",
      );
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KkBackground>
      <KkHeader
        title="권장 칼로리 수정"
        variant="close"
        onClose={() => router.replace("/(tabs)/mypage")}
      />
      <View style={styles.content}>
        <Text style={styles.label}>권장 칼로리</Text>

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={kcal}
            onChangeText={(text) => setKcal(text.replace(/\D/g, ""))}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#aaa"
          />
          <Text style={styles.suffix}>Kcal</Text>
        </View>
        {isKcalInvalid && (
          <Text style={styles.errorText}>1 ~ 10,000 사이의 칼로리를 입력해 주세요.</Text>
        )}

        <View style={styles.bottom}>
          <KkButton
            title="변경하기"
            disabled={!isKcalValid || loading}
            onPress={handleSubmit}
          />
        </View>
      </View>

      <KkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message="권장 칼로리가 수정되었습니다."
        buttonText="확인"
        onButtonPress={() => router.replace("/(tabs)/mypage")}
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
  },
  label: {
    ...Typography.title.s,
    color: "#FDFCFC",
    marginBottom: 8,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 16,
    height: 48,
    backgroundColor: "#FDFCFC1A",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#F6623B",
    paddingHorizontal: 16,
  },
  input: {
    ...Typography.body.l,
    flex: 1,
    color: "#FDFCFC",
    textAlign: "right",
  },
  suffix: {
    ...Typography.body.l,
    color: "#FDFCFC",
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 32,
  },
  errorText: {
    color: "#F6623B",
    fontSize: 12,
    marginTop: 4,
  },
});
