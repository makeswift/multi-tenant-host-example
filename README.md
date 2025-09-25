# Multi-Tenant Host Example

This multi-tenant setup uses subdomain-based routing where each tenant has its own Makeswift site:
- Site A uses API key for subdomain 'a' 
- Site B uses API key for subdomain 'b'

The API keys are configured in `lib/makeswift/show-id-to-api-key.ts`.


Finally, configure your Makeswift sites' host URLs:
- Site A: Set host URL to `http://a.localhost:3000`
- Site B: Set host URL to `http://b.localhost:3000`

Your site's host URL is found in your Makeswift site's settings.

