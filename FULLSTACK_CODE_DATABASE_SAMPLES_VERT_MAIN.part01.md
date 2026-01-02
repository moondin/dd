---
source_txt: fullstack_samples/VERT-main
converted_utc: 2025-12-18T11:26:37Z
part: 1
parts_total: 18
---

# FULLSTACK CODE DATABASE SAMPLES VERT-main

## Verbatim Content (Part 1 of 18)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - VERT-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/VERT-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: .dockerignore]---
Location: VERT-main/.dockerignore

```text
node_modules/
build/
dist/
.svelte-kit/
.output/
.vercel/
.vscode/

LICENSE
README.md
Dockerfile
docker-compose.yml
.npmrc
.prettier*
.gitignore
.env.*
.env

.DS_Store
Thumbs.db
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: VERT-main/.env.example

```text
# The hostname used for analytics tracking (currently only used by Plausible)
PUB_HOSTNAME=localhost:5173

# URL for your Plausible Analytics instance (leave empty to disable analytics)
PUB_PLAUSIBLE_URL=https://plausible.example.com

# Application environment: "production", "development", or "nightly"
PUB_ENV=development

# URL of the vertd daemon for video conversion (default: official VERT instance)
PUB_VERTD_URL=https://vertd.vert.sh

# Set to true to disable all external requests (vertd, Stripe, Plausible, etc.)
# Useful for privacy-focused deployments or air-gapped environments
# Note: the ffmpeg worker is still downloaded via a CDN (cdn.jsdelivr.net)
PUB_DISABLE_ALL_EXTERNAL_REQUESTS=false

# Set to true to disable blocking video conversions of an uploaded file when repeated failures
# occur within an hour. Useful for local deployments where secure context (HTTPS) may not be
# available - required for calculating file hashes of videos to block temporarily.
PUB_DISABLE_FAILURE_BLOCKS=false

# Stripe donation settings
# Please keep these values the same, they support VERT's development!
PUB_DONATION_URL=https://donations.vert.sh
PUB_STRIPE_KEY=pk_live_51RDVmAGSxPVad6bQwzVNnbc28nlmzA30krLWk1fefCMpUPiSRPkavMMbGqa8A3lUaOCMlsUEVy2CWDYg0ip3aPpL00ZJlsMkf2
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: VERT-main/.gitignore

```text
node_modules

# Output
.output
.vercel
/.svelte-kit
/build

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.*
!.env.example
!.env.test

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*

# IDE
.idea
```

--------------------------------------------------------------------------------

---[FILE: .npmignore]---
Location: VERT-main/.npmignore

```text
src/routes
src/app.d.ts
src/app.html
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: VERT-main/.prettierignore

```text
# Package Managers
package-lock.json
pnpm-lock.yaml
yarn.lock
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc]---
Location: VERT-main/.prettierrc

```text
{
	"useTabs": true,
	"tabWidth": 4,
	"singleQuote": false,
	"plugins": ["prettier-plugin-svelte"],
    "overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
}
```

--------------------------------------------------------------------------------

````
