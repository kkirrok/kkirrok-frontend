import { Typography } from "@/constants/typography";
import BellIcon from "@/assets/icons/bell.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import KkBackground from "@/components/KkBackground";
import KkModal from "@/components/KkModal";
import { useProfile } from "@/hooks/useProfile";
import { useProfileImage } from "@/hooks/useProfileImage";
import { deleteAccount, signOut } from "@/utils/api/authApi";
import { unregisterPushToken } from "@/utils/notifications/pushToken";
import { tokenStore } from "@/utils/store/tokenStore";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const { data: imageUrl } = useProfileImage(profile?.profile_image);

  const handleLogout = async () => {
    try {
      await unregisterPushToken();
    } catch {}
    try {
      await signOut();
    } catch {
      // 서버 오류여도 로컬 토큰은 삭제하고 로그인으로 이동
    }
    try {
      await tokenStore.remove();
    } catch {
      // 토큰 삭제 실패해도 로그인으로 이동
    }
    router.replace("/(auth)/SocialLogin");
  };

  return (
    <KkBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>마이페이지</Text>
            <TouchableOpacity
              style={styles.bellIconContainer}
              onPress={() => router.push("/notification")}
              accessibilityRole="button"
              accessibilityLabel="알림 화면으로 이동"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <BellIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.profileSection}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.profileImage}
              contentFit="cover"
            />
          ) : (
            <ProfileIcon width={72} height={72} />
          )}
          <View>
            <Text style={styles.name}>
              {isLoading
                ? "로딩중..."
                : profile?.nickname
                  ? `${profile.nickname}님`
                  : "guest님"}
            </Text>
            {profile?.meal_style_label ? (
              <Text style={styles.sub}>#{profile.meal_style_label}</Text>
            ) : null}
            {profile?.recommended_kcal ? (
              <Text style={styles.sub2}>
                권장 칼로리: {profile.recommended_kcal}kcal
              </Text>
            ) : null}
          </View>
        </View>

        <Text style={styles.sectionTitle}>내 정보</Text>

        <MenuItem
          title="프로필 변경"
          onPress={() => {
            router.push("/(auth)/ProfileEdit");
          }}
        />
        <MenuItem
          title="비밀번호 변경"
          onPress={() => {
            router.push("/(auth)/FindPassword");
          }}
        />
        <MenuItem
          title="권장 칼로리 변경"
          onPress={() => {
            router.push("/(auth)/ResetKcal");
          }}
        />
        <MenuItem
          title="알림 설정"
          onPress={() => {
            router.push("/notification-settings");
          }}
        />

        <View style={styles.divider} />

        {/* 이용 안내 */}
        <Text style={styles.sectionTitle}>이용 안내</Text>

        <MenuItem title="앱 정보" />
        <MenuItem
          title="로그아웃"
          onPress={() => {
            setModalType("logout");
            setModalVisible(true);
          }}
        />

        <MenuItem
          title="회원 탈퇴"
          onPress={() => {
            setModalType("withdraw");
            setModalVisible(true);
          }}
        />

        <KkModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={
            modalType === "logout"
              ? "로그아웃하시겠습니까?"
              : "탈퇴하면 지금까지 모든 기록이 삭제되고 다시 복구할 수 없습니다. 정말 탈퇴하시겠습니까?"
          }
          cancelText="취소"
          onCancelPress={() => setModalVisible(false)}
          buttonText="확인"
          onButtonPress={() => {
            setModalVisible(false);
            if (modalType === "logout") {
              handleLogout();
            } else if (modalType === "withdraw") {
              deleteAccount()
                .then(async () => {
                  try {
                    await tokenStore.remove();
                  } catch {
                    // 토큰 삭제 실패해도 계정은 이미 삭제됨
                  }
                  router.replace("/(auth)/SocialLogin");
                })
                .catch((e) => {
                  setErrorMessage(
                    e instanceof Error
                      ? e.message
                      : "회원 탈퇴에 실패했습니다.",
                  );
                  setErrorModalVisible(true);
                });
            }
          }}
        />
        <KkModal
          visible={errorModalVisible}
          onClose={() => setErrorModalVisible(false)}
          message={errorMessage}
          buttonText="확인"
          onButtonPress={() => setErrorModalVisible(false)}
        />
      </ScrollView>
    </KkBackground>
  );
}

function MenuItem({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  headerTitle: {
    ...Typography.title.m,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    color: "white",
  },
  bellIconContainer: {
    marginLeft: "auto",
    marginRight: 6,
  },
  profileSection: {
    gap: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  name: {
    ...Typography.title.s,
    color: "#FDFCFC",
  },

  sub: {
    ...Typography.title.xs,
    color: "#E7E2DF",
    marginTop: 4,
  },
  sub2: {
    ...Typography.title.xs,
    color: "#D0C7C2",
    marginTop: 4,
  },
  sectionTitle: {
    color: "#FDFCFC",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 4,
  },
  menuText: {
    ...Typography.title.xs,
    color: "#E7E2DF",
  },
  divider: {
    height: 1,
    backgroundColor: "#D0C7C2",
    opacity: 0.4,
    marginVertical: 24,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
});
