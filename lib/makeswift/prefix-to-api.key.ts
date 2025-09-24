import { match } from 'ts-pattern'

export function getApiKey(prefix: string): string {
  return match(prefix)
    .with('a', () => 'd8c531d6-d021-478f-8516-1daaf07abc22')
    .with('b', () => '873f8954-b970-402e-ae58-097f0d505c7c')
    .otherwise(() => {
      throw new Error(`Invalid prefix: ${prefix}. Only 'A' is supported.`)
    })
}
