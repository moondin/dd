---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 62
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 62 of 695)

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

---[FILE: troubleshooting.mdx]---
Location: payload-main/docs/troubleshooting/troubleshooting.mdx

```text
---
title: Troubleshooting
label: Troubleshooting
order: 10
desc: Troubleshooting Common Issues in Payload
keywords: admin, components, custom, customize, documentation, Content Management System, cms, headless, javascript, node, react, nextjs, troubleshooting
---

## Dependency mismatches

All `payload` and `@payloadcms/*` packages must be on exactly the same version and installed only once.

When two copies—or two different versions—of any of these packages (or of `react` / `react-dom`) appear in your dependency graph, you can see puzzling runtime errors. The most frequent is a broken React context:

```bash
TypeError: Cannot destructure property 'config' of...
```

This happens because one package imports a hook (most commonly `useConfig`) from _version A_ while the context provider comes from _version B_. The fix is always the same: make sure every Payload-related and React package resolves to the same module.

### Confirm whether duplicates exist

The first thing to do is to confirm whether duplicative dependencies do in fact exist.

There are two ways to do this:

1. Using pnpm's built-in inspection tool

```bash
pnpm why @payloadcms/ui
```

This prints the dependency tree and shows which versions are being installed. If you see more than one distinct version—or the same version listed under different paths—you have duplication.

2. Manual check (works with any package manager)

```bash
find node_modules -name package.json \
     -exec grep -H '"name": "@payloadcms/ui"' {} \;
```

Most of these hits are likely symlinks created by pnpm. Edit the matching package.json files (temporarily add a comment or change a description) to confirm whether they point to the same physical folder or to multiple copies.

Perform the same two checks for react and react-dom; a second copy of React can cause identical symptoms.

#### If no duplicates are found

`@payloadcms/ui` intentionally contains two bundles of itself, so you may see dual paths even when everything is correct. Inside the Payload Admin UI you must import only:

- `@payloadcms/ui`
- `@payloadcms/ui/rsc`
- `@payloadcms/ui/shared`

Any other deep import such as `@payloadcms/ui/elements/Button` should **only** be used in your own frontend, outside of the Payload Admin Panel. Those deep entries are published un-bundled to help you tree-shake and ship a smaller client bundle if you only need a few components from `@payloadcms/ui`.

### Fixing dependency issues

These steps assume `pnpm`, which the Payload team recommends and uses internally. The principles apply to other package managers like npm and yarn as well. Do note that yarn 1.x is not supported by Payload.

1. Pin every critical package to an exact version

In package.json remove `^` or `~` from all versions of:

- `payload`
- `@payloadcms/*`
- `react`
- `react-dom`

Prefixes allow your package manager to float to a newer minor/patch release, causing mismatches.

2. Delete node_modules

Old packages often linger even after you change versions or removed them from your package.json. Deleting node_modules ensures a clean slate.

3. Re-install dependencies

```bash
pnpm install
```

#### If the error persists

1. Clean the global store (pnpm only)

```bash
pnpm store prune
```

2. Delete the lockfile

Depending on your package manager, this could be `pnpm-lock.yaml`, `package-lock.json`, or `yarn.lock`.

Make sure you delete the lockfile **and** the node_modules folder at the same time, then run `pnpm install`. This forces a fresh, consistent resolution for all packages. It will also update all packages with dynamic versions to the latest version.

While it's best practice to manage dependencies in such a way where the lockfile can easily be re-generated (often this is the easiest way to resolve dependency issues), this may break your project if you have not tested the latest versions of your dependencies.

If you are using a version control system, make sure to commit your lockfile after this step.

3. Deduplicate anything that slipped through

```bash
pnpm dedupe
```

**Still stuck?**

- Switch to `pnpm` if you are on npm. Its symlinked store helps reducing accidental duplication.
- Inspect the lockfile directly for peer-dependency violations.
- Check project-level .npmrc / .pnpmfile.cjs overrides.
- Run [Syncpack](https://www.npmjs.com/package/syncpack) to enforce identical versions of every `@payloadcms/*`, `react`, and `react-dom` reference.

Absolute last resort: add Webpack aliases so that all imports of a given package resolve to the same path (e.g. `resolve.alias['react'] = path.resolve('./node_modules/react')`). Keep this only until you can fix the underlying version skew.

### Monorepos

Another error you might see is the following or similarly related to hooks, in particular when `next` versions are mismatched:

```bash
useUploadHandlers must be used within UploadHandlersProvider
```

This is a common pitfall when using a monorepo setup with multiple packages. In this case, ensure that all packages in the monorepo use the same version of `payload`, `@payloadcms/*`, `next`, `react`, and `react-dom`. You can use pnpm with workspaces to manage dependencies across packages in a monorepo effectively. Unfortunately this error becomes harder to debug inside a monorepo due to how package managers hoist dependencies as well as resolve them.

If you've pinned the versions and the error persists we recommend removing `.next/`, `node_modules/` and if possible deleting the lockfile and re-generating it to ensure that all packages in the monorepo are using the same version of the dependencies mentioned above.

In some cases package managers will hoist dependencies to the root of the monorepo which can lead to multiple versions or multiple instances of the same package being installed in different locations.  
Where possible it's best to install the Payload dependencies at the root of the monorepo to ensure only one version and one instance is installed across all packages.

## "Unauthorized, you must be logged in to make this request" when attempting to log in

This means that your auth cookie is not being set or accepted correctly upon logging in. To resolve check the following settings in your Payload Config:

- CORS - If you are using the '\*', try to explicitly only allow certain domains instead including the one you have specified.
- CSRF - Do you have this set? if so, make sure your domain is whitelisted within the csrf domains. If not, probably not the issue, but probably can't hurt to whitelist it anyway.
- Cookie settings. If these are completely undefined, then that's fine. but if you have cookie domain set, or anything similar, make sure you don't have the domain misconfigured

This error likely means that the auth cookie that Payload sets after logging in successfully is being rejected because of misconfiguration.

To further investigate the issue:

- Go to the login screen. Open your inspector. Go to the Network tab.
- Log in and then find the login request that should appear in your network panel. Click the login request.
- The login request should have a Set-Cookie header on the response, and the cookie should be getting set successfully. If it is not, most browsers generally have a little yellow ⚠️ symbol that you can hover over to see why the cookie was rejected.

## Using --experimental-https

If you are using the `--experimental-https` flag when starting your Payload server, you may run into issues with your WebSocket connection for HMR (Hot Module Reloading) in development mode.

To resolve this, you can set the `USE_HTTPS` environment variable to `true` in your `.env` file:

```
USE_HTTPS=true
```

This will ensure that the WebSocket connection uses the correct protocol (`wss://` instead of `ws://`) when HTTPS is enabled.

Alternatively if more of your URL is dynamic, you can set the full URL for the WebSocket connection using the `PAYLOAD_HMR_URL_OVERRIDE` environment variable:

```
PAYLOAD_HMR_URL_OVERRIDE=wss://localhost:3000/_next/webpack-hmr
```
```

--------------------------------------------------------------------------------

---[FILE: generating-types.mdx]---
Location: payload-main/docs/typescript/generating-types.mdx

```text
---
title: Generating TypeScript Interfaces
label: Generating Types
order: 20
desc: Generate your own TypeScript interfaces based on your collections and globals.
keywords: headless cms, typescript, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

While building your own custom functionality into Payload, like [Plugins](../plugins/overview), [Hooks](../hooks/overview), [Access Control](../access-control/overview) functions, [Custom Views](../custom-components/custom-views), [GraphQL queries / mutations](../graphql/overview), or anything else, you may benefit from generating your own TypeScript types dynamically from your Payload Config itself.

## Types generation script

Run the following command in a Payload project to generate types based on your Payload Config:

```
payload generate:types
```

You can run this command whenever you need to regenerate your types, and then you can use these types in your Payload code directly.

## Disable declare statement

By default, `generate:types` will add a `declare` statement to your types file, which automatically enables type inference within Payload.

If you are using your `payload-types.ts` file in other repos, though, it might be better to disable this `declare` statement, so that you don't get any TS errors in projects that use your Payload types, but do not have Payload installed.

```ts
// payload.config.ts
{
  // ...
  typescript: {
    declare: false, // defaults to true if not set
  },
}
```

If you do disable the `declare` pattern, you'll need to manually add a `declare` statement to your code in order for Payload types to be recognized. Here's an example showing how to declare your types in your `payload.config.ts` file:

```ts
import { Config } from './payload-types'

declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}
```

## Custom output file path

You can specify where you want your types to be generated by adding a property to your Payload Config:

```ts
// payload.config.ts
{
  // ...
	typescript: {
    // defaults to: path.resolve(__dirname, './payload-types.ts')
		outputFile: path.resolve(__dirname, './generated-types.ts'),
	},
}
```

The above example places your types next to your Payload Config itself as the file `generated-types.ts`.

## Custom generated types

Payload generates your types based on a JSON schema. You can extend that JSON schema, and thus the generated types, by passing a function to `typescript.schema`:

```ts
// payload.config.ts
{
  // ...
  typescript: {
    schema: [
      ({ jsonSchema }) => {
        // Modify the JSON schema here
        jsonSchema.definitions.Test = {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
          },
          required: ['title', 'content'],
        }
        return jsonSchema
      },
    ]
  }
}

// This will generate the following type in your payload-types.ts:

export interface Test {
  title: string
  content: string
  [k: string]: unknown
}
```

This function takes the existing JSON schema as an argument and returns the modified JSON schema. It can be useful for plugins that wish to generate their own types.

### External schema references

You can use `$ref` to reference external JSON schema files in your custom schemas:

```ts
// payload.config.ts
{
  typescript: {
    schema: [
      ({ jsonSchema }) => {
        jsonSchema.definitions.MyType = {
          $ref: './schemas/my-type.json',
        }
        return jsonSchema
      },
    ]
  }
}
```

External references are resolved relative to your project's working directory (`process.cwd()`).

## Example Usage

For example, let's look at the following simple Payload Config:

```ts
import type { Config } from 'payload'

const config: Config = {
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
        },
      ],
    },
  ],
}
```

By generating types, we'll end up with a file containing the following two TypeScript interfaces:

```ts
export interface User {
  id: string
  name: string
  email?: string
  resetPasswordToken?: string
  resetPasswordExpiration?: string
  loginAttempts?: number
  lockUntil?: string
}

export interface Post {
  id: string
  title?: string
  author?: string | User
}
```

## Custom Field Interfaces

For `array`, `block`, `group` and named `tab` fields, you can generate top level reusable interfaces. The following group field config:

```ts
{
  type: 'group',
  name: 'meta',
  interfaceName: 'SharedMeta', <-- here!!
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
```

will generate:

```ts
// a top level reusable interface!!
export interface SharedMeta {
  title?: string
  description?: string
}

// example usage inside collection interface
export interface Collection1 {
  // ...other fields
  meta?: SharedMeta
}
```

<Banner type="warning">
  **Naming Collisions**

Since these types are hoisted to the top level, you need to be aware that naming collisions can
occur. For example, if you have a collection with the name of `Meta` and you also create a
interface with the name `Meta` they will collide. It is recommended to scope your interfaces by
appending the field type to the end, i.e. `MetaGroup` or similar.

</Banner>

## Using your types

Now that your types have been generated, Payload's Local API will now be typed. It is common for users to want to use this in their frontend code, we recommend generating them with Payload and then copying the file over to your frontend codebase. This is the simplest way to get your types into your frontend codebase.

### Adding an npm script

<Banner type="warning">
  **Important**

Payload needs to be able to find your config to generate your types.

</Banner>

Payload will automatically try and locate your config, but might not always be able to find it. For example, if you are working in a `/src` directory or similar, you need to tell Payload where to find your config manually by using an environment variable. If this applies to you, you can create an npm script to make generating your types easier.

To add an npm script to generate your types and show Payload where to find your config, open your `package.json` and update the `scripts` property to the following:

```
{
  "scripts": {
    "generate:types": "PAYLOAD_CONFIG_PATH=src/payload.config.ts payload generate:types",
  },
}
```

Now you can run `pnpm generate:types` to easily generate your types.
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/typescript/overview.mdx

```text
---
title: TypeScript - Overview
label: Overview
order: 10
desc: Payload is the most powerful TypeScript headless CMS available.
keywords: headless cms, typescript, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Payload supports TypeScript natively, and not only that, the entirety of the CMS is built with TypeScript. To get started developing with Payload and TypeScript, you can use one of Payload's built-in boilerplates in one line via `create-payload-app`:

```
npx create-payload-app@latest
```

Pick a TypeScript project type to get started easily.

## Setting up from Scratch

It's also possible to set up a TypeScript project from scratch. We plan to write up a guide for exactly how—so keep an eye out for that, too.

## Using Payload's Exported Types

Payload exports a number of types that you may find useful while writing your own custom functionality like [Plugins](../plugins/overview), [Hooks](../hooks/overview), [Access Control](../access-control/overview) functions, [Custom Views](../custom-components/custom-views), [GraphQL queries / mutations](../graphql/overview) or anything else.

## Config Types

- [Base config](/docs/configuration/overview#typescript)
- [Collections](/docs/configuration/collections#typescript)
- [Globals](/docs/configuration/globals#typescript)
- [Fields](/docs/fields/overview#typescript)

## Hook Types

- [Collection hooks](/docs/hooks/collections#typescript)
- [Global hooks](/docs/hooks/globals#typescript)
- [Field hooks](/docs/hooks/fields#typescript)
```

--------------------------------------------------------------------------------

````
