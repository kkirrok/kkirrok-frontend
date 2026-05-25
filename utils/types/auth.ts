export type SetProfileParams = {
  name: string;
  birth: string;
  phone: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  purpose: string;
  habits: string[];
};

export type AuthResponse = {
  code: string;
  status: number;
  message: string;
  data: {
    access_token: string;
    nickname: string;
    role: string;
    onboarding_completed: boolean;
  };
};
