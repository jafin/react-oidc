import React from 'react';
import './ie.polyfills';

import { BrowserRouter as Router } from 'react-router-dom';
import { AuthenticationProvider, oidcLog, InMemoryWebStorage } from '@axa-fr/react-oidc-context';
import CustomCallback from './Pages/CustomCallback';
import Header from './Layout/Header';
import Routes from './Router';
import oidcConfiguration from './configuration';

const App = () => (
  <div>
    <AuthenticationProvider
      configuration={oidcConfiguration}
      loggerLevel={oidcLog.DEBUG}
      isEnabled
      callbackComponentOverride={CustomCallback}
      // UserStore={InMemoryWebStorage}
      customEvents={{
        onUserLoaded: user => console.log('onUserLoaded', user),
        onUserUnloaded: () => console.log('onUserUnloaded'),
        onSilentRenewError: error => console.log('onSilentRenewError', error),
        onUserSignedOut: () => console.log('onUserSignedOut'),
        onUserSessionChanged: () => console.log('onUserSessionChanged'),
        onAccessTokenExpiring: () => console.log('onAccessTokenExpiring'),
        onAccessTokenExpired: () => console.log('onAccessTokenExpired'),
      }}
    >
      <Router>
        <Header />
        <Routes />
      </Router>
    </AuthenticationProvider>
  </div>
);

export { App };
