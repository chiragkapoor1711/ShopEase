import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

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

    // Admin
    if (pathname.startsWith("/admin")) {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Seller
    if (pathname.startsWith("/seller")) {
      if (payload.role !== "seller") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Customer
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/cart") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/orders") ||
      pathname.startsWith("/addresses")
    ) {
      if (payload.role !== "user") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Shared pages
    if (
      pathname === "/profile" ||
      pathname === "/change-password"
    ) {
      if (!["admin", "seller", "user"].includes(payload.role)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();

  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",

    "/dashboard/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/addresses/:path*",

    "/profile",
    "/change-password",
  ],
};