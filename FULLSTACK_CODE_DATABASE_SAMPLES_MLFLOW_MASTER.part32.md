---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 32
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 32 of 991)

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

---[FILE: docusaurusConfigUtils.ts]---
Location: mlflow-master/docs/docusaurusConfigUtils.ts

```typescript
export function postProcessSidebar(items) {
  // Remove items with customProps.hide set to true
  return items.filter((item) => item.customProps?.hide !== true);
}

export function apiReferencePrefix(): string {
  let prefix = process.env.API_REFERENCE_PREFIX || 'https://mlflow.org/docs/latest/';
  if (!prefix.startsWith('http')) {
    throw new Error(`API reference prefix must start with http, got ${prefix}`);
  }

  if (!prefix.endsWith('/')) {
    prefix += '/';
  }
  return prefix;
}
```

--------------------------------------------------------------------------------

---[FILE: eslint.config.js]---
Location: mlflow-master/docs/eslint.config.js

```javascript
const { defineConfig } = require('eslint/config');
const docusaurusEslintPlugin = require('@docusaurus/eslint-plugin');
const mlflowDocsPlugin = require('./eslint-plugin-mlflow-docs');
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const unusedImports = require('eslint-plugin-unused-imports');
const reactPlugin = require('eslint-plugin-react');

// Prevent autofixing as it can corrupt file contents
if (process.argv.includes('--fix') && !process.env.MLFLOW_DOCS_ALLOW_ESLINT_FIX) {
  throw new Error(
    'ESLint autofix is disabled because it can corrupt file contents ' +
      '(e.g., https://github.com/sweepline/eslint-plugin-unused-imports/issues/115). ' +
      'If you want to use auto-fix anyway, run this command and ' +
      'carefully review ALL changes before committing:\n\n' +
      'MLFLOW_DOCS_ALLOW_ESLINT_FIX=1 npm run eslint -- --fix',
  );
}

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    ignores: ['**/*-ipynb.mdx'],
  },
  {
    files: ['**/*.md', '**/*.mdx'],
    extends: compat.extends('plugin:mdx/recommended'),
    plugins: {
      '@docusaurus': docusaurusEslintPlugin,
      'mlflow-docs': mlflowDocsPlugin,
      'unused-imports': unusedImports,
      react: reactPlugin,
    },
    settings: {
      'mdx/code-blocks': true,
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@docusaurus/no-html-links': 'error',
      'mlflow-docs/valid-notebook-url': 'error',
      'mlflow-docs/use-base-url-for-images': 'error',
      'mlflow-docs/prefer-apilink-component': 'error',
      'unused-imports/no-unused-imports': 'error',
      // These React rules prevent component imports from being flagged as unused.
      // Required when using eslint-plugin-unused-imports with JSX/React code.
      // https://www.npmjs.com/package/eslint-plugin-unused-imports
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
    },
  },
]);
```

--------------------------------------------------------------------------------

````
