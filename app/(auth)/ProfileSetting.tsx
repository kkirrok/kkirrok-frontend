import KkBackground from '@/components/KkBackground'
import KkHeader from '@/components/KkHeader'
import KkModal from '@/components/KkModal';
import ProfileForm from '@/components/KkProfileForm';
import { tokenStore } from '@/utils/store/tokenStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function ProfileSetting() {
  const router = useRouter();
  const { name, birthdate, phone } = useLocalSearchParams<{
    name: string;
    birthdate: string;
    phone: string;
  }>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    tokenStore.get()
      .then((token) => {
        if (!token) router.replace("/(auth)/Login");
      })
      .catch(() => router.replace("/(auth)/Login"));
  }, [router]);

  return (
    <KkBackground>
      <KkHeader title="프로필 설정" onBackPress={() => setModalVisible(true)} />
      <ProfileForm mode="create" name={name} birthdate={birthdate} phone={phone} />

      <KkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={"아직 가입이 완료되지 않았어요.\n지금 나가면 작성된 정보가 사라져요."}
        cancelText="홈으로 이동"
        onCancelPress={() => router.replace("/(auth)/Login")}
        buttonText="계속 작성하기"
        onButtonPress={() => setModalVisible(false)}
      />
    </KkBackground>
  );
}
