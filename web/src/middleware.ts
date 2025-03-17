import { NextResponse } from "next/server";
import { auth } from "../auth";

export default auth((request) => {
  const isLogged = !!request.auth;

  const { pathname } = request.nextUrl;

  const isPrivatePath = pathname.startsWith("/dashboard");

  if (isLogged && !isPrivatePath) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (!isLogged && isPrivatePath) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path", "/sign-in", "/sign-up"],
};
