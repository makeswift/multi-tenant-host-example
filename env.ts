import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // The root domain the app is served from (e.g. "localhost" in development,
    // "example.com" in production). Used to distinguish a tenant subdomain from
    // the bare root domain, which maps to the default tenant.
    ROOT_DOMAIN: z.string().min(1),
    DEFAULT_MAKESWIFT_SITE_API_KEY: z.string().min(1),
    SITE_A_SUBDOMAIN: z.string().min(1),
    SITE_A_MAKESWIFT_SITE_API_KEY: z.string().min(1),
    SITE_B_SUBDOMAIN: z.string().min(1),
    SITE_B_MAKESWIFT_SITE_API_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    ROOT_DOMAIN: process.env.ROOT_DOMAIN,
    DEFAULT_MAKESWIFT_SITE_API_KEY: process.env.DEFAULT_MAKESWIFT_SITE_API_KEY,
    SITE_A_SUBDOMAIN: process.env.SITE_A_SUBDOMAIN,
    SITE_A_MAKESWIFT_SITE_API_KEY: process.env.SITE_A_MAKESWIFT_SITE_API_KEY,
    SITE_B_SUBDOMAIN: process.env.SITE_B_SUBDOMAIN,
    SITE_B_MAKESWIFT_SITE_API_KEY: process.env.SITE_B_MAKESWIFT_SITE_API_KEY,
  },
})
