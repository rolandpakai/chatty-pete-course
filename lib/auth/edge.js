import * as auth0 from './auth0/edge';
import * as cookie from './cookie/edge';

const AUTH_TYPE = process.env.AUTH_TYPE || 'auth0';

const authModules = {
  'auth0': auth0,
  'cookie': cookie,
};

const { withMiddlewareAuthRequired } = authModules[AUTH_TYPE];

export { withMiddlewareAuthRequired };