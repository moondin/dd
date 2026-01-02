---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 581
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 581 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: loadMessages.ts]---
Location: mlflow-master/mlflow/server/js/src/i18n/loadMessages.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

/**
 * This file separates the webpack require.context from the rest of the i18n message loading
 * so that it can be mocked in tests.
 */
export const DEFAULT_LOCALE = 'en';

export async function loadMessages(locale: any) {
  if (locale === DEFAULT_LOCALE) {
    return {};
  }
  if (locale === 'dev') {
    const pseudoMessages = {};
    const defaultMessages = await import('../lang/default/en.json');
    const { generateENXA } = await import('@formatjs/cli/src/pseudo_locale');
    Object.entries(defaultMessages).forEach(
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      ([key, value]) => (pseudoMessages[key] = generateENXA(value)),
    );
    return pseudoMessages;
  }

  try {
    return (await import(`../lang/compiled/${locale}.json`)).default;
  } catch (e) {
    return {};
  }
}
```

--------------------------------------------------------------------------------

````
