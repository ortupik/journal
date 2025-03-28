import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Assuming you're using next-auth

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const path = req.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/signup' || path === '/';

  if (isPublicPath) {
    if (token && (path === '/login' || path === '/signup')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*'
  ]
};