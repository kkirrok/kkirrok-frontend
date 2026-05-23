import { View, Text, Animated, Easing } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import KkBackground from '@/components/KkBackground';
import KkButton from '@/components/KkButton';
import KkHeader from '@/components/KkHeader';

export default function Loading() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000, 
        easing: Easing.bezier(0.4, 0.0, 0.2, 1), 
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <KkBackground>
      <KkHeader title="끼록하기" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View
          style={{
            width: 180,
            height: 180,
            borderRadius: 100,
            borderWidth: 20,
            borderColor: '#F6623B',
            borderTopColor: '#FFCDC0',
            transform: [{ rotate }],
          }}
        />

        <Text style={{ marginTop: 32, fontSize: 24, color: 'white', fontWeight: "600" }}>
          끼록 분석 중입니다
        </Text>

        <View style={{ marginTop: 160, justifyContent: 'center', alignItems: 'center' }}>
          <KkButton
            title="다시하기"
            size="small"
            onPress={() => console.log('다시')}
          />
        </View>
      </View>
    </KkBackground>
  );
};