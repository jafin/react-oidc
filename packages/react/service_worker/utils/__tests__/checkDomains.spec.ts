import { describe, it, expect } from 'vitest';
import { checkDomain } from '..';

describe('domains', () => {
  describe('can check domain matches', () => {
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
