import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { TERMS_CONTENT } from "@/constants/terms";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupTermsDetail() {
  const params = useLocalSearchParams<{ title: string; termId: string }>();
  const title = Array.isArray(params.title) ? params.title[0] : (params.title ?? "");
  const termId = Array.isArray(params.termId) ? params.termId[0] : (params.termId ?? "");
  const router = useRouter();
  const content = TERMS_CONTENT[termId] ?? "";

  return (
    <KkBackground>
      <KkHeader title={title} variant="back" />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <View style={styles.container}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.body}>{content}</Text>
          </ScrollView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  body: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: Colors.gray[200],
    lineHeight: 22,
  },
  bottom: {
    paddingBottom: 12,
  },
});
