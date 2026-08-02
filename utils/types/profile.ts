export interface ProfileOption {
  value: string;
  label: string;
  is_selected: boolean;
}

export interface UserProfile {
  nickname: string;
  gender: string;
  profile_image: string;
  name: string;
  birth: string;
  phone: string;
  meal_style: string;
  meal_style_label: string;
  recommended_kcal: number;
  purposes: ProfileOption[];
  habits: ProfileOption[];
}
