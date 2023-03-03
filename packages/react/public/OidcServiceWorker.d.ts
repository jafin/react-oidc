type Domain = string | RegExp;
type TrustedDomains = {
    [key: string]: Domain[];
};
type OidcServerConfiguration = {
    revocationEndpoint: string;
    issuer: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    userInfoEndpoint: string;
};
type OidcConfiguration = {
    token_renew_mode: string;
    service_worker_convert_all_requests_to_cors: boolean;
};
interface FetchHeaders extends Headers {
    keys(): string[];
}
type Status = 'LOGGED' | 'LOGGED_IN' | 'LOGGED_OUT' | 'NOT_CONNECTED' | 'LOGOUT_FROM_ANOTHER_TAB' | 'SESSION_LOST' | 'REQUIRE_SYNC_TOKENS' | 'FORCE_REFRESH' | null;
type MessageEventType = 'clear' | 'init' | 'setState' | 'getState' | 'setCodeVerifier' | 'getCodeVerifier' | 'setSessionState' | 'getSessionState' | 'setNonce';
type MessageData = {
    status: Status;
    oidcServerConfiguration: OidcServerConfiguration;
    oidcConfiguration: OidcConfiguration;
    where: string;
    state: string;
    codeVerifier: string;
    sessionState: string;
    nonce: Nonce;
};
type MessageEventData = {
    configurationName: string;
    type: MessageEventType;
    data: MessageData;
};
type Nonce = {
    nonce: string;
} | null;
type OidcConfig = {
    configurationName: string;
    tokens: Tokens | null;
    status: Status;
    state: string | null;
    codeVerifier: string | null;
    nonce: Nonce;
    oidcServerConfiguration: OidcServerConfiguration | null;
    oidcConfiguration?: OidcConfiguration;
    sessionState?: string | null;
    items?: MessageData;
};
type IdTokenPayload = {
    iss: string;
    /**
     * (Expiration Time) Claim
     */
    exp: number;
    /**
     * (Issued At) Claim
     */
    iat: number;
    nonce: string | null;
};
type AccessTokenPayload = {
    exp: number;
    sub: string;
};
type Tokens = {
    issued_at: number;
    access_token: string;
    accessTokenPayload: AccessTokenPayload | null;
    id_token: null | string;
    idTokenPayload: IdTokenPayload;
    refresh_token?: string;
    expiresAt: number;
    expires_in: number;
};
type Database = {
    [key: string]: OidcConfig;
};
declare const _self: ServiceWorkerGlobalScope & typeof globalThis;
declare let trustedDomains: TrustedDomains;
declare const scriptFilename = "OidcTrustedDomains.js";
declare const id: string;
declare const acceptAnyDomainToken = "*";
declare const keepAliveJsonFilename = "OidcKeepAliveServiceWorker.json";
declare const handleInstall: (event: ExtendableEvent) => void;
declare const handleActivate: (event: ExtendableEvent) => void;
declare let currentLoginCallbackConfigurationName: string | null;
declare const database: Database;
declare const countLetter: (str: string, find: string) => number;
declare const b64DecodeUnicode: (str: string) => string;
declare const parseJwt: (token: string) => any;
declare const extractTokenPayload: (token: string) => any;
declare const computeTimeLeft: (refreshTimeBeforeTokensExpirationInSecond: number, expiresAt: number) => number;
declare const isTokensValid: (tokens: Tokens | null) => boolean;
declare const isTokensOidcValid: (tokens: Tokens, nonce: string | null, oidcServerConfiguration: OidcServerConfiguration) => {
    isValid: boolean;
    reason: string;
};
declare const TokenRenewMode: {
    access_token_or_id_token_invalid: string;
    access_token_invalid: string;
    id_token_invalid: string;
};
declare function hideTokens(currentDatabaseElement: OidcConfig): (response: Response) => Response | Promise<Response>;
declare const getCurrentDatabasesTokenEndpoint: (database: Database, url: string) => OidcConfig[];
declare const openidWellknownUrlEndWith = "/.well-known/openid-configuration";
declare const getCurrentDatabaseDomain: (database: Database, url: string) => OidcConfig | null;
declare const serializeHeaders: (headers: Headers) => Record<string, string>;
declare const REFRESH_TOKEN = "REFRESH_TOKEN_SECURED_BY_OIDC_SERVICE_WORKER";
declare const ACCESS_TOKEN = "ACCESS_TOKEN_SECURED_BY_OIDC_SERVICE_WORKER";
declare const NONCE_TOKEN = "NONCE_SECURED_BY_OIDC_SERVICE_WORKER";
declare const CODE_VERIFIER = "CODE_VERIFIER_SECURED_BY_OIDC_SERVICE_WORKER";
declare const sleep: (ms: number) => Promise<unknown>;
declare const keepAliveAsync: (event: FetchEvent) => Promise<Response>;
declare const handleFetch: (event: FetchEvent) => Promise<void>;
declare const handleMessage: (event: ExtendableMessageEvent) => void;
declare const checkDomain: (domains: Domain[], endpoint: string) => void;
//# sourceMappingURL=OidcServiceWorker.d.ts.map