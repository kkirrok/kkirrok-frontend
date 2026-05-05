import { StyleSheet, TouchableOpacity } from 'react-native';
import KkButton from '@/components/KkButton'
import KkTextBox from '@/components/KkTextBox'
import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileIcon from '@/assets/icons/profile.svg';
import PhotoIcon from '@/assets/icons/photo.svg';
import KkModal from '@/components/KkModal';
import { useRouter } from 'expo-router';

type Mode = 'create' | 'edit';

interface ProfileFormProps {
  mode: Mode;
}

// API에서 받아오는 형태로 변경 필요
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
  '카페인 섭취 많음',
  '물 섭취 적음',
  '규칙적 식사',
];

export default function KkProfileForm({ mode }: ProfileFormProps) {
  const isEdit = mode === 'edit';
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'female' | 'male' | null>(null);
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain' | 'habit' | null>(null);
  const [age, setAge] = useState<string>('');
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const toggleHabit = (habit: string) => {
    setSelectedHabits(prev =>
      prev.includes(habit)
        ? prev.filter(h => h !== habit)
        : [...prev, habit]
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>프로필 사진</Text>
          <View style={styles.profileSection}>
            <View style={styles.wrapper}>
              <ProfileIcon width={112} height={112} />

              <TouchableOpacity
                style={styles.camera}
                onPress={() => console.log('이미지 변경')}
              >
                <PhotoIcon width={32} height={32} />
              </TouchableOpacity>
            </View>
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

            {isEdit && (
              <View style={{ width: 80, marginBottom: 24 }}>
                <Text style={styles.title}>나이</Text>
                <View
                  style={[
                    styles.inputBox,
                    { borderColor: age ? '#F6623B' : '#A49289' }
                  ]}
                >
                  <Text style={styles.suffix}>만</Text>
                  <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#aaa"
                  />
                  <Text style={styles.suffix}>세</Text>
                </View>
              </View>
            )}
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
              <Text style={[styles.title, { marginBottom: 8 }]}>식습관 유형</Text>
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

          <View style={{ marginTop: 'auto', marginBottom: 12 }}>
            <KkButton
              title={isEdit ? '변경하기' : '다음'}
              disabled={!nickname || !gender || !goal || selectedHabits.length === 0}
              onPress={() => {
                if (isEdit) {
                  setModalVisible(true);
                } else {
                  // 회원가입 다음 단계
                }
              }}
            />
          </View>

          <KkModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            message="프로필이 변경되었습니다."
            buttonText="확인"
            onButtonPress={() => router.push('/(tabs)/mypage')}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
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
  profileSection: {
    alignItems: 'center',
    gap: 12,
  },
  wrapper: {
    width: 112,
    height: 112,
    alignSelf: 'center',
  },
  camera: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: 0,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 16,
    height: 48,
    backgroundColor: '#FDFCFC1A',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#F6623B',
    paddingHorizontal: 16,
  },
  input: {
    color: '#FDFCFC',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'right',
    paddingHorizontal: 8,
  },
  suffix: {
    color: '#FDFCFC',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
  },
});