---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 1
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 1 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: .dockerignore]---
Location: sim-main/.dockerignore

```text
# Git
.git
.gitignore

# Documentation
LICENSE
NOTICE
README.md
*.md
docs/

# IDE and editor
.vscode
.idea
*.swp
*.swo

# Environment and config
.env*
!.env.example
.prettierrc
.prettierignore
.eslintrc*
.eslintignore

# CI/CD and DevOps
.github
.devcontainer
.husky
docker-compose*.yml
Dockerfile*

# Build artifacts and caches
.next
.turbo
.cache
dist
build
out
coverage
*.log

# Dependencies (will be installed fresh in container)
node_modules
.bun

# Test files
**/*.test.ts
**/*.test.tsx
**/*.spec.ts
**/*.spec.tsx
__tests__
__mocks__
jest.config.*
vitest.config.*

# TypeScript build info
*.tsbuildinfo

# OS files
.DS_Store
Thumbs.db

# Temporary files
tmp
temp
*.tmp
```

--------------------------------------------------------------------------------

---[FILE: .gitattributes]---
Location: sim-main/.gitattributes

```text
# Set default behavior to automatically normalize line endings
* text=auto eol=lf

# Explicitly declare text files you want to always be normalized and converted
# to native line endings on checkout
*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.jsx text eol=lf
*.json text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
*.toml text eol=lf
*.css text eol=lf
*.scss text eol=lf
*.sh text eol=lf
*.bash text eol=lf
Dockerfile* text eol=lf
.dockerignore text eol=lf
.gitignore text eol=lf
.gitattributes text eol=lf

# Denote all files that are truly binary and should not be modified
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
*.pdf binary
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: sim-main/.gitignore

```text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/apps/**/node_modules
/packages/**/node_modules
/scripts/node_modules

# bun specific
bun-debug.log*

# testing
/coverage
/apps/**/coverage

# next.js
/.next/
/apps/**/out/
/apps/**/.next/
/apps/**/build

# production
/build
/dist
**/dist/
**/standalone/
sim-standalone.tar.gz

# misc
.DS_Store
*.pem

# env files
.env
*.env
.env.local
.env.development
.env.test
.env.production

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# cursorrules
# .cursorrules

# docs
/apps/docs/.source
/apps/docs/.contentlayer
/apps/docs/.content-collections

# database instantiation
**/postgres_data/

# collector configuration
collector-config.yaml
docker-compose.collector.yml
start-collector.sh

# Turborepo
.turbo

# VSCode
.vscode

# IntelliJ
.idea

## Helm Chart Tests
helm/sim/test
i18n.cache
```

--------------------------------------------------------------------------------

---[FILE: .npmrc]---
Location: sim-main/.npmrc

```text
ignore-scripts=true
```

--------------------------------------------------------------------------------

---[FILE: biome.json]---
Location: sim-main/biome.json
Signals: React, Next.js

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0-beta.5/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": false },
  "files": {
    "ignoreUnknown": false,
    "includes": [
      "**",
      "!**/.next",
      "!**/out",
      "!**/dist",
      "!**/build",
      "!**/node_modules",
      "!**/.bun",
      "!**/.cache",
      "!**/.turbo",
      "!**/.DS_Store",
      "!**/*.pem",
      "!**/bun-debug.log*",
      "!**/.env*.local",
      "!**/.env",
      "!**/.vercel",
      "!**/coverage",
      "!**/public/sw.js",
      "!**/public/workbox-*.js",
      "!**/public/worker-*.js",
      "!**/public/fallback-*.js",
      "!**/apps/docs/.source/**",
      "!**/venv/**",
      "!**/.venv/**"
    ]
  },
  "formatter": {
    "enabled": true,
    "useEditorconfig": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 100,
    "attributePosition": "auto",
    "bracketSpacing": true,
    "includes": [
      "**",
      "!**/.next",
      "!**/out",
      "!**/dist",
      "!**/build",
      "!**/node_modules",
      "!**/.bun",
      "!**/.cache",
      "!**/.turbo",
      "!**/.DS_Store",
      "!**/*.pem",
      "!**/bun-debug.log*",
      "!**/.env*.local",
      "!**/.env",
      "!**/.vercel",
      "!**/coverage",
      "!**/public/sw.js",
      "!**/public/workbox-*.js",
      "!**/public/worker-*.js",
      "!**/public/fallback-*.js",
      "!**/apps/docs/.source/**",
      "!**/venv/**",
      "!**/.venv/**"
    ]
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": {
          "level": "on",
          "options": {
            "groups": [
              [":NODE:", "react", "react/**"],
              ":PACKAGE:",
              "@/components/**",
              "@/lib/**",
              "@/app/**",
              ":ALIAS:",
              ":RELATIVE:"
            ]
          }
        }
      }
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "nursery": {
        "useSortedClasses": "warn",
        "noNestedComponentDefinitions": "off"
      },
      "a11y": {
        "noSvgWithoutTitle": "off",
        "useAltText": "off",
        "useKeyWithClickEvents": "off",
        "noRedundantAlt": "off",
        "useSemanticElements": "off",
        "useButtonType": "off",
        "useFocusableInteractive": "off",
        "noStaticElementInteractions": "off",
        "useAriaPropsSupportedByRole": "off",
        "useAriaPropsForRole": "off"
      },
      "suspicious": {
        "noImplicitAnyLet": "off",
        "noArrayIndexKey": "off",
        "noExplicitAny": "off",
        "noControlCharactersInRegex": "off",
        "noThenProperty": "off",
        "noAssignInExpressions": "off",
        "noDocumentCookie": "off"
      },
      "correctness": {
        "useExhaustiveDependencies": "off",
        "noUnusedFunctionParameters": "off",
        "noUnusedVariables": "off"
      },
      "security": {
        "noDangerouslySetInnerHtml": "off"
      },
      "style": {
        "noNonNullAssertion": "off",
        "noParameterAssign": "off",
        "useNodejsImportProtocol": "off",
        "useAsConstAssertion": "error",
        "useDefaultParameterLast": "error",
        "useEnumInitializers": "error",
        "useSelfClosingElements": "error",
        "useSingleVarDeclarator": "error",
        "noUnusedTemplateLiteral": "off",
        "useNumberNamespace": "error",
        "noInferrableTypes": "error",
        "noUselessElse": "error"
      },
      "complexity": {
        "noForEach": "off",
        "noUselessFragments": "off",
        "noStaticOnlyClass": "off"
      },
      "performance": {
        "noAccumulatingSpread": "off",
        "noDelete": "error",
        "noImgElement": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "jsxQuoteStyle": "single",
      "quoteProperties": "asNeeded",
      "trailingCommas": "es5",
      "semicolons": "asNeeded",
      "arrowParentheses": "always",
      "bracketSameLine": false,
      "quoteStyle": "single",
      "attributePosition": "auto",
      "bracketSpacing": true
    }
  },
  "css": {
    "formatter": {
      "enabled": true,
      "indentWidth": 2
    }
  },
  "json": {
    "formatter": {
      "enabled": true,
      "indentWidth": 2
    }
  }
}
```

--------------------------------------------------------------------------------

````
