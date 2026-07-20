import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import ProfileForm from "@/components/KkProfileForm";
import { getProfile } from "@/utils/api/profileApi";
import { getDownloadUrl } from "@/utils/api/r2Api";
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
  const [initialImageUrl, setInitialImageUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getProfile()
      .then(async (data) => {
        if (controller.signal.aborted) return;
        setProfile(data);
        if (data.profile_image) {
          try {
            const url = await getDownloadUrl(data.profile_image);
            if (!controller.signal.aborted) setInitialImageUrl(url);
          } catch {}
        }
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

  if (loading) {
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
    color: "#E7E2DF",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Pretendard-Regular",
  },
  errorButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  errorButtonText: {
    color: "#E7E2DF",
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
  },
});
