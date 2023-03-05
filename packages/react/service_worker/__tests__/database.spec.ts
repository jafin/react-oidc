import { describe, it, expect } from 'vitest';
import { defaultDatabase, getCurrentDatabasesTokenEndpoint } from '../database';
import { OidcConfigBuilder, OidcServerConfigBuilder } from './testHelper';

describe('database', () => {
  describe('defaultDatabase', () => {
    it('builds a default database', () => {
      const result = defaultDatabase();
      expect(result).toHaveProperty('default');
      expect(result).toHaveProperty('default.configurationName');
    });
  });

  describe('getCurrentDatabasesTokenEndpoint', () => {
    it('can get database', () => {
      const database = defaultDatabase();
      const tokenEndpointUrl = 'https://test.com/token';

      database.OidcServerConfiguration = new OidcConfigBuilder()
        .withOidcServerConfiguration(
          new OidcServerConfigBuilder()
            .withTokenEndpoint(tokenEndpointUrl)
            .build()
        )
        .build();

      const result = getCurrentDatabasesTokenEndpoint(
        database,
        tokenEndpointUrl
      );
      expect(result.length).toBe(1);
    });
  });
});
