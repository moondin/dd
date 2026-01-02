---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 67
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 67 of 695)

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

---[FILE: pnpm-workspace.yaml]---
Location: payload-main/examples/astro/pnpm-workspace.yaml

```yaml
packages:
  - 'payload'
  - 'website'
```

--------------------------------------------------------------------------------

---[FILE: extensions.json]---
Location: payload-main/examples/astro/.vscode/extensions.json

```json
{
  "recommendations": ["astro-build.astro-vscode"],
  "unwantedRecommendations": []
}
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: payload-main/examples/astro/payload/.env.example

```text
DATABASE_URI=mongodb://127.0.0.1/payload-template-blank-3-0
PAYLOAD_SECRET=YOUR_SECRET_HERE
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc.json]---
Location: payload-main/examples/astro/payload/.prettierrc.json

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": false
}
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.yml]---
Location: payload-main/examples/astro/payload/docker-compose.yml

```yaml
version: '3'

services:
  payload:
    image: node:18-alpine
    ports:
      - '3000:3000'
    volumes:
      - .:/home/node/app
      - node_modules:/home/node/app/node_modules
    working_dir: /home/node/app/
    command: sh -c "corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm dev"
    depends_on:
      - mongo
      # - postgres
    env_file:
      - .env

  # Ensure your DATABASE_URI uses 'mongo' as the hostname ie. mongodb://mongo/my-db-name
  mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    command:
      - --storageEngine=wiredTiger
    volumes:
      - data:/data/db
    logging:
      driver: none

  # Uncomment the following to use postgres
  # postgres:
  #   restart: always
  #   image: postgres:latest
  #   volumes:
  #     - pgdata:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

volumes:
  data:
  # pgdata:
  node_modules:
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: payload-main/examples/astro/payload/Dockerfile

```text
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Remove this line if you do not have this folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
```

--------------------------------------------------------------------------------

---[FILE: eslint.config.mjs]---
Location: payload-main/examples/astro/payload/eslint.config.mjs

```text
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
]

export default eslintConfig
```

--------------------------------------------------------------------------------

---[FILE: next-env.d.ts]---
Location: payload-main/examples/astro/payload/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.mjs]---
Location: payload-main/examples/astro/payload/next.config.mjs

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
Location: payload-main/examples/astro/payload/package.json
Signals: React, Next.js

```json
{
  "name": "payload-app",
  "version": "1.0.0",
  "description": "A blank template to get started with Payload 3.0",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "build": "next build",
    "dev": "next dev --turbo",
    "devsafe": "rm -rf .next && next dev",
    "generate:importmap": "payload generate:importmap",
    "generate:types": "payload generate:types",
    "lint": "next lint",
    "payload": "payload",
    "start": "next start"
  },
  "dependencies": {
    "@payloadcms/db-mongodb": "3.11.0",
    "@payloadcms/next": "3.11.0",
    "@payloadcms/richtext-lexical": "3.11.0",
    "cross-env": "^7.0.3",
    "graphql": "^16.8.1",
    "next": "15.4.10",
    "payload": "3.11.0",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "sharp": "0.32.6"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@types/node": "^22.5.4",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "eslint": "^9.16.0",
    "eslint-config-next": "15.1.0",
    "prettier": "^3.4.2",
    "typescript": "5.7.2"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  }
}
```

--------------------------------------------------------------------------------

````
