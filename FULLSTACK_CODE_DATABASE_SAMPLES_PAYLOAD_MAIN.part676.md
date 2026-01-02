---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 676
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 676 of 695)

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

---[FILE: getMimeType.ts]---
Location: payload-main/test/uploads/getMimeType.ts

```typescript
import path from 'path'

export const getMimeType = (
  filePath: string,
): {
  filename: string
  type: string
} => {
  const ext = path.extname(filePath).slice(1)
  let type: string
  switch (ext) {
    case 'png':
      type = 'image/png'
      break
    case 'jpg':
      type = 'image/jpeg'
      break
    case 'jpeg':
      type = 'image/jpeg'
      break
    case 'svg':
      type = 'image/svg+xml'
      break
    case 'webp':
      type = 'image/webp'
      break
    default:
      type = 'image/png'
  }

  return {
    filename: path.basename(filePath),
    type,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: image.svg]---
Location: payload-main/test/uploads/image.svg

```text
<svg width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    path {
      fill: #333333;
    }

    @media (prefers-color-scheme: dark) {
      path {
        fill: white;
      }
    }
  </style>
	<path d="M120.59 8.5824L231.788 75.6142V202.829L148.039 251.418V124.203L36.7866 57.2249L120.59 8.5824Z" />
	<path d="M112.123 244.353V145.073L28.2114 193.769L112.123 244.353Z" />
</svg>
```

--------------------------------------------------------------------------------

````
