import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('middleware running!!!')
  const host = request.headers.get('host') || ''
  const isUsingDraftMode = request.nextUrl.searchParams.get('x-makeswift-draft-mode') != null
  const url = request.nextUrl.clone()

  // Extract subdomain (e.g., 'a' from 'a.mysite.com')
  const subdomain = host.split('.')[0]

  // Skip if no subdomain or if it's already a path-based request
  if (subdomain === 'www' || subdomain === 'localhost' || subdomain === host) {
    return NextResponse.next()
  }

  // Handle API routes: a.mysite.com/api/makeswift/endpoint -> mysite.com/api/makeswift/endpoint?tenant=a
  if (url.pathname.startsWith('/api/makeswift/') || isUsingDraftMode) {
    console.log('api route!!!')
    console.log('subdomain', subdomain)

    // Add tenant as a header instead of query param
    const response = NextResponse.next()
    response.headers.set('x-tenant-id', subdomain)
    console.log('Setting header x-tenant-id to:', subdomain)

    return response
  } else {
    // Handle page routes: a.mysite.com/about -> mysite.com/a/about
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
