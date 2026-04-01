import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Login from '../(auth)/Login';
import Signup from '../(auth)/Signup';

export default function HomeScreen() {
  return (
    <View>
     <Signup />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1614"
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  }
});
