import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Route protection.
 *
 * While NEXT_PUBLIC_PREVIEW_OPEN is "true", or Supabase env vars are missing,
 * everything is open so the committee can review the site before accounts
 * exist. Set NEXT_PUBLIC_PREVIEW_OPEN=false in Vercel before real member
 * content goes in.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const previewOpen = process.env.NEXT_PUBLIC_PREVIEW_OPEN === 'true' || !url || !key;

  if (previewOpen) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)'],
};
