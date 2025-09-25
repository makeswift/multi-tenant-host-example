import { NextRequest, NextResponse } from 'next/server'

import { isValidTenantId } from './lib/makeswift/tenants'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // get the tenant id from the subdomain
  const tenantId = host.split('.')[0]

  if (!isValidTenantId(tenantId)) {
    return NextResponse.next()
  }

  if (!url.pathname.startsWith('/api/makeswift/')) {
    url.pathname = `/${tenantId}${url.pathname}`
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
