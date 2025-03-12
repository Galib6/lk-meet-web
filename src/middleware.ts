import { getServerAuthSession } from '@components/auth/lib/utils';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Paths } from 'src/@base/constants/paths';

export default async function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname;

  // check if the path is not in publicPaths then check if the user is authenticated or not, if is not then redirect to login
  if (pathName.startsWith(Paths.meeting.room)) {
    const session = getServerAuthSession(req);
    if (session.isAuthenticate) return;
    return NextResponse.redirect(new URL(`${Paths.auth.login}/?callbackUrl=${req.nextUrl.href}`, req.url), {
      status: 302,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
