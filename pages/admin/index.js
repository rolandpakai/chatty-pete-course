"use client";

import { useState, useEffect } from "react";
import { htmlReader } from 'services/web';

export default function CrawlPage({ env }) {
  const [url, setUrl] = useState('');

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const response = await htmlReader({ url });
    const data = response.body;
    console.log("crawl index data", data);
  }

  return (
    <>
      ADMIN

      <form onSubmit={handleSubmit}>
          <fieldset className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={handleChange}
              placeholder="Enter URL"
            />
            <button type="submit" className="btn">Send</button>
          </fieldset>
        </form>
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