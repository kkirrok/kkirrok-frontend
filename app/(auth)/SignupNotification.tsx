import { Typography } from "@/constants/typography";
import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { NOTIFICATION_ITEMS } from "@/constants/notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupNotification() {
  const router = useRouter();
  const { termsChecked } = useLocalSearchParams<{ termsChecked?: string }>();
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_ITEMS.map((n) => [n.id, false])),
  );

  const allOn = NOTIFICATION_ITEMS.every((n) => settings[n.id]);

  const toggleAll = (value: boolean) =>
    setSettings(Object.fromEntries(NOTIFICATION_ITEMS.map((n) => [n.id, value])));

  const toggle = (id: string, value: boolean) =>
    setSettings((prev) => ({ ...prev, [id]: value }));

  return (
    <KkBackground>
      <KkHeader title="끼록 시작하기" variant="back" />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>전체 알림</Text>
            <Switch
              value={allOn}
              onValueChange={toggleAll}
              trackColor={{ false: Colors.gray[700], true: Colors.main[500] }}
              thumbColor={Colors.gray[100]}
            />
          </View>

          <View style={styles.separator} />

          {NOTIFICATION_ITEMS.map((notif) => (
            <View key={notif.id} style={styles.row}>
              <Text style={styles.label}>{notif.label}</Text>
              <Switch
                value={settings[notif.id]}
                onValueChange={(v) => toggle(notif.id, v)}
                trackColor={{ false: Colors.gray[700], true: Colors.main[500] }}
                thumbColor={Colors.gray[100]}
              />
            </View>
          ))}

          <View style={styles.bottom}>
            {/* TODO: 알림 설정 저장 API 스펙 확정 후 settings 값 전달 (ex. PATCH /v1/users/notifications) */}
            <KkButton
              title="다음"
              onPress={() =>
                router.push({
                  pathname: "/(auth)/Signup",
                  params: { termsChecked },
                })
              }
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  label: {
    ...Typography.body.l,
    color: Colors.gray[200],
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray[800],
    marginBottom: 4,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 12,
  },
});
