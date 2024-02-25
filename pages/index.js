import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export default function Home() {

  return (
    <>
      <Head>
        <title>Chatty Pete - Login or Signup</title>
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
            Welcome to Chatty Pete
          </h1>
          <p className="text-lg mt-2">
            Log in with your account to continue
          </p>
          <div className="flex justify-center gap-3 mt-4">
            {
              <>
                <Link 
                  href="/chat" 
                  className="btn"
                >
                    Start
                </Link>
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  return {
    props: {}
  }
}
