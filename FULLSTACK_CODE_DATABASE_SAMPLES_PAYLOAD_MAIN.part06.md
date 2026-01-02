---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 6
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 6 of 695)

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

---[FILE: pnpm-workspace.yaml]---
Location: payload-main/.github/pnpm-workspace.yaml

```yaml
packages:
  - 'actions/*'
```

--------------------------------------------------------------------------------

---[FILE: PULL_REQUEST_TEMPLATE.md]---
Location: payload-main/.github/PULL_REQUEST_TEMPLATE.md

```text
<!--

Thank you for the PR! Please go through the checklist below and make sure you've completed all the steps.

Please review the [CONTRIBUTING.md](https://github.com/payloadcms/payload/blob/main/CONTRIBUTING.md) document in this repository if you haven't already.

The following items will ensure that your PR is handled as smoothly as possible:

- PR Title must follow conventional commits format. For example, `feat: my new feature`, `fix(plugin-seo): my fix`.
- Minimal description explained as if explained to someone not immediately familiar with the code.
- Provide before/after screenshots or code diffs if applicable.
- Link any related issues/discussions from GitHub or Discord.
- Add review comments if necessary to explain to the reviewer the logic behind a change

### What?

### Why?

### How?

Fixes #

-->
```

--------------------------------------------------------------------------------

---[FILE: reproduction-guide.md]---
Location: payload-main/.github/reproduction-guide.md

```text
# Reproduction Guide

1. [Fork](https://github.com/payloadcms/payload/fork) this repo
2. Optionally, create a new branch for your reproduction
3. Run `pnpm install` to install dependencies
4. Open up the `test/_community` directory
5. Add any necessary `collections/globals/fields` in this directory to recreate the issue you are experiencing
6. Run `pnpm dev _community` to start the admin panel

**NOTE:** The goal is to isolate the problem by reducing the number of `collections/globals/fields` you add to the `test/_community` folder. This folder is _not_ meant for you to copy your project into, but rather recreate the issue you are experiencing with minimal config.

## Example test directory file tree

```text
.
├── config.ts
├── int.spec.ts
├── e2e.spec.ts
└── payload-types.ts
```

- `config.ts` - This is the _granular_ Payload config for testing. It should be as lightweight as possible. Reference existing configs for an example
- `int.spec.ts` [Optional] - This is the test file run by jest. Any test file must have a `*int.spec.ts` suffix.
- `e2e.spec.ts` [Optional] - This is the end-to-end test file that will load up the admin UI using the above config and run Playwright tests.
- `payload-types.ts` - Generated types from `config.ts`. Generate this file by running `pnpm dev:generate-types _community`.

The directory split up in this way specifically to reduce friction when creating tests and to add the ability to boot up Payload with that specific config. You should modify the files in `test/_community` to get started.

<br />

## Testing is optional but encouraged

An issue does not need to have failing tests — reproduction steps with your forked repo are enough at this point. Some people like to dive deeper and we want to give you the guidance/tools to do so. Read more below:

### Running integration tests (Payload API tests)

First install [Jest Runner for VSVode](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner).

There are a couple ways run integration tests:

- **Granularly** - you can run individual tests in vscode by installing the Jest Runner plugin and using that to run individual tests. Clicking the `debug` button will run the test in debug mode allowing you to set break points.

  <img src="https://raw.githubusercontent.com/payloadcms/payload/main/.github/assets/int-debug.png" />

- **Manually** - you can run all int tests in the `/test/_community/int.spec.ts` file by running the following command:

  ```bash
  pnpm test:int _community
  ```

### Running E2E tests (Admin Panel UI tests)

The easiest way to run E2E tests is to install

- [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- [Playwright Runner](https://marketplace.visualstudio.com/items?itemName=ortoni.ortoni)

Once they are installed you can open the `testing` tab in vscode sidebar and drill down to the test you want to run, i.e. `/test/_community/e2e.spec.ts`

<img src="https://raw.githubusercontent.com/payloadcms/payload/main/.github/assets/e2e-debug.png" />

#### Notes

The default credentials are `dev@payloadcms.com` as email and `test` as password. They can be found in `test/credentials.ts`. By default, these will be autofilled, so no log-in is required.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/.github/actions/activity/package.json

```json
{
  "private": true,
  "license": "MIT",
  "scripts": {
    "build": "pnpm build:typecheck && pnpm build:popular-issues:ncc && pnpm build:new-issues:ncc",
    "build:new-issues:ncc": "ncc build src/new-issues.ts -m -o dist/new-issues",
    "build:popular-issues:ncc": "ncc build src/popular-issues.ts -m -o dist/popular-issues",
    "build:typecheck": "tsc",
    "clean": "rimraf dist"
  },
  "dependencies": {
    "@actions/core": "^1.3.0",
    "@actions/github": "^5.0.0",
    "@slack/web-api": "^7.10.0"
  },
  "devDependencies": {
    "@octokit/openapi-types": "^26.0.0",
    "@octokit/webhooks-types": "^7.5.1",
    "@types/node": "^20.16.5",
    "@vercel/ncc": "0.38.1",
    "typescript": "^4.9.5"
  }
}
```

--------------------------------------------------------------------------------

````
