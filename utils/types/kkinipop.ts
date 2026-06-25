export type Group = {
  group_id: number;
  name: string;
  invite_code: string;
  member_count: number;
  cur_exp: number;
  max_exp: number;
  level: number;
  is_leader: boolean;
};

export type GroupMember = {
  member_id: number;
  nickname: string;
  profile_image: string | null;
  is_me: boolean;
  leader: boolean;
};
