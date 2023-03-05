// https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation (excluding rules #1, #4, #5, #7, #8, #12, and #13 which did not apply).

import { OidcServerConfiguration, Tokens } from './types';

export type TokenInvalidReason =
  | 'Issuer does not match'
  | 'Token expired'
  | 'Token is used from too long time'
  | 'Nonce does not match'
  | '' /* valid */;

export type TokenValidationResult = {
  isValid: boolean;
  reason: TokenInvalidReason;
};

// https://github.com/openid/AppAuth-JS/issues/65
const isTokensOidcValid = (
  tokens: Tokens,
  nonce: string | null,
  oidcServerConfiguration: OidcServerConfiguration
): TokenValidationResult => {
  if (tokens.idTokenPayload) {
    const idTokenPayload = tokens.idTokenPayload;
    // 2: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery) MUST exactly match the value of the iss (issuer) Claim.
    if (oidcServerConfiguration.issuer !== idTokenPayload.iss) {
      return { isValid: false, reason: 'Issuer does not match' };
    }
    // 3: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience. The aud (audience) Claim MAY contain an array with more than one element. The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.

    // 6: If the ID Token is received via direct communication between the Client and the Token Endpoint (which it is in this flow), the TLS server validation MAY be used to validate the issuer in place of checking the token signature. The Client MUST validate the signature of all other ID Tokens according to JWS [JWS] using the algorithm specified in the JWT alg Header Parameter. The Client MUST use the keys provided by the Issuer.

    // 9: The current time MUST be before the time represented by the exp Claim.
    const currentTimeUnixSecond = new Date().getTime() / 1000;
    if (idTokenPayload.exp && idTokenPayload.exp < currentTimeUnixSecond) {
      return { isValid: false, reason: 'Token expired' };
    }
    // 10: The iat Claim can be used to reject tokens that were issued too far away from the current time, limiting the amount of time that nonces need to be stored to prevent attacks. The acceptable range is Client specific.
    const timeInSevenDays = 60 * 60 * 24 * 7;
    if (
      idTokenPayload.iat &&
      idTokenPayload.iat + timeInSevenDays < currentTimeUnixSecond
    ) {
    return { isValid: false, reason: 'Token is used from too long time' };
    }
    // 11: If a nonce value was sent in the Authentication Request, a nonce Claim MUST be present and its value checked to verify that it is the same value as the one that was sent in the Authentication Request. The Client SHOULD check the nonce value for replay attacks. The precise method for detecting replay attacks is Client specific.
    if (idTokenPayload.nonce && idTokenPayload.nonce !== nonce) {
      return { isValid: false, reason: 'Nonce does not match' };
    }
  }
  return { isValid: true, reason: '' };
};

const isTokensValid = (tokens: Tokens | null) => {
  if (!tokens) {
    return false;
  }
  return computeTimeLeft(0, tokens.expiresAt) > 0;
};

const computeTimeLeft = (
  refreshTimeBeforeTokensExpirationInSecond: number,
  expiresAt: number
) => {
  const currentTimeUnixSecond = new Date().getTime() / 1000;
  return Math.round(
    expiresAt -
      refreshTimeBeforeTokensExpirationInSecond -
      currentTimeUnixSecond
  );
};

export { isTokensOidcValid, isTokensValid };
