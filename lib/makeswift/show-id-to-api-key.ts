import { match } from 'ts-pattern'

const API_KEYS = {
  a: 'd8c531d6-d021-478f-8516-1daaf07abc22',
  b: '873f8954-b970-402e-ae58-097f0d505c7c',
} as const

export function getApiKey(prefix: string): string {
  return match(prefix)
    .with('a', () => API_KEYS.a)
    .with('b', () => API_KEYS.b)
    .otherwise(() => {
      throw new Error(`Invalid prefix: ${prefix}. Only 'a' and 'b' are supported.`)
    })
}

export function getAllApiKeys(): string[] {
  return Object.values(API_KEYS)
}

export function isValidApiKey(apiKey: string): boolean {
  return getAllApiKeys().includes(apiKey)
}
