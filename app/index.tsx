import { getUserRole } from "@/utils/api/authApi";
import { registerPushTokenIfPermitted } from "@/utils/notifications/pushToken";
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
          // 토큰 갱신·이전 등록 실패 등에 대비해 앱 진입 시마다 등록 상태를 맞춤
          registerPushTokenIfPermitted().catch(() => {});
          router.replace("/(tabs)");
        }
      } catch (e) {
        if (
          e instanceof Error &&
          e.message === "TERMS_AGREEMENT_REQUIRED"
        ) {
          router.replace({
            pathname: "/(auth)/TermsAgreement",
            params: { next: "tabs" },
          });
          return;
        }
        router.replace("/(auth)/SocialLogin");
      }
    }
    checkAuth();
  }, [router]);

  return <View style={{ flex: 1, backgroundColor: "#1A1614" }} />;
}
