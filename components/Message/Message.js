import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import Markdown from 'react-markdown'
import Image from "next/image";

export const Message = ({ role, content }) => {
  const { user } = useUser();

  return (
    <div className={`grid grid-cols-[30px_1fr] gap-5 p-5 ${role === 'assistant' ? 'bg-gray-600' : role === 'notice' ? 'bg-red-600' : ''}`}>
      <div>
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
      <div className="prose prose-invert">
        <Markdown>
          {content}
        </Markdown>
      </div>
    </div>
  )
};
