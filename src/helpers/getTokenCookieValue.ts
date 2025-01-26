import { JWT } from "@config/index";

// @NOTE for Engine.IO
export const getTokenCookieValue = (cookie?: string) => {
  if (!cookie) {
    return null;
  }

  const values = cookie.split(";");

  for (const value of values) {
    if (value.startsWith(JWT.COOKIE_KEY)) {
      const indexOfFirstEqualitySymbol = value.indexOf("=");

      return value.slice(indexOfFirstEqualitySymbol + 1);
    }
  }

  return null;
};
