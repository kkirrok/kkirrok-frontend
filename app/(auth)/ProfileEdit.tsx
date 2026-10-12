import { Typography } from "@/constants/typography";
import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import ProfileForm from "@/components/KkProfileForm";
import { useR2ImageUrl } from "@/hooks/useR2ImageUrl";
import { getProfile } from "@/utils/api/profileApi";
import { UserProfile } from "@/utils/types/profile";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const REVERSE_PURPOSE_MAP: Record<
  string,
  "lose" | "maintain" | "gain" | "habit"
> = {
  LOSE_WEIGHT: "lose",
  MAINTAIN: "maintain",
  GAIN_WEIGHT: "gain",
  HABIT: "habit",
};

export default function ProfileEdit() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getProfile()
      .then((data) => {
        if (controller.signal.aborted) return;
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "프로필 조회에 실패했습니다.";
        if (message.includes("인증 토큰")) {
          router.replace("/(auth)/SocialLogin");
        } else {
          setError(message);
        }
        setLoading(false);
      });

    return () => controller.abort();
  }, [router]);

  // 마이페이지에서 이미 받은 프로필 URL이 있으면 캐시를 그대로 사용
  const { data: initialImageUrl, isLoading: imageLoading } = useR2ImageUrl(
    profile?.profile_image,
  );

  if (loading || imageLoading) {
    return (
      <KkBackground>
        <KkHeader title="프로필 변경" />
      </KkBackground>
    );
  }

  if (error) {
    return (
      <KkBackground>
        <KkHeader title="프로필 변경" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.errorButton}
          >
            <Text style={styles.errorButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </KkBackground>
    );
  }

  const selectedPurpose = profile?.purposes.find((p) => p.is_selected)?.value;
  const initialGoal = selectedPurpose
    ? REVERSE_PURPOSE_MAP[selectedPurpose]
    : undefined;
  const initialHabits =
    profile?.habits.filter((h) => h.is_selected).map((h) => h.value) ?? [];
  const initialGender =
    profile?.gender === "MALE"
      ? "male"
      : profile?.gender === "FEMALE"
        ? "female"
        : undefined;

  return (
    <KkBackground>
      <KkHeader title="프로필 변경" />
      <ProfileForm
        mode="edit"
        name={profile?.name}
        birthdate={profile?.birth}
        phone={profile?.phone}
        initialNickname={profile?.nickname}
        initialGender={initialGender}
        initialGoal={initialGoal}
        initialHabits={initialHabits}
        initialImageUrl={initialImageUrl}
      />
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  errorText: {
    ...Typography.body.l,
    color: "#E7E2DF",
    textAlign: "center",
  },
  errorButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  errorButtonText: {
    ...Typography.body.m,
    color: "#E7E2DF",
    fontFamily: "Pretendard-SemiBold",
  },
});
