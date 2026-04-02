import { StyleSheet } from 'react-native';
import KkBackground from '@/components/KkBackground'
import KkButton from '@/components/KkButton'
import KkHeader from '@/components/KkHeader'
import KkTextBox from '@/components/KkTextBox'
import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileSetting() {
  const [gender, setGender] = useState<'female' | 'male' | null>(null);

  return (
    <KkBackground>
      <KkHeader title="프로필 설정" variant="back" />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View style={styles.content}>
          <KkTextBox
            label="닉네임*"
            value=""
            onChangeText={() => { }}
            placeholder="닉네임을 입력해 주세요."
          />
          <View>
            <Text style={styles.title}>성별*</Text>
            <View style={styles.container}>
              <KkButton
                title="여성"
                size="tag"
                selected={gender === 'female'}
                onPress={() => setGender('female')}
                showIcon
              />
              <KkButton
                title="남성"
                size="tag"
                selected={gender === 'male'}
                onPress={() => setGender('male')}
                showIcon
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 24,
  },
  title: {
    color: '#FDFCFC',
    fontSize: 18,
    fontWeight: '600',
    paddingBottom: 8,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  }
})