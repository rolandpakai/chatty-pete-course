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

export default function ChatPage({ chatId, title, messages = [] }) {
  const [newChatId, setNewChatId] = useState(null);
  const [incomingMessage, setIncomingMessage] = useState('');
  const [messageText, setMessageText] = useState('');
  const [newChatMessages, setNewChatMessages] = useState([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [fullMessage, setFullMessage] = useState('');
  const [originalChatId, setOriginalChatId] = useState(chatId);
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
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {!!incomingMessage && !routeHasChanged && (
                  <Message 
                    role={"assistant"}
                    content={incomingMessage}
                  />
                )}
                {!!incomingMessage && !!routeHasChanged && (
                  <Message 
                    role={"notice"}
                    content={"Only one message at a time. Please allow any other response to complete before sending another message"}
                  />
                )}
              </div>
            )}
          </div>
          <footer className="bg-gray-800 p-10">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea 
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder={generatingResponse ? "" : "Send a message..."}
                  className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500" />
                <button type="submit" className="btn">Send</button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const _id = ctx.params?.chatId?.[0] || null;

  if (_id) {
    const chat = await findOne({
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
    props: {}
  }
}
