import KkBackground from "@/components/KkBackground";
import { Image, View } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import KkButton from "@/components/KkButton";

export default function Preview() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  return (
    <KkBackground>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 }}>
        <Image
          source={{ uri }}
          style={{
            width: '100%',
            aspectRatio: 1,
            borderRadius: 20,
          }}
        />

        <KkButton
          title="끼록하기"
          style={{ marginTop: 24 }}
          onPress={() => console.log('사진 확인')}
        />
      </View>
    </KkBackground>
  );
};