export type Reaction = { emoji: string; count: number; users?: string[] };
export type MealRecord = {
  id: string;
  name: string;
  time: string;
  image: string | null;
  isOwn: boolean;
  reactions: Reaction[];
};
