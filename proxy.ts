import { NextResponse } from "next/server";

const robotsHeader = {
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export function proxy() {
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", robotsHeader["X-Robots-Tag"]);
  return response;
}

export const config = {
  matcher: "/leads/:path*",
};
