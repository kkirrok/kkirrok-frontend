import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
