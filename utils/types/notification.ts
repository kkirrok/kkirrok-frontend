export type NotificationType =
  | "RECORD"
  | "KKINIPOP"
  | "KKINIPOP_REACTION"
  | "GROUP_JOIN"
  | "GROUP_REACT"
  | "GROUP_CHAT"
  | "MISSION_START"
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
