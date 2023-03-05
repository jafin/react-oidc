import { Database, OidcConfig } from './types';

function defaultDatabase(): Database {
  return {
    default: {
      configurationName: 'default',
      tokens: null,
      status: null,
      state: null,
      codeVerifier: null,
      nonce: null,
      oidcServerConfiguration: null,
    },
  };
}

const getCurrentDatabasesTokenEndpoint = (database: Database, url: string) => {
  const databases: OidcConfig[] = [];
  for (const [, value] of Object.entries<OidcConfig>(database)) {
    if (
      value.oidcServerConfiguration != null &&
      url.startsWith(value.oidcServerConfiguration.tokenEndpoint)
    ) {
      databases.push(value);
    } else if (
      value.oidcServerConfiguration != null &&
      value.oidcServerConfiguration.revocationEndpoint &&
      url.startsWith(value.oidcServerConfiguration.revocationEndpoint)
    ) {
      databases.push(value);
    }
  }
  return databases;
};

export { defaultDatabase, getCurrentDatabasesTokenEndpoint };
