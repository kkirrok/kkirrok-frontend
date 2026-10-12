import { getDownloadUrl } from "@/utils/api/r2Api";
import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";

// R2 다운로드 URL은 presigned인 경우 5분 뒤 만료되므로, 만료 전에 새로 받도록 4분만 캐시
// (서버가 만료 없는 CDN URL을 준다면 이 값만 늘리면 됨)
const R2_URL_CACHE_TIME = 4 * 60 * 1000;

// 같은 key는 화면이 달라도 캐시를 공유. 컴포넌트 밖(목록 로드 함수 등)에서는
// queryClient.fetchQuery(r2ImageQueryOptions(key))로 같은 캐시를 사용
export const r2ImageQueryOptions = (key: string) =>
  queryOptions({
    queryKey: ["r2-image", key],
    queryFn: () => getDownloadUrl(key),
    staleTime: R2_URL_CACHE_TIME,
    // 만료됐을 수 있는 URL이 캐시에 남아 재사용되지 않도록 보관 시간도 맞춤
    gcTime: R2_URL_CACHE_TIME,
    retry: 1,
  });

// R2 객체 key 하나를 다운로드 URL로 변환
export const useR2ImageUrl = (key?: string | null) => {
  return useQuery({
    ...r2ImageQueryOptions(key ?? ""),
    enabled: !!key,
  });
};

// 여러 key를 한 번에 변환해 { key: url } 형태로 반환 (실패하거나 로딩 중인 key는 빠짐)
export const useR2ImageUrls = (
  keys: (string | null | undefined)[],
): Record<string, string> => {
  const uniqueKeys = [...new Set(keys.filter((k): k is string => !!k))];
  return useQueries({
    queries: uniqueKeys.map(r2ImageQueryOptions),
    combine: (results) => {
      const urls: Record<string, string> = {};
      results.forEach((result, i) => {
        if (result.data) urls[uniqueKeys[i]] = result.data;
      });
      return urls;
    },
  });
};
