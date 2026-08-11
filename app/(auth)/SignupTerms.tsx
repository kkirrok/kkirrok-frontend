import { Typography } from "@/constants/typography";
import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { TERMS } from "@/constants/terms";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupTerms() {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(TERMS.map((t) => [t.id, false])),
  );

  const allChecked = TERMS.every((t) => checked[t.id]);
  const requiredChecked = TERMS.filter((t) => t.required).every(
    (t) => checked[t.id],
  );

  const toggleAll = () => {
    const next = !allChecked;
    setChecked(Object.fromEntries(TERMS.map((t) => [t.id, next])));
  };

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <KkBackground>
      <KkHeader title="끼록 시작하기" variant="back" />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
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

          {TERMS.map((term) => (
            <View key={term.id} style={styles.termRow}>
              <TouchableOpacity
                style={styles.termLeft}
                onPress={() => toggle(term.id)}
              >
                <Ionicons
                  name={checked[term.id] ? "checkbox" : "checkbox-outline"}
                  size={22}
                  color={checked[term.id] ? Colors.main[500] : Colors.gray[400]}
                />
                <Text style={styles.termLabel}>
                  <Text
                    style={
                      term.required ? styles.requiredTag : styles.optionalTag
                    }
                  >
                    ({term.required ? "필수" : "선택"}){" "}
                  </Text>
                  {term.label}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/SignupTermsDetail",
                    params: {
                      title: `(${term.required ? "필수" : "선택"}) ${term.label}`,
                      termId: term.id,
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
            </View>
          ))}

          <View style={styles.bottom}>
            {/* TODO: 회원가입 API에 marketing_consent 필드 추가되면 checked.marketing 값 전달 */}
            <KkButton
              title="다음"
              disabled={!requiredChecked}
              onPress={() => router.push("/(auth)/SignupNotification")}
            />
          </View>
        </View>
      </SafeAreaView>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
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
  requiredTag: {
    color: Colors.main[500],
  },
  optionalTag: {
    color: Colors.gray[500],
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 12,
  },
});
