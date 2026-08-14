import { Typography } from "@/constants/typography";
import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkModal from "@/components/KkModal";
import { Colors } from "@/constants/colors";
import { agreeTerms, getTermsList } from "@/utils/api/termsApi";
import { tokenStore } from "@/utils/store/tokenStore";
import { TERM_LABELS, TermItem } from "@/utils/types/terms";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsAgreement() {
  const router = useRouter();
  const { next } = useLocalSearchParams<{ next?: string }>();

  const [terms, setTerms] = useState<TermItem[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [termsLoadFailed, setTermsLoadFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useEffect(() => {
    tokenStore.get().then((token) => {
      if (!token) router.replace("/(auth)/Login");
    });
  }, []);

  useEffect(() => {
    getTermsList()
      .then((list) => {
        setTerms(list);
        setChecked(Object.fromEntries(list.map((t) => [t.type, false])));
      })
      .catch(() => {
        setTermsLoadFailed(true);
        setErrorMessage("약관 목록을 불러오는 데 실패했습니다.");
        setErrorModalVisible(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const allChecked = terms.every((t) => checked[t.type]);
  const requiredChecked = terms
    .filter((t) => t.is_required)
    .every((t) => checked[t.type]);

  const toggleAll = () => {
    const next = !allChecked;
    setChecked(Object.fromEntries(terms.map((t) => [t.type, next])));
  };

  const toggle = (type: string) =>
    setChecked((prev) => ({ ...prev, [type]: !prev[type] }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await agreeTerms(
        terms.map((t) => ({ type: t.type, is_agree: checked[t.type] ?? false })),
      );
      if (next === "onboarding") {
        router.replace("/(auth)/KkirokStart");
      } else {
        router.replace("/(tabs)");
      }
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "약관 동의에 실패했습니다.",
      );
      setErrorModalVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KkBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Text style={styles.title}>서비스 이용 약관</Text>
          <Text style={styles.subtitle}>서비스 이용을 위해 약관에 동의해 주세요.</Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.main[500]} />
          </View>
        ) : (
          <View style={styles.content}>
            <TouchableOpacity style={styles.masterRow} onPress={toggleAll}>
              <Ionicons
                name={allChecked ? "checkbox" : "checkbox-outline"}
                size={24}
                color={allChecked ? Colors.main[500] : Colors.gray[400]}
              />
              <Text style={styles.masterLabel}>약관 전체 동의</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            {terms.map((term) => (
              <View key={term.type} style={styles.termRow}>
                <TouchableOpacity
                  style={styles.termLeft}
                  onPress={() => toggle(term.type)}
                >
                  <Ionicons
                    name={checked[term.type] ? "checkbox" : "checkbox-outline"}
                    size={22}
                    color={
                      checked[term.type] ? Colors.main[500] : Colors.gray[400]
                    }
                  />
                  <Text style={styles.termLabel}>
                    <Text
                      style={
                        term.is_required ? styles.requiredTag : styles.optionalTag
                      }
                    >
                      ({term.is_required ? "필수" : "선택"}){" "}
                    </Text>
                    {TERM_LABELS[term.type] ?? term.type}
                  </Text>
                </TouchableOpacity>
                {term.url && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(auth)/SignupTermsDetail",
                        params: {
                          title: `(${term.is_required ? "필수" : "선택"}) ${TERM_LABELS[term.type] ?? term.type}`,
                          termUrl: term.url,
                        },
                      })
                    }
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.gray[500]}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <View style={styles.bottom}>
              <KkButton
                title="동의하고 시작하기"
                disabled={termsLoadFailed || !requiredChecked || submitting}
                onPress={handleSubmit}
              />
            </View>
          </View>
        )}
      </SafeAreaView>

      <KkModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        message={errorMessage}
        buttonText="확인"
        onButtonPress={() => setErrorModalVisible(false)}
      />
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 8,
  },
  title: {
    ...Typography.title.m,
    color: Colors.gray[100],
  },
  subtitle: {
    ...Typography.body.m,
    color: Colors.gray[400],
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  masterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  masterLabel: {
    ...Typography.title.xs,
    color: Colors.gray[100],
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray[800],
    marginVertical: 16,
  },
  termRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  termLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  termLabel: {
    ...Typography.body.m,
    color: Colors.gray[200],
    flex: 1,
  },
  requiredTag: { color: Colors.main[500] },
  optionalTag: { color: Colors.gray[500] },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 12,
  },
});
