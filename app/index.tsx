import { getUserRole } from "@/utils/api/authApi";
import { tokenStore } from "@/utils/store/tokenStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await tokenStore.get();
        if (!token) {
          router.replace("/(auth)/SocialLogin");
          return;
        }
        const role = await getUserRole();
        if (role === "PENDING") {
          router.replace("/(auth)/KkirokStart");
        } else {
          router.replace("/(tabs)");
        }
      } catch {
        router.replace("/(auth)/SocialLogin");
      }
    }
    checkAuth();
  }, [router]);

  return <View style={{ flex: 1, backgroundColor: "#1A1614" }} />;
}
