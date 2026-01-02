---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 4
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 4 of 695)

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
Location: payload-main/pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'tools/*'
  - 'test'
  - 'templates/blank'
  - 'templates/website'
  - 'templates/ecommerce'

updateNotifier: false
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/README.md

```text
<a href="https://payloadcms.com"><img width="100%" src="https://l4wlsi8vxy8hre4v.public.blob.vercel-storage.com/github-banner-new-logo.jpg" alt="Payload headless CMS Admin panel built with React" /></a>
<br />
<br />

<p align="left">
  <a href="https://github.com/payloadcms/payload/actions"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/payloadcms/payload/main.yml?style=flat-square"></a>
  &nbsp;
  <a href="https://discord.gg/payload"><img alt="Discord" src="https://img.shields.io/discord/967097582721572934?label=Discord&color=7289da&style=flat-square" /></a>
  &nbsp;
  <a href="https://www.npmjs.com/package/payload"><img alt="npm" src="https://img.shields.io/npm/dw/payload?style=flat-square" /></a>
  &nbsp;
  <a href="https://github.com/payloadcms/payload/graphs/contributors"><img alt="npm" src="https://img.shields.io/github/contributors-anon/payloadcms/payload?color=yellow&style=flat-square" /></a>
  &nbsp;
  <a href="https://www.npmjs.com/package/payload"><img alt="npm" src="https://img.shields.io/npm/v/payload?style=flat-square" /></a>
  &nbsp;
  <a href="https://twitter.com/payloadcms"><img src="https://img.shields.io/badge/follow-payloadcms-1DA1F2?logo=twitter&style=flat-square" alt="Payload Twitter" /></a>
</p>
<hr/>
<h4>
<a target="_blank" href="https://payloadcms.com/docs/getting-started/what-is-payload" rel="dofollow"><strong>Explore the Docs</strong></a>&nbsp;·&nbsp;<a target="_blank" href="https://payloadcms.com/community-help" rel="dofollow"><strong>Community Help</strong></a>&nbsp;·&nbsp;<a target="_blank" href="https://github.com/payloadcms/payload/discussions/1539" rel="dofollow"><strong>Roadmap</strong></a>&nbsp;·&nbsp;<a target="_blank" href="https://www.g2.com/products/payload-cms/reviews#reviews" rel="dofollow"><strong>View G2 Reviews</strong></a>
</h4>
<hr/>

> [!IMPORTANT]
> Star this repo or keep an eye on it to follow along.

Payload is the first-ever Next.js native CMS that can install directly in your existing `/app` folder. It's the start of a new era for headless CMS.

<h3>Benefits over a regular CMS</h3>
<ul>
   <li>It's both an app framework & headless CMS</li>
  <li>Deploy anywhere, including serverless on Vercel for free</li>
  <li>Combine your front+backend in the same <code>/app</code> folder if you want</li>
  <li>Don't sign up for yet another SaaS - Payload is open source</li>
  <li>Query your database in React Server Components</li>
  <li>Both admin and backend are 100% extensible</li>
  <li>No vendor lock-in</li>
  <li>Never touch ancient WP code again</li>
  <li>Build faster, never hit a roadblock</li>
</ul>

## Quickstart

Before beginning to work with Payload, make sure you have all of the [required software](https://payloadcms.com/docs/getting-started/installation).

```text
pnpx create-payload-app@latest
```

**If you're new to Payload, you should start with the website template** (`pnpx create-payload-app@latest -t website`). It shows how to do _everything_ - including custom Rich Text blocks, on-demand revalidation, live preview, and more. It comes with a frontend built with Tailwind all in one `/app` folder.

## One-click deployment options

You can deploy Payload serverlessly in one-click via Vercel and Cloudflare—giving everything you need without the hassle of the plumbing.

### Deploy on Cloudflare

Fully self-contained — one click to deploy Payload with **Workers**, **R2** for uploads, and **D1** for a globally replicated database.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://dub.sh/payload-cloudflare)

### Deploy on Vercel

All-in-one on Vercel — one click to deploy Payload with a **Next.js** front end, **Neon** database, and **Vercel Blob** for media storage.

[![Deploy with Vercel](https://vercel.com/button)](https://dub.sh/payload-vercel)

## One-click templates

Jumpstart your next project with a ready-to-go template. These are **production-ready, end-to-end solutions** designed to get you to market fast. Build any kind of **website**, **ecommerce store**, **blog**, or **portfolio** — complete with a modern front end built using **React Server Components** and **Tailwind**.

#### 🌐 [Website](https://github.com/payloadcms/payload/tree/main/templates/website)

#### 🛍️ [Ecommerce](https://github.com/payloadcms/payload/tree/main/templates/ecommerce) 🎉 _**NEW**_ 🎉

We're constantly adding more templates to our [**Templates Directory**](https://github.com/payloadcms/payload/tree/main/templates).
If you maintain your own, add the `payload-template` topic to your GitHub repo so others can discover it.

**🔗 Explore more:**

- [Official Templates](https://github.com/payloadcms/payload/tree/main/templates)
- [Community Templates](https://github.com/topics/payload-template)

## ✨ Payload Features

- Completely free and open-source
- Next.js native, built to run inside _your_ `/app` folder
- Use server components to extend Payload UI
- Query your database directly in server components, no need for REST / GraphQL
- Fully TypeScript with automatic types for your data
- [Auth out of the box](https://payloadcms.com/docs/authentication/overview)
- [Versions and drafts](https://payloadcms.com/docs/versions/overview)
- [Localization](https://payloadcms.com/docs/configuration/localization)
- [Block-based layout builder](https://payloadcms.com/docs/fields/blocks)
- [Customizable React admin](https://payloadcms.com/docs/admin/overview)
- [Lexical rich text editor](https://payloadcms.com/docs/fields/rich-text)
- [Conditional field logic](https://payloadcms.com/docs/fields/overview#conditional-logic)
- Extremely granular [Access Control](https://payloadcms.com/docs/access-control/overview)
- [Document and field-level hooks](https://payloadcms.com/docs/hooks/overview) for every action Payload provides
- Intensely fast API
- Highly secure thanks to HTTP-only cookies, CSRF protection, and more

<a target="_blank" href="https://github.com/payloadcms/payload/discussions"><strong>Request Feature</strong></a>

## 🗒️ Documentation

Check out the [Payload website](https://payloadcms.com/docs/getting-started/what-is-payload) to find in-depth documentation for everything that Payload offers.

Migrating from v2 to v3? Check out the [3.0 Migration Guide](https://github.com/payloadcms/payload/blob/main/docs/migration-guide/overview.mdx) on how to do it.

## 🙋 Contributing

If you want to add contributions to this repository, please follow the instructions in [contributing.md](./CONTRIBUTING.md).

## 📚 Examples

The [Examples Directory](./examples) is a great resource for learning how to setup Payload in a variety of different ways, but you can also find great examples in our blog and throughout our social media.

If you'd like to run the examples, you can use `create-payload-app` to create a project from one:

```sh
npx create-payload-app --example example_name
```

You can see more examples at:

- [Examples Directory](./examples)
- [Payload Blog](https://payloadcms.com/blog)
- [Payload YouTube](https://www.youtube.com/@payloadcms)

## 🔌 Plugins

Payload is highly extensible and allows you to install or distribute plugins that add or remove functionality. There are both officially-supported and community-supported plugins available. If you maintain your own plugin, consider adding the `payload-plugin` topic to your GitHub repository for others to find.

- [Official Plugins](https://github.com/orgs/payloadcms/repositories?q=topic%3Apayload-plugin)
- [Community Plugins](https://github.com/topics/payload-plugin)

## 🚨 Need help?

There are lots of good conversations and resources in our Github Discussions board and our Discord Server. If you're struggling with something, chances are, someone's already solved what you're up against. :point_down:

- [GitHub Discussions](https://github.com/payloadcms/payload/discussions)
- [GitHub Issues](https://github.com/payloadcms/payload/issues)
- [Discord](https://t.co/30APlsQUPB)
- [Community Help](https://payloadcms.com/community-help)

## ⭐ Like what we're doing? Give us a star

## 👏 Thanks to all our contributors

<img align="left" src="https://contributors-img.web.app/image?repo=payloadcms/payload"/>
```

--------------------------------------------------------------------------------

---[FILE: SECURITY.md]---
Location: payload-main/SECURITY.md

```text
# Security Policy

## Reporting a Vulnerability

Please report any security issues or concerns to [info@payloadcms.com](mailto:info@payloadcms.com).
```

--------------------------------------------------------------------------------

---[FILE: sentry.client.config.ts]---
Location: payload-main/sentry.client.config.ts

```typescript
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn,
  // Replay may only be enabled for the client-side
  integrations: [Sentry.replayIntegration()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  enabled: !!dsn,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
```

--------------------------------------------------------------------------------

---[FILE: sentry.server.config.ts]---
Location: payload-main/sentry.server.config.ts

```typescript
import * as Sentry from '@sentry/nextjs'
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

const enabled = !!dsn

Sentry.init({
  dsn,
  enabled,
  skipOpenTelemetrySetup: true,
  tracesSampleRate: 1.0,
})

if (enabled) {
  // eslint-disable-next-line no-console
  console.log('Sentry inited')
}

export {}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.base.json]---
Location: payload-main/tsconfig.base.json
Signals: React, Next.js

```json
{
  "compilerOptions": {
    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "target": "ES2022",
    "rootDir": "${configDir}/src",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowJs": true,
    "checkJs": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "preserve",
    "outDir": "${configDir}/dist",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "emitDeclarationOnly": true,
    "sourceMap": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "types": ["node", "jest"],
    "incremental": true,
    "isolatedModules": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@payload-config": ["./test/_community/config.ts"],
      "@payloadcms/admin-bar": ["./packages/admin-bar/src"],
      "@payloadcms/live-preview": ["./packages/live-preview/src"],
      "@payloadcms/live-preview-react": ["./packages/live-preview-react/src/index.ts"],
      "@payloadcms/live-preview-vue": ["./packages/live-preview-vue/src/index.ts"],
      "@payloadcms/ui": ["./packages/ui/src/exports/client/index.ts"],
      "@payloadcms/ui/shared": ["./packages/ui/src/exports/shared/index.ts"],
      "@payloadcms/ui/rsc": ["./packages/ui/src/exports/rsc/index.ts"],
      "@payloadcms/ui/scss": ["./packages/ui/src/scss.scss"],
      "@payloadcms/ui/scss/app.scss": ["./packages/ui/src/scss/app.scss"],
      "@payloadcms/next/*": ["./packages/next/src/exports/*.ts"],
      "@payloadcms/richtext-lexical/client": [
        "./packages/richtext-lexical/src/exports/client/index.ts"
      ],
      "@payloadcms/richtext-lexical/rsc": ["./packages/richtext-lexical/src/exports/server/rsc.ts"],
      "@payloadcms/richtext-slate/rsc": ["./packages/richtext-slate/src/exports/server/rsc.ts"],
      "@payloadcms/plugin-ecommerce/ui": ["./packages/plugin-ecommerce/src/exports/ui.ts"],
      "@payloadcms/plugin-ecommerce/react": ["./packages/plugin-ecommerce/src/exports/react.ts"],
      "@payloadcms/plugin-ecommerce/types": ["./packages/plugin-ecommerce/src/exports/types.ts"],
      "@payloadcms/richtext-slate/client": [
        "./packages/richtext-slate/src/exports/client/index.ts"
      ],
      "@payloadcms/plugin-seo/client": ["./packages/plugin-seo/src/exports/client.ts"],
      "@payloadcms/plugin-sentry/client": ["./packages/plugin-sentry/src/exports/client.ts"],
      "@payloadcms/plugin-stripe/client": ["./packages/plugin-stripe/src/exports/client.ts"],
      "@payloadcms/plugin-search/client": ["./packages/plugin-search/src/exports/client.ts"],
      "@payloadcms/plugin-form-builder/client": [
        "./packages/plugin-form-builder/src/exports/client.ts"
      ],
      "@payloadcms/plugin-import-export/rsc": [
        "./packages/plugin-import-export/src/exports/rsc.ts"
      ],
      "@payloadcms/plugin-mcp": ["./packages/plugin-mcp/src/index.ts"],
      "@payloadcms/plugin-multi-tenant/rsc": ["./packages/plugin-multi-tenant/src/exports/rsc.ts"],
      "@payloadcms/plugin-multi-tenant/utilities": [
        "./packages/plugin-multi-tenant/src/exports/utilities.ts"
      ],
      "@payloadcms/plugin-multi-tenant/fields": [
        "./packages/plugin-multi-tenant/src/exports/fields.ts"
      ],
      "@payloadcms/plugin-multi-tenant/client": [
        "./packages/plugin-multi-tenant/src/exports/client.ts"
      ],
      "@payloadcms/plugin-multi-tenant": ["./packages/plugin-multi-tenant/src/index.ts"],
      "@payloadcms/plugin-multi-tenant/translations/languages/all": [
        "./packages/plugin-multi-tenant/src/translations/index.ts"
      ],
      "@payloadcms/plugin-multi-tenant/translations/languages/*": [
        "./packages/plugin-multi-tenant/src/translations/languages/*.ts"
      ],
      "@payloadcms/next": ["./packages/next/src/exports/*"],
      "@payloadcms/storage-azure/client": ["./packages/storage-azure/src/exports/client.ts"],
      "@payloadcms/storage-s3/client": ["./packages/storage-s3/src/exports/client.ts"],
      "@payloadcms/storage-vercel-blob/client": [
        "./packages/storage-vercel-blob/src/exports/client.ts"
      ],
      "@payloadcms/storage-gcs/client": ["./packages/storage-gcs/src/exports/client.ts"],
      "@payloadcms/storage-uploadthing/client": [
        "./packages/storage-uploadthing/src/exports/client.ts"
      ]
    }
  },
  "include": ["${configDir}/src"],
  "exclude": ["${configDir}/dist", "${configDir}/build", "${configDir}/temp", "**/*.spec.ts"]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/tsconfig.json
Signals: React, Next.js

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "composite": false,
    "noEmit": true,
    "baseUrl": ".",
  },
  "references": [
    {
      "path": "./packages/admin-bar"
    },
    {
      "path": "./packages/create-payload-app"
    },
    {
      "path": "./packages/db-mongodb"
    },
    {
      "path": "./packages/db-postgres"
    },
    {
      "path": "./packages/drizzle"
    },
    {
      "path": "./packages/graphql"
    },
    {
      "path": "./packages/live-preview"
    },
    {
      "path": "./packages/live-preview-react"
    },
    {
      "path": "./packages/live-preview-vue"
    },
    {
      "path": "./packages/kv-redis"
    },
    {
      "path": "./packages/next"
    },
    {
      "path": "./packages/payload"
    },
    {
      "path": "./packages/plugin-cloud-storage"
    },
    {
      "path": "./packages/storage-s3"
    },
    {
      "path": "./packages/payload-cloud"
    },
    {
      "path": "./packages/plugin-form-builder"
    },
    {
      "path": "./packages/plugin-nested-docs"
    },
    {
      "path": "./packages/plugin-redirects"
    },
    {
      "path": "./packages/plugin-search"
    },
    {
      "path": "./packages/plugin-seo"
    },
    {
      "path": "./packages/plugin-import-export"
    },
    {
      "path": "./packages/plugin-stripe"
    },
    {
      "path": "./packages/plugin-multi-tenant"
    },
    {
      "path": "./packages/richtext-slate"
    },
    {
      "path": "./packages/richtext-lexical"
    },
    {
      "path": "./packages/translations"
    },
    {
      "path": "./packages/ui"
    },
    {
      "path": "./packages/sdk"
    }
  ],
  "include": [
    "${configDir}/src",
    ".next/types/**/*.ts",
    "./scripts/**/*.ts",
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tstyche.config.json]---
Location: payload-main/tstyche.config.json

```json
{
  "testFileMatch": ["test/**/types.spec.ts"]
}
```

--------------------------------------------------------------------------------

---[FILE: turbo.json]---
Location: payload-main/turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "clean": {
      "cache": false,
      "dependsOn": ["^clean"]
    },
    "build": {
      "cache": true,
      "dependsOn": ["^build"],
      "outputs": ["./dist/**"]
    },
    "build:debug": {
      "cache": true,
      "dependsOn": ["^build:debug"],
      "outputs": ["./dist/**"]
    },
    "build:bundle-for-analysis": {
      "cache": true,
      "dependsOn": ["^build:bundle-for-analysis"],
      "outputs": ["./esbuild/**"]
    },
    "dev": {
      "cache": false
    },
    "lint": {
      "cache": false
    },
    "lint:fix": {
      "cache": false
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: settings.json]---
Location: payload-main/.claude/settings.json

```json
{
  "extraKnownMarketplaces": {
    "superpowers-dev": {
      "source": {
        "source": "github",
        "repo": "obra/superpowers"
      }
    }
  },
  "enabledPlugins": {
    "superpowers@superpowers-dev": true
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/post-write-format.sh"
          }
        ]
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(gh issue view:*)",
      "Bash(gh pr view:*)",
      "Bash(gh release view:*)",
      "Bash(gh run list:*)",
      "Bash(gh run view:*)",
      "Bash(git branch:*)",
      "Bash(git describe:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git ls-files:*)",
      "Bash(git remote:*)",
      "Bash(git rev-parse:*)",
      "Bash(git show:*)",
      "Bash(git status)",
      "Bash(pnpm --version)",
      "Bash(pnpm audit:*)",
      "Bash(pnpm install)",
      "Bash(pnpm list:*)",
      "Bash(pnpm run:*)",
      "Bash(pnpm turbo:*)",
      "Bash(pnpm view:*)",
      "Bash(pnpm why:*)",
      "Bash(pwd)",
      "Bash(which:*)",
      "Skill(superpowers:brainstorming)",
      "Skill(superpowers:executing-plans)",
      "Skill(superpowers:requesting-code-review)",
      "Skill(superpowers:subagent-driven-development)",
      "Skill(superpowers:systematic-debugging)",
      "Skill(superpowers:testing-anti-patterns)",
      "Skill(superpowers:using-git-worktrees)",
      "Skill(superpowers:writing-plans)",
      "Skill(superpowers:writing-skills)",
      "WebFetch(domain:docs.aws.amazon.com)",
      "WebFetch(domain:docs.claude.com)",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:payloadcms.com)",
      "WebFetch(domain:pure.md)",
      "WebFetch(domain:raw.githubusercontent.com)",
      "WebFetch(domain:www.anthropic.com)",
      "WebFetch(domain:www.npmjs.com)",
      "WebSearch"
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: analyze-issue.md]---
Location: payload-main/.claude/commands/analyze-issue.md

```text
---
description: Analyze a GitHub issue and create a resolution plan
argument-hint: <issue-number-or-url>
---

Deep-dive on the GitHub issue provided in $ARGUMENTS. Find the problem and generate a plan. Do not write code. Explain the problem clearly and propose a comprehensive plan to solve it.

PROMPT for the issue number or URL if not provided, and stop here.

Steps:

1. Fetch issue data using: `gh issue view $ARGUMENTS --json author,title,number,body,comments,labels`
2. Parse the JSON response to extract:
   - Title and number
   - Description (body)
   - All comments with authors
   - Labels
3. Format the issue context clearly
4. Review the issue context and details
5. Examine the relevant parts of the codebase. Analyze the code thoroughly until you have a solid understanding of how it works.
6. Explain the issue in detail, including the problem and its root cause. There is no guarantee the issue is valid, so be critical and thorough in your analysis.
7. Create a comprehensive plan to solve the issue. The plan should include:
   - Required code changes
   - Potential impacts on other parts of the system
   - Necessary tests to be written or updated
   - Documentation updates
   - Performance considerations
   - Security implications
   - Backwards compatibility (if applicable)
   - Include the reference link to the source issue and any related discussions
8. Think deeply about all aspects of the task. Consider edge cases, potential challenges, and best practices for addressing the issue.

**IMPORTANT: ONLY CREATE A PLAN. DO NOT WRITE ANY CODE.** Your task is to create a thorough, comprehensive strategy for understanding and resolving the issue.
```

--------------------------------------------------------------------------------

---[FILE: triage.md]---
Location: payload-main/.claude/commands/triage.md

```text
---
description: Triage a GitHub issue and present findings on validity, code locations, and optionally create a failing test or resolution plan.
argument-hint: <issue-number-or-url>
allowed-tools: Bash(gh issue view:*), Task, TodoWrite, Write, AskUserQuestion
---

# Triage GitHub Issue

Quickly triage GitHub issues to determine validity and identify where the issue exists in code. Do not write code during triage.

## Process

### Step 1: Validate & Fetch

1. Check if `$ARGUMENTS` provided - if missing, ask user and stop
2. Create TodoWrite with: Fetch and validate issue data | Investigate codebase | Analyze validity and generate report | Offer next steps
3. Fetch issue data: `gh issue view $ARGUMENTS --json author,title,number,body,comments,labels,url`
4. If command fails: Inform user and stop
5. Extract title, body, comments, labels, state, URL
6. Verify issue has sufficient info to investigate

### Step 2: Investigate

1. Use Task tool with subagent_type=Explore to examine relevant parts of codebase
2. Think step by step through the code paths involved until you understand the relevant files, functions, and logic
3. Focus on understanding the problem space before judging validity

### Step 3: Analyze & Report

1. Think step by step about whether this issue is valid - be critical and consider alternative explanations
2. Determine verdict: Valid | Invalid | Needs Info
3. Determine confidence: High | Medium | Low
4. If valid: Think deeply about the root cause before proposing fix direction
5. Generate findings using output structure below
6. Auto-save to `.claude/artifacts/triage-<issue-number>.md`
7. Present findings to user

### Step 4: Offer Next Steps

Use AskUserQuestion with multiSelect: true:

"What would you like to do next?"

- **Create failing test** - Write integration test that reproduces the issue
- **Create resolution plan** - Generate full plan using `/superpowers:write-plan`
- **Done for now** - End triage

If user selects test: Write an integration test that reproduces the issue.
If user selects plan: Use `/superpowers:write-plan` to create detailed implementation plan.

## Output Structure

```markdown
# Triage: #<issue-number> - <title>

**Verdict:** Valid | Invalid | Needs Info
**Confidence:** High | Medium | Low

## Problem

1-2 sentences on what's broken and why.

## Reproduction

Steps to reproduce from investigation:

1. ...
2. ...

## Code Locations

- `path/file.ts:123` - what's here
- `path/other.ts:456` - related

## Fix Direction

Brief hints on potential approach (not full plan):

- Consider X
- May need to change Y

## Issue Link

<url>
```

## When to Stop

**STOP immediately when:**

- `$ARGUMENTS` not provided (ask for it)
- `gh issue view` command fails
- Issue not found or inaccessible
- Cannot understand issue after investigation
- Insufficient information to determine validity

**Ask for clarification rather than guessing.**

## Remember

- Create TodoWrite with 4 steps upfront
- Mark steps in_progress before starting, completed after finishing
- Use Explore agent for investigation
- Be critical about issue validity
- Auto-save findings to `.claude/artifacts/`
- Single question at end with multi-select options
- DO NOT write code during triage (tests come after, if requested)
- Stop when blocked, don't guess
```

--------------------------------------------------------------------------------

---[FILE: post-write-format.sh]---
Location: payload-main/.claude/hooks/post-write-format.sh

```bash
#!/bin/bash

# Post-write hook to format files after creating
# This is the bash equivalent of lint-staged in package.json

# To test this file directly via cli:
# echo '{"tool_input": {"file_path": "path/to/your/file"}}' | .claude/hooks/post-write-format.sh

# Read JSON from stdin and extract file path
FILE=$(jq -r '.tool_input.file_path' 2>/dev/null)

if [ -z "$FILE" ] || [ "$FILE" = "null" ]; then
  exit 0
fi

# Check if file exists
if [ ! -f "$FILE" ]; then
  exit 0
fi

# Format based on file type
case "$FILE" in
  */package.json)
    npx sort-package-json "$FILE" 2>/dev/null
    ;;
  *.yml|*.json)
    npx prettier --write "$FILE" 2>/dev/null
    ;;
  *.md|*.mdx)
    npx prettier --write "$FILE" 2>/dev/null
    if command -v markdownlint >/dev/null 2>&1; then
      markdownlint -i node_modules "$FILE" 2>/dev/null
    fi
    ;;
  *.js|*.jsx|*.ts|*.tsx)
    npx prettier --write "$FILE" 2>/dev/null
    npx eslint --cache --fix "$FILE" 2>/dev/null
    ;;
esac

exit 0
```

--------------------------------------------------------------------------------

---[FILE: marketplace.json]---
Location: payload-main/.claude-plugin/marketplace.json

```json
{
  "name": "payload-marketplace",
  "version": "0.0.1",
  "description": "Development marketplace for Payload",
  "owner": {
    "name": "Payload",
    "email": "info@payloadcms.com"
  },
  "plugins": [
    {
      "name": "payload",
      "description": "Payload Development plugin - covers collections, fields, hooks, access control, plugins, and database adapters.",
      "version": "0.0.1",
      "source": "./tools/claude-plugin",
      "author": {
        "name": "Payload",
        "email": "info@payloadcms.com"
      }
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: CODEOWNERS]---
Location: payload-main/.github/CODEOWNERS

```text
# Order matters. The last matching pattern takes precedence

## Package Exports

**/exports/ @denolfe @DanRibbens

## Packages

/packages/create-payload-app/src/ @denolfe
/packages/email-*/src/ @denolfe
/packages/eslint-*/ @denolfe @AlessioGr
/packages/plugin-cloud-storage/src/ @denolfe
/packages/plugin-multi-tenant/src/ @JarrodMFlesch
/packages/richtext-*/src/ @AlessioGr
/packages/storage-*/src/ @denolfe
/packages/ui/src/  @jacobsfletch @AlessioGr @JarrodMFlesch

## Templates

/templates/_data/ @denolfe
/templates/_template/ @denolfe

## Build Files

**/jest.config.js @denolfe @AlessioGr
**/tsconfig*.json @denolfe @AlessioGr

## Root

/.github/ @denolfe
/.husky/ @denolfe
/.vscode/ @denolfe @AlessioGr
/package.json @denolfe
/tools/ @denolfe
```

--------------------------------------------------------------------------------

---[FILE: dependabot.yml]---
Location: payload-main/.github/dependabot.yml

```yaml
# docs: https://docs.github.com/github/administering-a-repository/configuration-options-for-dependency-updates

version: 2
updates:
  - package-ecosystem: github-actions
    directories:
      - /
      - /.github/workflows
      - /.github/actions/* # Not working until resolved: https://github.com/dependabot/dependabot-core/issues/6345
      - /.github/actions/setup
    target-branch: main
    schedule:
      interval: monthly
      timezone: America/Detroit
      time: '06:00'
    groups:
      github_actions:
        patterns:
          - '*'

  - package-ecosystem: npm
    directory: /
    target-branch: main
    open-pull-requests-limit: 0 # Only allow security updates
    schedule:
      interval: weekly
      day: sunday
      timezone: America/Detroit
      time: '06:00'
    commit-message:
      prefix: 'chore(deps)'
    labels:
      - dependencies
    groups:
      production-deps:
        dependency-type: production
        update-types:
          - minor
          - patch
        patterns:
          - '*'
      dev-deps:
        dependency-type: development
        update-types:
          - minor
          - patch
        patterns:
          - '*'

  - package-ecosystem: npm
    directory: /
    target-branch: 2.x
    open-pull-requests-limit: 0 # Only allow security updates
    schedule:
      interval: weekly
      day: sunday
      timezone: America/Detroit
      time: '06:00'
    commit-message:
      prefix: 'chore(deps)'
    labels:
      - dependencies
    groups:
      production-deps:
        dependency-type: production
        update-types:
          - patch
        patterns:
          - '*'
```

--------------------------------------------------------------------------------

````
