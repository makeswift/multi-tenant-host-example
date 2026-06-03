import { NextRequest, NextResponse } from 'next/server'

import { DEFAULT_TENANT_ID, getSubdomainFromHost, isValidTenantId } from './lib/makeswift/tenants'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const url = request.nextUrl.clone()

  // Resolve the tenant from the subdomain (e.g. "siteA" from
  // "siteA.localhost:3000"). The bare root domain and any unrecognized host
  // (e.g. "www" or a platform preview URL) fall back to the default tenant.
  const subdomain = getSubdomainFromHost(host)
  const tenant = subdomain != null && isValidTenantId(subdomain) ? subdomain : DEFAULT_TENANT_ID

  // Rewrite so the tenant is always the first path segment; the catch-all route
  // reads it from there. Makeswift API routes are excluded via `config.matcher`.
  url.pathname = `/${tenant}${url.pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
