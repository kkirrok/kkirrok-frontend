import { fetchCalendar, fetchDailyCalendar } from "@/utils/api/calendarApi";

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

describe("fetchDailyCalendar", () => {
  it("날짜를 쿼리파라미터로 포함해 요청한다", async () => {
    mockFetch.mockReturnValue(mockResponse(200, { data: { meals: [] } }));
    await fetchDailyCalendar("2026-08-04");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("date=2026-08-04"),
      expect.anything(),
    );
  });

  it("성공 시 일별 데이터를 반환한다", async () => {
    const daily = { meals: [], total_kcal: 0 };
    mockFetch.mockReturnValue(mockResponse(200, { data: daily }));
    const result = await fetchDailyCalendar("2026-08-04");
    expect(result).toEqual(daily);
  });

  it("토큰 없으면 에러를 던진다", async () => {
    const { tokenStore } = jest.requireMock("@/utils/store/tokenStore");
    tokenStore.get.mockResolvedValueOnce(null);
    await expect(fetchDailyCalendar("2026-08-04")).rejects.toThrow(
      "인증 토큰이 없습니다.",
    );
  });

  it("서버 오류 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(500, { message: "일별 캘린더 조회에 실패했습니다." }),
    );
    await expect(fetchDailyCalendar("2026-08-04")).rejects.toThrow(
      "일별 캘린더 조회에 실패했습니다.",
    );
  });
});

describe("fetchCalendar", () => {
  it("year/month/startDayOfWeek를 쿼리파라미터로 포함해 요청한다", async () => {
    mockFetch.mockReturnValue(mockResponse(200, { data: { weeks: [] } }));
    await fetchCalendar(2026, 8);
    const url: string = mockFetch.mock.calls[0][0];
    expect(url).toContain("year=2026");
    expect(url).toContain("month=8");
    expect(url).toContain("startDayOfWeek=0");
  });

  it("성공 시 월별 캘린더를 반환한다", async () => {
    const calendar = { weeks: [] };
    mockFetch.mockReturnValue(mockResponse(200, { data: calendar }));
    const result = await fetchCalendar(2026, 8);
    expect(result).toEqual(calendar);
  });

  it("서버 오류 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(403, { message: "권한이 없습니다." }),
    );
    await expect(fetchCalendar(2026, 8)).rejects.toThrow("권한이 없습니다.");
  });
});
