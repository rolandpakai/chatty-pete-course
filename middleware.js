import { withMiddlewareAuthRequired } from "lib/auth/edge";

export default withMiddlewareAuthRequired();

export const config = {
  matcher: ['/api/chat/:path*', '/chat/:path*']
};