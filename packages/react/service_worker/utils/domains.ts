import { scriptFilename } from '../constants';
import { Domain } from '../types';

function checkDomain(domains: Domain[], endpoint: string) {
  if (!endpoint) {
    return;
  }

  const domain = domains.find((domain) => {
    let testable: RegExp;

    if (typeof domain === 'string') {
      testable = new RegExp(`^${domain}`);
    } else {
      testable = domain;
    }

    return testable.test?.(endpoint);
  });
  if (!domain) {
    throw new Error(
      'Domain ' +
        endpoint +
        ' is not trusted, please add domain in ' +
        scriptFilename
    );
  }
}

export { checkDomain };
