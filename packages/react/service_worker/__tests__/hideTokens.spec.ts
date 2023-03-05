import { describe, it, expect } from 'vitest';
import { hideTokens } from '../hideTokens';
import { OidcConfigBuilder, ResponseBuilder } from './testHelper';

describe('hideTokens', () => {
  it('when no issued_at value is set it will populate one with current time', async () => {
    const config = new OidcConfigBuilder().withTestingDefault().build();
    const result = hideTokens(config);
    expect(result).toBeTypeOf('function');
    var resp = await result(new ResponseBuilder().withBodyContent({}).build());
    expect(resp).toBeTypeOf('object');
    var payload = await resp.json();
    expect(payload.issued_at).toBeTypeOf('number');
  });

  it('returns a response but bail early on non status 200', async () => {
    const config = new OidcConfigBuilder().withTestingDefault().build();
    const result = hideTokens(config);
    expect(result).toBeTypeOf('function');
    var resp = await result(new ResponseBuilder().withStatus(404).build());
    expect(resp).toBeTypeOf('object');
    expect(resp.status).toBe(404);
  });
});
