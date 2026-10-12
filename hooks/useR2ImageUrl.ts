import { getDownloadUrl } from "@/utils/api/r2Api";
import { useQuery } from "@tanstack/react-query";

// R2 객체 key를 다운로드 URL로 변환 (presigned URL 유효기간 5분보다 짧게 캐시)
export const useR2ImageUrl = (key?: string | null) => {
  return useQuery({
    queryKey: ["r2-image", key],
    queryFn: () => getDownloadUrl(key!),
    enabled: !!key,
    staleTime: 4 * 60 * 1000,
  });
};
