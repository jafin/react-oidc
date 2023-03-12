import { Tokens } from '../types';

function parseJwt(token: string) {
  return JSON.parse(
    b64DecodeUnicode(token.split('.')[1].replace('-', '+').replace('_', '/'))
  );
}
function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    Array.prototype.map
      .call(
        atob(str),
        (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      )
      .join('')
  );
}

function computeTimeLeft(
  refreshTimeBeforeTokensExpirationInSecond: number,
  expiresAt: number
) {
  const currentTimeUnixSecond = new Date().getTime() / 1000;
  return Math.round(
    expiresAt -
      refreshTimeBeforeTokensExpirationInSecond -
      currentTimeUnixSecond
  );
}

function isTokensValid(tokens: Tokens | null) {
  if (!tokens) {
    return false;
  }
  return computeTimeLeft(0, tokens.expiresAt) > 0;
}

export { parseJwt, b64DecodeUnicode, computeTimeLeft, isTokensValid };
