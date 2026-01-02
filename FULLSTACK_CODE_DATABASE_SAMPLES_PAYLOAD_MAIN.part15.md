---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 15
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 15 of 695)

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

---[FILE: triage.yml]---
Location: payload-main/.github/workflows/triage.yml

```yaml
name: triage

on:
  pull_request_target:
    types:
      - opened
  issues:
    types:
      - opened

env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  debug-context:
    runs-on: ubuntu-24.04
    steps:
      - name: View context attributes
        uses: actions/github-script@v7
        with:
          script: console.log({ context })

  label-created-by:
    name: label-on-open
    runs-on: ubuntu-24.04
    steps:
      - name: Tag with 'created-by'
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const payloadTeamUsernames = [
              'denolfe',
              'jmikrut',
              'DanRibbens',
              'jacobsfletch',
              'JarrodMFlesch',
              'AlessioGr',
              'JessChowdhury',
              'kendelljoseph',
              'PatrikKozak',
              'tylandavis',
              'paulpopus',
              'r1tsuu',
              'GermanJablo',
            ];

            const type = context.payload.pull_request ? 'pull_request' : 'issue';

            const isTeamMember = payloadTeamUsernames
              .map(n => n.toLowerCase())
              .includes(context.payload[type].user.login.toLowerCase());

            if (isTeamMember) {
              github.rest.issues.addLabels({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                labels: ['created-by: Payload team'],
              });
              console.log(`Added 'created-by: Payload team' label`);
              return;
            }

            const association = context.payload[type].author_association;
            let label = ''
            if (association === 'MEMBER' || association === 'OWNER') {
              label = 'created-by: Payload team';
            } else if (association === 'CONTRIBUTOR') {
              label = 'created-by: Contributor';
            }

            if (!label) return;

            github.rest.issues.addLabels({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: [label],
            });
            console.log(`Added '${label}' label.`);

  triage:
    name: initial-triage
    if: github.event_name == 'issues'
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v5
        with:
          ref: ${{ github.event.pull_request.base.ref }}
          token: ${{ secrets.GITHUB_TOKEN }}
      - uses: ./.github/actions/triage
        with:
          reproduction-comment: '.github/comments/invalid-reproduction.md'
          reproduction-link-section: '### Link to the code that reproduces this issue(.*)### Reproduction Steps'
          reproduction-issue-labels: 'validate-reproduction'
          actions-to-perform: 'tag,comment'
          area-label-section: '### Which area\(s\) are affected\?(.*)### Environment Info'
          area-label-skip: 'Not sure'
```

--------------------------------------------------------------------------------

---[FILE: wait-until-package-version.sh]---
Location: payload-main/.github/workflows/wait-until-package-version.sh

```bash
#!/bin/bash

if [[ "$#" -ne 2 ]]; then
  echo "Usage: $0 <package-name> <version>"
  exit 1
fi

PACKAGE_NAME="$1"
TARGET_VERSION=${2#v} # Git tag has leading 'v', npm version does not
TIMEOUT=300  # 5 minutes in seconds
INTERVAL=10  # 10 seconds
ELAPSED=0

echo "Waiting for version ${TARGET_VERSION} of '${PACKAGE_NAME}' to resolve... (timeout: ${TIMEOUT} seconds)"

while [[ ${ELAPSED} -lt ${TIMEOUT} ]]; do
  latest_version=$(npm show "${PACKAGE_NAME}" version 2>/dev/null)

  if [[ ${latest_version} == "${TARGET_VERSION}" ]]; then
    echo "SUCCCESS: Version ${TARGET_VERSION} of ${PACKAGE_NAME} is available."
    exit 0
  else
    echo "Version ${TARGET_VERSION} of ${PACKAGE_NAME} is not available yet. Retrying in ${INTERVAL} seconds... (elapsed: ${ELAPSED}s)"
  fi

  sleep "${INTERVAL}"
  ELAPSED=$((ELAPSED + INTERVAL))
done

echo "Timed out after ${TIMEOUT} seconds waiting for version ${TARGET_VERSION} of '${PACKAGE_NAME}' to resolve."
exit 1
```

--------------------------------------------------------------------------------

---[FILE: pre-commit]---
Location: payload-main/.husky/pre-commit

```text
pnpm run lint-staged --quiet
```

--------------------------------------------------------------------------------

---[FILE: payload.iml]---
Location: payload-main/.idea/payload.iml

```text
<?xml version="1.0" encoding="UTF-8"?>
<module type="WEB_MODULE" version="4">
  <component name="NewModuleRootManager">
    <content url="file://$MODULE_DIR$">
      <excludeFolder url="file://$MODULE_DIR$/.tmp" />
      <excludeFolder url="file://$MODULE_DIR$/temp" />
      <excludeFolder url="file://$MODULE_DIR$/tmp" />
      <excludeFolder url="file://$MODULE_DIR$/packages/payload/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/payload/components" />
      <excludeFolder url="file://$MODULE_DIR$/packages/payload/dist" />
      <excludeFolder url="file://$MODULE_DIR$/.swc" />
      <excludeFolder url="file://$MODULE_DIR$/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/examples" />
      <excludeFolder url="file://$MODULE_DIR$/media" />
      <excludeFolder url="file://$MODULE_DIR$/packages/create-payload-app/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/create-payload-app/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/db-mongodb/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/db-mongodb/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/db-postgres/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/db-postgres/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/graphql/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/graphql/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/live-preview-react/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/live-preview-react/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/live-preview/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/live-preview/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/next/.swc" />
      <excludeFolder url="file://$MODULE_DIR$/packages/next/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/next/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/payload/fields" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-cloud-storage/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-cloud-storage/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-cloud/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-cloud/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-form-builder/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-nested-docs/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-nested-docs/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-redirects/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-redirects/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-search/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-search/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-sentry/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-seo/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-seo/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-stripe/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/richtext-lexical/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/richtext-lexical/dist" />
      <excludeFolder url="file://$MODULE_DIR$/templates" />
      <excludeFolder url="file://$MODULE_DIR$/test/.swc" />
      <excludeFolder url="file://$MODULE_DIR$/versions" />
      <excludeFolder url="file://$MODULE_DIR$/packages/richtext-slate/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/richtext-slate/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/email-nodemailer/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/email-nodemailer/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/email-resend/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/email-resend/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/live-preview-vue/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/live-preview-vue/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/payload/.swc" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-form-builder/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-relationship-object-ids/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-relationship-object-ids/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-stripe/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/storage-azure/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/storage-azure/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/storage-gcs/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/storage-gcs/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/storage-s3/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/storage-s3/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/storage-uploadthing/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/storage-uploadthing/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/storage-vercel-blob/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/storage-vercel-blob/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/translations/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/translations/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/ui/.swc" />
      <excludeFolder url="file://$MODULE_DIR$/packages/ui/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/ui/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/drizzle/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/drizzle/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/db-sqlite/.turbo" />
      <excludeFolder url="file://$MODULE_DIR$/packages/db-sqlite/dist" />
      <excludeFolder url="file://$MODULE_DIR$/packages/plugin-import-export/dist" />
    </content>
    <orderEntry type="inheritedJdk" />
    <orderEntry type="sourceFolder" forTests="false" />
  </component>
</module>
```

--------------------------------------------------------------------------------

---[FILE: Run_Dev_admin.xml]---
Location: payload-main/.idea/runConfigurations/Run_Dev_admin.xml

```text
<component name="ProjectRunConfigurationManager">
  <configuration default="false" name="Run Dev admin" type="js.build_tools.npm">
    <package-json value="$PROJECT_DIR$/package.json" />
    <command value="run" />
    <scripts>
      <script value="dev" />
    </scripts>
    <arguments value="admin" />
    <node-interpreter value="project" />
    <envs />
    <method v="2" />
  </configuration>
</component>
```

--------------------------------------------------------------------------------

---[FILE: Run_Dev_Fields.xml]---
Location: payload-main/.idea/runConfigurations/Run_Dev_Fields.xml

```text
<component name="ProjectRunConfigurationManager">
  <configuration default="false" name="Run Dev Fields" type="js.build_tools.npm">
    <package-json value="$PROJECT_DIR$/package.json" />
    <command value="run" />
    <scripts>
      <script value="dev" />
    </scripts>
    <arguments value="fields" />
    <node-interpreter value="project" />
    <envs />
    <method v="2" />
  </configuration>
</component>
```

--------------------------------------------------------------------------------

---[FILE: Run_Dev__community.xml]---
Location: payload-main/.idea/runConfigurations/Run_Dev__community.xml

```text
<component name="ProjectRunConfigurationManager">
  <configuration default="false" name="Run Dev _community" type="js.build_tools.npm">
    <package-json value="$PROJECT_DIR$/package.json" />
    <command value="run" />
    <scripts>
      <script value="dev" />
    </scripts>
    <arguments value="_community" />
    <node-interpreter value="project" />
    <envs />
    <method v="2" />
  </configuration>
</component>
```

--------------------------------------------------------------------------------

---[FILE: extensions.json]---
Location: payload-main/.vscode/extensions.json

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-playwright.playwright",
    "orta.vscode-jest"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: launch.json]---
Location: payload-main/.vscode/launch.json

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  "configurations": [
    {
      "command": "pnpm generate:types",
      "name": "Generate Types CLI",
      "request": "launch",
      "type": "node-terminal",
      "cwd": "${workspaceFolder}"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts _community",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Community",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts storage-uploadthing",
      "cwd": "${workspaceFolder}",
      "name": "Uploadthing",
      "request": "launch",
      "type": "node-terminal",
      "envFile": "${workspaceFolder}/test/storage-uploadthing/.env"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts live-preview",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Live Preview",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "node --no-deprecation test/loader/init.js",
      "cwd": "${workspaceFolder}",
      "name": "Run Loader",
      "request": "launch",
      "type": "node-terminal",
      "env": {
        "LOADER_TEST_FILE_PATH": "./dependency-test.js"
        // "LOADER_TEST_FILE_PATH": "../fields/config.ts"
      }
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts admin",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Admin",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts auth",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Auth",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts fields-relationship",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Fields-Relationship",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts query-presets",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Query Presets",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts login-with-username",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Login-With-Username",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm run dev plugin-cloud-storage",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev - plugin-cloud-storage",
      "request": "launch",
      "type": "node-terminal",
      "env": {
        "PAYLOAD_PUBLIC_CLOUD_STORAGE_ADAPTER": "s3"
      }
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts collections-graphql",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev GraphQL",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts fields",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Fields",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts versions",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Postgres",
      "request": "launch",
      "type": "node-terminal",
      "env": {
        "PAYLOAD_DATABASE": "postgres"
      }
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts versions",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Versions",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts folder-view",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Folder View",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts localization",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Localization",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts locked-documents",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Locked Documents",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts trash",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Trash",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts uploads",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Uploads",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts field-error-states",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev Field Error States",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm tsx --no-deprecation test/dev.ts plugin-search",
      "cwd": "${workspaceFolder}",
      "name": "Run Dev plugin-search",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm run test:int live-preview",
      "cwd": "${workspaceFolder}",
      "name": "Live Preview Int Tests",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "pnpm run test:int plugin-search",
      "cwd": "${workspaceFolder}",
      "name": "Search Plugin Int Tests",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "ts-node ./packages/payload/src/bin/index.ts build",
      "env": {
        "PAYLOAD_CONFIG_PATH": "test/fields/config.ts",
        "PAYLOAD_BUNDLER": "vite",
        "DISABLE_SWC": "true" // SWC messes up debugging the bin scripts
      },
      "name": "Build CLI - Vite",
      "outputCapture": "std",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "ts-node ./packages/payload/src/bin/index.ts build",
      "env": {
        "PAYLOAD_CONFIG_PATH": "test/fields/config.ts",
        "PAYLOAD_ANALYZE_BUNDLE": "true",
        "DISABLE_SWC": "true" // SWC messes up debugging the bin scripts
      },
      "name": "Build CLI - Webpack",
      "outputCapture": "std",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "ts-node ./packages/payload/src/bin/index.ts migrate:status",
      "env": {
        "PAYLOAD_CONFIG_PATH": "test/migrations-cli/config.ts",
        "PAYLOAD_DATABASE": "postgres",
        "DISABLE_SWC": "true" // SWC messes up debugging the bin scripts
        // "PAYLOAD_DROP_DATABASE": "true",
      },
      "name": "Migrate CLI - status",
      "outputCapture": "std",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "ts-node ./packages/payload/src/bin/index.ts migrate:create yass",
      "env": {
        "PAYLOAD_CONFIG_PATH": "test/migrations-cli/config.ts",
        "PAYLOAD_DATABASE": "postgres",
        "DISABLE_SWC": "true" // SWC messes up debugging the bin scripts
        // "PAYLOAD_DROP_DATABASE": "true",
      },
      "name": "Migrate CLI - create",
      "outputCapture": "std",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "ts-node ./packages/payload/src/bin/index.ts migrate:down",
      "env": {
        "PAYLOAD_CONFIG_PATH": "test/migrations-cli/config.ts",
        "PAYLOAD_DATABASE": "mongoose",
        "DISABLE_SWC": "true" // SWC messes up debugging the bin scripts
        // "PAYLOAD_DROP_DATABASE": "true",
      },
      "name": "Migrate CLI - down",
      "outputCapture": "std",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "ts-node ./packages/payload/src/bin/index.ts migrate:reset",
      "env": {
        "PAYLOAD_CONFIG_PATH": "test/migrations-cli/config.ts",
        "PAYLOAD_DATABASE": "mongoose",
        "DISABLE_SWC": "true" // SWC messes up debugging the bin scripts
        // "PAYLOAD_DROP_DATABASE": "true",
      },
      "name": "Migrate CLI - reset",
      "outputCapture": "std",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "command": "ts-node ./packages/payload/src/bin/index.ts migrate:refresh",
      "env": {
        "PAYLOAD_CONFIG_PATH": "test/migrations-cli/config.ts",
        "PAYLOAD_DATABASE": "mongoose",
        "DISABLE_SWC": "true" // SWC messes up debugging the bin scripts
        // "PAYLOAD_DROP_DATABASE": "true",
      },
      "name": "Migrate CLI - refresh",
      "outputCapture": "std",
      "request": "launch",
      "type": "node-terminal"
    },
    {
      "name": "Debug GraphQL Schema Generation",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/test/generateGraphQLSchema.ts",
      "args": ["graphql"],
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_OPTIONS": "--no-deprecation --no-experimental-strip-types"
      },
      "runtimeArgs": [
        "--no-deprecation",
        "--no-experimental-strip-types",
        "--import",
        "@swc-node/register/esm-register"
      ],
      "console": "integratedTerminal",
      "outputCapture": "std",
      "sourceMaps": true,
      "skipFiles": ["<node_internals>/**"]
    }
  ],
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0"
}
```

--------------------------------------------------------------------------------

---[FILE: settings.json]---
Location: payload-main/.vscode/settings.json

```json
{
  "npm.packageManager": "pnpm",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSaveMode": "file",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "eslint.rules.customizations": [
    // Silence some warnings that will get auto-fixed
    { "rule": "perfectionist/*", "severity": "off", "fixable": true },
    { "rule": "curly", "severity": "off", "fixable": true },
    { "rule": "object-shorthand", "severity": "off", "fixable": true }
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  // Load .git-blame-ignore-revs file
  "gitlens.advanced.blame.customArguments": ["--ignore-revs-file", ".git-blame-ignore-revs"],
  "jestrunner.jestCommand": "pnpm exec cross-env NODE_OPTIONS=\"--no-deprecation\" node 'node_modules/jest/bin/jest.js'",
  "jestrunner.changeDirectoryToWorkspaceRoot": false,
  "jestrunner.debugOptions": {
    "runtimeArgs": ["--no-deprecation"]
  },
  // Essentially disables bun test buttons
  "bun.test.filePattern": "bun.test.ts",
  "playwright.env": {
    "NODE_OPTIONS": "--no-deprecation --no-experimental-strip-types"
  },
  "jest.virtualFolders": [
    {
      "name": "root",
      "rootPath": ".",
      "runMode": {
        "type": "on-demand"
      }
    },
    {
      "name": "test",
      "rootPath": "test",
      "runMode": {
        "type": "on-demand"
      }
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: global-error.tsx]---
Location: payload-main/app/global-error.tsx
Signals: React, Next.js

```typescript
/* eslint-disable no-restricted-exports */
'use client'

import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error.js'
import { useEffect } from 'react'

export default function GlobalError({ error }: { error: { digest?: string } & Error }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error)
    }
  }, [error])

  return (
    <html lang="en-US">
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        {/* @ts-expect-error types repo */}
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/app/(app)/layout.tsx
Signals: React

```typescript
import React from 'react'

export const metadata = {
  description: 'Generated by Next.js',
  title: 'Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/app/(app)/test/page.tsx

```typescript
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const Page = async ({ params, searchParams }) => {
  const payload = await getPayload({
    config: configPromise,
  })
  return <div>test ${payload?.config?.collections?.length}</div>
}

export default Page
```

--------------------------------------------------------------------------------

---[FILE: custom.scss]---
Location: payload-main/app/(payload)/custom.scss

```text
#custom-css {
  font-family: monospace;
  background-image: url('/placeholder.png');
}

#custom-css::after {
  content: 'custom-css';
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/app/(payload)/layout.tsx
Signals: React

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
// import '@payloadcms/ui/styles.css' // Uncomment this line if `@payloadcms/ui` in `tsconfig.json` points to `/ui/dist` instead of `/ui/src`
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/app/(payload)/admin/[[...segments]]/not-found.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/app/(payload)/admin/[[...segments]]/page.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/app/(payload)/api/graphql/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/app/(payload)/api/[...slug]/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/app/my-route/route.ts

```typescript
export const GET = () => {
  return Response.json({
    hello: 'elliot',
  })
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc.json]---
Location: payload-main/docs/.prettierrc.json

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "semi": false
}
```

--------------------------------------------------------------------------------

````
