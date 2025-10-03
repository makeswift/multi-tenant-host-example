import { env } from 'env'

const SUBDOMAIN_TO_API_KEY = {
  default: env.DEFAULT_MAKESWIFT_SITE_API_KEY,
  [env.SITE_A_SUBDOMAIN]: env.SITE_A_MAKESWIFT_SITE_API_KEY,
  [env.SITE_B_SUBDOMAIN]: env.SITE_B_MAKESWIFT_SITE_API_KEY,
}

export function getApiKey(subdomain: string) {
  const apiKey = SUBDOMAIN_TO_API_KEY[subdomain]

  if (!apiKey) {
    throw new Error(
      `Invalid subdomain: ${subdomain}. Only ${Object.keys(SUBDOMAIN_TO_API_KEY).join(', ')} are supported.`
    )
  }

  return apiKey
}

export function isValidTenantId(subdomain: string) {
  return subdomain in SUBDOMAIN_TO_API_KEY
}

export function getSubdomainFromHost(host: string): string {
  if (!host.includes('.')) {
    return 'default'
  }

  return host.split('.').at(0) ?? 'default'
}
