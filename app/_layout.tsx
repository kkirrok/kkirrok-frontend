import { initializeKakaoSDK } from "@react-native-kakao/core";
import NaverLogin from "@react-native-seoul/naver-login";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, router } from "expo-router";
import { tokenStore } from "@/utils/store/tokenStore";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Platform, Text } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldPlayAnnouncement: false,
  }),
});

const kakaoKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
if (!kakaoKey) {
  console.warn("EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY is missing");
} else {
  try {
    initializeKakaoSDK(kakaoKey);
  } catch (e) {
    console.error("KakaoSDK initialize failed:", e);
  }
}

const naverId = process.env.EXPO_PUBLIC_NAVER_CLIENT_ID;
const naverSecret = process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET;
const naverScheme = process.env.EXPO_PUBLIC_NAVER_URL_SCHEME;
if (!naverId || !naverSecret) {
  console.warn("Naver login env vars are missing");
} else {
  if (!naverScheme) {
    console.warn(
      "EXPO_PUBLIC_NAVER_URL_SCHEME is missing; iOS Naver login may not work",
    );
  }
  try {
    NaverLogin.initialize({
      appName: "끼록",
      consumerKey: naverId,
      consumerSecret: naverSecret,
      serviceUrlSchemeIOS: naverScheme ?? "",
      disableNaverAppAuthIOS: false,
    });
  } catch (e) {
    console.error("NaverLogin initialize failed:", e);
  }
}

async function handleTermsError(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "TERMS_AGREEMENT_REQUIRED"
  ) {
    const onboardingDone = await tokenStore.getOnboarding();
    router.replace({
      pathname: "/(auth)/TermsAgreement",
      params: { next: onboardingDone ? "tabs" : "onboarding" },
    });
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleTermsError }),
  mutationCache: new MutationCache({ onError: handleTermsError }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // @ts-ignore
      Text.defaultProps = Text.defaultProps ?? {};
      // @ts-ignore
      Text.defaultProps.style = { fontFamily: "Pretendard-Regular" };
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS === "android") {
      SystemUI.setBackgroundColorAsync("#1A1614");
    }
  }, []);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
