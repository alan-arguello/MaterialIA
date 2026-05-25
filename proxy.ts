import { type NextRequest, NextResponse } from "next/server";

const dashboardUser = process.env.LEADS_DASHBOARD_USER ?? "admin";
const dashboardPassword = process.env.LEADS_DASHBOARD_PASSWORD;

const robotsHeader = {
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

const unauthorized = () =>
  new NextResponse("Autenticación requerida.", {
    status: 401,
    headers: {
      ...robotsHeader,
      "WWW-Authenticate": 'Basic realm="Material IA Leads"',
    },
  });

const decodeBasicAuth = (authorization: string) => {
  if (!authorization.startsWith("Basic ")) {
    return undefined;
  }

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return undefined;
    }

    return {
      user: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return undefined;
  }
};

export function proxy(request: NextRequest) {
  if (!dashboardPassword) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Configura LEADS_DASHBOARD_PASSWORD.", {
        status: 503,
        headers: robotsHeader,
      });
    }

    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", robotsHeader["X-Robots-Tag"]);
    return response;
  }

  const credentials = decodeBasicAuth(
    request.headers.get("authorization") ?? "",
  );

  if (
    credentials?.user !== dashboardUser ||
    credentials.password !== dashboardPassword
  ) {
    return unauthorized();
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", robotsHeader["X-Robots-Tag"]);
  return response;
}

export const config = {
  matcher: "/leads/:path*",
};
