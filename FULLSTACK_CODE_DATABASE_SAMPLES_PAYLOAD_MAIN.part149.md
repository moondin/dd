---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 149
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 149 of 695)

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

---[FILE: jest.mjs]---
Location: payload-main/packages/eslint-config/configs/jest/rules/jest.mjs

```text
/** @type {import('eslint').Linter.Config} */
export const index = {
  'jest/consistent-test-it': ['error', { fn: 'it' }],
  'jest/expect-expect': 'error',
  'jest/prefer-lowercase-title': ['error', { ignore: ['describe'] }],
  'jest/no-alias-methods': 'error',
  'jest/no-commented-out-tests': 'off',
  'jest/no-disabled-tests': 'off',
  'jest/no-duplicate-hooks': 'error',
  'jest/no-export': 'error',
  'jest/no-focused-tests': 'error',
  'jest/no-hooks': 'off',
  'jest/no-identical-title': 'error',
  'jest/no-conditional-in-test': 'warn',
  'jest/no-jasmine-globals': 'error',
  'jest/no-large-snapshots': 'error',
  'jest/no-mocks-import': 'error',
  'jest/no-standalone-expect': 'error',
  'jest/no-done-callback': 'error',
  'jest/no-test-prefixes': 'error',
  'jest/no-test-return-statement': 'error',
  'jest/prefer-called-with': 'error',
  'jest/prefer-expect-assertions': 'off',
  'jest/prefer-hooks-on-top': 'error',
  'jest/prefer-spy-on': 'off', // broken in packages/create-payload-app/src/lib/create-project.spec.ts
  'jest/prefer-strict-equal': 'warn',
  'jest/prefer-to-contain': 'error',
  'jest/prefer-to-have-length': 'error',
  'jest/prefer-todo': 'error',
  'jest/require-top-level-describe': 'error',
  'jest/require-to-throw-message': 'error',
  'jest/valid-describe-callback': 'error',
  'jest/valid-expect-in-promise': 'error',
  'jest/valid-expect': 'error',
  'jest/valid-title': 'error',
}

export default index
```

--------------------------------------------------------------------------------

---[FILE: index.mjs]---
Location: payload-main/packages/eslint-config/configs/react/index.mjs

```text
import reactRules from './rules/react.mjs'
import reactA11yRules from './rules/react-a11y.mjs'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import { deepMerge } from '../../deepMerge.js'

/** @type {import('eslint').Linter.Config} */
export const index = deepMerge(
  react.configs['recommended-type-checked'],
  {
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',
      '@eslint-react/naming-convention/use-state': 'off',
    },
  },
  {
    rules: reactRules,
  },
  {
    rules: reactA11yRules,
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
    },
  },
)
export default index
```

--------------------------------------------------------------------------------

---[FILE: react-a11y.mjs]---
Location: payload-main/packages/eslint-config/configs/react/rules/react-a11y.mjs

```text
// Sourced from https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb/rules/react-a11y.js

/** @type {import('eslint').Linter.Config} */
export const index = {
  // Enforce that anchors have content
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-has-content.md
  'jsx-a11y/anchor-has-content': ['error', { components: [] }],

  // Require ARIA roles to be valid and non-abstract
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-role.md
  'jsx-a11y/aria-role': ['error', { ignoreNonDom: false }],

  // Enforce all aria-* props are valid.
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-props.md
  'jsx-a11y/aria-props': 'error',

  // Enforce ARIA state and property values are valid.
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-proptypes.md
  'jsx-a11y/aria-proptypes': 'error',

  // Enforce that elements that do not support ARIA roles, states, and
  // properties do not have those attributes.
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-unsupported-elements.md
  'jsx-a11y/aria-unsupported-elements': 'error',

  // Enforce that all elements that require alternative text have meaningful information
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/alt-text.md
  'jsx-a11y/alt-text': [
    'error',
    {
      elements: ['img', 'object', 'area', 'input[type="image"]'],
      img: [],
      object: [],
      area: [],
      'input[type="image"]': [],
    },
  ],

  // Prevent img alt text from containing redundant words like "image", "picture", or "photo"
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-redundant-alt.md
  'jsx-a11y/img-redundant-alt': 'error',

  // require that JSX labels use "htmlFor"
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
  // deprecated: replaced by `label-has-associated-control` rule
  'jsx-a11y/label-has-for': [
    'off',
    {
      components: [],
      required: {
        every: ['nesting', 'id'],
      },
      allowChildren: false,
    },
  ],

  // Enforce that a label tag has a text label and an associated control.
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/b800f40a2a69ad48015ae9226fbe879f946757ed/docs/rules/label-has-associated-control.md
  'jsx-a11y/label-has-associated-control': [
    'error',
    {
      labelComponents: [],
      labelAttributes: [],
      controlComponents: [],
      assert: 'both',
      depth: 25,
    },
  ],

  // Enforce that a control (an interactive element) has a text label.
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/control-has-associated-label.md
  'jsx-a11y/control-has-associated-label': [
    'error',
    {
      labelAttributes: ['label'],
      controlComponents: [],
      ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
      ignoreRoles: [
        'grid',
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'row',
        'tablist',
        'toolbar',
        'tree',
        'treegrid',
      ],
      depth: 5,
    },
  ],

  // require that mouseover/out come with focus/blur, for keyboard-only users
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
  'jsx-a11y/mouse-events-have-key-events': 'error',

  // Prevent use of `accessKey`
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-access-key.md
  'jsx-a11y/no-access-key': 'error',

  // require onBlur instead of onChange
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-onchange.md
  'jsx-a11y/no-onchange': 'off',

  // Elements with an interactive role and interaction handlers must be focusable
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/interactive-supports-focus.md
  'jsx-a11y/interactive-supports-focus': 'error',

  // Enforce that elements with ARIA roles must have all required attributes
  // for that role.
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-has-required-aria-props.md
  'jsx-a11y/role-has-required-aria-props': 'error',

  // Enforce that elements with explicit or implicit roles defined contain
  // only aria-* properties supported by that role.
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-supports-aria-props.md
  'jsx-a11y/role-supports-aria-props': 'error',

  // Enforce tabIndex value is not greater than zero.
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/tabindex-no-positive.md
  'jsx-a11y/tabindex-no-positive': 'error',

  // ensure <hX> tags have content and are not aria-hidden
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/heading-has-content.md
  'jsx-a11y/heading-has-content': ['error', { components: [''] }],

  // require HTML elements to have a "lang" prop
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/html-has-lang.md
  'jsx-a11y/html-has-lang': 'error',

  // require HTML element's lang prop to be valid
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/lang.md
  'jsx-a11y/lang': 'error',

  // prevent distracting elements, like <marquee> and <blink>
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-distracting-elements.md
  'jsx-a11y/no-distracting-elements': [
    'error',
    {
      elements: ['marquee', 'blink'],
    },
  ],

  // only allow <th> to have the "scope" attr
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/scope.md
  'jsx-a11y/scope': 'error',

  // require onClick be accompanied by onKeyUp/onKeyDown/onKeyPress
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md
  'jsx-a11y/click-events-have-key-events': 'error',

  // Enforce that DOM elements without semantic behavior not have interaction handlers
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
  'jsx-a11y/no-static-element-interactions': [
    'error',
    {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp'],
    },
  ],

  // A non-interactive element does not support event handlers (mouse and key handlers)
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-interactions.md
  'jsx-a11y/no-noninteractive-element-interactions': [
    'error',
    {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp'],
    },
  ],

  // ensure emoji are accessible
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/accessible-emoji.md
  'jsx-a11y/accessible-emoji': 'error',

  // elements with aria-activedescendant must be tabbable
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-activedescendant-has-tabindex.md
  'jsx-a11y/aria-activedescendant-has-tabindex': 'error',

  // ensure iframe elements have a unique title
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/iframe-has-title.md
  'jsx-a11y/iframe-has-title': 'error',

  // prohibit autoFocus prop
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md
  'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],

  // ensure HTML elements do not specify redundant ARIA roles
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-redundant-roles.md
  'jsx-a11y/no-redundant-roles': 'error',

  // media elements must have captions
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption.md
  'jsx-a11y/media-has-caption': [
    'error',
    {
      audio: [],
      video: [],
      track: [],
    },
  ],

  // WAI-ARIA roles should not be used to convert an interactive element to non-interactive
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-interactive-element-to-noninteractive-role.md
  'jsx-a11y/no-interactive-element-to-noninteractive-role': [
    'error',
    {
      tr: ['none', 'presentation'],
    },
  ],

  // WAI-ARIA roles should not be used to convert a non-interactive element to interactive
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-to-interactive-role.md
  'jsx-a11y/no-noninteractive-element-to-interactive-role': [
    'error',
    {
      ul: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
      ol: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
      li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
      table: ['grid'],
      td: ['gridcell'],
    },
  ],

  // Tab key navigation should be limited to elements on the page that can be interacted with.
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-tabindex.md
  'jsx-a11y/no-noninteractive-tabindex': [
    'error',
    {
      tags: [],
      roles: ['tabpanel'],
    },
  ],

  // ensure <a> tags are valid
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/0745af376cdc8686d85a361ce36952b1fb1ccf6e/docs/rules/anchor-is-valid.md
  'jsx-a11y/anchor-is-valid': [
    'error',
    {
      components: ['Link'],
      specialLink: ['to'],
      aspects: ['noHref', 'invalidHref', 'preferButton'],
    },
  ],
}

export default index
```

--------------------------------------------------------------------------------

---[FILE: react.mjs]---
Location: payload-main/packages/eslint-config/configs/react/rules/react.mjs

```text
/** @type {import('eslint').Linter.Config} */
export const index = {
  '@eslint-react/dom/no-dangerously-set-innerhtml': 'off',
  '@eslint-react/dom/no-dangerously-set-innerhtml-with-children': 'off',
  '@eslint-react/no-unsafe-component-will-mount': 'off',
  '@eslint-react/no-unsafe-component-will-receive-props': 'off',
  '@eslint-react/no-unsafe-component-will-update': 'off',
  '@eslint-react/no-set-state-in-component-did-mount': 'off',
  '@eslint-react/no-set-state-in-component-did-update': 'off',
  '@eslint-react/no-set-state-in-component-will-update': 'off',
  '@eslint-react/no-missing-component-display-name': 'off',
  '@eslint-react/no-direct-mutation-state': 'off',
  '@eslint-react/no-array-index-key': 'off',
  '@eslint-react/no-unstable-default-props': 'off', // TODO: Evaluate enabling this
  '@eslint-react/no-unstable-context-value': 'off', // TODO: Evaluate enabling this
}

export default index
```

--------------------------------------------------------------------------------

---[FILE: index.mjs]---
Location: payload-main/packages/eslint-plugin/index.mjs

```text
import noJsxImportStatements from './customRules/no-jsx-import-statements.js'
import noNonRetryableAssertions from './customRules/no-non-retryable-assertions.js'
import noRelativeMonorepoImports from './customRules/no-relative-monorepo-imports.js'
import noImportsFromExportsDir from './customRules/no-imports-from-exports-dir.js'
import noFlakyAssertions from './customRules/no-flaky-assertions.js'
import noImportsFromSelf from './customRules/no-imports-from-self.js'
import properPinoLoggerErrorUsage from './customRules/proper-payload-logger-usage.js'

/**
 * @type {import('eslint').ESLint.Plugin}
 */
const index = {
  rules: {
    'no-jsx-import-statements': noJsxImportStatements,
    'no-relative-monorepo-imports': noRelativeMonorepoImports,
    'no-imports-from-exports-dir': noImportsFromExportsDir,
    'no-imports-from-self': noImportsFromSelf,
    'proper-payload-logger-usage': properPinoLoggerErrorUsage,

    // Testing-related
    'no-non-retryable-assertions': noNonRetryableAssertions,
    'no-flaky-assertions': noFlakyAssertions,
    'no-wait-function': {
      create: function (context) {
        return {
          CallExpression(node) {
            // Check if the function being called is named "wait"
            if (node.callee.name === 'wait') {
              context.report({
                node,
                message:
                  'Usage of "wait" function is discouraged as it\'s flaky. Proper assertions should be used instead.',
              })
            }
          },
        }
      },
    },
  },
}

export default index
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/eslint-plugin/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

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
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/eslint-plugin/package.json
Signals: React

```json
{
  "name": "@payloadcms/eslint-plugin",
  "version": "3.28.0",
  "description": "Payload plugin for ESLint",
  "keywords": [],
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/eslint-plugin"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "type": "module",
  "main": "index.mjs",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@eslint-react/eslint-plugin": "1.31.0",
    "@eslint/js": "9.22.0",
    "@types/eslint": "9.6.1",
    "@typescript-eslint/parser": "8.26.1",
    "eslint": "9.22.0",
    "eslint-config-prettier": "10.1.1",
    "eslint-plugin-import-x": "4.6.1",
    "eslint-plugin-jest": "28.11.0",
    "eslint-plugin-jest-dom": "5.5.0",
    "eslint-plugin-jsx-a11y": "6.10.2",
    "eslint-plugin-perfectionist": "3.9.1",
    "eslint-plugin-react-hooks": "0.0.0-experimental-d331ba04-20250307",
    "eslint-plugin-regexp": "2.7.0",
    "globals": "16.0.0",
    "typescript": "5.7.3",
    "typescript-eslint": "8.26.1"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: no-flaky-assertions.js]---
Location: payload-main/packages/eslint-plugin/customRules/no-flaky-assertions.js

```javascript
/** @type {import('eslint').Rule.RuleModule} */
export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow non-retryable assertions in Playwright E2E tests unless they are wrapped in an expect.poll() or expect().toPass()',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },
  create: function (context) {
    const nonRetryableAssertions = [
      'toBe',
      'toBeCloseTo',
      'toBeDefined',
      'toBeFalsy',
      'toBeGreaterThan',
      'toBeGreaterThanOrEqual',
      'toBeInstanceOf',
      'toBeLessThan',
      'toBeLessThanOrEqual',
      'toBeNaN',
      'toBeNull',
      'toBeTruthy',
      'toBeUndefined',
      'toContain',
      'toContainEqual',
      'toEqual',
      'toHaveLength',
      'toHaveProperty',
      'toMatch',
      'toMatchObject',
      'toStrictEqual',
      'toThrow',
      'any',
      'anything',
      'arrayContaining',
      'closeTo',
      'objectContaining',
      'stringContaining',
      'stringMatching',
    ]

    function isNonRetryableAssertion(node) {
      return (
        node.type === 'MemberExpression' &&
        node.property.type === 'Identifier' &&
        nonRetryableAssertions.includes(node.property.name)
      )
    }

    function isExpectPollOrToPass(node) {
      if (
        node.type === 'MemberExpression' &&
        (node?.property?.name === 'poll' || node?.property?.name === 'toPass')
      ) {
        return true
      }

      return (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        ((node.callee.object.type === 'CallExpression' &&
          node.callee.object.callee.type === 'MemberExpression' &&
          node.callee.object.callee.property.name === 'poll') ||
          node.callee.property.name === 'toPass')
      )
    }

    function hasExpectPollOrToPassInChain(node) {
      let ancestor = node

      while (ancestor) {
        if (isExpectPollOrToPass(ancestor)) {
          return true
        }
        ancestor = 'object' in ancestor ? ancestor.object : ancestor.callee
      }

      return false
    }

    function hasExpectPollOrToPassInParentChain(node) {
      let ancestor = node

      while (ancestor) {
        if (isExpectPollOrToPass(ancestor)) {
          return true
        }
        ancestor = ancestor.parent
      }

      return false
    }

    return {
      CallExpression(node) {
        // node.callee is MemberExpressiom
        if (isNonRetryableAssertion(node.callee)) {
          if (hasExpectPollOrToPassInChain(node.callee)) {
            return
          }

          if (hasExpectPollOrToPassInParentChain(node)) {
            return
          }

          context.report({
            node: node.callee.property,
            message:
              'Non-retryable, flaky assertion used in Playwright test: "{{ assertion }}". Those need to be wrapped in expect.poll() or expect().toPass().',
            data: {
              assertion: node.callee.property.name,
            },
          })
        }
      },
    }
  },
}

export default rule
```

--------------------------------------------------------------------------------

---[FILE: no-imports-from-exports-dir.js]---
Location: payload-main/packages/eslint-plugin/customRules/no-imports-from-exports-dir.js

```javascript
/** @type {import('eslint').Rule.RuleModule} */
export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow imports from an exports directory',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },
  create: function (context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        // Match imports starting with any number of "../" followed by "exports/"
        const regex = /^(\.?\.\/)*exports\//

        if (regex.test(importPath)) {
          context.report({
            node: node.source,
            message:
              'Import from relative "exports/" is not allowed. Import directly to the source instead.',
          })
        }
      },
    }
  },
}

export default rule
```

--------------------------------------------------------------------------------

---[FILE: no-imports-from-self.js]---
Location: payload-main/packages/eslint-plugin/customRules/no-imports-from-self.js

```javascript
import fs from 'fs'
import path from 'path'

/** @type {import('eslint').Rule.RuleModule} */
export const rule = {
  meta: {
    docs: {
      description: 'Disallow a package from importing from itself',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },

  create(context) {
    let packageName = null

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        packageName = getPackageName(context, packageName)
        if (packageName && importPath.startsWith(packageName)) {
          context.report({
            node,
            message: `Package "${packageName}" should not import from itself. Use relative instead.`,
          })
        }
      },
    }
  },
}

export default rule

/**
 * @param {import('eslint').Rule.RuleContext} context
 * @param {string|undefined} packageName
 */
function getPackageName(context, packageName) {
  if (packageName) {
    return packageName
  }

  const pkg = findNearestPackageJson(path.dirname(context.filename))
  if (pkg) {
    return pkg.name
  }
}

/**
 * @param {string} startDir
 */
function findNearestPackageJson(startDir) {
  let currentDir = startDir
  while (currentDir !== path.dirname(currentDir)) {
    // Root directory check
    const pkgPath = path.join(currentDir, 'package.json')
    if (fs.existsSync(pkgPath)) {
      const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      return pkgContent
    }
    currentDir = path.dirname(currentDir)
  }
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: no-jsx-import-statements.js]---
Location: payload-main/packages/eslint-plugin/customRules/no-jsx-import-statements.js

```javascript
/**
 * Disallows imports from .jsx extensions. Auto-fixes to .js.
 */

/** @type {import('eslint').Rule.RuleModule} */
export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow imports from .jsx extensions',
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        if (!importPath.endsWith('.jsx')) return

        context.report({
          node: node.source,
          message: 'JSX imports are invalid. Use .js instead.',
          fix: (fixer) => {
            return fixer.removeRange([node.source.range[1] - 2, node.source.range[1] - 1])
          },
        })
      },
    }
  },
}

export default rule
```

--------------------------------------------------------------------------------

---[FILE: no-non-retryable-assertions.js]---
Location: payload-main/packages/eslint-plugin/customRules/no-non-retryable-assertions.js

```javascript
/** @type {import('eslint').Rule.RuleModule} */
export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow non-retryable assertions in Playwright E2E tests',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },
  create: function (context) {
    const nonRetryableAssertions = [
      'toBe',
      'toBeCloseTo',
      'toBeDefined',
      'toBeFalsy',
      'toBeGreaterThan',
      'toBeGreaterThanOrEqual',
      'toBeInstanceOf',
      'toBeLessThan',
      'toBeLessThanOrEqual',
      'toBeNaN',
      'toBeNull',
      'toBeTruthy',
      'toBeUndefined',
      'toContain',
      'toContainEqual',
      'toEqual',
      'toHaveLength',
      'toHaveProperty',
      'toMatch',
      'toMatchObject',
      'toStrictEqual',
      'toThrow',
      'any',
      'anything',
      'arrayContaining',
      'closeTo',
      'objectContaining',
      'stringContaining',
      'stringMatching',
    ]

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          //node.callee.object.name === 'expect' &&
          node.callee.property.type === 'Identifier' &&
          nonRetryableAssertions.includes(node.callee.property.name)
        ) {
          context.report({
            node: node.callee.property,
            message:
              'Non-retryable, flaky assertion used in Playwright test: "{{ assertion }}". Those need to be wrapped in expect.poll or expect.toPass.',
            data: {
              assertion: node.callee.property.name,
            },
          })
        }
      },
    }
  },
}

export default rule
```

--------------------------------------------------------------------------------

---[FILE: no-relative-monorepo-imports.js]---
Location: payload-main/packages/eslint-plugin/customRules/no-relative-monorepo-imports.js

```javascript
/**
 * Disallows imports from relative monorepo package paths.
 *
 * ie. `import { mongooseAdapter } from '../../../packages/mongoose-adapter/src'`
 */

/** @type {import('eslint').Rule.RuleModule} */
export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow imports from relative monorepo packages/*/src',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },
  create: function (context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        // Match imports starting with any number of "../" followed by "packages/"
        const regex = /^(\.\.\/)*((?!src\b)\w+\/)+src\//

        if (regex.test(importPath)) {
          context.report({
            node: node.source,
            message: 'Import from relative "packages/*/src" is not allowed',
          })
        }
      },
    }
  },
}

export default rule
```

--------------------------------------------------------------------------------

---[FILE: proper-payload-logger-usage.js]---
Location: payload-main/packages/eslint-plugin/customRules/proper-payload-logger-usage.js

```javascript
export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow improper usage of payload.logger.error',
      recommended: 'error',
    },
    messages: {
      improperUsage: 'Improper logger usage. Pass { msg, err } so full error stack is logged.',
      wrongErrorField: 'Improper usage. Use { err } instead of { error }.',
      wrongMessageField: 'Improper usage. Use { msg } instead of { message }.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee

        // Function to check if the expression ends with `payload.logger.error`
        function isPayloadLoggerError(expression) {
          return (
            expression.type === 'MemberExpression' &&
            expression.property.name === 'error' && // must be `.error`
            expression.object.type === 'MemberExpression' &&
            expression.object.property.name === 'logger' && // must be `.logger`
            (expression.object.object.name === 'payload' || // handles just `payload`
              (expression.object.object.type === 'MemberExpression' &&
                expression.object.object.property.name === 'payload')) // handles `*.payload`
          )
        }

        // Check if the function being called is `payload.logger.error` or `*.payload.logger.error`
        if (isPayloadLoggerError(callee)) {
          const args = node.arguments

          // Case 1: Single string / templated string is passed as the argument
          if (
            args.length === 1 &&
            ((args[0].type === 'Literal' && typeof args[0].value === 'string') ||
              args[0].type === 'TemplateLiteral')
          ) {
            return // Valid: single string argument
          }

          // Case 2: Object is passed as the first argument
          if (args.length > 0 && args[0].type === 'ObjectExpression') {
            const properties = args[0].properties

            // Ensure no { error } key, only { err } is allowed
            properties.forEach((prop) => {
              if (prop.key.type === 'Identifier' && prop.key.name === 'error') {
                context.report({
                  node: prop,
                  messageId: 'wrongErrorField',
                })
              }

              // Ensure no { message } key, only { msg } is allowed
              if (prop.key.type === 'Identifier' && prop.key.name === 'message') {
                context.report({
                  node: prop,
                  messageId: 'wrongMessageField',
                })
              }
            })
            return // Valid object, checked for 'err'/'error' keys
          }

          // Case 3: Improper usage (string / templated string + error or additional err/error)
          if (
            args.length > 1 &&
            ((args[0].type === 'Literal' && typeof args[0].value === 'string') ||
              args[0].type === 'TemplateLiteral') &&
            args[1].type === 'Identifier' &&
            (args[1].name === 'err' || args[1].name === 'error')
          ) {
            context.report({
              node,
              messageId: 'improperUsage',
            })
          }
        }
      },
    }
  },
}

export default rule
```

--------------------------------------------------------------------------------

---[FILE: proper-payload-logger-usage.js]---
Location: payload-main/packages/eslint-plugin/tests/proper-payload-logger-usage.js

```javascript
import { RuleTester } from 'eslint'
import rule from '../customRules/proper-payload-logger-usage.js'

const ruleTester = new RuleTester()

// Example tests for the rule
ruleTester.run('no-improper-payload-logger-error', rule, {
  valid: [
    // Valid: payload.logger.error with object containing { msg, err }
    {
      code: "payload.logger.error({ msg: 'some message', err })",
    },
    // Valid: payload.logger.error with a single string
    {
      code: "payload.logger.error('Some error message')",
    },
    // Valid: payload.logger.error with a templated string
    {
      code: 'payload.logger.error(`Some error message`)',
    },
    // Valid: *.payload.logger.error with object
    {
      code: "this.payload.logger.error({ msg: 'another message', err })",
    },
    {
      code: "args.req.payload.logger.error({ msg: 'different message', err })",
    },
  ],

  invalid: [
    // Invalid: payload.logger.error with both string and error
    {
      code: "payload.logger.error('Some error message', err)",
      errors: [
        {
          messageId: 'improperUsage',
        },
      ],
    },
    // Invalid: payload.logger.error with both templated string and error
    {
      code: 'payload.logger.error(`Some error message`, err)',
      errors: [
        {
          messageId: 'improperUsage',
        },
      ],
    },
    // Invalid: *.payload.logger.error with both string and error
    {
      code: "this.payload.logger.error('Some error message', error)",
      errors: [
        {
          messageId: 'improperUsage',
        },
      ],
    },
    {
      code: "args.req.payload.logger.error('Some error message', err)",
      errors: [
        {
          messageId: 'improperUsage',
        },
      ],
    },
    // Invalid: payload.logger.error with object containing 'message' key
    {
      code: "payload.logger.error({ message: 'not the right property name' })",
      errors: [
        {
          messageId: 'wrongMessageField',
        },
      ],
    },
    // Invalid: *.payload.logger.error with object containing 'error' key
    {
      code: "this.payload.logger.error({ msg: 'another message', error })",
      errors: [
        {
          messageId: 'wrongErrorField',
        },
      ],
    },
  ],
})
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/graphql/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
**/docs/**
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/graphql/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: bin.js]---
Location: payload-main/packages/graphql/bin.js

```javascript
#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const useSwc = process.argv.includes('--use-swc')
const disableTranspile = process.argv.includes('--disable-transpile')

if (disableTranspile) {
  // Remove --disable-transpile from arguments
  process.argv = process.argv.filter((arg) => arg !== '--disable-transpile')

  const start = async () => {
    const { bin } = await import('./dist/bin/index.js')
    await bin()
  }

  void start()
} else {
  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)
  const url = pathToFileURL(dirname).toString() + '/'

  if (!useSwc) {
    const start = async () => {
      // Use tsx
      let tsImport = (await import('tsx/esm/api')).tsImport

      const { bin } = await tsImport('./dist/bin/index.js', url)
      await bin()
    }

    void start()
  } else if (useSwc) {
    const { register } = await import('node:module')
    // Remove --use-swc from arguments
    process.argv = process.argv.filter((arg) => arg !== '--use-swc')

    try {
      register('@swc-node/register/esm', url)
    } catch (_) {
      console.error(
        '@swc-node/register is not installed. Please install @swc-node/register in your project, if you want to use swc in payload run.',
      )
    }

    const start = async () => {
      const { bin } = await import('./dist/bin/index.js')
      await bin()
    }

    void start()
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/graphql/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

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
```

--------------------------------------------------------------------------------

````
