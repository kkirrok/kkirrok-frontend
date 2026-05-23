import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import KkButton from '@/components/KkButton';
import { Dimensions } from 'react-native';
import { setMealPhoto } from '@/utils/mealPhotoStore';
import KkHeader from '@/components/KkHeader';

const { height } = Dimensions.get('window');

const CAMERA_TOP = height * 0.2 + 24;
const CAMERA_HEIGHT = height * 0.45;
const GAP = 24;

export default function CameraScreen() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [mode, setMode] = useState<'food' | 'nutrition'>('food');

  const [foodPhoto, setFoodPhoto] = useState(null);
  const [nutrition, setNutrition] = useState(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>카메라 권한 필요</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>허용</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    if (!photo) return;

    if (source === 'meal') {
      setMealPhoto(photo.uri);
      router.back();
    } else {
      router.push({
        pathname: '/camera/Preview',
        params: { uri: photo.uri },
      });
    }
  };

  return (
    <View style={styles.container}>
      <KkHeader title="끼록하기" />

      <View style={styles.topContainer}>
        <View style={styles.row}>
          <KkButton
            title="음식촬영"
            size="tag"
            selected={mode === 'food'}
            onPress={() => setMode('food')}
          />
          <KkButton
            title="영양성분"
            size="tag"
            selected={mode === 'nutrition'}
            onPress={() => setMode('nutrition')}
          />
        </View>
      </View>

      <View style={styles.cameraWrapper}>
        <CameraView style={{ flex: 1 }} ref={cameraRef} />
      </View>

      <View style={styles.bottomContainer}>
      <View style={styles.outerButton}>
          <TouchableOpacity
            onPress={takePicture}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'white',
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1614',
  },

  topContainer: {
    position: 'absolute',
    top: CAMERA_TOP - GAP - 40,
    width: '100%',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  cameraWrapper: {
    position: 'absolute',
    top: CAMERA_TOP,
    width: '100%',
    height: CAMERA_HEIGHT,
    overflow: 'hidden',
  },

  bottomContainer: {
    position: 'absolute',
    top: CAMERA_TOP + CAMERA_HEIGHT + GAP,
    width: '100%',
    alignItems: 'center',
  },

  outerButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FF8868',
    alignItems: 'center',
    justifyContent: 'center',
  },

  innerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});