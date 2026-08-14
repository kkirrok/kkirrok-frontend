import { Typography } from "@/constants/typography";
import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { getTermsList } from "@/utils/api/termsApi";
import { TERM_LABELS, TermItem } from "@/utils/types/terms";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupTerms() {
  const router = useRouter();
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [termsLoadFailed, setTermsLoadFailed] = useState(false);

  const fetchTerms = () => {
    setLoading(true);
    setTermsLoadFailed(false);
    getTermsList()
      .then((list) => {
        setTerms(list);
        setChecked(Object.fromEntries(list.map((t) => [t.type, false])));
      })
      .catch(() => setTermsLoadFailed(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTerms(); }, []);

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

  return (
    <KkBackground>
      <KkHeader title="끼록 시작하기" variant="back" />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.main[500]} />
          </View>
        ) : termsLoadFailed ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>약관을 불러오지 못했습니다.</Text>
            <TouchableOpacity onPress={fetchTerms} style={styles.retryBtn}>
              <Text style={styles.retryText}>다시 시도</Text>
            </TouchableOpacity>
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
                title="다음"
                disabled={!requiredChecked}
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/SignupNotification",
                    params: { termsChecked: JSON.stringify(checked) },
                  })
                }
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
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
  errorText: {
    ...Typography.body.m,
    color: Colors.gray[400],
    marginBottom: 12,
  },
  retryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: Colors.gray[800],
  },
  retryText: {
    ...Typography.body.m,
    color: Colors.gray[100],
  },
});
