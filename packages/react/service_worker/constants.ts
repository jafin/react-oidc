const scriptFilename = 'OidcTrustedDomains.js'; /* global trustedDomains */
const acceptAnyDomainToken = '*';
const openidWellknownUrlEndWith = '/.well-known/openid-configuration';

const TokenRenewMode = {
  access_token_or_id_token_invalid: 'access_token_or_id_token_invalid',
  access_token_invalid: 'access_token_invalid',
  id_token_invalid: 'id_token_invalid',
};

const REFRESH_TOKEN = 'REFRESH_TOKEN_SECURED_BY_OIDC_SERVICE_WORKER';
const ACCESS_TOKEN = 'ACCESS_TOKEN_SECURED_BY_OIDC_SERVICE_WORKER';
const NONCE_TOKEN = 'NONCE_SECURED_BY_OIDC_SERVICE_WORKER';
const CODE_VERIFIER = 'CODE_VERIFIER_SECURED_BY_OIDC_SERVICE_WORKER';

export {
  scriptFilename,
  acceptAnyDomainToken,
  openidWellknownUrlEndWith,
  TokenRenewMode,
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  NONCE_TOKEN,
  CODE_VERIFIER,
};
