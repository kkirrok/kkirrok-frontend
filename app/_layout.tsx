import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NaverLogin from '@react-native-seoul/naver-login';
import { initializeKakaoSDK } from '@react-native-kakao/core';

if (initializeKakaoSDK) {
  initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? '');
}

try {
  NaverLogin.initialize({
    appName: '끼록',
    consumerKey: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID ?? '',
    consumerSecret: process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET ?? '',
    serviceUrlSchemeIOS: process.env.EXPO_PUBLIC_NAVER_URL_SCHEME ?? '',
    disableNaverAppAuthIOS: false,
  });
} catch (e) {
  console.error('NaverLogin initialize failed:', e);
}

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // @ts-ignore
      Text.defaultProps = Text.defaultProps ?? {};
      // @ts-ignore
      Text.defaultProps.style = { fontFamily: 'Pretendard-Regular' };
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
