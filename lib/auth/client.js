import * as auth0 from './auth0/client';
import * as cookie from './cookie/client';

const AUTH_TYPE = process.env.AUTH_TYPE || 'auth0';

const authModules = {
  'auth0': auth0,
  'cookie': cookie,
};

const { useUser, UserProvider } = authModules[AUTH_TYPE];

export { useUser, UserProvider };