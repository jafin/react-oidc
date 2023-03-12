const scriptFilename = 'OidcTrustedDomains.js'; /* global trustedDomains */
const acceptAnyDomainToken = '*';

const REFRESH_TOKEN = 'REFRESH_TOKEN_SECURED_BY_OIDC_SERVICE_WORKER';
const ACCESS_TOKEN = 'ACCESS_TOKEN_SECURED_BY_OIDC_SERVICE_WORKER';
const NONCE_TOKEN = 'NONCE_SECURED_BY_OIDC_SERVICE_WORKER';
const CODE_VERIFIER = 'CODE_VERIFIER_SECURED_BY_OIDC_SERVICE_WORKER';

const TOKEN = {
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  NONCE_TOKEN,
  CODE_VERIFIER,
};

export { scriptFilename, acceptAnyDomainToken, TOKEN };
