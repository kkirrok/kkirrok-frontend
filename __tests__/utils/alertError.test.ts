import { alertError } from "@/utils/alertError";
import { Alert } from "react-native";

const FALLBACK = "기본 메시지";

let alertSpy: jest.SpyInstance;
let now = 0;

beforeEach(() => {
  alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  // 이전 테스트의 throttle 영향을 받지 않도록 시간을 충분히 진행
  now += 10_000;
  jest.spyOn(Date, "now").mockImplementation(() => now);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("alertError", () => {
  it("서버 에러 메시지를 팝업으로 보여준다", () => {
    alertError(new Error("이미 참여한 그룹입니다."), FALLBACK);
    expect(alertSpy).toHaveBeenCalledWith("오류", "이미 참여한 그룹입니다.");
  });

  it("AbortError는 무시한다", () => {
    const err = new Error("aborted");
    err.name = "AbortError";
    alertError(err, FALLBACK);
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("네트워크 오류(TypeError)는 기본 메시지를 보여준다", () => {
    alertError(new TypeError("Network request failed"), FALLBACK);
    expect(alertSpy).toHaveBeenCalledWith("오류", FALLBACK);
  });

  it("useErrorMessage: false면 기본 메시지를 보여준다", () => {
    alertError(new Error("Camera is not ready"), FALLBACK, {
      useErrorMessage: false,
    });
    expect(alertSpy).toHaveBeenCalledWith("오류", FALLBACK);
  });

  it("Error가 아닌 값은 기본 메시지를 보여준다", () => {
    alertError("unknown", FALLBACK);
    expect(alertSpy).toHaveBeenCalledWith("오류", FALLBACK);
  });

  it("짧은 간격의 연속 호출은 한 번만 팝업을 띄운다", () => {
    alertError(new Error("첫 번째"), FALLBACK);
    now += 500;
    alertError(new Error("두 번째"), FALLBACK);
    expect(alertSpy).toHaveBeenCalledTimes(1);

    now += 2000;
    alertError(new Error("세 번째"), FALLBACK);
    expect(alertSpy).toHaveBeenCalledTimes(2);
    expect(alertSpy).toHaveBeenLastCalledWith("오류", "세 번째");
  });
});
