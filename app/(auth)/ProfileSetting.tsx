import KkBackground from "@/components/KkBackground";
import KkHeader from "@/components/KkHeader";
import ProfileForm from "@/components/KkProfileForm";
import { tokenStore } from "@/utils/store/tokenStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";

export default function ProfileSetting() {
  const router = useRouter();
  const { name, birthdate, phone } = useLocalSearchParams<{
    name: string;
    birthdate: string;
    phone: string;
  }>();
  useEffect(() => {
    tokenStore
      .get()
      .then((token) => {
        if (!token) router.replace("/(auth)/Login");
      })
      .catch(() => router.replace("/(auth)/Login"));
  }, [router]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      router.back();
      return true;
    });
    return () => sub.remove();
  }, [router]);

  return (
    <KkBackground>
      <KkHeader title="프로필 설정" onBackPress={() => router.back()} />
      <ProfileForm
        mode="create"
        name={name}
        birthdate={birthdate}
        phone={phone}
      />
    </KkBackground>
  );
}
