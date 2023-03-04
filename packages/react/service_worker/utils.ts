import { scriptFilename } from './constants';
import { Domain, FetchHeaders, Tokens } from './types';
const serializeHeaders = (headers: Headers) => {
  const headersObj: Record<string, string> = {};
  for (const key of (headers as FetchHeaders).keys()) {
    if (headers.has(key)) {
      headersObj[key] = headers.get(key) as string;
    }
  }
  return headersObj;
};

/**
 * Count occurances of letter in string
 * @param str
 * @param find
 * @returns
 */
const countLetter = (str: string, find: string) => {
  return str.split(find).length - 1;
};

const b64DecodeUnicode = (str: string) =>
  decodeURIComponent(
    Array.prototype.map
      .call(
        atob(str),
        (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      )
      .join('')
  );

const parseJwt = (token: string) =>
  JSON.parse(
    b64DecodeUnicode(token.split('.')[1].replace('-', '+').replace('_', '/'))
  );

const checkDomain = (domains: Domain[], endpoint: string) => {
  if (!endpoint) {
    return;
  }

  const domain = domains.find((domain) => {
    let testable: RegExp;

    if (typeof domain === 'string') {
      testable = new RegExp(`^${domain}`);
    } else {
      testable = domain;
    }

    return testable.test?.(endpoint);
  });
  if (!domain) {
    throw new Error(
      'Domain ' +
        endpoint +
        ' is not trusted, please add domain in ' +
        scriptFilename
    );
  }
};

const computeTimeLeft = (refreshTimeBeforeTokensExpirationInSecond: number, expiresAt: number) => {
  const currentTimeUnixSecond = new Date().getTime() / 1000;
  return Math.round(((expiresAt - refreshTimeBeforeTokensExpirationInSecond) - currentTimeUnixSecond));
};

const isTokensValid = (tokens: Tokens | null) => {
  if (!tokens) {
      return false;
  }
  return computeTimeLeft(0, tokens.expiresAt) > 0;
};

export { serializeHeaders, countLetter, parseJwt, checkDomain, isTokensValid };
