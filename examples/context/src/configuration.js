const baseUri = 'http://localhost:3000';

const configuration = {
  client_id: 'interactive.public.short',
  redirect_uri: baseUri + '/authentication/callback',
  response_type: 'code',
  post_logout_redirect_uri: baseUri + '/',
  scope: 'openid profile email api offline_access',
  authority: 'https://demo.identityserver.io',
  silent_redirect_uri: baseUri + '/authentication/silent_callback',
  automaticSilentRenew: true,
  loadUserInfo: true,
};

export default configuration;
