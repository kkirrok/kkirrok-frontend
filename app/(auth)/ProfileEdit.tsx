import KkBackground from '@/components/KkBackground';
import KkHeader from '@/components/KkHeader';
import ProfileForm from '@/components/KkProfileForm';

export default function ProfileEdit() {
  return (
    <KkBackground>
      <KkHeader title="프로필 변경" />
      <ProfileForm mode="edit" />
    </KkBackground>
  );
}