import { useUser } from "lib/auth/client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import Markdown from 'react-markdown'
import Image from "next/image";
import Cookies from 'universal-cookie';

const useUserCookie = (COOKIE_NAME) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoading = false;
    const cookies = new Cookies(null, { path: '/' });
    const user = cookies.get(COOKIE_NAME);

    const theme = user.picture.split('-')[0];
    user.picture = `/images/avatars/${theme}/${user.picture}`;

    setUser(user);
    setIsLoading(isLoading);
  }, []); 

  return {
    user,
    isLoading,
  }
}

const authModules = {
  'auth0': useUser,
  'cookie': useUserCookie,
};

export const Message = ({ env, role, content }) => {  
  const { user } = authModules[env.AUTH_TYPE](env.COOKIE_NAME);
  const [ displayName, setDisplayName ] = useState();

  useEffect(() => {
    let displayName = '?';

    if (role === 'user' && !!user) {
      displayName = user.name;
    }

    if (role === 'assistant') {
      displayName = env.AI_NAME;
    }

    setDisplayName(displayName);
  }, [env.AI_NAME, role, user]);

  return (
    <div className={`grid grid-cols-[30px_1fr] gap-5 p-5 ${role === 'assistant' ? 'bg-gray-600' : role === 'notice' ? 'bg-red-600' : ''}`}>
      <div className="flex items-center justify-center">
        {role === 'user' && !!user && (
          <Image 
            src={user.picture} 
            width={30}
            height={30}
            alt="User avatar" 
            className="rounded-sm shadow-md shadow-black/50"
          />
        )}
        {role === 'assistant' && (
          <div className="flex items-center justify-center h-[30px] w-[30px] rounded-sm shadow-md shadow-black/50 bg-gray-800">
            <FontAwesomeIcon icon={faRobot} className="text-emerald-200"/>
          </div>
        )}
      </div>
      <div className="">
        <div className="font-bold">{displayName}</div>
        <div className="prose prose-invert">
          <Markdown>
            {content}
          </Markdown>
        </div>
      </div>
    </div>
  )
};
