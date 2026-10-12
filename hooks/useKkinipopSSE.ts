import { tokenStore } from "@/utils/store/tokenStore";
import { GroupEmoji, Mission, PostDay, PostReaction, SystemEmoji } from "@/utils/types/kkinipop";
import EventSource, { CustomEvent } from "react-native-sse";
import { Alert } from "react-native";
import { MutableRefObject, useEffect } from "react";

type SSEEventMap =
  | "connected"
  | "ping"
  | "reaction-updated"
  | "mission-started"
  | "member-joined"
  | "member-left";

type Options = {
  selectedGroupIdRef: MutableRefObject<number | null>;
  setPostDays: React.Dispatch<React.SetStateAction<PostDay[]>>;
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  onMemberChange: () => void;
  systemEmojisRef: MutableRefObject<SystemEmoji[]>;
  customEmojisRef: MutableRefObject<(GroupEmoji & { imageUrl: string | null })[]>;
};

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export function useKkinipopSSE({
  selectedGroupIdRef,
  setPostDays,
  setMissions,
  onMemberChange,
  systemEmojisRef,
  customEmojisRef,
}: Options) {
  useEffect(() => {
    let es: EventSource<SSEEventMap> | null = null;
    let closed = false;

    async function connect() {
      if (closed) return;
      const token = await tokenStore.get();
      if (!token || closed) return;

      es = new EventSource<SSEEventMap>(`${BASE_URL}/v1/sse/subscribe`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      es.addEventListener("error", async () => {
        if (closed) return;
        es?.close();
        es = null;
        await new Promise<void>((resolve) => setTimeout(resolve, 3000));
        connect();
      });

      es.addEventListener("reaction-updated", (event: CustomEvent<"reaction-updated">) => {
        try {
          const data: {
            groupId: number;
            postId: number;
            emojiCode: string;
            count: number;
            reacted: boolean;
          } = JSON.parse(event.data!);

          if (data.groupId !== selectedGroupIdRef.current) return;

          setPostDays((prev) =>
            prev.map((day) => ({
              ...day,
              posts: day.posts.map((post) => {
                if (post.post_id !== data.postId) return post;

                if (data.count === 0) {
                  return {
                    ...post,
                    reactions: post.reactions.filter(
                      (r) => r.emoji_code !== data.emojiCode,
                    ),
                  };
                }

                const existing = post.reactions.find(
                  (r) => r.emoji_code === data.emojiCode,
                );
                if (existing) {
                  return {
                    ...post,
                    reactions: post.reactions.map((r) =>
                      r.emoji_code === data.emojiCode
                        ? { ...r, count: data.count, reacted: data.reacted }
                        : r,
                    ),
                  };
                }

                const sysEmoji = systemEmojisRef.current.find(
                  (e) => e.emoji_code === data.emojiCode,
                );
                const customEmoji = customEmojisRef.current.find(
                  (e) => e.emoji_code === data.emojiCode,
                );
                const newReaction: PostReaction = {
                  emoji_code: data.emojiCode,
                  label: sysEmoji?.label ?? customEmoji?.label ?? data.emojiCode,
                  count: data.count,
                  emoji_type: sysEmoji ? "SYSTEM_EMOJI" : "CUSTOM_EMOJI",
                  reacted: data.reacted,
                };
                return { ...post, reactions: [...post.reactions, newReaction] };
              }),
            })),
          );
        } catch {}
      });

      es.addEventListener("mission-started", (event: CustomEvent<"mission-started">) => {
        try {
          const data: {
            groupId: number;
            mission: {
              missionId: number;
              title: string;
              isRealTime: boolean;
              isEnd: boolean;
              startAt: string | null;
              endAt: string | null;
              successMemberCount: number;
              successMembers: unknown[];
            };
          } = JSON.parse(event.data!);

          if (data.groupId !== selectedGroupIdRef.current) return;

          const m = data.mission;
          const newMission: Mission = {
            mission_id: m.missionId,
            title: m.title,
            is_real_time: m.isRealTime,
            is_end: m.isEnd,
            start_at: m.startAt,
            end_at: m.endAt,
            success_member_count: m.successMemberCount ?? 0,
            success_members: [],
          };

          setMissions((prev) => {
            if (prev.some((ex) => ex.mission_id === newMission.mission_id)) return prev;
            return [...prev, newMission];
          });

          Alert.alert("미션 시작!", `"${m.title}" 미션이 시작되었습니다.`);
        } catch {}
      });

      es.addEventListener("member-joined", (event: CustomEvent<"member-joined">) => {
        try {
          const data: { groupId: number } = JSON.parse(event.data!);
          if (data.groupId !== selectedGroupIdRef.current) return;
          onMemberChange();
        } catch {}
      });

      es.addEventListener("member-left", (event: CustomEvent<"member-left">) => {
        try {
          const data: { groupId: number } = JSON.parse(event.data!);
          if (data.groupId !== selectedGroupIdRef.current) return;
          onMemberChange();
        } catch {}
      });
    }

    connect();

    return () => {
      closed = true;
      es?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
