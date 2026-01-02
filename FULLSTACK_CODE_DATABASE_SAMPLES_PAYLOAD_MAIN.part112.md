---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 112
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 112 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: next.config.mjs]---
Location: payload-main/examples/tailwind-shadcn-ui/next.config.mjs

```text
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
}

export default withPayload(nextConfig)
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/examples/tailwind-shadcn-ui/package.json
Signals: React, Next.js

```json
{
  "name": "tailwind-shadcn",
  "version": "1.0.0",
  "description": "A blank template to get started with Payload 3.0",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "dev": "cross-env NODE_OPTIONS=--no-deprecation next dev",
    "devsafe": "rm -rf .next && cross-env NODE_OPTIONS=--no-deprecation next dev",
    "generate:types": "payload generate:types",
    "lint": "cross-env NODE_OPTIONS=--no-deprecation next lint",
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "start": "cross-env NODE_OPTIONS=--no-deprecation next start"
  },
  "dependencies": {
    "@payloadcms/db-mongodb": "beta",
    "@payloadcms/next": "beta",
    "@payloadcms/richtext-lexical": "beta",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cross-env": "^7.0.3",
    "lucide-react": "^0.376.0",
    "next": "^15.4.10",
    "payload": "beta",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "sharp": "0.32.6",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.11.25",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "autoprefixer": "^10.4.19",
    "dotenv": "^16.4.5",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "tsx": "^4.7.1",
    "typescript": "^5.4.2"
  },
  "engines": {
    "node": ">=18.19.0"
  }
}
```

--------------------------------------------------------------------------------

````
