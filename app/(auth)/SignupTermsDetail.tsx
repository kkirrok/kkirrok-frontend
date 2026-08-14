import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { getDownloadUrlPublic } from "@/utils/api/r2Api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupTermsDetail() {
  const params = useLocalSearchParams<{ title: string; termUrl: string }>();
  const title = Array.isArray(params.title)
    ? params.title[0]
    : (params.title ?? "");
  const termUrl = Array.isArray(params.termUrl)
    ? params.termUrl[0]
    : (params.termUrl ?? "");
  const router = useRouter();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setContent("");

    if (!termUrl) {
      setLoading(false);
      setError(true);
      return;
    }

    const controller = new AbortController();

    const fetchContent = async () => {
      try {
        const url = termUrl.startsWith("http")
          ? termUrl
          : await getDownloadUrlPublic(termUrl);
        if (controller.signal.aborted) return;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error();
        setContent(await res.text());
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchContent();
    return () => controller.abort();
  }, [termUrl]);

  return (
    <KkBackground>
      <KkHeader title={title} variant="back" />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <View style={styles.container}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={Colors.main[500]} />
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>내용을 불러오지 못했습니다.</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.body}>{content}</Text>
            </ScrollView>
          )}
          <View style={styles.bottom}>
            <KkButton title="확인" onPress={() => router.back()} />
          </View>
        </View>
      </SafeAreaView>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  body: {
    ...Typography.body.m,
    color: Colors.gray[200],
    lineHeight: 22,
  },
  errorText: {
    ...Typography.body.m,
    color: Colors.gray[400],
  },
  bottom: { paddingBottom: 12 },
});
