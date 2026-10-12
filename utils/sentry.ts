import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

// 개발 중 에러와 실제 사용자 에러를 Sentry에서 구분하기 위한 환경 이름
// (EAS Update 채널: production / staging / development)
function getEnvironment() {
  if (__DEV__) return "development";
  return Updates.channel || "production";
}

export function initSentry() {
  if (!dsn) {
    console.warn("EXPO_PUBLIC_SENTRY_DSN is missing; Sentry is disabled");
    return;
  }
  Sentry.init({
    dsn,
    environment: getEnvironment(),
    // 어떤 OTA 업데이트에서 발생한 에러인지 구분
    dist: Updates.updateId ?? undefined,
    // 이메일·IP 등 개인정보는 전송하지 않음
    sendDefaultPii: false,
  });
}

export { Sentry };
