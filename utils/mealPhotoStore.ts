let pendingUri: string | null = null;

export const setMealPhoto = (uri: string) => {
  pendingUri = uri;
};

export const consumeMealPhoto = (): string | null => {
  const uri = pendingUri;
  pendingUri = null;
  return uri;
};
