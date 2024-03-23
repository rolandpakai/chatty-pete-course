import { handleAuth, handleLogin } from "lib/auth/auth";

export default function handler(req, res) {
  return handleAuth({
    signup: handleLogin({ authorizationParams: { screen_hint: "signup" }}),
  })(req, res);
}
