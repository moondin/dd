---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 8
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 8 of 695)

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

---[FILE: tsconfig.json]---
Location: payload-main/.github/actions/activity/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "esnext",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": false, // Undo this
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "downlevelIteration": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
  },
  "exclude": [
    "src/**/*.test.ts"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: payload-main/.github/actions/activity/src/constants.ts

```typescript
export const CHANNELS = {
  DEV: '#dev',
  DEBUG: '#test-slack-notifications',
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/.github/actions/activity/src/index.ts

```typescript
import { run as newIssuesRun } from './new-issues'
import { run as popularIssuesRun } from './popular-issues'
```

--------------------------------------------------------------------------------

---[FILE: new-issues.ts]---
Location: payload-main/.github/actions/activity/src/new-issues.ts

```typescript
import { info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { WebClient } from '@slack/web-api'

import { CHANNELS } from './constants'
import { daysAgo } from './lib/utils'
import { SlimIssue } from './types'

const DAYS_WINDOW = 7
const TRIAGE_LABEL = 'status: needs-triage'

function generateText(issues: { issue: SlimIssue; linkedPRUrl?: string }[]) {
  let text = `*A list of issues opened in the last ${DAYS_WINDOW} days with \`status: needs-triage\`:*\n\n`

  issues.forEach(({ issue, linkedPRUrl }) => {
    text += `• ${issue.title} - (<${issue.html_url}|#${issue.number}>)`
    if (linkedPRUrl) {
      text += ` - <${linkedPRUrl}|:link: Linked PR>`
    }
    text += `\n`
  })

  return text.trim()
}

async function getLinkedPRUrl(
  octoClient: ReturnType<typeof getOctokit>,
  issue: SlimIssue,
): Promise<string | undefined> {
  const { data: events } = await octoClient.rest.issues.listEventsForTimeline({
    owner: 'payloadcms',
    repo: 'payload',
    issue_number: issue.number,
  })

  const crossReferencedEvent = events.find(
    (event) => event.event === 'cross-referenced' && event.source?.issue?.pull_request,
  )
  return crossReferencedEvent?.source?.issue?.html_url
}
export async function run() {
  try {
    if (!process.env.GITHUB_TOKEN) throw new TypeError('GITHUB_TOKEN not set')
    if (!process.env.SLACK_TOKEN) throw new TypeError('SLACK_TOKEN not set')

    const octoClient = getOctokit(process.env.GITHUB_TOKEN)
    const slackClient = new WebClient(process.env.SLACK_TOKEN)

    const { data } = await octoClient.rest.search.issuesAndPullRequests({
      order: 'desc',
      per_page: 15,
      q: `repo:payloadcms/payload is:issue is:open label:"${TRIAGE_LABEL}" created:>=${daysAgo(DAYS_WINDOW)}`,
      sort: 'created',
    })

    if (!data.items.length) {
      info(`No popular issues`)
      return
    }

    const issuesWithLinkedPRs = await Promise.all(
      data.items.map(async (issue) => {
        const linkedPRUrl = await getLinkedPRUrl(octoClient, issue)
        return { issue, linkedPRUrl }
      }),
    )

    const messageText = generateText(issuesWithLinkedPRs)
    console.log(messageText)

    await slackClient.chat.postMessage({
      text: messageText,
      channel: process.env.DEBUG === 'true' ? CHANNELS.DEBUG : CHANNELS.DEV,
      icon_emoji: ':github:',
      username: 'GitHub Notifier',
    })
    info(`Posted to Slack!`)
  } catch (error) {
    setFailed(error as Error)
  }
}

run()
```

--------------------------------------------------------------------------------

---[FILE: popular-issues.ts]---
Location: payload-main/.github/actions/activity/src/popular-issues.ts

```typescript
import { info, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { WebClient } from '@slack/web-api'

import { CHANNELS } from './constants'
import { daysAgo } from './lib/utils'
import { SlimIssue } from './types'

const DAYS_WINDOW = 90

function generateText(issues: SlimIssue[]) {
  let text = `*A list of the top 10 issues sorted by the most reactions over the last ${DAYS_WINDOW} days:*\n\n`

  // Format date as "X days ago"
  const formattedDaysAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  issues.forEach((issue) => {
    text += `• ${issue?.reactions?.total_count || 0} 👍  ${issue.title} - <${issue.html_url}|#${issue.number}>, ${formattedDaysAgo(issue.created_at)}\n`
  })

  return text.trim()
}

export async function run() {
  try {
    if (!process.env.GITHUB_TOKEN) throw new TypeError('GITHUB_TOKEN not set')
    if (!process.env.SLACK_TOKEN) throw new TypeError('SLACK_TOKEN not set')

    const octoClient = getOctokit(process.env.GITHUB_TOKEN)
    const slackClient = new WebClient(process.env.SLACK_TOKEN)

    const { data } = await octoClient.rest.search.issuesAndPullRequests({
      order: 'desc',
      per_page: 10,
      q: `repo:payloadcms/payload is:issue is:open created:>=${daysAgo(DAYS_WINDOW)}`,
      sort: 'reactions',
    })

    if (!data.items.length) {
      info(`No popular issues`)
      return
    }

    const messageText = generateText(data.items)
    console.log(messageText)

    await slackClient.chat.postMessage({
      text: messageText,
      channel: process.env.DEBUG === 'true' ? CHANNELS.DEBUG : CHANNELS.DEV,
      icon_emoji: ':github:',
      username: 'GitHub Notifier',
    })

    info(`Posted to Slack!`)
  } catch (error) {
    setFailed(error as Error)
  }
}

run()
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/.github/actions/activity/src/types.ts

```typescript
import type { components } from '@octokit/openapi-types'

export type SlimIssue = Pick<
  components['schemas']['issue-search-result-item'],
  'html_url' | 'number'
> & {
  title: string
  created_at: string
  reactions?: components['schemas']['reaction-rollup']
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: payload-main/.github/actions/activity/src/lib/utils.ts

```typescript
/**
 * Format date to <month|short> <day|numeric>, <year|numeric>
 */
export function formattedDate(createdAt: string): string {
  const date = new Date(createdAt)

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Get days ago in YYYY-MM-DD format
 */
export function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}
```

--------------------------------------------------------------------------------

---[FILE: .eslintrc.js]---
Location: payload-main/.github/actions/release-commenter/.eslintrc.js

```javascript
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
}
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: payload-main/.github/actions/release-commenter/action.yml

```yaml
name: Release Commenter
description: Comment on PRs and Issues when a fix is released
branding:
  icon: message-square
  color: blue
inputs:
  GITHUB_TOKEN:
    description: |
      A GitHub personal access token with repo scope, such as
      secrets.GITHUB_TOKEN.
    required: true
  comment-template:
    description: |
      Text template for the comment string.
    required: false
    default: |
      Included in release {release_link}
  label-template:
    description: Add the given label. Multiple labels can be separated by commas.
    required: false
  skip-label:
    description: Skip commenting if any of the given label are present. Multiple labels can be separated by commas.
    required: false
    default: 'dependencies'
  tag-filter:
    description: |
      Filter tags by a regular expression. Must be escaped. e.g. 'v\\d' to isolate tags between major versions.
    required: false
    default: null
runs:
  using: node20
  main: dist/index.js
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: payload-main/.github/actions/release-commenter/jest.config.js

```javascript
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/dist/'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: payload-main/.github/actions/release-commenter/LICENSE

```text
MIT License

Copyright (c) 2020-2025 Cameron Little <cameron@camlittle.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

Modifications made by Payload CMS, Inc. <info@payloadcms.com>, 2025
Details in README.md
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/.github/actions/release-commenter/package.json

```json
{
  "name": "release-commenter",
  "version": "0.0.0",
  "private": true,
  "description": "GitHub Action to automatically comment on PRs and Issues when a fix is released.",
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "main": "dist/index.js",
  "scripts": {
    "build": "pnpm build:typecheck && pnpm build:ncc",
    "build:ncc": "ncc build src/index.ts -t -o dist",
    "build:typecheck": "tsc",
    "clean": "rimraf dist",
    "test": "jest"
  },
  "dependencies": {
    "@actions/core": "^1.3.0",
    "@actions/github": "^5.0.0"
  },
  "devDependencies": {
    "@octokit/webhooks-types": "^7.5.1",
    "@swc/jest": "^0.2.37",
    "@types/jest": "^27.5.2",
    "@types/node": "^20.16.5",
    "@typescript-eslint/eslint-plugin": "^4.33.0",
    "@typescript-eslint/parser": "^4.33.0",
    "@vercel/ncc": "0.38.1",
    "concurrently": "^8.2.2",
    "eslint": "^7.32.0",
    "jest": "^29.7.0",
    "prettier": "^3.3.3",
    "typescript": "^4.9.5"
  }
}
```

--------------------------------------------------------------------------------

````
