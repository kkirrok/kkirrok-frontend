import KkBackground from "@/components/KkBackground";
import KkLogoHeader from "@/components/KkLogoHeader";
import BellIcon from "@/assets/icons/bell.svg"; 
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type NutrientBarProps = {
  label: string;
  value: number;
};

function NutrientBar({ label, value }: NutrientBarProps) {
  return (
    <View style={styles.nutrientRow}>
      <Text style={styles.nutrientLabel}>{label}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${value}%` }]} />
      </View>
      <Text style={styles.nutrientValue}>20/60g</Text>
    </View>
  );
}

export default function Home() {
  return (
    <KkBackground>
      <ScrollView>
        <KkLogoHeader />
        <View style={styles.container}>
          {/* 프로필 카드 */}
          <Card style={{ borderWidth: 0.5, borderColor: "#FF8868", }}>
            <Text style={styles.title}>디저트 집착 유형</Text>
            <Text style={styles.nickname}>뀨뀨뀨님</Text>
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={styles.character}
            />
            <Text style={styles.level}>LV4</Text>
            <Text style={styles.exp}>EXP 120/1500</Text>
          </Card>

          {/* 기록 안내 */}
          <Card style={{ alignItems: "center", marginTop: 16, borderWidth: 0.5, borderColor: "#FF8868", }}>
            <Text style={styles.notice}>끼록할 시간이에요!</Text>
            <Text style={styles.subNotice}>현재 먹고 있는 메뉴는?</Text>
          </Card>

          {/* 영양 성분 */}
          <Text style={styles.sectionTitle}>오늘의 영양성분</Text>
          <Card>
            <NutrientBar label="단백질" value={70} />
            <NutrientBar label="탄수화물" value={50} />
            <NutrientBar label="당" value={60} />
            <NutrientBar label="지방" value={50} />
            <NutrientBar label="나트륨" value={60} />
          </Card>

          {/* 피드백 */}
          <Text style={styles.sectionTitle}>오늘의 피드백</Text>
          <Text style={styles.subTitle}>152kcal에 딱 맞는 운동</Text>

          <View style={styles.row}>
            <Card>
              <Text style={styles.cardTitle}>자전거</Text>
              <Text style={styles.cardDesc}>1시간 타면 200kcal가 소모되어요!</Text>
              <View style={styles.tagRow}>
                <Text style={styles.tag}>유산소</Text>
                <BellIcon width={40} height={40} />
              </View>
            </Card>
            <Card>
              <Text style={styles.cardTitle}>자전거</Text>
              <Text style={styles.cardDesc}>1시간 타면 200kcal가 소모되어요!</Text>
              <View style={styles.tagRow}>
                <Text style={styles.tag}>유산소</Text>
                <BellIcon width={40} height={40} />
              </View>
            </Card>
          </View>

          <Text style={styles.subTitle}>남은 1848kcal는 이렇게 채워봐요!</Text>
          <View style={styles.row}>
            <Card>
              <Text style={styles.cardTitle}>샐러드</Text>
              <Text style={styles.cardDesc}>
                302kcal로 00을 채우기 효과적이에요.
              </Text>
            </Card>
            <Card>
              <Text style={styles.cardTitle}>치즈</Text>
              <Text style={styles.cardDesc}>
                302kcal로 00을 채우기 효과적이에요.
              </Text>
            </Card>
          </View>

          {/* 이전 기록 */}
          <View style={styles.row}>
            <Card>
              <Text style={styles.cardTitle}>이전 요일들 기록 기반 피드백</Text>
              <Text style={styles.cardDesc}>
                나트륨을 많이 먹으셨네요 줄이세요
              </Text>
            </Card>
            <BellIcon width={24} height={24} />
          </View>
        </View>
      </ScrollView>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "semibold",
    textAlign: "center",
    color: "#FDFCFC",
  },
  nickname: {
    fontSize: 18,
    fontWeight: "semibold",
    textAlign: "center",
    marginBottom: 8,
    color: "#FDFCFC",
  },
  character: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  level: {
    textAlign: "center",
    color: "white",
    marginTop: 8,
  },
  exp: {
    textAlign: "center",
    color: "gray",
  },
  notice: {
    fontSize: 18,
    color: "#FDFCFC",
    fontWeight: "semibold",
  },
  subNotice: {
    fontSize: 14,
    color: "#E7E2DF",
  },
  sectionTitle: {
    fontWeight: "semibold",
    fontSize: 20,
    color: "#FDFCFC",
    marginTop: 16,
  },
  subTitle: {
    fontWeight: "semibold",
    fontSize: 18,
    color: "#E7E2DF",
  },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  nutrientLabel: {
    width: "20%",
    fontSize: 16,
    fontWeight: "semibold",
    color: "#E7E2DF",
  },
  barBg: {
    flex: 1,
    height: 20,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  barFill: {
    width: "20%",
    height: 20,
    backgroundColor: "#FF8868",
    borderRadius: 8,
  },
  nutrientValue: {
    color: "#E7E2DF",
    fontSize: 14,
    fontWeight: "semibold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  tagRow: {
     flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "flex-end",
  },
  tag: {
    borderRadius: 16, 
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#372E2A",
    color: "#E7E2DF",
  },
  cardTitle: {
    color: "#E7E2DF",
    fontSize: 16,
    fontWeight: "semibold",
  },
  cardDesc: {
    color: "#E7E2DF",
    fontSize: 12,
  },
});
