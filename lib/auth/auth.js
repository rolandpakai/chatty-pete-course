import * as auth0 from './auth0/auth';
import * as cookie from './cookie/auth';

const AUTH_TYPE = process.env.AUTH_TYPE || 'auth0';

const authModules = {
  'auth0': auth0,
  'cookie': cookie,
};

const { getSession, handleAuth, handleLogin } = authModules[AUTH_TYPE];

export { getSession, handleAuth, handleLogin };