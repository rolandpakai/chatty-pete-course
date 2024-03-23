import { useEffect, useState } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Cookies from 'universal-cookie';

const COOKIE_NAME = process.env.COOKIE_NAME ?? 'LAISA';

const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("sssssss")
    const isLoading = false;
    const cookies = new Cookies(null, { path: '/' });
    const user = cookies.get(COOKIE_NAME);

    setUser(user);
    setIsLoading(isLoading);
  }, []); 

  return {
    user,
    isLoading,
  }
}

export { useUser, UserProvider };
