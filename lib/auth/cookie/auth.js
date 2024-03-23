import Cookies from 'universal-cookie';
import {v4 as uuid} from 'uuid';
import { parse } from 'url';

const COOKIE_NAME = process.env.COOKIE_NAME ?? 'LAISA';

const getSession = (req, res) => {
  const cookies = new Cookies(req.headers.cookie, { path: '/' });
  const user = cookies.get(COOKIE_NAME);

  if (user) {
    return {
      user
    }
  } else {
    return null;
  }
}

const cookieLoginHandler = (req, res) => {
  const { query } = parse(req.url, true);
  const { name } = query;

  const sub = uuid().replaceAll('-', '');
  const user = {
    sub: `cookie-auth|${sub}`,
    picture: '/lego.png',
    name,
  }

  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${JSON.stringify(user)}; Path=/`);
  res.writeHead(302, {
    Location: '/chat'
  });
  res.end();
}

const cookieLogoutHandler = (req, res) => {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  res.writeHead(302, {
    Location: '/'
  });
  res.end();
}

const handleAuth = (authHandlers) => {
  const { signup, logout, login } = authHandlers;

  const signupHandler = (req, res) => {
    if (signup) {
      return signup(req, res);
    } else {
      cookieLoginHandler(req, res);
    }
  }

  const logoutHandler = (req, res) => {
    if (logout) {
      return logout(req, res);
    } else {
      cookieLogoutHandler(req, res);
    }
  }

  const loginHandler = (req, res) => {
    if (login) {
      return login(req, res);
    } else {
      return signupHandler(req, res);
    }
  }

  const meHandler = (req, res) => {
    res.status(200).json({});
  }

  return (req, res) => {
    const { pathname } = parse(req.url, true);
    switch (pathname) {
      case '/api/auth/login': loginHandler(req, res); break;
      case '/api/auth/signup': signupHandler(req, res); break;
      case '/api/auth/logout': logoutHandler(req, res); break;
      case '/api/auth/me': meHandler(req, res); break;
    }
  }
}

const handleLogin = (params) => {
  return (req, res) => {
    cookieLoginHandler(req, res);
  };
}

export { getSession, handleAuth, handleLogin };
