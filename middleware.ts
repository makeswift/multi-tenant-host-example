import { NextRequest, NextResponse } from 'next/server'

import { unstable_isDraftModeRequest } from '@makeswift/runtime/next/middleware'

export function middleware(request: NextRequest) {
  console.log('middleware running!!!')
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  const subdomain = host.split('.')[0]

  if (url.pathname.startsWith('/api/makeswift/') || unstable_isDraftModeRequest(request)) {
    console.log('api route!!!')
    console.log('subdomain', subdomain)

    const response = NextResponse.next()
    response.headers.set('x-tenant-id', subdomain)

    return response
  } else {
    const newPath = `/${subdomain}${url.pathname}`
    url.pathname = newPath
  }

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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
