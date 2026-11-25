import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * THE LOCK ON THE DOOR.
 *
 * Every request passes through here before any page is sent. A visitor may
 * have the front page, the sign-in page and the "ask to join" page. Everything
 * else is for somebody signed in and marked as a member — see src/lib/auth.ts
 * for what that means and how a person becomes one.
 *
 *   not signed in               → the front page (or "not signed in" for /api)
 *   signed in, not a member     → the sign-in page, which says why
 *   temporary password          → /account/password, until they choose their own
 *
 * It fails SHUT. If the Supabase settings are missing on the live site, nobody
 * gets in; the portal is never left open by accident.
 *
 * This file cannot import from src/, so the few rules it needs are repeated
 * here. Keep them in step with src/lib/auth.ts.
 */

const PUBLIC = new Set(['/', '/login', '/join']);
const PASSWORD_PAGE = '/account/password';

function isPublic(path: string) {
  return (
    PUBLIC.has(path) ||
    path === '/api/join' ||
    // The wind panel's frame. It is a wrapper round the weather station's own
    // widget and holds nothing of the club's; it is sandboxed, so it may not
    // carry the member's sign-in with it.
    path.startsWith('/embed/')
  );
}

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const configured = Boolean(url && key);
  const open =
    process.env.NEXT_PUBLIC_PORTAL_OPEN === 'true' ||
    (!configured && process.env.NODE_ENV !== 'production');

  if (open) return NextResponse.next();

  const path = request.nextUrl.pathname;
  const api = path.startsWith('/api/');

  const away = (to: string, why?: string) => {
    if (api) {
      return NextResponse.json(
        { ok: false, code: 'not_signed_in', message: 'Sign in to the portal first.' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    const target = request.nextUrl.clone();
    target.pathname = to;
    target.search = why ? `?why=${why}` : '';
    const res = NextResponse.redirect(target);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  };

  if (!configured) return isPublic(path) ? NextResponse.next() : away('/');

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

  // Asks Supabase who this is, every time — so a member whose access has been
  // taken away is shut out on their very next click, not when a token expires.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const member = user?.app_metadata?.portal_member === true;
  const temporary = user?.app_metadata?.must_change_password === true;

  if (isPublic(path)) {
    // A member who is already in has no use for the front door.
    if (member && !temporary && (path === '/' || path === '/login' || path === '/join')) {
      const target = request.nextUrl.clone();
      target.pathname = '/dashboard';
      target.search = '';
      return NextResponse.redirect(target);
    }
    return response;
  }

  if (!user) return away('/');
  if (!member) return away('/login', 'not-a-member');

  if (temporary && path !== PASSWORD_PAGE && path !== '/api/account/password') {
    return away(PASSWORD_PAGE);
  }

  // What a member sees is theirs: nothing between here and their browser
  // should keep a copy to show the next person.
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
