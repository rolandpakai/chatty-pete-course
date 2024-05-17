"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";
import {v4 as uuid} from 'uuid';
import { streamReader } from "openai-edge-stream";
import { ChatSideBar } from "../../components/ChatSideBar";
import { Message } from 'components/Message';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { findOne } from 'services/db';
import { sendMessage } from 'services/api';

export default function ChatPage({ env, chatId, title, messages = [] }) {
  const [newChatId, setNewChatId] = useState(null);
  const [incomingMessage, setIncomingMessage] = useState('');
  const [messageText, setMessageText] = useState('');
  const [newChatMessages, setNewChatMessages] = useState([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [fullMessage, setFullMessage] = useState('');
  const [originalChatId, setOriginalChatId] = useState(chatId);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const router = useRouter();
  const routeHasChanged = chatId !== originalChatId;

  // When the route changes
  useEffect(() => {
    setNewChatMessages([]);
    setNewChatId(null);
  }, [chatId]);

  // Save the newly streamed messages to the new chat messages
  useEffect(() => {
    if (!routeHasChanged && !generatingResponse && fullMessage) {
      setNewChatMessages(prev => [...prev, {
        _id: uuid(),
        role: 'assistant',
        content: fullMessage,
      }]);
      setFullMessage('');
    }
  }, [generatingResponse, fullMessage, routeHasChanged]);

  // If we created a new chat
  useEffect(() => {
    if (!generatingResponse && newChatId) {
      setNewChatId(null);
      router.push(`/chat/${newChatId}`);
    }
  }, [newChatId, generatingResponse, router]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setGeneratingResponse(true);
    setOriginalChatId(chatId);

    setNewChatMessages(prev => {
      const newChatMessages = [...prev, {
        _id: uuid(),
        role: 'user',
        content: messageText,
      }];

      return newChatMessages;
    });

    setMessageText('');

    const response = await sendMessage({chatId, message: messageText});
    const data = response.body;

    if (!data) {
      return;
    }

    const reader = data.getReader();
    let content = '';

    await streamReader(reader, (message) => {
      if (message.event === "newChatId") {
        setNewChatId(message.content);
      } else {
        setIncomingMessage(s => s.concat(message.content));
        content = content.concat(message.content);
      }
    });

    setFullMessage(content);
    setIncomingMessage('');
    setGeneratingResponse(false);
  };

  const handleUploadButtonClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = handleFileUpload;
    fileInput.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      /*
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      */
 
      const fileData = {
        _id: uuid(),
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      };

      setUploadedFiles(prevArray => [...prevArray, JSON.stringify(fileData)]);
    }
  };

  const allMessages = [...messages, ...newChatMessages];

  return (
    <>
      <Head>
        <title>New Chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSideBar chatId={chatId} />
        <div className="bg-gray-700 flex flex-col overflow-hidden">
          <div className="flex flex-1 flex-col-reverse text-white overflow-auto">
            {!allMessages.length && !incomingMessage && (
              <div className="m-auto justify-center flex items-center text-center">
                <div>
                  <FontAwesomeIcon 
                    icon={faRobot} 
                    className="text-6xl text-emerald-200"
                  />
                  <h1 className="text-4xl font-bold text-white/50 mt-2">
                    Ask me a question!
                  </h1>
                </div>
              </div>
            )}
            {!!allMessages.length && (
              <div className="mb-auto">
                {allMessages.map(message => (
                  <Message 
                    key={message._id} 
                    env={env}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {!!incomingMessage && !routeHasChanged && (
                  <Message 
                    env={env}
                    role={"assistant"}
                    content={incomingMessage}
                  />
                )}
                {!!incomingMessage && !!routeHasChanged && (
                  <Message 
                    env={env}
                    role={"notice"}
                    content={"Only one message at a time. Please allow any other response to complete before sending another message"}
                  />
                )}
              </div>
            )}
            {!!uploadedFiles.length && (
              <div className="mb-auto">
                {uploadedFiles.map(file => (
                  <Message 
                    key={file._id} 
                    env={env}
                    role={"file"}
                    content={file}
                  />
                ))}
              </div>
            )}
          </div>
          <footer className="bg-gray-800 p-6">
            <div className="w-full">
              <div className="flex gap-2">
                <div class="flex">
                  <button 
                    className="flex items-center justify-center text-token-text-primary juice:h-8 juice:w-8 dark:text-white juice:rounded-full focus-visible:outline-black dark:focus-visible:outline-white juice:mb-1 juice:ml-[3px]" 
                    aria-label="Attach files"
                    onClick={handleUploadButtonClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path 
                        fill="currentColor" 
                        fill-rule="evenodd" 
                        d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z" 
                        clip-rule="evenodd" 
                        data-darkreader-inline-fill="">
                      </path>
                    </svg>
                  </button>
                </div>
                <textarea 
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={generatingResponse ? "" : "Send a message..."}
                  className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500" 
                />
                <button 
                  type="submit" 
                  className="btn"
                  onClick={handleSubmit}
                >
                    Send
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const _id = ctx.params?.chatId?.[0] || null;

  const env = {
    AI_NAME: process.env.AI_NAME,
    AUTH_TYPE: process.env.AUTH_TYPE,
    COOKIE_NAME: process.env.COOKIE_NAME,
  };

  if (_id) {
    const chat = await findOne(process.env.COLLECTION_NAME_CHATS, {
      _id
    });
    
    if (!chat) {
      return {
        redirect: {
          destination: '/chat'
        }
      }
    }

    return {
      props: {
        env,
        chatId: chat._id,
        title: chat.title,
        messages: chat.messages.map(message => ({
          ...message,
          _id: uuid(),
        }))
      }
    }
  }

  return {
    props: {
      env,
    }
  }
}
