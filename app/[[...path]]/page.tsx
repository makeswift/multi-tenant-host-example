import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { Makeswift, Page as MakeswiftPage } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { runtime } from '@/lib/makeswift/runtime'
import { getApiKey } from '@/lib/makeswift/show-id-to-api-key'

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const pathSegments = (await params)?.path ?? []
  const path = '/' + pathSegments.join('/')

  // Get subdomain from host header
  const headersList = await headers()
  const host = headersList.get('host')

  if (!host) {
    throw new Error('Host header is required')
  }

  const subdomain = host.split('.')[0]
  const makeswiftClient = new Makeswift(getApiKey(subdomain), {
    runtime,
  })

  const snapshot = await makeswiftClient.getPageSnapshot(path, {
    siteVersion: getSiteVersion(),
  })

  if (snapshot == null) return notFound()

  return <MakeswiftPage snapshot={snapshot} />
}
