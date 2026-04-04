import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import KkBackground from '@/components/KkBackground'
import KkButton from '@/components/KkButton'
import KkHeader from '@/components/KkHeader'
import KkTextBox from '@/components/KkTextBox'
import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileIcon from '@/assets/icons/profile.svg';
import PhotoIcon from '@/assets/icons/photo.svg';

const habits = [
    '야식 잦음',
    '폭식',
    '불규칙 식사',
    '탄수화물 위주',
    '단 음식 선호',
    '음주 잦음',
    '배달 자주',
    '채소 부족',
    '단백질 부족',
    '간식 많음',
  ];

export default function ProfileSetting() {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'female' | 'male' | null>(null);
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain' | 'habit' | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const toggleHabit = (habit: string) => {
    setSelectedHabits(prev =>
      prev.includes(habit)
        ? prev.filter(h => h !== habit)
        : [...prev, habit]
    );
  };

  return (
    <KkBackground>
      <KkHeader title="프로필 설정" variant="back" />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View style={styles.content}>
          <View style={styles.wrapper}>
            <ProfileIcon width={100} height={100} />

            <TouchableOpacity style={styles.camera} onPress={() => console.log('이미지 변경')}>
              <PhotoIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
          <KkTextBox
            label="닉네임*"
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해 주세요."
          />
          <View>
            <View style={styles.container}>
              <Text style={styles.title}>성별*</Text>
              <View style={styles.section}>
                <KkButton
                  title="여성"
                  size="tag"
                  selected={gender === 'female'}
                  onPress={() => setGender('female')}
                />
                <KkButton
                  title="남성"
                  size="tag"
                  selected={gender === 'male'}
                  onPress={() => setGender('male')}
                />
              </View>
            </View>
            <View style={styles.container}>
              <Text style={styles.title}>목표*</Text>
              <View style={styles.section}>
                <KkButton
                  title="감량"
                  size="tag"
                  selected={goal === 'lose'}
                  onPress={() => setGoal('lose')}
                />
                <KkButton
                  title="유지"
                  size="tag"
                  selected={goal === 'maintain'}
                  onPress={() => setGoal('maintain')}
                />
                <KkButton
                  title="증량"
                  size="tag"
                  selected={goal === 'gain'}
                  onPress={() => setGoal('gain')}
                />
                <KkButton
                  title="습관"
                  size="tag"
                  selected={goal === 'habit'}
                  onPress={() => setGoal('habit')}
                />
              </View>
            </View>

            <View>
              <Text style={styles.title}>식습관 유형</Text>
              <View style={styles.section}>
                {habits.map(habit => (
                  <KkButton
                    key={habit}
                    title={habit}
                    size="tag"
                    selected={selectedHabits.includes(habit)}
                    onPress={() => toggleHabit(habit)}
                    showIcon
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={{ marginTop: "auto", marginBottom: 12 }}>
            <KkButton
              title="다음"
              disabled={!nickname || !gender || !goal || selectedHabits.length === 0}
              onPress={() => { }}
            />
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
    marginBottom: 24,
  },
  section: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,   
    rowGap: 16,
  },
  wrapper: {
  width: 100,
  height: 100,
  justifyContent: 'center',
  alignItems: 'center',
},
camera: {
  position: 'absolute',
  right: 0,
  bottom: 0,
  backgroundColor: '#000',
  borderRadius: 999,
  padding: 6,
}
})