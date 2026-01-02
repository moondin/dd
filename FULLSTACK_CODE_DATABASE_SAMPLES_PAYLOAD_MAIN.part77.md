---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 77
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 77 of 695)

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

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/select/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const selectFields: CollectionConfig['fields'] = [
  {
    name: 'selectFieldServerComponent',
    type: 'select',
    admin: {
      components: {
        Field: '@/collections/Fields/select/components/server/Field#CustomSelectFieldServer',
        Label: '@/collections/Fields/select/components/server/Label#CustomSelectFieldLabelServer',
      },
    },
    options: [
      {
        label: 'Option 1',
        value: 'option-1',
      },
      {
        label: 'Option 2',
        value: 'option-2',
      },
      {
        label: 'Option 3',
        value: 'option-3',
      },
    ],
  },
  {
    name: 'selectFieldClientComponent',
    type: 'select',
    admin: {
      components: {
        Field: '@/collections/Fields/select/components/client/Field#CustomSelectFieldClient',
        Label: '@/collections/Fields/select/components/client/Label#CustomSelectFieldLabelClient',
      },
    },
    options: [
      {
        label: 'Option 1',
        value: 'option-1',
      },
      {
        label: 'Option 2',
        value: 'option-2',
      },
      {
        label: 'Option 3',
        value: 'option-3',
      },
    ],
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/select/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { SelectFieldClientComponent } from 'payload'

import { SelectField } from '@payloadcms/ui'
import React from 'react'

export const CustomSelectFieldClient: SelectFieldClientComponent = (props) => {
  return <SelectField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/select/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { SelectFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomSelectFieldLabelClient: SelectFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/select/components/server/Field.tsx
Signals: React

```typescript
import type { SelectFieldServerComponent } from 'payload'
import type React from 'react'

import { SelectField } from '@payloadcms/ui'

export const CustomSelectFieldServer: SelectFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <SelectField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/select/components/server/Label.tsx
Signals: React

```typescript
import type { SelectFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomSelectFieldLabelServer: SelectFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/text/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const textFields: CollectionConfig['fields'] = [
  {
    name: 'textFieldServerComponent',
    type: 'text',
    admin: {
      components: {
        Field: '@/collections/Fields/text/components/server/Field#CustomTextFieldServer',
        Label: '@/collections/Fields/text/components/server/Label#CustomTextFieldLabelServer',
      },
    },
  },
  {
    name: 'textFieldClientComponent',
    type: 'text',
    admin: {
      components: {
        Field: '@/collections/Fields/text/components/client/Field#CustomTextFieldClient',
        Label: '@/collections/Fields/text/components/client/Label#CustomTextFieldLabelClient',
      },
    },
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/text/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { TextFieldClientComponent } from 'payload'

import { TextField } from '@payloadcms/ui'
import React from 'react'

export const CustomTextFieldClient: TextFieldClientComponent = (props) => {
  return <TextField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/text/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { TextFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomTextFieldLabelClient: TextFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/text/components/server/Field.tsx
Signals: React

```typescript
import type { TextFieldServerComponent } from 'payload'
import type React from 'react'

import { TextField } from '@payloadcms/ui'

export const CustomTextFieldServer: TextFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <TextField field={clientField} path={path} schemaPath={schemaPath} permissions={permissions} />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/text/components/server/Label.tsx
Signals: React

```typescript
import type { TextFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomTextFieldLabelServer: TextFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/textarea/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const textareaFields: CollectionConfig['fields'] = [
  {
    name: 'textareaFieldServerComponent',
    type: 'textarea',
    admin: {
      components: {
        Field: '@/collections/Fields/textarea/components/server/Field#CustomTextareaFieldServer',
        Label:
          '@/collections/Fields/textarea/components/server/Label#CustomTextareaFieldLabelServer',
      },
    },
  },
  {
    name: 'textareaFieldClientComponent',
    type: 'textarea',
    admin: {
      components: {
        Field: '@/collections/Fields/textarea/components/client/Field#CustomTextareaFieldClient',
        Label:
          '@/collections/Fields/textarea/components/client/Label#CustomTextareaFieldLabelClient',
      },
    },
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/textarea/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { TextareaFieldClientComponent } from 'payload'

import { TextareaField } from '@payloadcms/ui'
import React from 'react'

export const CustomTextareaFieldClient: TextareaFieldClientComponent = (props) => {
  return <TextareaField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/textarea/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { TextareaFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomTextareaFieldLabelClient: TextareaFieldLabelClientComponent = ({
  field,
  path,
}) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/textarea/components/server/Field.tsx
Signals: React

```typescript
import type { TextareaFieldServerComponent } from 'payload'
import type React from 'react'

import { TextareaField } from '@payloadcms/ui'

export const CustomTextareaFieldServer: TextareaFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <TextareaField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/textarea/components/server/Label.tsx
Signals: React

```typescript
import type { TextareaFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomTextareaFieldLabelServer: TextareaFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/RootViews/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const CustomRootViews: CollectionConfig = {
  slug: 'custom-root-views',
  admin: {
    components: {
      views: {
        edit: {
          root: {
            Component: '@/collections/RootViews/components/CustomRootEditView#CustomRootEditView',
          },
        },
      },
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: CustomRootEditView.tsx]---
Location: payload-main/examples/custom-components/src/collections/RootViews/components/CustomRootEditView.tsx
Signals: React

```typescript
import type { ServerSideEditViewProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

export const CustomRootEditView: React.FC<ServerSideEditViewProps> = () => {
  return (
    <Gutter>
      <h1>Custom Root Edit View</h1>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Views/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const CustomViews: CollectionConfig = {
  slug: 'custom-views',
  admin: {
    components: {
      views: {
        edit: {
          customView: {
            Component: '@/collections/Views/components/CustomTabEditView#CustomTabEditView',
            path: '/custom-tab',
            tab: {
              href: '/custom-tab',
              label: 'Custom Tab',
            },
          },
          default: {
            Component: '@/collections/Views/components/CustomDefaultEditView#CustomDefaultEditView',
          },
        },
      },
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: CustomDefaultEditView.tsx]---
Location: payload-main/examples/custom-components/src/collections/Views/components/CustomDefaultEditView.tsx
Signals: React

```typescript
import type { ServerSideEditViewProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

export const CustomDefaultEditView: React.FC<ServerSideEditViewProps> = () => {
  return (
    <Gutter>
      <h1>Custom Default Edit View</h1>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: CustomTabEditView.tsx]---
Location: payload-main/examples/custom-components/src/collections/Views/components/CustomTabEditView.tsx
Signals: React

```typescript
import type { ServerSideEditViewProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

export const CustomTabEditView: React.FC<ServerSideEditViewProps> = () => {
  return (
    <Gutter>
      <h1>Custom Tab Edit View</h1>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: LinkToCustomDefaultView.tsx]---
Location: payload-main/examples/custom-components/src/components/afterNavLinks/LinkToCustomDefaultView.tsx
Signals: React, Next.js

```typescript
import Link from 'next/link'
import React from 'react'

export const LinkToCustomDefaultView: React.FC = () => {
  return <Link href="/admin/custom-default">Go to Custom Default View</Link>
}
```

--------------------------------------------------------------------------------

---[FILE: LinkToCustomMinimalView.tsx]---
Location: payload-main/examples/custom-components/src/components/afterNavLinks/LinkToCustomMinimalView.tsx
Signals: React, Next.js

```typescript
import Link from 'next/link'
import React from 'react'

export const LinkToCustomMinimalView: React.FC = () => {
  return <Link href="/admin/custom-minimal">Go to Custom Minimal View</Link>
}
```

--------------------------------------------------------------------------------

---[FILE: LinkToCustomView.tsx]---
Location: payload-main/examples/custom-components/src/components/afterNavLinks/LinkToCustomView.tsx
Signals: React, Next.js

```typescript
import Link from 'next/link'
import React from 'react'

export const LinkToCustomView: React.FC = () => {
  return <Link href="/admin/custom">Go to Custom View</Link>
}
```

--------------------------------------------------------------------------------

---[FILE: CustomDefaultRootView.tsx]---
Location: payload-main/examples/custom-components/src/components/views/CustomDefaultRootView.tsx
Signals: React

```typescript
import type { AdminViewProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

export const CustomDefaultRootView: React.FC<AdminViewProps> = ({
  initPageResult,
  params,
  searchParams,
}) => {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>Custom Default Root View</h1>
        <br />
        <p>This view uses the Default Template.</p>
      </Gutter>
    </DefaultTemplate>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: CustomMinimalRootView.tsx]---
Location: payload-main/examples/custom-components/src/components/views/CustomMinimalRootView.tsx
Signals: React

```typescript
import type { AdminViewProps } from 'payload'

import { MinimalTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

export const CustomMinimalRootView: React.FC<AdminViewProps> = () => {
  return (
    <MinimalTemplate>
      <Gutter>
        <h1>Custom Minimal Root View</h1>
        <br />
        <p>This view uses the Minimal Template.</p>
      </Gutter>
    </MinimalTemplate>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: CustomRootView.tsx]---
Location: payload-main/examples/custom-components/src/components/views/CustomRootView.tsx
Signals: React

```typescript
import type { AdminViewProps } from 'payload'

import React from 'react'

export const CustomRootView: React.FC<AdminViewProps> = () => {
  return (
    <div>
      <h1>Custom Root View</h1>
      <br />
      <p>This is a completely standalone view.</p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: seed.ts]---
Location: payload-main/examples/custom-components/src/migrations/seed.ts

```typescript
import type { MigrateUpArgs } from '@payloadcms/db-mongodb'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.create({
    collection: 'users',
    data: {
      email: 'demo@payloadcms.com',
      password: 'demo',
    },
  })

  await payload.create({
    collection: 'custom-fields',
    data: {
      title: 'Custom Fields',
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/examples/custom-server/.gitignore

```text
# Created by https://www.toptal.com/developers/gitignore/api/node,macos,windows,webstorm,sublimetext,visualstudiocode
# Edit at https://www.toptal.com/developers/gitignore?templates=node,macos,windows,webstorm,sublimetext,visualstudiocode

### macOS ###
# General
.DS_Store
.AppleDouble
.LSOverride

# Icon must end with two \r
Icon

# Thumbnails
._*

# Files that might appear in the root of a volume
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent

# Directories potentially created on remote AFP share
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk

### macOS Patch ###
# iCloud generated files
*.icloud

### Node ###
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp

# Docusaurus cache and generated files
.docusaurus

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

### Node Patch ###
# Serverless Webpack directories
.webpack/

# Optional stylelint cache

# SvelteKit build / generate output
.svelte-kit

### SublimeText ###
# Cache files for Sublime Text
*.tmlanguage.cache
*.tmPreferences.cache
*.stTheme.cache

# Workspace files are user-specific
*.sublime-workspace

# Project files should be checked into the repository, unless a significant
# proportion of contributors will probably not be using Sublime Text
# *.sublime-project

# SFTP configuration file
sftp-config.json
sftp-config-alt*.json

# Package control specific files
Package Control.last-run
Package Control.ca-list
Package Control.ca-bundle
Package Control.system-ca-bundle
Package Control.cache/
Package Control.ca-certs/
Package Control.merged-ca-bundle
Package Control.user-ca-bundle
oscrypto-ca-bundle.crt
bh_unicode_properties.cache

# Sublime-github package stores a github token in this file
# https://packagecontrol.io/packages/sublime-github
GitHub.sublime-settings

### VisualStudioCode ###
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets

# Local History for Visual Studio Code
.history/

# Built Visual Studio Code Extensions
*.vsix

### VisualStudioCode Patch ###
# Ignore all local history of files
.history
.ionide

### WebStorm ###
# Covers JetBrains IDEs: IntelliJ, RubyMine, PhpStorm, AppCode, PyCharm, CLion, Android Studio, WebStorm and Rider
# Reference: https://intellij-support.jetbrains.com/hc/en-us/articles/206544839

# User-specific stuff
.idea/**/workspace.xml
.idea/**/tasks.xml
.idea/**/usage.statistics.xml
.idea/**/dictionaries
.idea/**/shelf

# AWS User-specific
.idea/**/aws.xml

# Generated files
.idea/**/contentModel.xml

# Sensitive or high-churn files
.idea/**/dataSources/
.idea/**/dataSources.ids
.idea/**/dataSources.local.xml
.idea/**/sqlDataSources.xml
.idea/**/dynamic.xml
.idea/**/uiDesigner.xml
.idea/**/dbnavigator.xml

# Gradle
.idea/**/gradle.xml
.idea/**/libraries

# Gradle and Maven with auto-import
# When using Gradle or Maven with auto-import, you should exclude module files,
# since they will be recreated, and may cause churn.  Uncomment if using
# auto-import.
# .idea/artifacts
# .idea/compiler.xml
# .idea/jarRepositories.xml
# .idea/modules.xml
# .idea/*.iml
# .idea/modules
# *.iml
# *.ipr

# CMake
cmake-build-*/

# Mongo Explorer plugin
.idea/**/mongoSettings.xml

# File-based project format
*.iws

# IntelliJ
out/

# mpeltonen/sbt-idea plugin
.idea_modules/

# JIRA plugin
atlassian-ide-plugin.xml

# Cursive Clojure plugin
.idea/replstate.xml

# SonarLint plugin
.idea/sonarlint/

# Crashlytics plugin (for Android Studio and IntelliJ)
com_crashlytics_export_strings.xml
crashlytics.properties
crashlytics-build.properties
fabric.properties

# Editor-based Rest Client
.idea/httpRequests

# Android studio 3.1+ serialized cache file
.idea/caches/build_file_checksums.ser

### WebStorm Patch ###
# Comment Reason: https://github.com/joeblau/gitignore.io/issues/186#issuecomment-215987721

# *.iml
# modules.xml
# .idea/misc.xml
# *.ipr

# Sonarlint plugin
# https://plugins.jetbrains.com/plugin/7973-sonarlint
.idea/**/sonarlint/

# SonarQube Plugin
# https://plugins.jetbrains.com/plugin/7238-sonarqube-community-plugin
.idea/**/sonarIssues.xml

# Markdown Navigator plugin
# https://plugins.jetbrains.com/plugin/7896-markdown-navigator-enhanced
.idea/**/markdown-navigator.xml
.idea/**/markdown-navigator-enh.xml
.idea/**/markdown-navigator/

# Cache file creation bug
# See https://youtrack.jetbrains.com/issue/JBR-2257
.idea/$CACHE_FILE$

# CodeStream plugin
# https://plugins.jetbrains.com/plugin/12206-codestream
.idea/codestream.xml

# Azure Toolkit for IntelliJ plugin
# https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij
.idea/**/azureSettings.xml

### Windows ###
# Windows thumbnail cache files
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db

# Dump file
*.stackdump

# Folder config file
[Dd]esktop.ini

# Recycle Bin used on file shares
$RECYCLE.BIN/

# Windows Installer files
*.cab
*.msi
*.msix
*.msm
*.msp

# Windows shortcuts
*.lnk

# End of https://www.toptal.com/developers/gitignore/api/node,macos,windows,webstorm,sublimetext,visualstudiocode
```

--------------------------------------------------------------------------------

---[FILE: next-env.d.ts]---
Location: payload-main/examples/custom-server/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.ts]---
Location: payload-main/examples/custom-server/next.config.ts
Signals: Next.js

```typescript
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default withPayload(nextConfig)
```

--------------------------------------------------------------------------------

---[FILE: nodemon.json]---
Location: payload-main/examples/custom-server/nodemon.json

```json
{
  "watch": ["src/server.ts"],
  "exec": "tsx src/server.ts",
  "ext": "ts"
}
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/examples/custom-server/package.json
Signals: React, Next.js, Express

```json
{
  "name": "payload-3-custom-server",
  "type": "module",
  "scripts": {
    "build": "next build && tsc --project tsconfig.server.json",
    "dev": "nodemon",
    "generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
    "generate:types": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types",
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "start": "cross-env NODE_ENV=production node dist/server.js"
  },
  "dependencies": {
    "@payloadcms/db-mongodb": "latest",
    "@payloadcms/next": "latest",
    "@payloadcms/payload-cloud": "latest",
    "@payloadcms/richtext-lexical": "latest",
    "cross-env": "^7.0.3",
    "express": "^4.21.1",
    "graphql": "^16.8.1",
    "next": "15.4.10",
    "payload": "latest",
    "react": "^19.2.1",
    "react-dom": "^19.2.1"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^18.11.5",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "nodemon": "^3.1.7",
    "ts-node": "^10.9.2",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}
```

--------------------------------------------------------------------------------

````
