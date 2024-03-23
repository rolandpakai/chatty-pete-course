import Link from "next/link";

export const LoginSignup = () => {
  return (
    <>
      <p className="text-lg mt-2">
        Log in with your account to continue
      </p>
      <div className="flex justify-center gap-3 mt-4">
        <Link
          href="/api/auth/login"
          className="btn"
        >
          Login
        </Link>
        <Link
          href="/api/auth/signup"
          className="btn"
        >
          Signup
        </Link>
      </div>
    </>
  )
};
