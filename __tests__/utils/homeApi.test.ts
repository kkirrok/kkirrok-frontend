import { fetchHome, fetchRecommendations } from "@/utils/api/homeApi";

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

describe("fetchHome", () => {
  it("성공 시 홈 데이터를 반환한다", async () => {
    const homeData = {
      member_info: { nickname: "끼록이", meal_style: "DIET", meal_style_label: "다이어트" },
      reminder: null,
      nutrition: null,
      feedback: null,
    };
    mockFetch.mockReturnValue(mockResponse(200, homeData));
    const result = await fetchHome();
    expect(result).toEqual(homeData);
  });

  it("토큰 없으면 에러를 던진다", async () => {
    const { tokenStore } = jest.requireMock("@/utils/store/tokenStore");
    tokenStore.get.mockResolvedValueOnce(null);
    await expect(fetchHome()).rejects.toThrow("인증 토큰이 없습니다.");
  });

  it("서버 오류 시 메시지로 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(500, { message: "서버 점검 중입니다." }),
    );
    await expect(fetchHome()).rejects.toThrow("서버 점검 중입니다.");
  });
});

describe("fetchRecommendations", () => {
  it("성공 시 추천 데이터를 반환한다", async () => {
    const recommendations = {
      target_exercise_kcal: 300,
      exercise_recommend: [],
      remaining_food_kcal: 500,
      food_recommend: [],
    };
    mockFetch.mockReturnValue(
      mockResponse(200, { data: recommendations }),
    );
    const result = await fetchRecommendations();
    expect(result).toEqual(recommendations);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v1/meals/recommendations"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("data 필드가 없으면 에러를 던진다", async () => {
    mockFetch.mockReturnValue(mockResponse(200, {}));
    await expect(fetchRecommendations()).rejects.toThrow(
      "추천 정보 응답 데이터가 없습니다.",
    );
  });

  it("서버 오류 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(503, { message: "추천 서비스 불가" }),
    );
    await expect(fetchRecommendations()).rejects.toThrow("추천 서비스 불가");
  });
});
