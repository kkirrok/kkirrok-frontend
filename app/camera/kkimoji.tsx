import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import KkBackground from '@/components/KkBackground';
import KkButton from '@/components/KkButton';
import KkHeader from '@/components/KkHeader';
import { Colors } from '@/constants/colors';

const { width, height: screenHeight } = Dimensions.get('window');

export default function KkimojiCamera() {
  const { uri: paramUri } = useLocalSearchParams<{ uri?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(paramUri ?? null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isTaking, setIsTaking] = useState(false);

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
      console.error('촬영 실패:', e);
    } finally {
      setIsTaking(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted && !capturedUri) {
    return (
      <KkBackground>
        <KkHeader title="끼모지 만들기" />
        <View style={styles.permissionWrap}>
          <Text style={styles.permissionText}>카메라 권한이 필요합니다.</Text>
          <KkButton title="권한 허용" onPress={requestPermission} />
        </View>
      </KkBackground>
    );
  }

  if (capturedUri) {
    return (
      <KkBackground>
        <View style={styles.headerAbsolute}>
          <KkHeader title="끼모지 만들기" onBackPress={() => router.back()} />
        </View>
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: capturedUri }}
            style={styles.previewImage}
            contentFit="cover"
          />
          <View style={styles.previewButtons}>
            <KkButton
              title="다시하기"
              style={styles.previewBtnGray}
              onPress={() => setCapturedUri(null)}
            />
            <KkButton
              title="업로드 하기"
              style={styles.previewBtn}
              disabled
              onPress={() => {
                // TODO: API - upload kkimoji
              }}
            />
          </View>
        </View>
      </KkBackground>
    );
  }

  const camTop = (screenHeight - width) / 2;
  const shutterTop = camTop + width + 32;

  return (
    <View style={styles.container}>
      <View style={styles.headerAbsolute}>
        <KkHeader title="끼모지 만들기" />
      </View>
      <View style={[styles.cameraWrapper, { top: camTop, width, height: width }]}>
        <CameraView
          style={{ flex: 1 }}
          ref={cameraRef}
          facing="front"
          onCameraReady={() => setCameraReady(true)}
          onMountError={(error) => console.error('카메라 마운트 에러:', error)}
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  permissionText: {
    color: Colors.gray[100],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
  },
  headerAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  cameraWrapper: {
    position: 'absolute',
    overflow: 'hidden',
  },
  shutterWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.main[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.gray[100],
  },
  previewContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    gap: 24,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
  },
  previewButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  previewBtn: {
    flex: 1,
  },
  previewBtnGray: {
    flex: 1,
    backgroundColor: Colors.gray[700],
  },
});
