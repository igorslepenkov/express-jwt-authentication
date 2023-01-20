export const parseBearerToken = (bearerToken: string): string | null => {
  const matchResult = bearerToken.match(/Bearer ([\w.]+)/);

  if (matchResult && matchResult.length > 1) {
    return matchResult[1];
  }

  return null;
};
