import {
  MEAL_TIME_SLOT_TO_TYPE,
  deleteMeal,
  fetchTodayMeals,
  searchFoods,
} from "@/utils/api/mealApi";

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

describe("MEAL_TIME_SLOT_TO_TYPE", () => {
  it.each([
    ["BREAKFAST", "아침"],
    ["LUNCH", "점심"],
    ["DINNER", "저녁"],
    ["SNACK", "간식"],
    ["MIDNIGHT_SNACK", "야식"],
  ] as const)("%s → %s 변환", (slot, expected) => {
    expect(MEAL_TIME_SLOT_TO_TYPE[slot]).toBe(expected);
  });
});

describe("fetchTodayMeals", () => {
  it("성공 시 식사 목록을 반환한다", async () => {
    const meals = [{ id: 1, food_name: "김치찌개", kcal: 300 }];
    mockFetch.mockReturnValue(mockResponse(200, { data: meals }));
    const result = await fetchTodayMeals();
    expect(result).toEqual(meals);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v1/meals"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer mock-token" }),
      }),
    );
  });

  it("토큰 없으면 에러를 던진다", async () => {
    const { tokenStore } = jest.requireMock("@/utils/store/tokenStore");
    tokenStore.get.mockResolvedValueOnce(null);
    await expect(fetchTodayMeals()).rejects.toThrow("인증 토큰이 없습니다.");
  });

  it("서버 오류 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(500, { message: "서버 오류입니다." }),
    );
    await expect(fetchTodayMeals()).rejects.toThrow("서버 오류입니다.");
  });
});

describe("deleteMeal", () => {
  it("성공 시 완료된다", async () => {
    mockFetch.mockReturnValue(mockResponse(200, {}));
    await expect(deleteMeal(42)).resolves.toBeUndefined();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v1/meals/42"),
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("실패 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(404, { message: "식단을 찾을 수 없습니다." }),
    );
    await expect(deleteMeal(999)).rejects.toThrow("식단을 찾을 수 없습니다.");
  });
});

describe("searchFoods", () => {
  it("키워드를 URL 인코딩해서 요청한다", async () => {
    mockFetch.mockReturnValue(mockResponse(200, { data: [] }));
    await searchFoods("김치 볶음밥");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent("김치 볶음밥")),
      expect.anything(),
    );
  });

  it("성공 시 음식 목록을 반환한다", async () => {
    const foods = [{ food_name: "김치찌개", kcal: 300 }];
    mockFetch.mockReturnValue(mockResponse(200, { data: foods }));
    const result = await searchFoods("김치");
    expect(result).toEqual(foods);
  });
});
