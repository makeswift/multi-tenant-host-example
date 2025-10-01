import { notFound } from 'next/navigation'

import { Makeswift, Page as MakeswiftPage } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { runtime } from '@/lib/makeswift/runtime'
import { getApiKey } from '@/lib/makeswift/tenants'

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const pathSegments = (await params)?.path ?? []

  if (pathSegments.length === 0) return notFound()

  // First segment is the subdomain (siteA, siteB, etc.)
  const subdomain = pathSegments.at(0) ?? 'default'
  const remainingPath = pathSegments.slice(1)
  const makeswiftPath = '/' + remainingPath.join('/')

  const makeswiftClient = new Makeswift(getApiKey(subdomain), {
    runtime,
  })

  const snapshot = await makeswiftClient.getPageSnapshot(makeswiftPath, {
    siteVersion: getSiteVersion(),
  })

  if (snapshot == null) return notFound()

  return <MakeswiftPage snapshot={snapshot} />
}
