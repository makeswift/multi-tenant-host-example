import { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

import '@/lib/makeswift/components'
import { runtime } from '@/lib/makeswift/runtime'
import { getApiKey } from '@/lib/makeswift/show-id-to-api-key'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  console.log('tenantId in api route', tenantId, req.url)
  if (!tenantId) {
    throw new Error('Tenant ID is required in x-tenant-id header')
  }

  const apiKey = getApiKey(tenantId)

  return await MakeswiftApiHandler(apiKey, { runtime })(req, res)
}

export { handler as GET, handler as POST, handler as OPTIONS }
