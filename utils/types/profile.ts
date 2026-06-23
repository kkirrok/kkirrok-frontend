export interface ProfileOption {
  value: string;
  label: string;
  is_selected: boolean;
}

export interface UserProfile {
  nickname: string;
  gender: string;
  profile_image: string;
  purposes: ProfileOption[];
  habits: ProfileOption[];
}