# Multi-Tenant Makeswift Implementation

This project demonstrates how to implement multi-tenancy in a Next.js application using Makeswift, where different domains (or subdomains) are mapped to different Makeswift sites via their respective API keys.

## 🏗️ Architecture Overview

The multi-tenancy system supports **two routing approaches**:

### Subdomain-Based Routing

- `siteA.localhost:3000`
- **Required for the Makeswift builder**

### Path-Based Routing

- `localhost:3000/siteA`
- **Works for page navigation and public viewing**

Both approaches are equivalent for rendering pages, but **the Makeswift builder requires subdomain-based URLs** to function correctly.

### How It Works

1. **Detecting the tenant** from either the subdomain or the first path segment
2. **Mapping the tenant identifier** to the appropriate Makeswift site API key
3. **Rewriting URLs** to include the tenant identifier in the routing
4. **Serving tenant-specific content** from the correct Makeswift site

### When to Use Each Approach

**Use Subdomain-Based Routing (`siteA.localhost:3000`) when:**

- Working in the Makeswift builder (required)
- Setting up the Makeswift host URL in your site settings

**Use Path-Based Routing (`localhost:3000/siteA`) when:**

- Routing to published pages

## Key Benefits

This multi-tenant architecture provides several advantages:

### Unified Codebase, Multiple Sites

- **Single deployment** serves unlimited tenant sites
- **One set of components** registered once, available to all tenants
- **Centralized updates** - deploy new features and components to all sites simultaneously
- **Reduced maintenance** - manage one codebase instead of multiple separate projects

### Content Isolation with Shared Infrastructure

- **Complete content separation** - each tenant's pages, images, and assets are stored in separate Makeswift sites
- **Independent content management** - tenants can manage their own content without affecting others
- **Shared component library** - all tenants use the same components but with their own unique content and branding
- **API key-based isolation** - content isolation is enforced at the Makeswift API level

### Easy Scalability

- **Add new tenants** by simply adding environment variables (no code changes required)
- **Horizontal scaling** - the same infrastructure handles any number of tenants
- **Potentially cost efficient** - single hosting environment for multiple sites

## 📁 Key Files

### 1. `env.ts` - Environment Configuration

This file defines and validates the environment variables for each tenant's subdomain and Makeswift API key.

**What it does:**

- Uses `@t3-oss/env-nextjs` for type-safe environment variables
- Validates that each site has both a subdomain and a Makeswift API key
- Exposes the `env` object for use throughout the application

**Required Environment Variables:**

```bash
DEFAULT_MAKESWIFT_SITE_API_KEY=your-default-api-key  # Used when no subdomain is present (e.g., "localhost:3000")
SITE_A_SUBDOMAIN=siteA        # Just the subdomain part (e.g., "siteA" from "siteA.localhost")
SITE_A_MAKESWIFT_SITE_API_KEY=your-api-key-for-site-a
SITE_B_SUBDOMAIN=siteB        # Just the subdomain part (e.g., "siteB" from "siteB.localhost")
SITE_B_MAKESWIFT_SITE_API_KEY=your-api-key-for-site-b
```

---

### 2. `lib/makeswift/tenants.ts` - Subdomain-to-API-Key Mapping

This is the **core of the multi-tenancy logic**, mapping subdomains to their Makeswift API keys.

**The 'default' tenant** is used when no subdomain is detected, either from the domain or the path.

**To add a new tenant:** Simply add new environment variables in `env.ts` and extend the `SUBDOMAIN_TO_API_KEY` object.

---

### 3. `middleware.ts` - Request Interception & URL Rewriting

The middleware intercepts all incoming requests and rewrites URLs to include the tenant identifier. It supports both **subdomain-based** and **path-based** routing.

**What it does:**

1. **Extracts the subdomain** from the `host` header (e.g., `siteA.localhost:3000` → `siteA`)
2. **If no subdomain is present:**
   - Checks if the first path segment is a valid tenant ID
   - If valid (e.g., `/siteA/products`), allows the request to continue
   - If not valid (e.g., `/products`), rewrites to `/default/products`
3. **If a subdomain is present:**
   - Validates the tenant using `isValidTenantId()`
   - Skips rewriting for Makeswift API routes (`/api/makeswift/*`)
   - Rewrites the URL by prepending the subdomain to the pathname
4. **Skips static files** like favicon.ico and Next.js internal routes

**Examples:**

- **Subdomain:** `siteA.localhost:3000/products` → rewrites to `/siteA/products`
- **Path:** `localhost:3000/siteA/products` → no rewrite needed (already includes tenant)
- **Default:** `localhost:3000/products` → rewrites to `/default/products`
- **Makeswift API:** `siteA.localhost:3000/api/makeswift/...` → no rewrite (API handles subdomain extraction)

---

### 4. `app/[[...path]]/page.tsx` - Main Page Handler

This catch-all route handler renders Makeswift pages for the appropriate tenant.

**What it does:**

1. **Extracts the subdomain** from the first path segment (inserted by middleware)
2. **Reconstructs the Makeswift path** by removing the subdomain from the URL
3. **Creates a tenant-specific Makeswift client** using `getApiKey(subdomain)`
4. **Fetches the page snapshot** for the requested path from the correct Makeswift site
5. **Renders the Makeswift page** or returns a 404 if not found

**Example Flow:**

- Middleware rewrote URL to: `/siteA/products`
- `pathSegments = ['siteA', 'products']`
- `subdomain = 'siteA'`
- `makeswiftPath = '/products'`
- Fetches `/products` from Site A's Makeswift instance

---

### 5. `app/api/makeswift/[...makeswift]/route.ts` - Makeswift API Handler

This API route handler manages Makeswift's draft mode and preview functionality, allowing you to use the builder. These requests require the subdomain which is defined in the host setting.

**What it does:**

1. **Extracts the subdomain** from the request headers (e.g., `siteA` from `siteA.localhost:3000`, or `default` from `localhost:3000`)
2. **Gets the tenant-specific API key** using `getApiKey(subdomain)`
3. **Delegates to Makeswift's API handler** with the correct API key
4. **Supports all HTTP methods** (GET, POST, OPTIONS) for Makeswift operations

---

## 🔄 Request Flow

Here's how requests flow through the multi-tenant system:

### Subdomain-Based Flow

```
1. User visits: siteA.localhost:3000/products
   │
   ├─> Middleware extracts "siteA" from host header
   │
   ├─> Validates "siteA" is a valid tenant
   │
   ├─> Rewrites URL to: /siteA/products
   │
   └─> Routes to [[...path]]/page.tsx

2. Page Component receives: params.path = ['siteA', 'products']
   │
   ├─> Extracts tenantId = 'siteA'
   │
   ├─> Calls getApiKey('siteA') → Gets Site A's API key
   │
   ├─> Creates Makeswift client with Site A's API key
   │
   ├─> Fetches page snapshot for '/products' from Site A
   │
   └─> Renders the page with tenant-specific content
```

### Path-Based Flow

```
1. User visits: localhost:3000/siteA/products
   │
   ├─> Middleware finds no subdomain
   │
   ├─> Checks first path segment: "siteA"
   │
   ├─> Validates "siteA" is a valid tenant
   │
   ├─> No rewrite needed (path already includes tenant)
   │
   └─> Routes to [[...path]]/page.tsx

2. Page Component receives: params.path = ['siteA', 'products']
   │
   ├─> Extracts tenantId = 'siteA'
   │
   ├─> Calls getApiKey('siteA') → Gets Site A's API key
   │
   ├─> Creates Makeswift client with Site A's API key
   │
   ├─> Fetches page snapshot for '/products' from Site A
   │
   └─> Renders the page with tenant-specific content
```

**Note:** Both routing approaches result in the same internal URL structure (`/siteA/products`), ensuring consistent page rendering regardless of how the user accesses the site.

---

## 🚀 Adding a New Tenant

To add a new tenant site:

1. **Add environment variables** in `.env.local` (or your hosting platform):

   ```bash
   SITE_C_SUBDOMAIN=siteC
   SITE_C_MAKESWIFT_SITE_API_KEY=your-new-api-key
   ```

2. **Update `env.ts`** to include the new variables:

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

3. **Update `lib/makeswift/tenants.ts`** to add the mapping:
   ```typescript
   const SUBDOMAIN_TO_API_KEY = {
     // ... existing entries
     [env.SITE_C_SUBDOMAIN]: env.SITE_C_MAKESWIFT_SITE_API_KEY,
   }
   ```

---

## 🛠️ Development Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Create `.env` file** with your tenant configuration:

   ```bash
   DEFAULT_MAKESWIFT_SITE_API_KEY=your-default-site-key
   SITE_A_SUBDOMAIN=siteA
   SITE_A_MAKESWIFT_SITE_API_KEY=your-site-a-key
   SITE_B_SUBDOMAIN=siteB
   SITE_B_MAKESWIFT_SITE_API_KEY=your-site-b-key
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

4. **Test different tenants** using either routing approach:

   **Subdomain-based (required for Makeswift builder):**
   - Default tenant: `http://localhost:3000`
   - Site A: `http://siteA.localhost:3000`
   - Site B: `http://siteB.localhost:3000`

   **Path-based (works for page navigation):**
   - Default tenant: `http://localhost:3000`
   - Site A: `http://localhost:3000/siteA`
   - Site B: `http://localhost:3000/siteB`

---

## Modify your `/etc/hosts` Configuration (Optional)

If you want to use custom local domains like `siteA.local`, you'll need to configure `/etc/hosts`:

1. **Edit `/etc/hosts` with sudo** (e.g., using `vim` or your preferred editor)

   ```bash
   sudo vim /etc/hosts
   ```

2. **Add entries for each subdomain:**

   ```
   127.0.0.1    siteA.local
   127.0.0.1    siteB.local
   ```

3. **Visit your custom domains:**
   - `http://siteA.local:3000`
   - `http://siteB.local:3000`
