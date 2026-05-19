import KkBackground from '@/components/KkBackground'
import KkHeader from '@/components/KkHeader'
import React from 'react'
import ProfileForm from '@/components/KkProfileForm';

export default function ProfileSetting() {
  return (
    <KkBackground>
      <KkHeader title="프로필 설정" />
      <ProfileForm mode="create" />
    </KkBackground>
  );
}