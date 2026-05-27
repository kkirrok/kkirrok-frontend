import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const ONBOARDING_KEY = "onboarding_completed";

export const tokenStore = {
  save: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  get: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  remove: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
  setOnboarding: (completed: boolean) =>
    SecureStore.setItemAsync(ONBOARDING_KEY, completed ? "true" : "false"),
  getOnboarding: async () => {
    const val = await SecureStore.getItemAsync(ONBOARDING_KEY);
    return val === "true";
  },
};
