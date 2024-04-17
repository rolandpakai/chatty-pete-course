import { faMessage, faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPromptList } from "services/prompt";

export const PromptSideBar = ({ promptId }) => {
  const [promptList, setPromptList] = useState([]);

  useEffect(() => {
    const loadPromptList = async () => {
      const response = await getPromptList();
      const json = await response.json();

      setPromptList(json?.prompts || []);
    };

    loadPromptList();
  }, [promptId]);

  return (
    <div className="bg-gray-900 text-white flex flex-col overflow-hidden">
      <Link href="/prompt/new" className="side-menu-item bg-emerald-500 hover:bg-emerald-600">
        <FontAwesomeIcon icon={faPlus} />
        New prompt
      </Link>
      <div className="flex-1 overflow-auto bg-gray-950">
        {promptList.map(prompt => (
          <Link 
            key={prompt._id} 
            href={`/prompt/${prompt._id}`} 
            className={`side-menu-item ${promptId === prompt._id ? 'bg-gray-700 hover:bg-gray-700' : ''}`}
          >
            <FontAwesomeIcon icon={faMessage} className="text-white/50" />
            <span 
              title={prompt.url}
              className="overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {prompt.url}
            </span>
          </Link>
        ))}
      </div>
      <Link href="/chat" className="side-menu-item">
        <FontAwesomeIcon icon={faMessage} />
        Chat
      </Link>
      <Link href="/api/auth/logout" className="side-menu-item">
        <FontAwesomeIcon icon={faRightFromBracket} />
        Logout
      </Link>
    </div>
  )
} 