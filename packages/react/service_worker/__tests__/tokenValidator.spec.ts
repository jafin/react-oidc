import { describe, it, expect, beforeEach } from 'vitest';
import {
  isTokensValid,
  isTokensOidcValid,
  TokenInvalidReason,
} from '../tokenValidator';
import { OidcServerConfiguration } from '../types';
import {
  currentTimeUnixSeconds,
  OidcServerConfigBuilder,
  TokenBuilder,
} from './testHelper';

describe('tokenValidator', () => {
  let oidcServerConfig: OidcServerConfiguration;

  beforeEach(() => {
    oidcServerConfig = new OidcServerConfigBuilder()
      .withTestingDefault()
      .build();
  });

  describe('isTokensOidcValid', () => {
    it('can validate valid token', () => {
      const token = new TokenBuilder()
        .WithNonExpiredToken()
        .withIdTokenPayload({
          iss: oidcServerConfig.issuer,
          exp: 0,
          iat: 0,
          nonce: null,
        })
        .build();
      const result = isTokensOidcValid(token, null, oidcServerConfig);
      expect(result.isValid).toBeTruthy();
      expect(result.reason).toBe<TokenInvalidReason>('');
    });

    it('can invalidate nonmatching issuer', () => {
      const token = new TokenBuilder()
        .WithNonExpiredToken()
        .withIdTokenPayload({
          iss: oidcServerConfig.issuer + 'nonmatching',
          exp: 0,
          iat: 0,
          nonce: null,
        })
        .build();
      const result = isTokensOidcValid(token, null, oidcServerConfig);
      expect(result.isValid).toBeFalsy();
      expect(result.reason).toBe<TokenInvalidReason>('Issuer does not match');
    });

    it('can invalidate exp IdToken Claim', () => {
      const token = new TokenBuilder()
        .WithNonExpiredToken()
        .withIdTokenPayload({
          iss: oidcServerConfig.issuer,
          exp: currentTimeUnixSeconds() - 10,
          iat: 0,
          nonce: null,
        })
        .build();

      const result = isTokensOidcValid(token, null, oidcServerConfig);
      expect(result.isValid).toBeFalsy();
      expect(result.reason).toBe<TokenInvalidReason>('Token expired');
    });
  });

  it('can invalidate late issuedAt tokens', () => {
    const timeIn8Days = 60*60*24*8;
    const token = new TokenBuilder()
      .WithNonExpiredToken()
      .withIdTokenPayload({
        iss: oidcServerConfig.issuer,
        exp: 0,
        iat: currentTimeUnixSeconds() - timeIn8Days,
        nonce: null,
      })
      .build();

    const result = isTokensOidcValid(token, null, oidcServerConfig);
    expect(result.isValid).toBeFalsy();
    expect(result.reason).toBe<TokenInvalidReason>('Token is used from too long time');
  });

  it('can invalidate mismatch nonce', () => {
    const token = new TokenBuilder()
      .WithNonExpiredToken()
      .withIdTokenPayload({
        iss: oidcServerConfig.issuer,
        exp: 0,
        iat: 0,
        nonce: 'mismatched',
      })
      .build();

    const result = isTokensOidcValid(token, null, oidcServerConfig);
    expect(result.isValid).toBeFalsy();
    expect(result.reason).toBe<TokenInvalidReason>('Nonce does not match');
  });

  describe('isTokensValid', () => {
    it('can check expired token', () => {
      expect(
        isTokensValid(new TokenBuilder().withExpiredToken().build())
      ).toBeFalsy();
    });

    it('can check non-expired token', () => {
      const token = new TokenBuilder().WithNonExpiredToken().build();
      expect(isTokensValid(token)).toBeTruthy();
    });

    it('can check null token', () => {
      expect(isTokensValid(null)).toBeFalsy();
    });
  });
});
