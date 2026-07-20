import PhotoIcon from "@/assets/icons/photo.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import KkButton from "@/components/KkButton";
import KkModal from "@/components/KkModal";
import KkTextBox from "@/components/KkTextBox";
import { setProfile } from "@/utils/api/authApi";
import { tokenStore } from "@/utils/store/tokenStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "create" | "edit";

interface ProfileFormProps {
  mode: Mode;
  name?: string;
  birthdate?: string;
  phone?: string;
  initialNickname?: string;
  initialGender?: "female" | "male";
  initialGoal?: "lose" | "maintain" | "gain" | "habit";
  initialHabits?: string[];
  initialImageUrl?: string;
}

const PURPOSE_MAP: Record<string, string> = {
  lose: "LOSE_WEIGHT",
  maintain: "MAINTAIN",
  gain: "GAIN_WEIGHT",
  habit: "HABIT",
};

const HABITS: { label: string; value: string }[] = [
  { label: "야식 잦음", value: "LATE_NIGHT_MEAL" },
  { label: "폭식", value: "BIG_EATER" },
  { label: "소식", value: "SMALL_EATER" },
  { label: "불규칙 식사", value: "IRREGULAR_MEAL" },
  { label: "규칙적 식사", value: "REGULAR_MEAL" },
  { label: "단 음식 선호", value: "SWEET" },
  { label: "짠 음식 선호", value: "SALTY" },
  { label: "매운 음식 선호", value: "SPICY" },
  { label: "음주 잦음", value: "BEVERAGE" },
  { label: "배달 자주", value: "DELIVERY_FOOD" },
  { label: "패스트푸드 자주", value: "FAST_FOOD" },
  { label: "채소 위주", value: "VEGETABLE" },
  { label: "육류 위주", value: "MEAT" },
  { label: "간식 많음", value: "SNACK" },
  { label: "디저트 선호", value: "DESSERT" },
  { label: "간헐적 단식", value: "INTERMITTENT_FASTING" },
  { label: "다이어트 식단", value: "DIET" },
];

export default function KkProfileForm({
  mode,
  name,
  birthdate,
  phone,
  initialNickname,
  initialGender,
  initialGoal,
  initialHabits,
  initialImageUrl,
}: ProfileFormProps) {
  const isEdit = mode === "edit";
  const [nickname, setNickname] = useState(initialNickname ?? "");
  const [gender, setGender] = useState<"female" | "male" | null>(
    initialGender ?? null,
  );
  const [goal, setGoal] = useState<
    "lose" | "maintain" | "gain" | "habit" | null
  >(initialGoal ?? null);
  const [age, setAge] = useState<string>("");
  const [selectedHabits, setSelectedHabits] = useState<string[]>(
    initialHabits ?? [],
  );
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const router = useRouter();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setErrorMessage("사진 접근 권한이 필요합니다.");
      setErrorModalVisible(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!gender || !goal) return;
    setSubmitting(true);
    try {
      await setProfile(
        {
          name: name ?? "",
          birth: birthdate ?? "",
          phone: phone ?? "",
          nickname,
          gender: gender === "female" ? "FEMALE" : "MALE",
          purpose: PURPOSE_MAP[goal],
          habits: selectedHabits,
        },
        imageUri ?? undefined,
      );
      await tokenStore.setOnboarding(true);
      router.replace("/(tabs)");
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.",
      );
      setErrorModalVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!gender || !goal) return;
    setSubmitting(true);
    try {
      await setProfile(
        {
          name: name ?? "",
          birth: birthdate ?? "",
          phone: phone ?? "",
          nickname,
          gender: gender === "female" ? "FEMALE" : "MALE",
          purpose: PURPOSE_MAP[goal],
          habits: selectedHabits,
        },
        imageUri ?? undefined,
      );
      setModalVisible(true);
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.",
      );
      setErrorModalVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHabit = (value: string) => {
    setSelectedHabits((prev) =>
      prev.includes(value) ? prev.filter((h) => h !== value) : [...prev, value],
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>프로필 사진</Text>
          <View style={styles.profileSection}>
            <View style={styles.wrapper}>
              {imageUri || initialImageUrl ? (
                <Image
                  source={{ uri: imageUri ?? initialImageUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <ProfileIcon width={112} height={112} />
              )}

              <TouchableOpacity style={styles.camera} onPress={handlePickImage}>
                <PhotoIcon width={32} height={32} />
              </TouchableOpacity>
            </View>
          </View>
          <KkTextBox
            label="닉네임*"
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해 주세요."
          />
          <View>
            <View style={styles.container}>
              <Text style={styles.title}>성별*</Text>
              <View style={styles.section}>
                <KkButton
                  title="여성"
                  size="tag"
                  selected={gender === "female"}
                  onPress={() => setGender("female")}
                />
                <KkButton
                  title="남성"
                  size="tag"
                  selected={gender === "male"}
                  onPress={() => setGender("male")}
                />
              </View>
            </View>

            {isEdit && (
              <View style={{ width: 80, marginBottom: 24 }}>
                <Text style={styles.title}>나이</Text>
                <View
                  style={[
                    styles.inputBox,
                    { borderColor: age ? "#F6623B" : "#A49289" },
                  ]}
                >
                  <Text style={styles.suffix}>만</Text>
                  <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#aaa"
                  />
                  <Text style={styles.suffix}>세</Text>
                </View>
              </View>
            )}
            <View style={styles.container}>
              <Text style={styles.title}>목표*</Text>
              <View style={styles.section}>
                <KkButton
                  title="감량"
                  size="tag"
                  selected={goal === "lose"}
                  onPress={() => setGoal("lose")}
                />
                <KkButton
                  title="유지"
                  size="tag"
                  selected={goal === "maintain"}
                  onPress={() => setGoal("maintain")}
                />
                <KkButton
                  title="증량"
                  size="tag"
                  selected={goal === "gain"}
                  onPress={() => setGoal("gain")}
                />
                <KkButton
                  title="습관"
                  size="tag"
                  selected={goal === "habit"}
                  onPress={() => setGoal("habit")}
                />
              </View>
            </View>

            <View>
              <Text style={[styles.title, { marginBottom: 8 }]}>
                식습관 유형
              </Text>
              <View style={styles.section}>
                {HABITS.map(({ label, value }) => (
                  <KkButton
                    key={value}
                    title={label}
                    size="tag"
                    selected={selectedHabits.includes(value)}
                    onPress={() => toggleHabit(value)}
                    showIcon
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={{ marginTop: "auto", marginBottom: 12 }}>
            <KkButton
              title={isEdit ? "변경하기" : "다음"}
              disabled={!nickname || !gender || !goal || submitting}
              onPress={() => {
                if (isEdit) {
                  handleEdit();
                } else {
                  handleCreate();
                }
              }}
            />
          </View>

          <KkModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            message="프로필이 변경되었습니다."
            buttonText="확인"
            onButtonPress={() => router.push("/(tabs)/mypage")}
          />
          <KkModal
            visible={errorModalVisible}
            onClose={() => setErrorModalVisible(false)}
            message={errorMessage}
            buttonText="확인"
            onButtonPress={() => setErrorModalVisible(false)}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 24,
  },
  title: {
    color: "#FDFCFC",
    fontSize: 18,
    fontWeight: "600",
    paddingBottom: 8,
  },
  container: {
    marginBottom: 24,
  },
  section: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 8,
    rowGap: 16,
  },
  profileSection: {
    alignItems: "center",
    gap: 12,
  },
  wrapper: {
    width: 112,
    height: 112,
    alignSelf: "center",
  },
  profileImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  camera: {
    position: "absolute",
    right: 0,
    bottom: 0,
    padding: 0,
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
    color: "#FDFCFC",
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    textAlign: "right",
    paddingHorizontal: 8,
  },
  suffix: {
    color: "#FDFCFC",
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
  },
});
