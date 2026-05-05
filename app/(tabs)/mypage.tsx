import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import KkBackground from "@/components/KkBackground";
import BellIcon from "@/assets/icons/bell.svg";
import ProfileIcon from "@/assets/icons/profile.svg";

export default function Page() {
  return (
    <KkBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>마이페이지</Text>
          <BellIcon width={24} height={24} />
          </View>
          </SafeAreaView>

        <View style={styles.profileSection}>
          <ProfileIcon width={70} height={70} />
          <View>
            <Text style={styles.name}>김스냅님</Text>
            <Text style={styles.sub}>#디저트집착유형</Text>
            <Text style={styles.sub}>권장 칼로리: 2500kcal</Text>
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
        <MenuItem title="로그아웃" />
        <MenuItem title="회원 탈퇴" />
      </ScrollView>
    </KkBackground>
  );
}

function MenuItem({ title }: { title: string }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ddd',
    marginRight: 15,
  },

  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  sub: {
    color: '#ddd',
    marginTop: 3,
  },

  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },

  menuItem: {
    paddingVertical: 14,
  },

  menuText: {
    color: '#eee',
    fontSize: 15,
  },

  divider: {
    height: 1,
    backgroundColor: '#aaa',
    opacity: 0.4,
    marginVertical: 20,
  },
});