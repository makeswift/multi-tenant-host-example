import { NextRequest, NextResponse } from 'next/server'

import { isValidSubdomain } from './lib/makeswift/show-id-to-api-key'

// import { unstable_isDraftModeRequest } from '@makeswift/runtime/next/middleware'

export function middleware(request: NextRequest) {
  console.log('middleware running!!!')
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  const subdomain = host.split('.')[0]

  if (!isValidSubdomain(subdomain)) {
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
