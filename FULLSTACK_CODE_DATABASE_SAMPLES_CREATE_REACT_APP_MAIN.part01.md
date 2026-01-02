---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 1
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 1 of 37)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - create-react-app-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/create-react-app-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: .alexignore]---
Location: create-react-app-main/.alexignore

```text
build

CHANGELOG*
CODE_OF_CONDUCT.md
```

--------------------------------------------------------------------------------

---[FILE: .alexrc]---
Location: create-react-app-main/.alexrc

```text
{
  "allow": [
    "attacks",
    "colors",
    "conservative",
    "crashes",
    "executed",
    "executes",
    "execution",
    "failed",
    "hook",
    "host-hostess",
    "hostesses-hosts",
    "invalid",
    "remain",
    "watchman-watchwoman"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: .eslintignore]---
Location: create-react-app-main/.eslintignore

```text
node_modules/
build/
test/fixtures/webpack-message-formatting/src/AppBabel.js
packages/react-error-overlay/lib/
```

--------------------------------------------------------------------------------

---[FILE: .eslintrc.json]---
Location: create-react-app-main/.eslintrc.json
Signals: React

```json
{
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "commonjs": true,
    "node": true,
    "es6": true,
    "jest": true
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
    "no-console": "off",
    "strict": ["error", "global"],
    "curly": "warn"
  },
  "overrides": [
    {
      "files": [
        "docusaurus/website/src/**/*.js",
        "packages/cra-template/**/*.js",
        "packages/react-error-overlay/**/*.js",
        "packages/react-scripts/fixtures/kitchensink/template/{src,integration}/**/*.js",
        "test/fixtures/*/src/*.js"
      ],
      "excludedFiles": ["packages/react-error-overlay/*.js"],
      "extends": ["react-app", "react-app/jest"]
    },
    {
      "files": [
        "test/fixtures/webpack-message-formatting/src/{AppLintError,AppLintWarning,AppUnknownFile}.js"
      ],
      "rules": {
        "no-unused-vars": "off",
        "no-undef": "off"
      }
    },
    {
      "files": ["test/fixtures/webpack-message-formatting/src/Export5.js"],
      "rules": {
        "import/no-anonymous-default-export": "off"
      }
    },
    {
      "files": ["test/fixtures/issue-5176-flow-class-properties/src/App.js"],
      "rules": {
        "no-dupe-class-members": "off"
      }
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: .gitattributes]---
Location: create-react-app-main/.gitattributes

```text
* text=auto eol=lf
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: create-react-app-main/.gitignore

```text
.idea/
.vscode/
node_modules/
build/
.DS_Store
*.tgz
my-app*
template/src/__tests__/__snapshots__/
lerna-debug.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
/.changelog
.npm/
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: create-react-app-main/.prettierignore

```text
build/
package-lock.json
test/fixtures/webpack-message-formatting/src/AppBabel.js
test/fixtures/webpack-message-formatting/src/AppCss.css
packages/react-error-overlay/fixtures/bundle*
packages/react-error-overlay/fixtures/inline*
packages/react-error-overlay/fixtures/junk*
packages/react-error-overlay/lib/
packages/react-error-overlay/coverage/
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc]---
Location: create-react-app-main/.prettierrc

```text
{
  "arrowParens": "avoid",
  "singleQuote": true,
  "semi": true
}
```

--------------------------------------------------------------------------------

````
