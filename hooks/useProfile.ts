import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/utils/api/profileApi";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await getProfile();
    },
  });
}
