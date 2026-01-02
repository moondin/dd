---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 172
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 172 of 695)

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

---[FILE: tsconfig.bundletypes.json]---
Location: payload-main/packages/payload/tsconfig.bundletypes.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../translations" }],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as payload is a server-only package.
    // This ensures node types do not conflict with node types (e.g. fetch.dispatcher)
    "lib": ["ES2022"],
    "paths": {
      "@payloadcms/translations": ["../translations/dist/exports/index.d.ts"],
      "@payloadcms/translations/utilities": ["../translations/dist/exports/utilities.d.ts"]
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/payload/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../translations" }],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as payload is a server-only package.
    // This ensures node types do not conflict with node types (e.g. fetch.dispatcher)
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: checkPayloadDependencies.ts]---
Location: payload-main/packages/payload/src/checkPayloadDependencies.ts

```typescript
import { checkDependencies } from './utilities/dependencies/dependencyChecker.js'
import { PAYLOAD_PACKAGE_LIST } from './versions/payloadPackageList.js'

export function checkPayloadDependencies() {
  const dependencies = [...PAYLOAD_PACKAGE_LIST]

  if (process.env.PAYLOAD_CI_DEPENDENCY_CHECKER !== 'true') {
    dependencies.push('@payloadcms/plugin-sentry')
  }

  // First load. First check if there are mismatching dependency versions of payload packages
  void checkDependencies({
    dependencyGroups: [
      {
        name: 'payload',
        dependencies,
        targetVersionDependency: 'payload',
      },
    ],
  })
}
```

--------------------------------------------------------------------------------

````
