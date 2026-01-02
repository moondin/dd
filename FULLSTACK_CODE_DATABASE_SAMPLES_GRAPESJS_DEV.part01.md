---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 1
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 1 of 97)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - grapesjs-dev
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/grapesjs-dev
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: .eslintrc.js]---
Location: grapesjs-dev/.eslintrc.js

```javascript
module.exports = {
  root: true, // Add this to indicate this is the root ESLint configuration
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
  },
  globals: {
    $: true,
    grapesjs: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'jest'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'no-var': 'off',
    'prefer-const': 'off',
    'no-prototype-builtins': 'off',
    'no-useless-escape': 'off',
    'prefer-rest-params': 'off',
    'no-empty': 'off',
    'prefer-spread': 'off',
    'no-extra-boolean-cast': 'off',
    'no-unsafe-optional-chaining': 'off',
    'no-shadow-restricted-names': 'off',
    'no-cond-assign': 'off',
    'no-fallthrough': 'off',
    'no-sparse-arrays': 'off',
    'no-redeclare': 'off',
    'no-control-regex': 'off',
    'no-constant-condition': 'off',
    'no-misleading-character-class': 'off',
    'no-undef': 'off',
    'no-func-assign': 'off',
    'no-regex-spaces': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unnecessary-type-const': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-wrapper-object-types': 'off',
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', { code: 300 }],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
  },
  ignorePatterns: ['*/docs/api/*', 'dist', 'packages/cli/src/template/**/*.*', '*/locale/*', 'stats.json'],
};
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: grapesjs-dev/.gitignore

```text
.DS_Store
.settings/
.sass-cache/
.project
.idea
npm-debug.log*
yarn-error.log
package-lock.json
style/.sass-cache/
stats.json
.npmrc

img/
images/
private/
vendor/
coverage/
locale/
node_modules/
bower_components/
grapesjs-*.tgz
_index.html
docs/.vuepress/dist
dist/
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: grapesjs-dev/.prettierignore

```text
docs/**/*.md
dist/
pnpm-lock.yaml
packages/cli/src/template/**/*.*
**/locale/**
stats.json
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc]---
Location: grapesjs-dev/.prettierrc

```text
{
  "endOfLine": "lf",
  "insertPragma": false,
  "requirePragma": false,
  "trailingComma": "all",
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "printWidth": 120
}
```

--------------------------------------------------------------------------------

---[FILE: CODE_OF_CONDUCT.md]---
Location: grapesjs-dev/CODE_OF_CONDUCT.md

```text
# Contributor Covenant Code of Conduct

## Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful.

## Scope

This Code of Conduct applies both within project spaces and in public spaces when an individual is representing the project or its community. Examples of representing a project or community include using an official project e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event. Representation of a project may be further defined and clarified by project maintainers.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at artur.catch@hotmail.it. The project team will review and investigate all complaints, and will respond in a way that it deems appropriate to the circumstances. The project team is obligated to maintain confidentiality with regard to the reporter of an incident. Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good faith may face temporary or permanent repercussions as determined by other members of the project's leadership.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4, available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
```

--------------------------------------------------------------------------------

---[FILE: CONTRIBUTING.md]---
Location: grapesjs-dev/CONTRIBUTING.md

```text
# Contribute to GrapesJS

Thank you for your interest in contributing to GrapesJS! We welcome all types of contributions, including bug reports, feature suggestions, documentation improvements, and code contributions.

## Quick Start

### Prerequisites

- Node.js (version 20 LTS)
- pnpm (version 9.10.0 or later)

### Setup

1. Install Node.js 20 LTS:

   ```bash
   nvm install 20
   nvm use 20
   ```

2. Install pnpm globally:

   ```bash
   npm install -g pnpm@9.10.0
   ```

3. Clone the repository:

   ```bash
   git clone https://github.com/GrapesJS/grapesjs.git
   cd grapesjs
   ```

4. Install dependencies:

   ```bash
   pnpm install
   ```

5. Run the build script:

   ```bash
   pnpm run build
   ```

6. Start the development server:

   ```bash
   pnpm start
   ```

7. Open `http://localhost:8080/` in your browser to see the editor in action.

## Development Workflow

- **Linting**: `pnpm lint`
- **Formatting**: `pnpm format`
- **Checking format**: `pnpm format:check`
- **Building**: `pnpm build`
- **Testing**: `pnpm test`

### Code Style

We use ESLint for linting and Prettier for code formatting. While we don't have pre-commit hooks, we strongly recommend using these tools before submitting your changes:

- Run `pnpm lint` to check for linting errors.
- Run `pnpm format` to automatically format your code.
- Run `pnpm format:check` to check if your code is formatted correctly.

Code style is enforced at the CI level. We recommend using Prettier extensions in your editor for real-time formatting.

### Documentation

To generate and view the documentation:

1. Generate API documentation:

   ```bash
   pnpm run docs:api
   ```

2. Run the VuePress documentation server:

   ```bash
   pnpm run docs
   ```

3. Open `http://localhost:8080/` to view the documentation.

## Pull Requests

When submitting a pull request:

- Target your PR to the `dev` branch.
- Clearly describe the problem and solution.
- Include the relevant issue number if applicable.
- Add tests for new features or bug fixes.

If you're a first-time contributor, consider starting a discussion or opening an issue related to your changes before submitting a PR. This helps with collaboration and prevents duplicate work.

## Questions?

If you have any questions, please [open an issue](https://github.com/GrapesJS/grapesjs/issues) or start a [discussion](https://github.com/GrapesJS/grapesjs/discussions). Search existing issues and discussions first to avoid duplicates.

## Thank You

Your contributions to open source, no matter how small, make projects like GrapesJS possible. Thank you for taking the time to contribute.
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: grapesjs-dev/LICENSE

```text
./packages/core/LICENSE
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: grapesjs-dev/package.json
Signals: React

```json
{
  "name": "@grapesjs/monorepo",
  "version": "0.0.0",
  "packageManager": "pnpm@9.10.0",
  "scripts": {
    "start": "pnpm --filter grapesjs start",
    "start:docs": "pnpm --filter @grapesjs/docs docs",
    "test": "pnpm -r run test",
    "docs": "pnpm --filter @grapesjs/docs docs",
    "docs:api": "pnpm --filter @grapesjs/docs docs:api",
    "lint": "eslint .",
    "build": "pnpm -r run build",
    "check": "pnpm run lint && pnpm run format:check && pnpm run ts:check",
    "ts:check": "pnpm --filter grapesjs ts:check",
    "clean": "find . -type d \\( -name \"node_modules\" -o -name \"build\" -o -name \"dist\" \\) -exec rm -rf {} + && rm ./pnpm-lock.yaml",
    "format": "prettier . --write --ignore-path .prettierignore",
    "format:check": "prettier . --check --ignore-path .prettierignore",
    "release:core:rc": "ts-node scripts/releaseCore rc",
    "release:core:latest": "ts-node scripts/releaseCore latest",
    "release:cli:rc": "ts-node scripts/releaseCli rc",
    "release:cli:latest": "ts-node scripts/releaseCli latest",
    "publish:core:rc": "cd packages/core && npm publish --tag rc --access public",
    "publish:core:latest": "cd packages/core && npm publish --access public",
    "build:core": "pnpm --filter grapesjs build",
    "release:docs": "ts-node scripts/releaseDocs latest",
    "build:cli": "pnpm --filter grapesjs-cli build",
    "build:docs:api": "pnpm --filter @grapesjs/docs docs:api",
    "build:docs": "pnpm --filter @grapesjs/docs build"
  },
  "devDependencies": {
    "@babel/cli": "7.27.0",
    "@babel/core": "7.25.2",
    "@babel/preset-env": "7.25.4",
    "@babel/preset-typescript": "7.24.7",
    "@babel/runtime": "7.25.6",
    "babel-loader": "9.1.3",
    "@jest/globals": "29.7.0",
    "@types/jest": "29.5.12",
    "@types/node": "22.4.1",
    "@types/underscore": "^1.11.15",
    "@typescript-eslint/eslint-plugin": "8.10.0",
    "@typescript-eslint/parser": "8.10.0",
    "cross-env": "7.0.3",
    "css-loader": "7.1.2",
    "dotenv": "16.4.5",
    "eslint": "8.57.0",
    "eslint-config-prettier": "9.1.0",
    "eslint-config-standard-with-typescript": "43.0.1",
    "eslint-plugin-import": "2.31.0",
    "eslint-plugin-jest": "28.8.3",
    "eslint-plugin-n": "17.17.0",
    "eslint-plugin-prettier": "5.2.1",
    "eslint-plugin-promise": "7.1.0",
    "eslint-plugin-react-hooks": "4.6.2",
    "jest": "29.7.0",
    "prettier": "3.3.3",
    "ts-jest": "29.2.4",
    "ts-loader": "9.5.2",
    "ts-node": "10.9.2",
    "typescript": "5.5.4"
  },
  "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": [
        "@babel/*",
        "typescript",
        "ts-node",
        "@tsconfig/*",
        "@types/*",
        "jest",
        "@jest/*",
        "supertest",
        "prettier",
        "webpack",
        "grapesjs-cli"
      ]
    }
  },
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  }
}
```

--------------------------------------------------------------------------------

````
