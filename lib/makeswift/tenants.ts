import { env } from 'env'

export const DEFAULT_TENANT_ID = 'default'

const SUBDOMAIN_TO_API_KEY = {
  [DEFAULT_TENANT_ID]: env.DEFAULT_MAKESWIFT_SITE_API_KEY,
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

/**
 * Extracts the subdomain from a host header relative to the configured
 * `ROOT_DOMAIN`. Returns `null` when the host is the bare root domain or does
 * not belong to it, both of which resolve to the default tenant.
 *
 * Examples (ROOT_DOMAIN="example.com"):
 *   "example.com"        -> null   (apex, no subdomain)
 *   "siteA.example.com"  -> "siteA"
 *   "www.example.com"    -> "www"  (unknown subdomain; resolves to default later)
 *   "other.com"          -> null   (not under the root domain)
 */
export function getSubdomainFromHost(host: string): string | null {
  // Strip the port (e.g. "siteA.localhost:3000" -> "siteA.localhost").
  const hostname = host.split(':')[0]

  // The bare root domain has no subdomain.
  if (hostname === env.ROOT_DOMAIN) {
    return null
  }

  // A tenant host looks like "<subdomain>.<ROOT_DOMAIN>".
  const suffix = `.${env.ROOT_DOMAIN}`
  if (hostname.endsWith(suffix)) {
    const subdomain = hostname.slice(0, -suffix.length)
    return subdomain.length > 0 ? subdomain : null
  }

  // Host does not match the configured root domain.
  return null
}

/**
 * Resolves a host header to a known tenant id, falling back to the default
 * tenant for the root domain or any unrecognized host/subdomain. Unlike
 * `getApiKey`, this never throws, so callers can safely derive a tenant from an
 * arbitrary host (e.g. the apex domain or `www`).
 */
export function getTenantFromHost(host: string): string {
  const subdomain = getSubdomainFromHost(host)

  return subdomain != null && isValidTenantId(subdomain) ? subdomain : DEFAULT_TENANT_ID
}
