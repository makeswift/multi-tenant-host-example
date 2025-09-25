# Makeswift Multi-Tenant Next.js Starter

This multi-tenant setup uses subdomain-based routing with internal path-based mapping for optimal caching:
- Site A: `a.mysite.com/page` → internally maps to `mysite.com/a/page`
- Site B: `b.mysite.com/page` → internally maps to `mysite.com/b/page`

The API keys are configured in `lib/makeswift/show-id-to-api-key.ts`.

## URL Structure

**External URLs (what users see):**
- **Site A pages**: `a.mysite.com/home`, `a.mysite.com/about`, etc.
- **Site B pages**: `b.mysite.com/home`, `b.mysite.com/about`, etc.
- **API endpoints**: `a.mysite.com/api/makeswift/...`, `b.mysite.com/api/makeswift/...`

**Internal URLs (after middleware rewrite):**
- **Site A pages**: `mysite.com/a/home`, `mysite.com/a/about`, etc.
- **Site B pages**: `mysite.com/b/home`, `mysite.com/b/about`, etc.
- **API endpoints**: `mysite.com/api/makeswift/...?tenant=a`, `mysite.com/api/makeswift/...?tenant=b`

## Benefits

This hybrid approach provides:
- **User-friendly subdomains**: Clean URLs like `a.mysite.com/page`
- **ISR Compatible**: Internal path-based structure enables static generation
- **Vercel Edge Cache**: Pages are cached at the edge based on internal URL structure
- **Middleware Rewriting**: Subdomain requests are transparently mapped to path-based routing

Finally, configure your Makeswift sites' host URLs:
- Site A: Set host URL to `http://a.localhost:3000`
- Site B: Set host URL to `http://b.localhost:3000`

Your site's host URL is found in your Makeswift site's settings.

