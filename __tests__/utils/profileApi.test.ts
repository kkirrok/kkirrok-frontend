import { getProfile, updateKcal } from "@/utils/api/profileApi";

jest.mock("@/utils/store/tokenStore", () => ({
  tokenStore: { get: jest.fn().mockResolvedValue("mock-token") },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockResponse(status: number, body: unknown) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

beforeEach(() => mockFetch.mockReset());

describe("updateKcal", () => {
  it("유효한 칼로리로 성공한다", async () => {
    mockFetch.mockReturnValue(mockResponse(200, {}));
    await expect(updateKcal(2000)).resolves.toBeUndefined();
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.kcal).toBe(2000);
  });

  it.each([0, -1, 1.5, -100])(
    "유효하지 않은 칼로리(%i) 입력 시 에러를 던진다",
    async (kcal) => {
      await expect(updateKcal(kcal)).rejects.toThrow(
        "올바른 칼로리 값을 입력해 주세요.",
      );
      expect(mockFetch).not.toHaveBeenCalled();
    },
  );

  it("서버 오류 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(400, { message: "칼로리 범위를 초과했습니다." }),
    );
    await expect(updateKcal(99999)).rejects.toThrow(
      "칼로리 범위를 초과했습니다.",
    );
  });
});

describe("getProfile", () => {
  it("성공 시 프로필을 반환한다", async () => {
    const profile = { nickname: "끼록이", kcal: 2000 };
    mockFetch.mockReturnValue(mockResponse(200, profile));
    const result = await getProfile();
    expect(result).toEqual(profile);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v1/users/profile"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer mock-token" }),
      }),
    );
  });

  it("토큰 없으면 에러를 던진다", async () => {
    const { tokenStore } = jest.requireMock("@/utils/store/tokenStore");
    tokenStore.get.mockResolvedValueOnce(null);
    await expect(getProfile()).rejects.toThrow("인증 토큰이 없습니다.");
  });

  it("서버 오류 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(404, { message: "사용자를 찾을 수 없습니다." }),
    );
    await expect(getProfile()).rejects.toThrow("사용자를 찾을 수 없습니다.");
  });
});
