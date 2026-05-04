import { MealRecord } from "./types";

export const MOCK_RECORDS: MealRecord[] = [
  {
    id: "1",
    name: "이름",
    time: "22:51",
    image: null,
    isOwn: true,
    reactions: [
      { emoji: "🔥", count: 2 },
      { emoji: "🐷", count: 2 },
    ],
  },
  {
    id: "2",
    name: "이름",
    time: "22:51",
    image: null,
    isOwn: false,
    reactions: [
      { emoji: "🔥", count: 2 },
      { emoji: "🐷", count: 2 },
    ],
  },
  {
    id: "3",
    name: "이름",
    time: "22:51",
    image: null,
    isOwn: false,
    reactions: [
      { emoji: "🔥", count: 2 },
      { emoji: "🐷", count: 2 },
    ],
  },
  {
    id: "4",
    name: "이름",
    time: "22:51",
    image: null,
    isOwn: false,
    reactions: [{ emoji: "🔥", count: 3 }],
  },
];
