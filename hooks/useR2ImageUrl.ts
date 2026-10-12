import { getDownloadUrl } from "@/utils/api/r2Api";
import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";

// presigned URL 유효기간 (Swagger R2 API 명시)
const R2_URL_VALID_TIME = 5 * 60 * 1000;
// 만료 전에 새 URL을 받도록 유효기간보다 짧게 캐시
// (서버가 만료 없는 CDN URL을 준다면 이 값만 늘리면 됨)
const R2_URL_CACHE_TIME = 4 * 60 * 1000;

// 같은 key는 화면이 달라도 캐시를 공유
const r2ImageQueryOptions = (key: string) =>
  queryOptions({
    queryKey: ["r2-image", key],
    queryFn: () => getDownloadUrl(key),
    staleTime: R2_URL_CACHE_TIME,
    gcTime: R2_URL_CACHE_TIME,
    retry: 1,
  });

type R2UrlResult = {
  data: string | undefined;
  dataUpdatedAt: number;
  isFetching: boolean;
};

// 캐시된 URL이 만료됐을 수 있고 새 URL을 받는 중이면, 깨진 이미지 대신 빈 상태가 되도록 undefined 반환
// (새 URL을 받지 못한 경우에는 기존 URL이라도 사용)
export function getUsableR2Url({
  data,
  dataUpdatedAt,
  isFetching,
}: R2UrlResult): string | undefined {
  if (!data) return undefined;
  const mayBeExpired = Date.now() - dataUpdatedAt >= R2_URL_VALID_TIME;
  return mayBeExpired && isFetching ? undefined : data;
}

// R2 객체 key 하나를 다운로드 URL로 변환
export const useR2ImageUrl = (key?: string | null) => {
  const query = useQuery({
    ...r2ImageQueryOptions(key ?? ""),
    enabled: !!key,
  });
  const data = getUsableR2Url(query);
  return {
    ...query,
    data,
    isLoading: query.isLoading || (!data && query.isFetching),
  };
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
        const url = getUsableR2Url(result);
        if (url) urls[uniqueKeys[i]] = url;
      });
      return urls;
    },
  });
};
