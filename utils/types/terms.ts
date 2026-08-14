export type TermType =
  | "TERMS_OF_SERVICE"
  | "PRIVACY_COLLECTION"
  | "PRIVACY_THIRD_PARTY"
  | "MARKETING";

export type TermItem = {
  type: TermType;
  is_required: boolean;
  version: number;
  url: string | null;
};

export const TERM_LABELS: Record<TermType, string> = {
  TERMS_OF_SERVICE: "끼록 이용약관 동의",
  PRIVACY_COLLECTION: "개인정보 수집 및 이용동의",
  PRIVACY_THIRD_PARTY: "개인정보 제3자 제공 동의",
  MARKETING: "마케팅 정보 수신 동의",
};
