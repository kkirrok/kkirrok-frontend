import { Alert } from "react-native";

const THROTTLE_MS = 2000;
let lastAlertAt = 0;

/**
 * API·기기 오류를 사용자에게 팝업으로 알린다.
 * - 요청 취소(AbortError)는 무시
 * - 여러 요청이 동시에 실패해도 팝업이 겹쳐 뜨지 않도록 짧은 간격 내 중복 호출은 무시
 * - API 오류는 서버 메시지를 우선 보여주고, 기기 오류처럼 메시지가 사용자용이 아니면
 *   useErrorMessage: false로 fallbackMessage만 보여준다
 */
export function alertError(
  err: unknown,
  fallbackMessage: string,
  { useErrorMessage = true }: { useErrorMessage?: boolean } = {},
) {
  if (err instanceof Error && err.name === "AbortError") return;
  console.error(err);

  const now = Date.now();
  if (now - lastAlertAt < THROTTLE_MS) return;
  lastAlertAt = now;

  // 네트워크 단절 시 fetch가 던지는 TypeError("Network request failed")는 사용자용 문구가 아님
  const isUserFacing =
    useErrorMessage &&
    err instanceof Error &&
    !(err instanceof TypeError) &&
    !!err.message;
  const message = isUserFacing ? (err as Error).message : fallbackMessage;
  Alert.alert("오류", message);
}
