import {
  registerDeviceToken,
  unregisterDeviceToken,
} from "@/utils/api/notificationApi";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const PUSH_TOKEN_KEY = "push_device_token";

export async function requestAndRegisterPushToken(): Promise<void> {
  if (Platform.OS === "web") return;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;

  const { data: token } = await Notifications.getDevicePushTokenAsync();
  await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);

  const platform = Platform.OS === "ios" ? "IOS" : "ANDROID";
  await registerDeviceToken(token, platform);
}

export async function unregisterPushToken(): Promise<void> {
  if (Platform.OS === "web") return;

  const token = await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
  if (!token) return;

  await unregisterDeviceToken(token);
  await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY);
}
