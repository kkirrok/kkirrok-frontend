import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Sentry } from "@/utils/sentry";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  error: Error;
  retry: () => Promise<void>;
};

// 화면 렌더링 중 에러가 나면 앱이 꺼지는 대신 보여주는 화면 (expo-router ErrorBoundary)
export default function KkErrorFallback({ error, retry }: Props) {
  useEffect(() => {
    // ErrorBoundary가 잡은 에러는 전역 핸들러로 가지 않으므로 직접 Sentry에 전송
    Sentry.captureException(error);
  }, [error]);

  return (
    <KkBackground>
      <View style={styles.container}>
        <Text style={styles.emoji}>😵</Text>
        <Text style={styles.title}>문제가 발생했어요</Text>
        <Text style={styles.description}>
          잠시 후 다시 시도해 주세요.{"\n"}문제가 계속되면 앱을 다시 실행해 주세요.
        </Text>
        <KkButton title="다시 시도" onPress={retry} style={styles.button} />
      </View>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  emoji: { fontSize: 56 },
  title: { ...Typography.title.m, color: Colors.gray[100] },
  description: {
    ...Typography.body.m,
    color: Colors.gray[300],
    textAlign: "center",
  },
  button: { marginTop: 12, alignSelf: "stretch" },
});
