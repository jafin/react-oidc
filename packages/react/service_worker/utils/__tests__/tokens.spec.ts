import { describe, it, expect } from 'vitest';
import { Tokens } from '../../types';
import { isTokensValid, parseJwt } from '..';

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

describe('tokens', () => {
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

  it('can check Expired Token', () => {
    expect(
      isTokensValid(
        createToken(
          currentTimeUnixSeconds() - 60,
          currentTimeUnixSeconds() - 120
        )
      )
    ).toBeFalsy();
  });

  it('can check valid Token', () => {
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
});
