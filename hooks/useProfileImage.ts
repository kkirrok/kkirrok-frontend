import { useQuery } from "@tanstack/react-query";
import { getDownloadUrl } from "@/utils/api/r2Api";

export const useProfileImage = (key?: string) => {
  return useQuery({
    queryKey: ["profile-image", key],
    queryFn: () => getDownloadUrl(key!),
    enabled: !!key,
  });
};