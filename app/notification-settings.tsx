import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkModal from "@/components/KkModal";
import {
  fetchNotificationSettings,
  updateNotificationSettings,
  type NotificationAgreeType,
  type NotificationSettings,
} from "@/utils/api/notificationApi";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ALL_TYPES: NotificationAgreeType[] = [
  "KKIROK",
  "KKINIPOP",
  "GROUP_JOIN_AND_QUIT",
  "REACTION",
];

const TYPE_LABEL: Record<NotificationAgreeType, string> = {
  KKIROK: "끼록 알림",
  KKINIPOP: "끼니팝 알림",
  GROUP_JOIN_AND_QUIT: "그룹 알림",
  REACTION: "그룹 끼록 반응 알림",
};

const ORANGE = "#F6623B";

function buildAgreeMap(
  data: NotificationSettings,
): Record<NotificationAgreeType, boolean> {
  if (data.agrees.length === 0) {
    return Object.fromEntries(ALL_TYPES.map((t) => [t, data.is_all])) as Record<
      NotificationAgreeType,
      boolean
    >;
  }
  const map = Object.fromEntries(
    ALL_TYPES.map((t) => [t, data.is_all]),
  ) as Record<NotificationAgreeType, boolean>;
  for (const a of data.agrees) {
    if (a.type in map) map[a.type] = a.is_agree;
  }
  return map;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [agreeMap, setAgreeMap] = useState<
    Record<NotificationAgreeType, boolean>
  >(
    () =>
      Object.fromEntries(ALL_TYPES.map((t) => [t, false])) as Record<
        NotificationAgreeType,
        boolean
      >,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      setLoading(true);
      fetchNotificationSettings(controller.signal)
        .then((data: NotificationSettings) => {
          setAgreeMap(buildAgreeMap(data));
        })
        .catch((err: unknown) => {
          if (err instanceof Error && err.name === "AbortError") return;
          setErrorMessage(
            err instanceof Error
              ? err.message
              : "알림 설정 조회에 실패했습니다.",
          );
          setErrorModalVisible(true);
        })
        .finally(() => setLoading(false));
      return () => controller.abort();
    }, []),
  );

  const isAll = ALL_TYPES.every((t) => agreeMap[t]);

  const handleToggleAll = (value: boolean) => {
    setAgreeMap(
      Object.fromEntries(ALL_TYPES.map((t) => [t, value])) as Record<
        NotificationAgreeType,
        boolean
      >,
    );
  };

  const handleToggle = (type: NotificationAgreeType, value: boolean) => {
    setAgreeMap((prev) => ({ ...prev, [type]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const allSame = ALL_TYPES.every((t) => agreeMap[t] === isAll);
      if (allSame) {
        await updateNotificationSettings(
          true,
          ALL_TYPES.map((t) => ({ type: t, is_agree: isAll })),
        );
      } else {
        await updateNotificationSettings(
          false,
          ALL_TYPES.map((t) => ({ type: t, is_agree: agreeMap[t] })),
        );
      }
      router.back();
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "알림 설정 변경에 실패했습니다.",
      );
      setErrorModalVisible(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KkBackground>
      <KkHeader title="알림 설정" />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={ORANGE} />
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.row}>
              <Text style={styles.label}>전체 알림</Text>
              <Switch
                value={isAll}
                onValueChange={handleToggleAll}
                trackColor={{ false: "#5C4A43", true: ORANGE }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            {ALL_TYPES.map((type) => (
              <View key={type} style={styles.row}>
                <Text style={styles.label}>{TYPE_LABEL[type]}</Text>
                <Switch
                  value={agreeMap[type]}
                  onValueChange={(v) => handleToggle(type, v)}
                  trackColor={{ false: "#5C4A43", true: ORANGE }}
                  thumbColor="#FFFFFF"
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.bottom}>
            <KkButton title="저장" disabled={saving} onPress={handleSave} />
          </View>
        </SafeAreaView>
      )}

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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  label: {
    color: "#FDFCFC",
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
  },
  divider: {
    height: 1,
    backgroundColor: "#D0C7C2",
    opacity: 0.3,
    marginVertical: 4,
  },
  bottom: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
