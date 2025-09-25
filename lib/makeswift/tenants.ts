import { match } from 'ts-pattern'

const API_KEYS = {
  a: 'd8c531d6-d021-478f-8516-1daaf07abc22',
  b: '873f8954-b970-402e-ae58-097f0d505c7c',
} as const

export function getApiKey(tenantId: string): string {
  return match(tenantId)
    .with('a', () => API_KEYS.a)
    .with('b', () => API_KEYS.b)
    .otherwise(() => {
      throw new Error(`Invalid tenantId: ${tenantId}. Only 'a' and 'b' are supported.`)
    })
}

export function isValidTenantId(tenantId: string): boolean {
  return Object.keys(API_KEYS).includes(tenantId)
}
