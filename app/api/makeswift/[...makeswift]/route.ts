import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

import '@/lib/makeswift/components'
import { runtime } from '@/lib/makeswift/runtime'
import { getApiKey, getTenantFromHost } from '@/lib/makeswift/tenants'

async function handler(
  req: NextRequest,
  context: { params: Promise<{ makeswift: string[] }> },
) {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''

  // Resolve the tenant from the host (e.g., "siteA" from "siteA.localhost:3000"),
  // falling back to the default tenant for the root domain or unknown hosts.
  const apiKey = getApiKey(getTenantFromHost(host))

  return await MakeswiftApiHandler(apiKey, { runtime })(req, context)
}

export { handler as GET, handler as POST, handler as OPTIONS }
