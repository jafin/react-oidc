import {
  ACCESS_TOKEN,
  NONCE_TOKEN,
  REFRESH_TOKEN,
  TokenRenewMode,
} from './constants';
import { isTokensOidcValid } from './tokenValidator';
import {
  OidcConfig,
  OidcConfiguration,
  OidcServerConfiguration,
  Tokens,
} from './types';
import { extractTokenPayload } from './utils';

function hideTokens(currentDatabaseElement: OidcConfig) {
  const configurationName = currentDatabaseElement.configurationName;
  return (response: Response) => {
    if (response.status !== 200) {
      return response;
    }
    return response.json().then<Response>((tokens: Tokens) => {
      if (!tokens.issued_at) {
        const currentTimeUnixSecond = new Date().getTime() / 1000;
        tokens.issued_at = currentTimeUnixSecond;
      }

      const accessTokenPayload = extractTokenPayload(tokens.access_token);
      const secureTokens = {
        ...tokens,
        access_token: ACCESS_TOKEN + '_' + configurationName,
        accessTokenPayload,
      };
      tokens.accessTokenPayload = accessTokenPayload;

      let _idTokenPayload = null;
      if (tokens.id_token) {
        _idTokenPayload = extractTokenPayload(tokens.id_token);
        tokens.idTokenPayload = { ..._idTokenPayload };
        if (_idTokenPayload.nonce && currentDatabaseElement.nonce != null) {
          const keyNonce =
            NONCE_TOKEN + '_' + currentDatabaseElement.configurationName;
          _idTokenPayload.nonce = keyNonce;
        }
        secureTokens.idTokenPayload = _idTokenPayload;
      }
      if (tokens.refresh_token) {
        secureTokens.refresh_token = REFRESH_TOKEN + '_' + configurationName;
      }

      const idTokenExpiresAt =
        _idTokenPayload && _idTokenPayload.exp
          ? _idTokenPayload.exp
          : Number.MAX_VALUE;
      const accessTokenExpiresAt =
        accessTokenPayload && accessTokenPayload.exp
          ? accessTokenPayload.exp
          : tokens.issued_at + tokens.expires_in;

      let expiresAt: number;
      const tokenRenewMode = (
        currentDatabaseElement.oidcConfiguration as OidcConfiguration
      ).token_renew_mode;
      if (tokenRenewMode === TokenRenewMode.access_token_invalid) {
        expiresAt = accessTokenExpiresAt;
      } else if (tokenRenewMode === TokenRenewMode.id_token_invalid) {
        expiresAt = idTokenExpiresAt;
      } else {
        expiresAt =
          idTokenExpiresAt < accessTokenExpiresAt
            ? idTokenExpiresAt
            : accessTokenExpiresAt;
      }
      secureTokens.expiresAt = expiresAt;

      tokens.expiresAt = expiresAt;
      const nonce = currentDatabaseElement.nonce
        ? currentDatabaseElement.nonce.nonce
        : null;
      const { isValid, reason } = isTokensOidcValid(
        tokens,
        nonce,
        currentDatabaseElement.oidcServerConfiguration as OidcServerConfiguration
      ); //TODO: Type assertion, could be null.
      if (!isValid) {
        throw Error(`Tokens are not OpenID valid, reason: ${reason}`);
      }

      // When refresh_token is not rotated we reuse ald refresh_token
      if (
        currentDatabaseElement.tokens != null &&
        'refresh_token' in currentDatabaseElement.tokens &&
        !('refresh_token' in tokens)
      ) {
        const refreshToken = currentDatabaseElement.tokens.refresh_token;

        currentDatabaseElement.tokens = {
          ...tokens,
          refresh_token: refreshToken,
        };
      } else {
        currentDatabaseElement.tokens = tokens;
      }

      currentDatabaseElement.status = 'LOGGED_IN';
      const body = JSON.stringify(secureTokens);
      return new Response(body, response);
    });
  };
}

export { hideTokens };
