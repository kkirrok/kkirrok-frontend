import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height: screenHeight } = Dimensions.get("window");

export default function KkinipopCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [autoSave, setAutoSave] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [isTaking, setIsTaking] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <KkBackground>
        <KkHeader title="끼니팝" />
        <View style={styles.permissionWrap}>
          <Text style={styles.permissionText}>카메라 권한이 필요합니다.</Text>
          <KkButton title="권한 허용" onPress={requestPermission} />
        </View>
      </KkBackground>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady || isTaking) return;
    try {
      setIsTaking(true);
      const photo = await cameraRef.current.takePictureAsync({
        skipProcessing: true,
        quality: 0.5,
        exif: false,
        base64: false,
      });
      if (!photo?.uri) return;
      setCapturedUri(photo.uri);
    } catch (e) {
      console.error("촬영 실패:", e);
    } finally {
      setIsTaking(false);
    }
  };

  if (capturedUri) {
    const camTop = (screenHeight - width) / 2;
    const btnTop = camTop + width + 24;
    return (
      <KkBackground>
        <View style={styles.headerAbsolute}>
          <KkHeader
            title="끼니팝"
            onBackPress={() => {
              setCapturedUri(null);
              setCameraReady(false);
            }}
          />
        </View>
        <Image
          source={{ uri: capturedUri }}
          style={[styles.previewImage, { top: camTop, width, height: width }]}
          contentFit="cover"
        />
        <View style={[styles.previewBtnWrap, { top: btnTop }]}>
          <KkButton
            title="끼록하기"
            onPress={() => {
              // TODO: API
              router.back();
            }}
          />
        </View>
      </KkBackground>
    );
  }

  const camTop = (screenHeight - width) / 2;
  const CHIP_H = 40;
  const chipTop = camTop - 24 - CHIP_H;
  const shutterTop = camTop + width + 24;

  return (
    <View style={styles.container}>
      <View style={styles.headerAbsolute}>
        <KkHeader title="끼니팝" />
      </View>

      <TouchableOpacity
        style={[styles.chip, { top: chipTop }]}
        onPress={() => setAutoSave((v) => !v)}
        activeOpacity={0.8}
      >
        {autoSave ? (
          <Ionicons
            name="checkmark-circle-outline"
            size={24}
            color={Colors.gray[200]}
          />
        ) : (
          <View style={styles.emptyCircle} />
        )}
        <Text style={styles.chipText}>나의 끼록 자동 저장 3/3</Text>
      </TouchableOpacity>

      <View
        style={[styles.cameraWrapper, { top: camTop, width, height: width }]}
      >
        <CameraView
          style={{ flex: 1 }}
          ref={cameraRef}
          onCameraReady={() => setCameraReady(true)}
          onMountError={(error) => console.error("카메라 마운트 에러:", error)}
        />
      </View>

      <View style={[styles.shutterWrap, { top: shutterTop }]}>
        <TouchableOpacity
          style={styles.shutterOuter}
          onPress={takePicture}
          disabled={!cameraReady || isTaking}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[1000],
  },
  permissionWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  permissionText: {
    color: Colors.gray[100],
    fontFamily: "Pretendard-SemiBold",
    fontSize: 16,
  },
  chip: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.gray[900],
    borderRadius: 16,
    zIndex: 5,
  },
  emptyCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.gray[100],
  },
  chipText: {
    color: Colors.gray[200],
    ...Typography.body.l,
  },
  headerAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  cameraWrapper: {
    position: "absolute",
    overflow: "hidden",
  },
  shutterWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.main[500],
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.gray[100],
  },
  previewImage: {
    position: "absolute",
    borderRadius: 20,
  },
  previewBtnWrap: {
    position: "absolute",
    left: 16,
    right: 16,
  },
});
