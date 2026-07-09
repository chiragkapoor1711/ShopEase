import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/about",
    "/admin/login",
    "/forgot-password",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Seller routes
    if (pathname.startsWith("/seller")) {
      if (payload.role !== "seller") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // User routes
    if (pathname.startsWith("/dashboard")) {
      if (payload.role !== "user") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();

  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/seller/:path*",
  ],
};