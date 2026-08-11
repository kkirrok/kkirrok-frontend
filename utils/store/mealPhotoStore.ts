import type { ScanMealResult } from "@/utils/types/meal";

let pendingUri: string | null = null;
let pendingScanResult: ScanMealResult | null = null;

export const setMealPhoto = (uri: string) => {
  pendingUri = uri;
  pendingScanResult = null;
};

export const consumeMealPhoto = (): string | null => {
  const uri = pendingUri;
  pendingUri = null;
  return uri;
};

export const setScanResult = (result: ScanMealResult) => {
  pendingScanResult = result;
  pendingUri = null;
};

export const consumeScanResult = (): ScanMealResult | null => {
  const result = pendingScanResult;
  pendingScanResult = null;
  return result;
};
