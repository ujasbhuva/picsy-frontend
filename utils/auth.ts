import Cookies from "js-cookie";
const TokenKey: string = "Writesonic_Token";

export function getToken(): string | undefined {
  return Cookies.get(TokenKey);
}

export function setToken(token: string): string | undefined {
  return Cookies.set(TokenKey, token, { expires: 14 });
}

export function clearAllCookie() {
  Cookies.remove(TokenKey);
}
