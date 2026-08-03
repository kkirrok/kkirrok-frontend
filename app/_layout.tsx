import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NaverLogin from "@react-native-seoul/naver-login";
import { initializeKakaoSDK } from "@react-native-kakao/core";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
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

const queryClient = new QueryClient({
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

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
