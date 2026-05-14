import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'

import { Makeswift, MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { COMPONENT_STYLES_TYPE } from '@/components/component-styles/register'
import '@/lib/makeswift/components'
import { MakeswiftProvider } from '@/lib/makeswift/provider'
import { runtime } from '@/lib/makeswift/runtime'
import { DEFAULT_TENANT_ID, getApiKey, getSubdomainFromHost } from '@/lib/makeswift/tenants'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Multi-Tenant Makeswift Site',
  description: 'A multi-tenant website powered by Makeswift',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const subdomain = getSubdomainFromHost(host) ?? DEFAULT_TENANT_ID
  const client = new Makeswift(getApiKey(subdomain), { runtime })
  const siteVersion = await getSiteVersion()
  const snapshot = await client.getComponentSnapshot('component-styles', {
    siteVersion,
  })

  return (
    <html lang="en">
      <body className={inter.className}>
        <MakeswiftProvider siteVersion={siteVersion}>
          {snapshot && (
            <MakeswiftComponent
              label="Component Styles"
              snapshot={snapshot}
              type={COMPONENT_STYLES_TYPE}
            />
          )}
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  )
}
