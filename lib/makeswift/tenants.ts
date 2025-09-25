const TENANT_ID_TO_API_KEY = {
  a: 'd8c531d6-d021-478f-8516-1daaf07abc22',
  b: '873f8954-b970-402e-ae58-097f0d505c7c',
} as const

export function getApiKey(tenantId: string): string {
  if (!isValidTenantId(tenantId)) {
    throw new Error(
      `Invalid tenantId: ${tenantId}. Only ${Object.keys(TENANT_ID_TO_API_KEY).join(', ')} are supported.`
    )
  }

  return TENANT_ID_TO_API_KEY[tenantId as keyof typeof TENANT_ID_TO_API_KEY]
}

export function isValidTenantId(tenantId: string): boolean {
  return tenantId in TENANT_ID_TO_API_KEY
}
