import { Makeswift } from '@makeswift/runtime/next'

import { getApiKey } from './prefix-to-api.key'
import { runtime } from './runtime'

export const client = new Makeswift(getApiKey('a'), {
  runtime,
})
