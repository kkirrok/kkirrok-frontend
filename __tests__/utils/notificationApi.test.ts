import {
  fetchNotificationSettings,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  registerDeviceToken,
  updateNotificationSettings,
} from "@/utils/api/notificationApi";

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

describe("fetchNotificationSettings", () => {
  it("404이면 기본 설정값을 반환한다", async () => {
    mockFetch.mockReturnValue(mockResponse(404, {}));
    const result = await fetchNotificationSettings();
    expect(result.is_all).toBe(false);
    expect(result.agrees).toHaveLength(4);
  });

  it("성공 시 서버 데이터를 반환한다", async () => {
    const settings = {
      is_all: true,
      agrees: [{ type: "KKIROK", is_agree: true }],
    };
    mockFetch.mockReturnValue(mockResponse(200, { data: settings }));
    const result = await fetchNotificationSettings();
    expect(result.is_all).toBe(true);
  });

  it("서버 오류 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(500, { message: "서버 오류입니다." }),
    );
    await expect(fetchNotificationSettings()).rejects.toThrow("서버 오류입니다.");
  });
});

describe("updateNotificationSettings", () => {
  it("성공 시 업데이트된 설정을 반환한다", async () => {
    const updated = { is_all: false, agrees: [] };
    mockFetch.mockReturnValue(mockResponse(200, { data: updated }));
    const result = await updateNotificationSettings(false, []);
    expect(result).toEqual(updated);
  });

  it("실패 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(400, { message: "잘못된 요청입니다." }),
    );
    await expect(updateNotificationSettings(true, [])).rejects.toThrow(
      "잘못된 요청입니다.",
    );
  });
});

describe("fetchNotifications", () => {
  it("기본 page/size로 요청한다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(200, {
        data: { content: [], total_count: 0, unread_count: 0 },
      }),
    );
    await fetchNotifications();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("page=0&size=20"),
      expect.anything(),
    );
  });

  it("실패 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(mockResponse(401, { message: "인증 오류" }));
    await expect(fetchNotifications()).rejects.toThrow("인증 오류");
  });
});

describe("markNotificationRead", () => {
  it("성공 시 완료된다", async () => {
    mockFetch.mockReturnValue(mockResponse(200, {}));
    await expect(markNotificationRead(1)).resolves.toBeUndefined();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/v1/notifications/1/read"),
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("실패 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(404, { message: "알림을 찾을 수 없습니다." }),
    );
    await expect(markNotificationRead(999)).rejects.toThrow(
      "알림을 찾을 수 없습니다.",
    );
  });
});

describe("markAllNotificationsRead", () => {
  it("성공 시 완료된다", async () => {
    mockFetch.mockReturnValue(mockResponse(200, {}));
    await expect(markAllNotificationsRead()).resolves.toBeUndefined();
  });
});

describe("registerDeviceToken", () => {
  it("플랫폼과 토큰을 포함해 요청한다", async () => {
    mockFetch.mockReturnValue(mockResponse(200, {}));
    await registerDeviceToken("device-abc", "IOS");
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.token).toBe("device-abc");
    expect(body.platform).toBe("IOS");
  });
});
