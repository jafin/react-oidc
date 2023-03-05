import {
  acceptAnyDomainToken,
  openidWellknownUrlEndWith,
  scriptFilename,
} from './constants';
import {
  Database,
  Domain,
  FetchHeaders,
  OidcConfig,
  TrustedDomains,
} from './types';

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

const getCurrentDatabaseDomain = (
  database: Database,
  url: string,
  trustedDomains: TrustedDomains
) => {
  if (url.endsWith(openidWellknownUrlEndWith)) {
    return null;
  }
  for (const [key, currentDatabase] of Object.entries<OidcConfig>(database)) {
    const oidcServerConfiguration = currentDatabase.oidcServerConfiguration;

    if (!oidcServerConfiguration) {
      continue;
    }

    if (
      oidcServerConfiguration.tokenEndpoint &&
      url === oidcServerConfiguration.tokenEndpoint
    ) {
      continue;
    }
    if (
      oidcServerConfiguration.revocationEndpoint &&
      url === oidcServerConfiguration.revocationEndpoint
    ) {
      continue;
    }

    const domainsToSendTokens = oidcServerConfiguration.userInfoEndpoint
      ? [oidcServerConfiguration.userInfoEndpoint, ...trustedDomains[key]]
      : [...trustedDomains[key]];

    let hasToSendToken = false;
    if (domainsToSendTokens.find((f) => f === acceptAnyDomainToken)) {
      hasToSendToken = true;
    } else {
      for (let i = 0; i < domainsToSendTokens.length; i++) {
        let domain = domainsToSendTokens[i];

        if (typeof domain === 'string') {
          domain = new RegExp(`^${domain}`);
        }
        if (domain.test?.(url)) {
          hasToSendToken = true;
          break;
        }
      }
    }

    if (hasToSendToken) {
      if (!currentDatabase.tokens) {
        return null;
      }
      return currentDatabase;
    }
  }

  return null;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const extractTokenPayload = (token: string) => {
  try {
    if (!token) {
      return null;
    }
    if (countLetter(token, '.') === 2) {
      return parseJwt(token);
    } else {
      return null;
    }
  } catch (e) {
    console.warn(e);
  }
  return null;
};

export {
  serializeHeaders,
  countLetter,
  parseJwt,
  checkDomain,
  getCurrentDatabaseDomain,
  sleep,
  extractTokenPayload,
};
