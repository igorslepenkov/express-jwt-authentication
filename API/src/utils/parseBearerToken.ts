export const parseBearerToken = (bearerToken: string): string | null => {
  const splitResult = bearerToken.split(" ");

  if (splitResult && splitResult.length > 1) {
    return splitResult[1];
  }

  return null;
};
