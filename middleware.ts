import { NextRequest, NextResponse } from 'next/server'

import { DEFAULT_TENANT_ID, getSubdomainFromHost, isValidTenantId } from './lib/makeswift/tenants'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const url = request.nextUrl.clone()

  // Get the subdomain from the host (e.g., "siteA" from "siteA.localhost:3000")
  const subdomain = getSubdomainFromHost(host)

  // url.pathname always starts with a leading slash
  const firstPathSegment = url.pathname.split('/').at(1) ?? null

  // If no subdomain is present, check if the request path is already scoped for
  // a tenant.
  if (subdomain == null) {
    if (firstPathSegment && isValidTenantId(firstPathSegment)) {
      return NextResponse.next()
    }
    url.pathname = `/${DEFAULT_TENANT_ID}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  if (!isValidTenantId(subdomain)) {
    return NextResponse.next()
  }

  if (!url.pathname.startsWith('/api/makeswift/')) {
    url.pathname = `/${subdomain}${url.pathname}`
    return NextResponse.rewrite(url)
  }
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
