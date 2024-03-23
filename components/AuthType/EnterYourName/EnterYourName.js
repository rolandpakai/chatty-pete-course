import Link from "next/link";
import { useState } from "react";

export const EnterYourName = () => {
  const [name, setName] = useState('');

  return (
    <>
      <p className="text-lg mt-2">
        Enter Your name to continue
      </p>
      <div className="flex justify-center gap-3 mt-4">
          <input 
            type="text" 
            name="name" 
            placeholder="Enter your name"
            className=""
            onChange={(e) => setName(e.target.value)}
          />
          <Link 
            href={`/api/auth/signup?name=${name}`}
            className="btn"
          >
            Start
          </Link>
      </div>
    </>
  )
};
