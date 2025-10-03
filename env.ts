import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DEFAULT_MAKESWIFT_SITE_API_KEY: z.string().min(1),
    SITE_A_SUBDOMAIN: z.string().min(1),
    SITE_A_MAKESWIFT_SITE_API_KEY: z.string().min(1),
    SITE_B_SUBDOMAIN: z.string().min(1),
    SITE_B_MAKESWIFT_SITE_API_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    DEFAULT_MAKESWIFT_SITE_API_KEY: process.env.DEFAULT_MAKESWIFT_SITE_API_KEY,
    SITE_A_SUBDOMAIN: process.env.SITE_A_SUBDOMAIN,
    SITE_A_MAKESWIFT_SITE_API_KEY: process.env.SITE_A_MAKESWIFT_SITE_API_KEY,
    SITE_B_SUBDOMAIN: process.env.SITE_B_SUBDOMAIN,
    SITE_B_MAKESWIFT_SITE_API_KEY: process.env.SITE_B_MAKESWIFT_SITE_API_KEY,
  },
})
