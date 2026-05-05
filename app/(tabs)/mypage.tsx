import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import KkBackground from "@/components/KkBackground";
import KkModal from "@/components/KkModal";
import { useState } from 'react';
import { useRouter } from 'expo-router';
import BellIcon from "@/assets/icons/bell.svg";
import ProfileIcon from "@/assets/icons/profile.svg";

export default function MyPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  
  return (
    <KkBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>마이페이지</Text>
            <View style={styles.bellIconContainer}>
              <BellIcon width={24} height={24} />
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.profileSection}>
          <ProfileIcon width={72} height={72} />
          <View>
            <Text style={styles.name}>김스냅님</Text>
            <Text style={styles.sub}>#디저트집착유형</Text>
            <Text style={styles.sub2}>권장 칼로리: 2500kcal</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>내 정보</Text>

        <MenuItem title="프로필 변경" />
        <MenuItem title="비밀번호 변경" />
        <MenuItem title="권장 칼로리 변경" />

        <View style={styles.divider} />

        {/* 이용 안내 */}
        <Text style={styles.sectionTitle}>이용 안내</Text>

        <MenuItem title="앱 정보" />
        <MenuItem
          title="로그아웃"
          onPress={() => {
            setModalType('logout');
            setModalVisible(true);
          }}
        />

        <MenuItem
          title="회원 탈퇴"
          onPress={() => {
            setModalType('withdraw');
            setModalVisible(true);
          }}
        />

        <KkModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalType === 'logout' ? "로그아웃하시겠습니까?" : "탈퇴하면 지금까지 모든 기록이 삭제되고 다시 복구할 수 없습니다. 정말 탈퇴하시겠습니까?"}
          cancelText="취소"
          onCancelPress={() => setModalVisible(false)}
          buttonText="확인"
          onButtonPress={() => {
            setModalVisible(false);
            if (modalType === 'logout') {
              // 로그아웃 로직
            } else if (modalType === 'withdraw') {
              // 회원 탈퇴 로직
            }
          }}
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
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: "Pretendard-SemiBold",
  },
  bellIconContainer: {
    marginLeft: 'auto',
  },
  profileSection: {
    gap: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  name: {
    color: "#FDFCFC",
    fontSize: 18,
    fontWeight: '600',
    fontFamily: "Pretendard-SemiBold",
  },

  sub: {
    color: '#E7E2DF',
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
    marginTop: 4,
  },
  sub2: {
    color: '#D0C7C2',
    marginTop: 4,
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
  },
  sectionTitle: {
    color: '#FDFCFC',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 4,
  },
  menuText: {
    color: '#E7E2DF',
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
  },
  divider: {
    height: 1,
    backgroundColor: '#D0C7C2',
    opacity: 0.4,
    marginVertical: 24,
  },
});