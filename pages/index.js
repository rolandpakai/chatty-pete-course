"use client";

import Head from "next/head";
import { getSession } from 'lib/auth/auth';
import { useUser } from 'lib/auth/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react'
import { AuthType } from "components/AuthType"; 

const AI_NAME = process.env.AI_NAME ?? 'LAISA';

export default function Home({ auth_type }) {
  const [isClient, setIsClient] = useState(false);
  const { isLoading } = useUser();

  useEffect(() => {
    setIsClient(true)
  }, []);

  if (isClient) {
    if (isLoading) {
      return (
        <div>Loading...</div>
      )
    }

    return (
      <>
        <Head>
          <title>{AI_NAME} - Ligthware AI Support Assistant</title>
        </Head>
        <div className="flex justify-center items-center min-h-screen w-full bg-gray-800 text-white text-center">
          <div>
            <div className="">
              <FontAwesomeIcon 
                icon={faRobot} 
                className="text-emerald-200 text-6xl mb-2"
              />
            </div>
            <h1 className="text-4xl font-bold">
              Welcome to {AI_NAME} - Ligthware AI Support Assistant
            </h1>
            <AuthType authType={auth_type} />
          </div>
        </div>
      </>
    );
  }
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx.req, ctx.res);
  const auth_type = process.env.AUTH_TYPE ?? 'auth0';

  if (!!session) {
    return {
      redirect: {
        destination: "/chat"
      }
    }
  }

  return {
    props: {
      auth_type
    }
  }
}