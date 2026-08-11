import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import { scanMeal } from "@/utils/api/mealApi";
import { setScanResult } from "@/utils/store/mealPhotoStore";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";

export default function Loading() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [failed, setFailed] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scanningRef = useRef(false);

  const startScan = (imageUri: string) => {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScanning(true);
    setFailed(false);
    scanMeal(imageUri, "CAMERA")
      .then((result) => {
        setScanResult(result);
        router.dismissAll();
        router.back();
      })
      .catch(() => {
        setFailed(true);
      })
      .finally(() => {
        scanningRef.current = false;
        setScanning(false);
      });
  };

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
    ).start();

    if (uri) startScan(uri);
  }, [uri]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <KkBackground>
      <KkHeader title="끼록하기" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animated.View
          style={{
            width: 180,
            height: 180,
            borderRadius: 100,
            borderWidth: 20,
            borderColor: "#F6623B",
            borderTopColor: "#FFCDC0",
            transform: [{ rotate }],
          }}
        />

        <Text
          style={{
            marginTop: 32,
            fontSize: 24,
            color: "white",
            fontWeight: "600",
          }}
        >
          {failed ? "분석에 실패했어요." : "끼록 분석 중입니다"}
        </Text>

        <View
          style={{
            marginTop: 160,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <KkButton
            title="다시하기"
            size="small"
            disabled={scanning}
            onPress={() => {
              if (uri) startScan(uri);
              else router.back();
            }}
          />
        </View>
      </View>
    </KkBackground>
  );
}
