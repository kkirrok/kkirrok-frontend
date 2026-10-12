import {
  getUsableR2Url,
  useR2ImageUrl,
  useR2ImageUrls,
} from "@/hooks/useR2ImageUrl";
import { getDownloadUrl } from "@/utils/api/r2Api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import { ReactNode } from "react";

jest.mock("@/utils/api/r2Api", () => ({
  getDownloadUrl: jest.fn(),
}));

const mockGetDownloadUrl = getDownloadUrl as jest.MockedFunction<
  typeof getDownloadUrl
>;

const MINUTE = 60 * 1000;

let queryClient: QueryClient;

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  queryClient = new QueryClient();
  mockGetDownloadUrl.mockReset();
  mockGetDownloadUrl.mockImplementation(async (key) => `https://url/${key}`);
});

afterEach(() => {
  queryClient.clear();
});

describe("getUsableR2Url", () => {
  const now = Date.now();

  it("유효기간 안의 URL은 그대로 반환한다", () => {
    expect(
      getUsableR2Url({
        data: "url",
        dataUpdatedAt: now - 4 * MINUTE,
        isFetching: true,
      }),
    ).toBe("url");
  });

  it("만료됐을 수 있는 URL을 새로 받는 중이면 undefined를 반환한다", () => {
    expect(
      getUsableR2Url({
        data: "url",
        dataUpdatedAt: now - 6 * MINUTE,
        isFetching: true,
      }),
    ).toBeUndefined();
  });

  it("새 URL을 받지 못했으면 만료됐을 수 있어도 기존 URL을 반환한다", () => {
    expect(
      getUsableR2Url({
        data: "url",
        dataUpdatedAt: now - 6 * MINUTE,
        isFetching: false,
      }),
    ).toBe("url");
  });
});

describe("useR2ImageUrl", () => {
  it("key를 다운로드 URL로 변환한다", async () => {
    const { result } = await renderHook(() => useR2ImageUrl("profile/a.jpg"), {
      wrapper,
    });
    await waitFor(() =>
      expect(result.current.data).toBe("https://url/profile/a.jpg"),
    );
  });

  it("key가 없으면 요청하지 않는다", async () => {
    const { result } = await renderHook(() => useR2ImageUrl(null), {
      wrapper,
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(mockGetDownloadUrl).not.toHaveBeenCalled();
  });

  it("같은 key는 캐시를 공유해 한 번만 요청한다", async () => {
    const first = await renderHook(() => useR2ImageUrl("profile/a.jpg"), {
      wrapper,
    });
    await waitFor(() => expect(first.result.current.data).toBeDefined());

    const second = await renderHook(() => useR2ImageUrl("profile/a.jpg"), {
      wrapper,
    });
    expect(second.result.current.data).toBe("https://url/profile/a.jpg");
    expect(mockGetDownloadUrl).toHaveBeenCalledTimes(1);
  });

  it("만료됐을 수 있는 캐시는 새 URL을 받을 때까지 쓰지 않는다", async () => {
    queryClient.setQueryData(["r2-image", "profile/a.jpg"], "expired-url", {
      updatedAt: Date.now() - 6 * MINUTE,
    });

    const { result } = await renderHook(() => useR2ImageUrl("profile/a.jpg"), {
      wrapper,
    });
    expect(result.current.data).not.toBe("expired-url");
    await waitFor(() =>
      expect(result.current.data).toBe("https://url/profile/a.jpg"),
    );
  });
});

describe("useR2ImageUrls", () => {
  it("여러 key를 중복 없이 변환해 key별 URL로 반환한다", async () => {
    const { result } = await renderHook(
      () => useR2ImageUrls(["a.jpg", "b.jpg", "a.jpg", null, undefined]),
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current).toEqual({
        "a.jpg": "https://url/a.jpg",
        "b.jpg": "https://url/b.jpg",
      }),
    );
    expect(mockGetDownloadUrl).toHaveBeenCalledTimes(2);
  });

  it("변환에 실패한 key는 결과에서 빠진다", async () => {
    mockGetDownloadUrl.mockImplementation(async (key) => {
      if (key === "bad.jpg") throw new Error("fail");
      return `https://url/${key}`;
    });
    queryClient = new QueryClient({
      defaultOptions: { queries: { retryDelay: 0 } },
    });

    const { result } = await renderHook(
      () => useR2ImageUrls(["ok.jpg", "bad.jpg"]),
      { wrapper },
    );
    await waitFor(() =>
      expect(queryClient.getQueryState(["r2-image", "bad.jpg"])?.status).toBe(
        "error",
      ),
    );
    expect(result.current).toEqual({ "ok.jpg": "https://url/ok.jpg" });
  });
});
