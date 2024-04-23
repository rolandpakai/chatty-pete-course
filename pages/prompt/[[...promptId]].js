"use client";

import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { PromptSideBar } from "../../components/PromptSideBar";
import { findOne } from 'services/db';

export default function PromptPage({ env, promptId, url, content, label, type, page }) {
  const title = `${env.AI_NAME} Lightware AI Support Assistant`;
  const textareaRef = useRef(null);
  const [rows, setRows] = useState(15);

  useEffect(() => {
    if (promptId) {
      const lineHeight = parseFloat(window.getComputedStyle(textareaRef.current).lineHeight);

      function handleResize() {
        if (textareaRef.current) {
          const windowHeight = window.innerHeight;
          const newRows = Math.floor(windowHeight / lineHeight) - 14;
          setRows(newRows);
        }
      }

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [promptId]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <PromptSideBar promptId={promptId} />
        <div className="flex flex-1 text-white overflow-auto">
          <main className="bg-gray-800 p-10 w-full">
          {promptId &&
            <form>
              <fieldset className="flex flex-wrap gap-2 w-full">
                <div class="flex flex-wrap w-full">
                  <label for="url" class="w-full block mb-2 text-sm font-medium text-gray-900 dark:text-white">Label</label>
                  <input
                      id="url"
                      type="text"
                      value={label}
                      disabled="disabled"
                      className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500 disabled:text-gray-600"
                    />
                </div>
                <div class="flex flex-wrap w-full">
                  <label for="url" class="w-full block mb-2 text-sm font-medium text-gray-900 dark:text-white">Url</label>
                  <input
                      id="url"
                      type="text"
                      value={url}
                      disabled="disabled"
                      className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500 disabled:text-gray-600"
                    />
                </div>
                <div class="flex flex-wrap w-full">
                  <label for="content" class="w-full block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                  <textarea
                  ref={textareaRef}
                    id="content"
                    rows={rows}
                    value={content}
                    disabled="disabled"
                    className="w-full block resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500 disabled:text-gray-600" 
                  />
                </div>
              </fieldset>
            </form>
            }
          </main>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const _id = ctx.params?.promptId?.[0] || null;

  const env = {
    AI_NAME: process.env.AI_NAME,
    AUTH_TYPE: process.env.AUTH_TYPE,
    COOKIE_NAME: process.env.COOKIE_NAME,
  };

  if (_id) {
    const prompt = await findOne(process.env.COLLECTION_NAME_PROMPTS, {
      _id
    });

    if (!prompt) {
      return {
        redirect: {
          destination: '/prompt'
        }
      }
    }

    return {
      props: {
        env,
        promptId: prompt._id,
        ...prompt,
      }
    }
  }

  return {
    props: {
      env,
    }
  }
}