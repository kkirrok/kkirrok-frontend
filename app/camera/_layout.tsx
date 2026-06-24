import { tokenStore } from "@/utils/store/tokenStore";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function CameraLayout() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    tokenStore.get().then((token) => {
      if (!token) router.replace("/(auth)/Login");
      else setChecked(true);
    }).catch(() => {
      router.replace("/(auth)/Login");
    });
  }, []);

  if (!checked) return <View style={{ flex: 1 }} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
