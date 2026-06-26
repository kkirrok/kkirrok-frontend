export type Reaction = { emoji: string; count: number; users?: string[] };
export type MealRecord = {
  id: string;
  name: string;
  time: string;
  image: string | null;
  isOwn: boolean;
  reactions: Reaction[];
  missionId?: number | null;
};

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

export type PostReaction = {
  emoji_code: string;
  label: string;
  count: number;
  emoji_type: string;
  reacted: boolean;
};

export type Post = {
  post_id: number;
  member_id: number;
  nickname: string;
  profile_image: string | null;
  image: string | null;
  mission_id: number | null;
  created_at: string | null;
  reactions: PostReaction[];
};

export type PostDay = {
  date: string;
  label: string;
  day_of_week: number;
  posts: Post[];
};

export type MyKkirokStatus = {
  remaining_count: number;
  max_count: number;
};

export type MissionSuccessMember = {
  member_id: number;
  name: string;
  profile_image: string | null;
};

export type Mission = {
  mission_id: number;
  title: string;
  is_real_time: boolean;
  is_end: boolean;
  start_at: string | null;
  end_at: string | null;
  success_member_count: number;
  success_members: MissionSuccessMember[];
};
