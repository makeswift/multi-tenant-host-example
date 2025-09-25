import { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

import '@/lib/makeswift/components'
import { runtime } from '@/lib/makeswift/runtime'
import { getApiKey } from '@/lib/makeswift/show-id-to-api-key'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const subdomain = host.split('.')[0]

  console.log(`API Route handler invoked. URL: ${req.url}, Host: ${host}, Subdomain: ${subdomain}`)

  const apiKey = getApiKey(subdomain)

  return await MakeswiftApiHandler(apiKey, { runtime })(req, res)
}

export { handler as GET, handler as POST, handler as OPTIONS }
