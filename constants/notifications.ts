export type NotificationItem = {
  id: string;
  label: string;
};

export const NOTIFICATION_ITEMS: NotificationItem[] = [
  { id: "kkirok", label: "끼록 알림" },
  { id: "kkinipop", label: "끼니팝 알림" },
  { id: "group", label: "그룹 알림" },
  { id: "groupReaction", label: "그룹 끼록 반응 알림" },
];
