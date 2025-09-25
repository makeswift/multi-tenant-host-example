import { notFound } from 'next/navigation'

import { Makeswift, Page as MakeswiftPage } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { getApiKey } from '@/lib/makeswift/prefix-to-api.key'
import { runtime } from '@/lib/makeswift/runtime'

// export async function generateStaticParams() {
//   const pages = await client.getPages().toArray()

//   return pages.map(page => ({
//     path: page.path.split('/').filter(segment => segment !== ''),
//   }))
// }

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const pathSegments = (await params)?.path ?? []

  if (pathSegments.length === 0) return notFound()

  const firstPathSegment = pathSegments.at(0)!

  const makeswiftClient = new Makeswift(getApiKey(firstPathSegment), {
    runtime,
  })

  const path = '/' + pathSegments.join('/')
  const snapshot = await makeswiftClient.getPageSnapshot(path, {
    siteVersion: getSiteVersion(),
  })

  if (snapshot == null) return notFound()

  return <MakeswiftPage snapshot={snapshot} />
}
