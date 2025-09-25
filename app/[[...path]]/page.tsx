import { notFound } from 'next/navigation'

import { Makeswift, Page as MakeswiftPage } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { runtime } from '@/lib/makeswift/runtime'
import { getApiKey } from '@/lib/makeswift/show-id-to-api-key'

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const pathSegments = (await params)?.path ?? []

  if (pathSegments.length === 0) return notFound()

  // First segment is the tenant ID (a, b, etc.)
  const tenantId = pathSegments[0]
  const remainingPath = pathSegments.slice(1)
  const makeswiftPath = '/' + remainingPath.join('/')

  const makeswiftClient = new Makeswift(getApiKey(tenantId), {
    runtime,
  })

  const snapshot = await makeswiftClient.getPageSnapshot(makeswiftPath, {
    siteVersion: getSiteVersion(),
  })

  if (snapshot == null) return notFound()

  return <MakeswiftPage snapshot={snapshot} />
}
