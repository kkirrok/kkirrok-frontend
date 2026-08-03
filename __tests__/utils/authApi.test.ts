import { findEmail, loginLocal, verifyEmailCode } from "@/utils/api/authApi";

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockResponse(status: number, body: unknown) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("loginLocal", () => {
  it("성공 시 AuthResponse를 반환한다", async () => {
    const response = { data: { accessToken: "token123" } };
    mockFetch.mockReturnValue(mockResponse(200, response));

    const result = await loginLocal("test@example.com", "password123");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.test.example.com/v1/users/login/local",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result).toEqual(response);
  });

  it("실패 시 서버 메시지로 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(401, { message: "이메일 또는 비밀번호가 올바르지 않습니다." }),
    );

    await expect(loginLocal("wrong@example.com", "wrong")).rejects.toThrow(
      "이메일 또는 비밀번호가 올바르지 않습니다.",
    );
  });
});

describe("findEmail", () => {
  it("성공 시 이메일 문자열을 반환한다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(200, { data: { email: "found@example.com" } }),
    );

    const email = await findEmail({ name: "홍길동", birth: "1990-01-01", phone: "01012345678" });
    expect(email).toBe("found@example.com");
  });

  it("실패 시 기본 에러 메시지를 던진다", async () => {
    mockFetch.mockReturnValue(mockResponse(404, {}));

    await expect(
      findEmail({ name: "없는사람", birth: "1990-01-01", phone: "01000000000" }),
    ).rejects.toThrow("일치하는 회원 정보가 없습니다.");
  });

  it("실패 시 서버 메시지가 있으면 해당 메시지를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(400, { message: "잘못된 형식입니다." }),
    );

    await expect(
      findEmail({ name: "홍길동", birth: "invalid", phone: "01012345678" }),
    ).rejects.toThrow("잘못된 형식입니다.");
  });
});

describe("verifyEmailCode", () => {
  it("인증 성공 시 true를 반환한다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(200, { data: { verified: true } }),
    );

    const result = await verifyEmailCode("test@example.com", "123456");
    expect(result).toBe(true);
  });

  it("인증 실패 시 에러를 던진다", async () => {
    mockFetch.mockReturnValue(
      mockResponse(400, { message: "인증 코드가 올바르지 않습니다." }),
    );

    await expect(verifyEmailCode("test@example.com", "000000")).rejects.toThrow(
      "인증 코드가 올바르지 않습니다.",
    );
  });
});
