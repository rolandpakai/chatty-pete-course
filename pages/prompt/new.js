"use client";

import Head from "next/head";
import { useState } from "react";
import { htmlReader } from 'services/prompt';
import { PromptSideBar } from "../../components/PromptSideBar";

export default function NewPromptPage({ env }) {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [promptId, setPromptId] = useState('');

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const promptResponse = await htmlReader({ url, label });
    const { prompt } = await promptResponse.json();
    setPromptId(prompt._id);
    setUrl('');
    setLabel('');
  }

  return (
    <>
      <Head>
        <title>New Prompt</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <PromptSideBar promptId={promptId} />
        <div className="flex flex-1 text-white overflow-auto">
          <main className="bg-gray-800 p-10 w-full">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex flex-wrap gap-3 w-full">
                <div className="flex flex-wrap w-full">
                  <input
                    type="text"
                    value={label}
                    onChange={handleLabelChange}
                    placeholder="Enter Label"
                    className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500"
                  />
                </div>
                <div className="flex flex-wrap w-full">
                  <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Enter URL"
                    className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500"
                  />
                </div>
                <div className="flex flex-wrap gap-5 pt-2">
                  <button 
                    type="submit" 
                    className="btn"
                    disabled={!url || !label}
                  >
                    Send
                  </button>
                </div>
              </fieldset>
            </form>
          </main>
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

  return {
    props: {
      env,
    }
  }
}