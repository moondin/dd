---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 55
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 55 of 695)

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

---[FILE: stripe.mdx]---
Location: payload-main/docs/plugins/stripe.mdx

```text
---
title: Stripe Plugin
label: Stripe
order: 110
desc: Easily accept payments with Stripe
keywords: plugins, stripe, payments, ecommerce
---

![https://www.npmjs.com/package/@payloadcms/plugin-stripe](https://img.shields.io/npm/v/@payloadcms/plugin-stripe)

With this plugin you can easily integrate [Stripe](https://stripe.com) into Payload. Simply provide your Stripe credentials and this plugin will open up a two-way communication channel between the two platforms. This enables you to easily sync data back and forth, as well as proxy the Stripe REST API through Payload's [Access Control](../access-control/overview). Use this plugin to completely offload billing to Stripe and retain full control over your application's data.

For example, you might be building an e-commerce or SaaS application, where you have a `products` or a `plans` collection that requires either a one-time payment or a subscription. You can to tie each of these products to Stripe, then easily subscribe to billing-related events to perform your application's business logic, such as active purchases or subscription cancellations.

To build a checkout flow on your front-end you can either use [Stripe Checkout](https://stripe.com/payments/checkout), or you can also build a completely custom checkout experience from scratch using [Stripe Web Elements](https://stripe.com/docs/payments/elements). Then to build fully custom, secure customer dashboards, you can leverage Payload's Access Control to restrict access to your Stripe resources so your users never have to leave your site to manage their accounts.

The beauty of this plugin is the entirety of your application's content and business logic can be handled in Payload while Stripe handles solely the billing and payment processing. You can build a completely proprietary application that is endlessly customizable and extendable, on APIs and databases that you own. Hosted services like Shopify or BigCommerce might fracture your application's content then charge you for access.

<Banner type="info">
  This plugin is completely open-source and the [source code can be found
  here](https://github.com/payloadcms/payload/tree/main/packages/plugin-stripe).
  If you need help, check out our [Community
  Help](https://payloadcms.com/community-help). If you think you've found a bug,
  please [open a new
  issue](https://github.com/payloadcms/payload/issues/new?assignees=&labels=plugin%3A%20stripe&template=bug_report.md&title=plugin-stripe%3A)
  with as much detail as possible.
</Banner>

## Core features

- Hides your Stripe credentials when shipping SaaS applications
- Allows restricted keys through [Payload access control](https://payloadcms.com/docs/access-control/overview)
- Enables a two-way communication channel between Stripe and Payload
- Proxies the [Stripe REST API](https://stripe.com/docs/api)
- Proxies [Stripe webhooks](https://stripe.com/docs/webhooks)
- Automatically syncs data between the two platforms

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
  pnpm add @payloadcms/plugin-stripe
```

## Basic Usage

In the `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin with [options](#options):

```ts
import { buildConfig } from 'payload'
import { stripePlugin } from '@payloadcms/plugin-stripe'

const config = buildConfig({
  plugins: [
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    }),
  ],
})

export default config
```

### Options

| Option                         | Type               | Default     | Description                                                                                                              |
| ------------------------------ | ------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `stripeSecretKey` \*           | string             | `undefined` | Your Stripe secret key                                                                                                   |
| `stripeWebhooksEndpointSecret` | string             | `undefined` | Your Stripe webhook endpoint secret                                                                                      |
| `rest`                         | boolean            | `false`     | When `true`, opens the `/api/stripe/rest` endpoint                                                                       |
| `webhooks`                     | object or function | `undefined` | Either a function to handle all webhooks events, or an object of Stripe webhook handlers, keyed to the name of the event |
| `sync`                         | array              | `undefined` | An array of sync configs                                                                                                 |
| `logs`                         | boolean            | `false`     | When `true`, logs sync events to the console as they happen                                                              |

_\* An asterisk denotes that a property is required._

## Endpoints

The following custom endpoints are automatically opened for you:

| Endpoint               | Method | Description                                                                                                                                                                                                                                |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/api/stripe/rest`     | `POST` | Proxies the [Stripe REST API](https://stripe.com/docs/api) behind [Payload access control](https://payloadcms.com/docs/access-control/overview) and returns the result. See the [REST Proxy](#stripe-rest-proxy) section for more details. |
| `/api/stripe/webhooks` | `POST` | Handles all Stripe webhook events                                                                                                                                                                                                          |

##### Stripe REST Proxy

If `rest` is true, proxies the [Stripe REST API](https://stripe.com/docs/api) behind [Payload access control](https://payloadcms.com/docs/access-control/overview) and returns the result. This flag should only be used for local development, see the security note below for more information.

```ts
const res = await fetch(`/api/stripe/rest`, {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `JWT ${token}` // NOTE: do this if not in a browser (i.e. curl or Postman)
  },
  body: JSON.stringify({
    stripeMethod: 'stripe.subscriptions.list',
    stripeArgs: [
      {
        customer: 'abc',
      },
    ],
  }),
})
```

If you need to proxy the API server-side, use the [stripeProxy](#node) function.

<Banner type="info">
  **Note:**

The `/api` part of these routes may be different based on the settings defined in your Payload
config.

</Banner>

<Banner type="warning">
  **Warning:**

Opening the REST proxy endpoint in production is a potential security risk. Authenticated users will have open access to the Stripe REST API. In production, open your own endpoint and use the [stripeProxy](#node) function to proxy the Stripe API server-side.

</Banner>

## Webhooks

[Stripe webhooks](https://stripe.com/docs/webhooks) are used to sync from Stripe to Payload. Webhooks listen for events on your Stripe account so you can trigger reactions to them. Follow the steps below to enable webhooks.

Development:

1. Login using Stripe cli `stripe login`
1. Forward events to localhost `stripe listen --forward-to localhost:3000/api/stripe/webhooks`
1. Paste the given secret into your `.env` file as `STRIPE_WEBHOOKS_ENDPOINT_SECRET`

Production:

1. Login and [create a new webhook](https://dashboard.stripe.com/test/webhooks/create) from the Stripe dashboard
1. Paste `YOUR_DOMAIN_NAME/api/stripe/webhooks` as the "Webhook Endpoint URL"
1. Select which events to broadcast
1. Paste the given secret into your `.env` file as `STRIPE_WEBHOOKS_ENDPOINT_SECRET`
1. Then, handle these events using the `webhooks` portion of this plugin's config:

```ts
import { buildConfig } from 'payload'
import stripePlugin from '@payloadcms/plugin-stripe'

const config = buildConfig({
  plugins: [
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET,
      webhooks: {
        'customer.subscription.updated': ({ event, stripe, stripeConfig }) => {
          // do something...
        },
      },
      // NOTE: you can also catch all Stripe webhook events and handle the event types yourself
      // webhooks: (event, stripe, stripeConfig) => {
      //   switch (event.type): {
      //     case 'customer.subscription.updated': {
      //       // do something...
      //       break;
      //     }
      //     default: {
      //       break;
      //     }
      //   }
      // }
    }),
  ],
})

export default config
```

For a full list of available webhooks, see [here](https://stripe.com/docs/cli/trigger#trigger-event).

## Node

On the server you should interface with Stripe directly using the [stripe](https://www.npmjs.com/package/stripe) npm module. That might look something like this:

```ts
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-08-01',
})

export const MyFunction = async () => {
  try {
    const customer = await stripe.customers.create({
      email: data.email,
    })

    // do something...
  } catch (error) {
    console.error(error.message)
  }
}
```

Alternatively, you can interface with the Stripe using the `stripeProxy`, which is exactly what the `/api/stripe/rest` endpoint does behind-the-scenes. Here's the same example as above, but piped through the proxy:

```ts
import { stripeProxy } from '@payloadcms/plugin-stripe'

export const MyFunction = async () => {
  try {
    const customer = await stripeProxy({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripeMethod: 'customers.create',
      stripeArgs: [
        {
          email: data.email,
        },
      ],
    })

    if (customer.status === 200) {
      // do something...
    }

    if (customer.status >= 400) {
      throw new Error(customer.message)
    }
  } catch (error) {
    console.error(error.message)
  }
}
```

## Sync

This option will setup a basic sync between Payload collections and Stripe resources for you automatically. It will create all the necessary hooks and webhooks handlers, so the only thing you have to do is map your Payload fields to their corresponding Stripe properties. As documents are created, updated, and deleted from either Stripe or Payload, the changes are reflected on either side.

<Banner type="info">
  **Note:**

If you wish to enable a _two-way_ sync, be sure to setup [`webhooks`](#webhooks) and pass the
`stripeWebhooksEndpointSecret` through your config.

</Banner>

```ts
import { buildConfig } from 'payload'
import stripePlugin from '@payloadcms/plugin-stripe'

const config = buildConfig({
  plugins: [
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET,
      sync: [
        {
          collection: 'customers',
          stripeResourceType: 'customers',
          stripeResourceTypeSingular: 'customer',
          fields: [
            {
              fieldPath: 'name', // this is a field on your own Payload Config
              stripeProperty: 'name', // use dot notation, if applicable
            },
          ],
        },
      ],
    }),
  ],
})

export default config
```

<Banner type="warning">
  **Note:**

Due to limitations in the Stripe API, this currently only works with top-level fields. This is
because every Stripe object is a separate entity, making it difficult to abstract into a simple
reusable library. In the future, we may find a pattern around this. But for now, cases like that
will need to be hard-coded.

</Banner>

Using `sync` will do the following:

- Adds and maintains a `stripeID` read-only field on each collection, this is a field generated _by Stripe_ and used as a cross-reference
- Adds a direct link to the resource on Stripe.com
- Adds and maintains an `skipSync` read-only flag on each collection to prevent infinite syncs when hooks trigger webhooks
- Adds the following hooks to each collection:
  - `beforeValidate`: `createNewInStripe`
  - `beforeChange`: `syncExistingWithStripe`
  - `afterDelete`: `deleteFromStripe`
- Handles the following Stripe webhooks
  - `STRIPE_TYPE.created`: `handleCreatedOrUpdated`
  - `STRIPE_TYPE.updated`: `handleCreatedOrUpdated`
  - `STRIPE_TYPE.deleted`: `handleDeleted`

## TypeScript

All types can be directly imported:

```ts
import {
  StripeConfig,
  StripeWebhookHandler,
  StripeProxy,
  ...
} from '@payloadcms/plugin-stripe/types';
```
```

--------------------------------------------------------------------------------

---[FILE: building-without-a-db-connection.mdx]---
Location: payload-main/docs/production/building-without-a-db-connection.mdx

```text
---
title: Building without a DB connection
label: Building without a DB connection
order: 10
desc: You don't want to have a DB connection while building your Docker container? Learn how to prevent that!
keywords: deployment, production, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

One of the most common problems when building a site for production, especially with Docker - is the DB connection requirement.

The important note is that Payload by itself does not have this requirement, But [Next.js' SSG ](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation) does if any of your route segments have SSG enabled (which is default, unless you opted out or used a [Dynamic API](https://nextjs.org/docs/app/deep-dive/caching#dynamic-apis)) and use the Payload Local API.

Solutions:

## Using the experimental-build-mode Next.js build flag

You can run Next.js build using the `pnpm next build --experimental-build-mode compile` command to only compile the code without static generation, which does not require a DB connection. In that case, your pages will be rendered dynamically, but after that, you can still generate static pages using the `pnpm next build --experimental-build-mode generate` command when you have a DB connection.

When running `pnpm next build --experimental-build-mode compile`, environment variables prefixed with `NEXT_PUBLIC` will not be inlined and will be `undefined` on the client. To make these variables available, either run `pnpm next build --experimental-build-mode generate` if a DB connection is available, or use `pnpm next build --experimental-build-mode generate-env` if you do not have a DB connection.

[Next.js documentation](https://nextjs.org/docs/pages/api-reference/cli/next#next-build-options)

## Opting-out of SSG

You can opt out of SSG by adding this all the route segment files:

```ts
export const dynamic = 'force-dynamic'
```

**Note that it will disable static optimization and your site will be slower**.
More on [Next.js documentation](https://nextjs.org/docs/app/deep-dive/caching#opting-out-2)
```

--------------------------------------------------------------------------------

---[FILE: deployment.mdx]---
Location: payload-main/docs/production/deployment.mdx

```text
---
title: Production Deployment
label: Deployment
order: 10
desc: When your Payload based app is ready, tested, looking great, it is time to deploy. Learn how to deploy your app and what to consider before deployment.
keywords: deployment, production, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

<Banner type="success">
  So you've developed a Payload app, it's fully tested, and running great
  locally. Now it's time to launch. **Awesome! Great work!** Now, what's next?
</Banner>

There are many ways to deploy Payload to a production environment. When evaluating how you will deploy Payload, you need
to consider these main aspects:

1. [Basics](#basics)
1. [Security](#security)
1. [Your database](#database)
1. [Permanent File Storage](#file-storage)
1. [Docker](#docker)

Payload can be deployed _anywhere that Next.js can run_ - including Vercel, Netlify, SST, DigitalOcean, AWS, and more. Because it's open source, you can self-host it.

But it's important to remember that most Payload projects will also need a database, file storage, an email provider, and a CDN. Make sure you have all of the requirements that your project needs, no matter what deployment platform you choose.

## Basics

Payload runs fully in Next.js, so the [Next.js build process](https://nextjs.org/docs/app/building-your-application/deploying) is used for building Payload. If you've used `create-payload-app` to create your project, executing the `build`
npm script will build Payload for production.

## Security

Payload features a suite of security features that you can rely on to strengthen your application's security. When
deploying to Production, it's a good idea to double-check that you are making proper use of each of them.

### The Secret Key

When you initialize Payload, you provide it with a `secret` property. This property should be impossible to guess and
extremely difficult for brute-force attacks to crack. Make sure your Production `secret` is a long, complex string.

### Double-check and thoroughly test all Access Control

Because _**you**_ are in complete control of who can do what with your data, you should double and triple-check that you
wield that power responsibly before deploying to Production.

<Banner type="error">
**By default, all Access Control functions require that a user is successfully logged in to Payload to create, read, update, or delete data.**

But, if you allow public user registration, for example, you will want to make sure that your access control functions are more strict - permitting **only appropriate users** to perform appropriate actions.

</Banner>

### Running in Production

Depending on where you deploy Payload, you may need to provide a start script to your deployment platform in order to start up Payload in production mode.

Note that this is different than running `next dev`. Generally, Next.js apps come configured with a `start` script which runs `next start`.

### Secure Cookie Settings

You should be using an SSL certificate for production Payload instances, which means you
can [enable secure cookies](/docs/authentication/overview) in your Authentication-enabled Collection configs.

### Preventing API Abuse

Payload comes with a robust set of built-in anti-abuse measures, such as locking out users after X amount of failed
login attempts, GraphQL query complexity limits, max `depth` settings, and
more. [Click here to learn more](/docs/production/preventing-abuse).

## Database

Payload can be used with any Postgres database or MongoDB-compatible database including AWS DocumentDB or Azure Cosmos DB. Make sure your production environment has access to the database that Payload uses.

Out of the box, Payload templates pass the `process.env.DATABASE_URI` environment variable to its database adapters, so make sure you've got that environment variable (and all others that you use) assigned in your deployment platform.

### DocumentDB

When using AWS DocumentDB, you will need to configure connection options for authentication in the `connectOptions`
passed to the `mongooseAdapter` . You also need to set `connectOptions.useFacet` to `false` to disable use of the
unsupported `$facet` aggregation.

### CosmosDB

When using Azure Cosmos DB, an index is needed for any field you may want to sort on. To add the sort index for all
fields that may be sorted in the admin UI use the [indexSortableFields](/docs/configuration/overview) option.

## File storage

If you are using Payload to [manage file uploads](/docs/upload/overview), you need to consider where your uploaded files
will be permanently stored. If you do not use Payload for file uploads, then this section does not impact your app
whatsoever.

### Persistent vs Ephemeral Filesystems

Some cloud app hosts such as [Heroku](https://heroku.com) use `ephemeral` file systems, which means that any files
uploaded to your server only last until the server restarts or shuts down. Heroku and similar providers schedule
restarts and shutdowns without your control, meaning your uploads will accidentally disappear without any way to get
them back.

Alternatively, persistent filesystems will never delete your files and can be trusted to reliably host uploads
perpetually.

**Popular cloud providers with ephemeral filesystems:**

- Heroku
- DigitalOcean Apps

**Popular cloud providers with persistent filesystems:**

- DigitalOcean Droplets
- Amazon EC2
- GoDaddy
- Many other more traditional web hosts

<Banner type="error">
  **Warning:**

If you rely on Payload's **Upload** functionality, make sure you either use a host
with a persistent filesystem or have an integration with a third-party file host like Amazon S3.

</Banner>

### Using cloud storage providers

If you don't use Payload's `upload` functionality, you can completely disregard this section.

But, if you do, and you still want to use an ephemeral filesystem provider, you can use one of Payload's official cloud storage plugins or write your own to save the files your users upload to a more permanent storage solution like Amazon S3 or DigitalOcean Spaces.

Payload provides a list of official cloud storage adapters for you to use:

- [Azure Blob Storage](https://github.com/payloadcms/payload/tree/main/packages/storage-azure)
- [Google Cloud Storage](https://github.com/payloadcms/payload/tree/main/packages/storage-gcs)
- [AWS S3](https://github.com/payloadcms/payload/tree/main/packages/storage-s3)
- [Uploadthing](https://github.com/payloadcms/payload/tree/main/packages/storage-uploadthing)
- [Vercel Blob Storage](https://github.com/payloadcms/payload/tree/main/packages/storage-vercel-blob)

Follow the docs to configure any one of these storage providers. For local development, it might be handy to simply store uploads on your own computer, and then when it comes to production, simply enable the plugin for the cloud storage vendor of your choice.

## Docker

This is an example of a multi-stage docker build of Payload for production. Ensure you are setting your environment
variables on deployment, like `PAYLOAD_SECRET`, `PAYLOAD_CONFIG_PATH`, and `DATABASE_URI` if needed. If you don't want to have a DB connection and your build requires that, learn [here](./building-without-a-db-connection) how to prevent that.

In your Next.js config, set the `output` property `standalone`.

```js
// next.config.js
const nextConfig = {
  output: 'standalone',
}
```

Dockerfile

```dockerfile
# Dockerfile
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
```

## Docker Compose

Here is an example of a docker-compose.yml file that can be used for development

```yml
version: '3'

services:
  payload:
    image: node:24-alpine
    ports:
      - '3000:3000'
    volumes:
      - .:/home/node/app
      - node_modules:/home/node/app/node_modules
    working_dir: /home/node/app/
    command: sh -c "corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm dev"
    depends_on:
      - mongo
      # - postgres
    env_file:
      - .env

  # Ensure your DATABASE_URI uses 'mongo' as the hostname ie. mongodb://mongo/my-db-name
  mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    command:
      - --storageEngine=wiredTiger
    volumes:
      - data:/data/db
    logging:
      driver: none

  # Uncomment the following to use postgres
  # postgres:
  #   restart: always
  #   image: postgres:latest
  #   volumes:
  #     - pgdata:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

volumes:
  data:
  # pgdata:
  node_modules:
```
```

--------------------------------------------------------------------------------

---[FILE: preventing-abuse.mdx]---
Location: payload-main/docs/production/preventing-abuse.mdx

```text
---
title: Preventing Production API Abuse
label: Preventing Abuse
order: 20
desc: Payload has built-in security that can be configured to combat production API abuse such as limiting login attempts and IP requests.
keywords: abuse, production, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

## Introduction

Payload has built-in security best practices that can be configured to your application-specific needs.

## Limit Failed Login Attempts

Set the max number of failed login attempts before a user account is locked out for a period of time. Set the `maxLoginAttempts` on the collections that feature Authentication to a reasonable but low number for your users to get in. Use the `lockTime` to set a number in milliseconds from the time a user fails their last allowed attempt that a user must wait to try again.

## Max Depth

Querying a collection and automatically including related documents via `depth` incurs a performance cost. Also, it's possible that your configs may have circular relationships, meaning scenarios where an infinite amount of relationships might populate back and forth until your server times out and crashes. You can prevent any potential of depth-related issues by setting a `maxDepth` property on your Payload Config. The maximum allowed depth should be as small as possible without interrupting dev experience, and it defaults to `10`.

## Cross-Site Request Forgery (CSRF)

CSRF prevention will verify the authenticity of each request to your API to prevent a malicious action from another site from authorized users. See how to configure CSRF [here](/docs/authentication/cookies#csrf-attacks).

## Cross Origin Resource Sharing (CORS)

To securely allow headless operation you will need to configure the allowed origins for requests to be able to use the Payload API. You can see how to set CORS as well as other Payload configuration settings [here](/docs/configuration/overview)

## Limiting GraphQL Complexity

Because GraphQL gives the power of query writing outside a server's control, someone with bad intentions might write a maliciously complex query and bog down your server. To prevent resource-intensive GraphQL requests, Payload provides a way to specify complexity limits. These limits are based on a complexity score calculated for each request.

Any GraphQL request that is calculated to be too expensive is rejected. On the Payload Config, in `graphQL` you can set the `maxComplexity` value as an integer. For reference, the default complexity value for each added field is 1, and all `relationship` and `upload` fields are assigned a value of 10.

If you do not need GraphQL it is advised that you disable it altogether with the Payload Config by setting `graphQL.disable: true`. Should you wish to enable GraphQL again, you can remove this property or set it to `false` any time. By turning it off, Payload will bypass creating schemas from your collections and will not register the route.

## Malicious File Uploads

Payload does not execute uploaded files on the server, but depending on your setup it may be used to transmit and store potentially dangerous files. If your configuration allows file uploads there is the potential that a bad actor uploads a malicious file that is then served to other users. Consider the following ways to mitigate the risks.

First, enable email [verification](/docs/authentication/email#email-verification) when users are allowed to register new accounts and add other bot prevention services.

Review that `create` and `update` access on file upload collections are as restrictive as your application needs allow. Consider limiting `read` access of uploaded user's files and how you might limit user uploaded files from being served outside of Payload.

You can also add a [3rd party library](https://github.com/Cisco-Talos/clamav) to scan files in a [hook](/docs/hooks/collections) or have antivirus software in place.
```

--------------------------------------------------------------------------------

---[FILE: depth.mdx]---
Location: payload-main/docs/queries/depth.mdx

```text
---
title: Depth
label: Depth
order: 30
desc: Payload depth determines how many levels down related documents should be automatically populated when retrieved.
keywords: query, documents, pagination, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Documents in Payload can have relationships to other Documents. This is true for both [Collections](../configuration/collections) as well as [Globals](../configuration/globals). When you query a Document, you can specify the depth at which to populate any of its related Documents either as full objects, or only their IDs.

Since Documents can be infinitely nested or recursively related, it's important to be able to control how deep your API populates. Depth can impact the performance of your queries by affecting the load on the database and the size of the response.

For example, when you specify a `depth` of `0`, the API response might look like this:

```json
{
  "id": "5ae8f9bde69e394e717c8832",
  "title": "This is a great post",
  "author": "5f7dd05cd50d4005f8bcab17"
}
```

But with a `depth` of `1`, the response might look like this:

```json
{
  "id": "5ae8f9bde69e394e717c8832",
  "title": "This is a great post",
  "author": {
    "id": "5f7dd05cd50d4005f8bcab17",
    "name": "John Doe"
  }
}
```

<Banner type="warning">
  **Important:** Depth has no effect in the [GraphQL API](../graphql/overview),
  because there, depth is based on the shape of your queries.
</Banner>

## Local API

To specify depth in the [Local API](../local-api/overview), you can use the `depth` option in your query:

```ts
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    // highlight-start
    depth: 2,
    // highlight-end
  })

  return posts
}
```

<Banner type="info">
  **Reminder:** This is the same for [Globals](../configuration/globals) using
  the `findGlobal` operation.
</Banner>

## REST API

To specify depth in the [REST API](../rest-api/overview), you can use the `depth` parameter in your query:

```ts
// highlight-start
fetch('https://localhost:3000/api/posts?depth=2')
  // highlight-end
  .then((res) => res.json())
  .then((data) => console.log(data))
```

<Banner type="info">
  **Reminder:** This is the same for [Globals](../configuration/globals) using
  the `/api/globals` endpoint.
</Banner>

## Default Depth

If no depth is specified in the request, Payload will use its default depth for all requests. By default, this is set to `2`.

To change the default depth on the application level, you can use the `defaultDepth` option in your root Payload config:

```ts
import { buildConfig } from 'payload/config'

export default buildConfig({
  // ...
  // highlight-start
  defaultDepth: 1,
  // highlight-end
  // ...
})
```

## Max Depth

Fields like the [Relationship Field](../fields/relationship) or the [Upload Field](../fields/upload) can also set a maximum depth. If exceeded, this will limit the population depth regardless of what the depth might be on the request.

To set a max depth for a field, use the `maxDepth` property in your field configuration:

```js
{
  slug: 'posts',
  fields: [
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      // highlight-start
      maxDepth: 2,
      // highlight-end
    }
  ]
}
```
```

--------------------------------------------------------------------------------

````
