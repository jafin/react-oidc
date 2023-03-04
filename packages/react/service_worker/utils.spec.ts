import { describe, it, expect } from 'vitest';
import { Tokens } from './types';
import {
  checkDomain,
  countLetter,
  isTokensValid,
  parseJwt,
  serializeHeaders,
} from './utils';

const createToken = (expires: number, issued_at: number): Tokens => {
  return {
    expiresAt: expires,
    issued_at: issued_at,
    expires_in: 60,
    id_token: null,
    accessTokenPayload: null,
    access_token: '',
    idTokenPayload: { iss: '', exp: 0, iat: 0, nonce: null },
  };
};

const currentTimeUnixSeconds = (): number => {
  return new Date().getTime() / 1000;
};

describe('utils', () => {
  it('can serialize headers', () => {
    const result = serializeHeaders(
      new Headers({ 'Content-Type': 'application/json' })
    ); // Error: Argument of type 'Headers' is not assignable to parameter of type 'Headers'.(2345
    expect(result).toEqual({ 'content-type': 'application/json' });
  });

  it('can count letters', () => {
    const result = countLetter('token.type.z', '.');
    expect(result).toBe(2);
  });

  it('can parse JwtTokens', () => {
    const result = parseJwt(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    );
    expect(result).toEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    });
  });

  it('can check ExpiredToken', () => {
    expect(
      isTokensValid(
        createToken(
          currentTimeUnixSeconds() - 60,
          currentTimeUnixSeconds() - 120
        )
      )
    ).toBeFalsy();
  });

  it('can check ExpiredToken', () => {
    expect(
      isTokensValid(
        createToken(
          currentTimeUnixSeconds() + 60,
          currentTimeUnixSeconds() - 120
        )
      )
    ).toBeTruthy();
  });

  it('can check null token', () => {
    expect(isTokensValid(null)).toBeFalsy();
  });

  describe('checkDomains', () => {
    it('can check string domains and return void', () => {
      const result = () =>
        checkDomain(
          ['https://securesite.com:3000'],
          'https://securesite.com:3000'
        );
      expect(result()).toBeUndefined();
    });

    it('can check regExp domains and return void when valid', () => {
      const result = () =>
        checkDomain(
          [/^https:\/\/securesite\.com/],
          'https://securesite.com:3000'
        );
      expect(result()).toBeUndefined();
    });

    it('will throw error when domain is not trusted', () => {
      const result = () =>
        checkDomain(
          ['https://notsecuresite.com'],
          'https://securesite.com:3000'
        );
      expect(result).toThrowError();
    });

    it('will return void when endpoint is falsy', () => {
      const result = () => checkDomain(['https://securesite.com:3000'], '');
      expect(result()).toBeUndefined();
    });
  });
});