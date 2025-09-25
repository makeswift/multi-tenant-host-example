import { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

import '@/lib/makeswift/components'
import { runtime } from '@/lib/makeswift/runtime'
import { getApiKey } from '@/lib/makeswift/show-id-to-api-key'

async function getShowIdFromSubdomain(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host')

  if (!host) {
    throw new Error('Host is required')
  }

  const subdomain = host.split('.')[0]

  return subdomain
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const showId = await getShowIdFromSubdomain()
  const apiKey = getApiKey(showId)

  return await MakeswiftApiHandler(apiKey, { runtime })(req, res)
}

export { handler as GET, handler as POST, handler as OPTIONS }
