import { Tabs, router } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeIcon from "../../assets/icons/homeIcon.svg";
import KkinipopIcon from "../../assets/icons/kkinipopIcon.svg";
import MypageIcon from "../../assets/icons/mypageIcon.svg";
import PlusIcon from "../../assets/icons/plus2.svg";
import ReportIcon from "../../assets/icons/reportIcon.svg";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 60 + insets.bottom : 70;
  const activeColor = "#FDFCFC";
  const inactiveColor = "#BAADA6";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: "#372E2A",
          height: TAB_BAR_HEIGHT + 20,
          position: "absolute",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          height: 60,
          marginTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: "Pretendard-Regular",
          fontSize: 12,
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <HomeIcon width={24} height={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "리포트",
          tabBarIcon: ({ color }) => (
            <ReportIcon width={24} height={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="plus"
        options={{
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <TouchableOpacity
              style={styles.fabContainer}
              onPress={() => router.push("/camera")}
              activeOpacity={0.8}
            >
              <View style={styles.fab}>
                <PlusIcon width={20} height={20} fill="#FFEFEB" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="kkinipop"
        options={{
          title: "끼니팝",
          tabBarIcon: ({ color }) => (
            <KkinipopIcon width={24} height={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: "마이페이지",
          tabBarIcon: ({ color }) => (
            <MypageIcon width={24} height={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F6623B",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#FF8868",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
