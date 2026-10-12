export type NotificationAgreeType =
  | "KKIROK"
  | "GROUP_JOIN_AND_QUIT"
  | "KKINIPOP"
  | "REACTION";

export type NotificationAgree = {
  type: NotificationAgreeType;
  is_agree: boolean;
};

export type NotificationSettings = {
  is_all: boolean;
  agrees: NotificationAgree[];
};

// Swagger NotificationType enum 기준 (서버에 새 타입이 추가돼도 깨지지 않도록 string 허용)
export type NotificationType =
  | "MEAL_REMINDER_OVERDUE"
  | "MEAL_REMINDER_NO_TODAY"
  | "GROUP_JOIN"
  | "MISSION_START"
  | "KKINIPOP_REACTION"
  | (string & {});

export type NotificationData = Record<string, string>;

export type NotificationItem = {
  notification_id: number;
  type: NotificationType;
  title: string;
  body: string;
  data: NotificationData | null;
  sent_at: string | null;
  is_read: boolean;
  image: string | null;
};

export type PageInfo = {
  page: number;
  size: number;
  total_elements: number;
  total_pages: number;
  has_next: boolean;
};

export type NotificationListData = {
  notifications: NotificationItem[];
  page_info: PageInfo;
};
