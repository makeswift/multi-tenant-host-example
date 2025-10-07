import { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'

import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

import '@/lib/makeswift/components'
import { runtime } from '@/lib/makeswift/runtime'
import { DEFAULT_TENANT_ID, getApiKey, getSubdomainFromHost } from '@/lib/makeswift/tenants'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''

  // Get the subdomain from the host (e.g., "siteA" from "siteA.localhost:3000")
  const tenantIdFromSubdomain = getSubdomainFromHost(host)

  const apiKey = getApiKey(tenantIdFromSubdomain ?? DEFAULT_TENANT_ID)

  return await MakeswiftApiHandler(apiKey, { runtime })(req, res)
}

export { handler as GET, handler as POST, handler as OPTIONS }
