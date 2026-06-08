# Multi-Tenant Makeswift Implementation

This project demonstrates how to implement multi-tenancy in a Next.js application using Makeswift, where different subdomains are mapped to different Makeswift sites via their respective API keys.

It uses **subdomain-based routing**: the subdomain identifies the tenant (e.g. `siteA.localhost:3000` serves Site A), and the bare root domain (`localhost:3000`) serves the default tenant. Subdomain URLs are also what the Makeswift builder requires to connect to a site.

## Prerequisites

This guide assumes you've set up a Makeswift site before. If you haven't, start with the [Makeswift quickstart](https://docs.makeswift.com/developer/docs/get-started/quickstart).

You'll need:

- **One Makeswift site per tenant** (this example uses three: a default plus Site A and Site B). Each site has its own content and its own **Site API key**, found in the Makeswift dashboard under the site's settings.
- **Node.js** and **pnpm** (`pnpm@9` — see `packageManager` in [package.json](package.json)).

## Quickstart

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Create your env file** by copying the example, then fill in each Site API key:

   ```bash
   cp .env.example .env.local
   ```

   ```bash
   ROOT_DOMAIN=localhost                 # "localhost" in dev; your real domain (e.g. "example.com") in prod
   DEFAULT_MAKESWIFT_SITE_API_KEY=...    # used for the bare root domain
   SITE_A_SUBDOMAIN=siteA                # just the subdomain part
   SITE_A_MAKESWIFT_SITE_API_KEY=...
   SITE_B_SUBDOMAIN=siteB
   SITE_B_MAKESWIFT_SITE_API_KEY=...
   ```

3. **Connect each Makeswift site to its subdomain.** In each site's host settings in the Makeswift dashboard, set the host URL to that tenant's subdomain so the builder loads the right content:

   - Default site → `http://localhost:3000`
   - Site A → `http://siteA.localhost:3000`
   - Site B → `http://siteB.localhost:3000`

4. **Run the development server:**

   ```bash
   pnpm dev
   ```

5. **Visit each tenant** in your browser:

   - Default tenant: `http://localhost:3000`
   - Site A: `http://siteA.localhost:3000`
   - Site B: `http://siteB.localhost:3000`

   > Most browsers (Chrome, Firefox, Edge) resolve `*.localhost` to `127.0.0.1` automatically. Safari does not — see [Resolving subdomains on Safari](#resolving-subdomains-on-safari-optional) below.

## How It Works

A request flows through the system in four steps:

1. **Detect the tenant** from the subdomain, resolved against the configured `ROOT_DOMAIN`.
2. **Resolve to a Makeswift site** by mapping the subdomain to the appropriate Site API key.
3. **Rewrite the URL** so the resolved tenant is the first path segment.
4. **Serve tenant-specific content** from the correct Makeswift site.

```
1. User visits: siteA.localhost:3000/products
   │
   ├─> Middleware extracts "siteA" from the host header
   │
   ├─> Resolves the tenant (falls back to "default" for the root
   │   domain or any unknown host)
   │
   ├─> Rewrites URL to: /siteA/products
   │
   └─> Routes to app/[[...path]]/page.tsx

2. Page component receives: params.path = ['siteA', 'products']
   │
   ├─> Extracts tenantId = 'siteA' from the first path segment
   │
   ├─> Calls getApiKey('siteA') → Site A's API key
   │
   ├─> Creates a Makeswift client with Site A's API key
   │
   ├─> Fetches the page snapshot for '/products' from Site A
   │
   └─> Renders the page with tenant-specific content
```

## Key Files

### `env.ts` — Environment configuration

Defines and validates the environment variables for each tenant using [`@t3-oss/env-nextjs`](https://github.com/t3-oss/t3-env). Each tenant needs a subdomain identifier and a Makeswift Site API key. The validated `env` object is consumed throughout the app. See [env.ts](env.ts).

### `lib/makeswift/tenants.ts` — Subdomain-to-API-key mapping

The core of the multi-tenancy logic. It maps subdomains to Site API keys and exposes helpers for resolving a tenant from a host. See [lib/makeswift/tenants.ts](lib/makeswift/tenants.ts).

- `SUBDOMAIN_TO_API_KEY` — the subdomain → API key map. `DEFAULT_TENANT_ID` (`'default'`) is used for the bare root domain and any unrecognized host.
- `getApiKey(subdomain)` — returns the API key for a subdomain, and **throws** if it isn't a known tenant.
- `getTenantFromHost(host)` — resolves a host header to a known tenant id, falling back to `default` and **never throwing**. This is why the API route can safely derive a tenant from an arbitrary host (the apex domain, `www`, a preview URL, etc.).
- `getSubdomainFromHost(host)` / `isValidTenantId(subdomain)` — supporting helpers used by the middleware.

### `middleware.ts` — Request interception & URL rewriting

Rewrites incoming URLs so the resolved tenant is always the first path segment. See [middleware.ts](middleware.ts).

1. **Extracts the subdomain** from the `host` header relative to `ROOT_DOMAIN` (e.g. `siteA.localhost:3000` → `siteA`; the bare `ROOT_DOMAIN` has no subdomain).
2. **Resolves the tenant:** a valid subdomain is used as-is; the bare root domain and any unrecognized host (e.g. `www`, a platform preview URL) fall back to the `default` tenant — so the page route never throws.
3. **Rewrites the URL** by prepending the resolved tenant to the pathname.
4. **Skips Makeswift API routes and static files** via `config.matcher` (the API handler resolves the tenant from the host itself).

**Examples** (with `ROOT_DOMAIN=localhost`):

| Request                           | Rewritten to        |
| --------------------------------- | ------------------- |
| `siteA.localhost:3000/products`   | `/siteA/products`   |
| `localhost:3000/products`         | `/default/products` |
| `www.localhost:3000/products`     | `/default/products` |

### `app/[[...path]]/page.tsx` — Main page handler

This catch-all route renders Makeswift pages for the appropriate tenant. See [app/[[...path]]/page.tsx](app/[[...path]]/page.tsx).

1. Reads the tenant id from the first path segment (inserted by middleware).
2. Reconstructs the Makeswift path by removing that segment.
3. Creates a tenant-specific Makeswift client via `getApiKey(subdomain)`.
4. Fetches the page snapshot for the requested path from the correct site.
5. Renders the page, or returns a 404 if no snapshot is found.

### `app/api/makeswift/[...makeswift]/route.ts` — Makeswift API handler

Handles Makeswift's draft mode and preview functionality so you can use the builder. These requests are excluded from the middleware, so the handler resolves the tenant from the host itself via `getTenantFromHost`. See [app/api/makeswift/[...makeswift]/route.ts](app/api/makeswift/[...makeswift]/route.ts).

## Key Benefits

- **Unified codebase, multiple sites** — a single deployment serves any number of tenant sites, with one set of components registered once and available to all tenants.
- **Content isolation** — each tenant's pages and assets live in a separate Makeswift site, isolated at the API-key level, while sharing the same component library.
- **Scales horizontally** — the same infrastructure handles any number of tenants from a single hosting environment.

## Adding a New Tenant

Adding a tenant is mostly configuration, plus a small wiring change in two files:

1. **Add environment variables** in `.env.local` (and your hosting platform):

   ```bash
   SITE_C_SUBDOMAIN=siteC
   SITE_C_MAKESWIFT_SITE_API_KEY=your-new-api-key
   ```

2. **Register them in [env.ts](env.ts)** (both `server` and `runtimeEnv`):

   ```typescript
   server: {
     // ... existing entries
     SITE_C_SUBDOMAIN: z.string().min(1),
     SITE_C_MAKESWIFT_SITE_API_KEY: z.string().min(1),
   },
   runtimeEnv: {
     // ... existing entries
     SITE_C_SUBDOMAIN: process.env.SITE_C_SUBDOMAIN,
     SITE_C_MAKESWIFT_SITE_API_KEY: process.env.SITE_C_MAKESWIFT_SITE_API_KEY,
   }
   ```

3. **Add the mapping in [lib/makeswift/tenants.ts](lib/makeswift/tenants.ts):**

   ```typescript
   const SUBDOMAIN_TO_API_KEY = {
     // ... existing entries
     [env.SITE_C_SUBDOMAIN]: env.SITE_C_MAKESWIFT_SITE_API_KEY,
   }
   ```

4. **Connect the new site's host URL** in the Makeswift dashboard (e.g. `http://siteC.localhost:3000`).

## Production Deployment

The same logic works in production with two changes:

- **Set `ROOT_DOMAIN` to your real domain** (e.g. `ROOT_DOMAIN=example.com`). Tenant subdomains are resolved relative to this value, and the bare apex domain maps to the default tenant.
- **Point each tenant subdomain at your deployment.** Configure wildcard DNS (`*.example.com`) or an individual DNS record per tenant so `siteA.example.com`, `siteB.example.com`, etc. all reach the same app. Update each Makeswift site's host URL to its production subdomain.

## Resolving Subdomains on Safari (Optional)

Chrome, Firefox, and Edge resolve `*.localhost` to `127.0.0.1` automatically, but Safari does not. To make the tenant subdomains work in Safari, map them explicitly in `/etc/hosts`. This keeps `ROOT_DOMAIN=localhost`, so no other config changes:

1. **Edit `/etc/hosts` with sudo:**

   ```bash
   sudo vim /etc/hosts
   ```

2. **Add an entry per subdomain:**

   ```
   127.0.0.1    siteA.localhost
   127.0.0.1    siteB.localhost
   ```

3. **Visit** `http://siteA.localhost:3000`, `http://siteB.localhost:3000`, etc.

## Limitations

- **Subdomain-based only.** Tenants are distinguished by subdomain, not by URL path. The first path segment is reserved internally for the resolved tenant. If you need to distinguish tenants by path instead, see the [path-based multi-tenant example](https://github.com/makeswift/multi-tenant-example-path).
- **Adding a tenant requires a small code change** to [env.ts](env.ts) and [lib/makeswift/tenants.ts](lib/makeswift/tenants.ts), in addition to environment variables — see [Adding a New Tenant](#adding-a-new-tenant).
- **Browser support for `*.localhost`** varies; Safari requires the [`/etc/hosts` approach](#resolving-subdomains-on-safari-optional).
