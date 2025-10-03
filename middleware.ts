import { NextRequest, NextResponse } from 'next/server'

import { getSubdomainFromHost, isValidTenantId } from './lib/makeswift/tenants'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const url = request.nextUrl.clone()

  // Get the subdomain from the host (e.g., "siteA" from "siteA.localhost:3000")
  const subdomain = getSubdomainFromHost(host)

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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
