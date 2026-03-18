import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from "react-native";
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerShown: false,
        tabBarStyle: { height: 66 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/icon.png")}
              style={{ width: 30, height: 24 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
