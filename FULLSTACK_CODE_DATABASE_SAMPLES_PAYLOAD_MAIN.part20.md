---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 20
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 20 of 695)

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

---[FILE: api-keys.mdx]---
Location: payload-main/docs/authentication/api-keys.mdx

```text
---
title: API Key Strategy
label: API Key Strategy
order: 50
desc: Enable API key based authentication to interface with Payload.
keywords: authentication, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

To integrate with third-party APIs or services, you might need the ability to generate API keys that can be used to identify as a certain user within Payload. API keys are generated on a user-by-user basis, similar to email and passwords, and are meant to represent a single user.

For example, if you have a third-party service or external app that needs to be able to perform protected actions against Payload, first you need to create a user within Payload, i.e. `dev@thirdparty.com`. From your external application you will need to authenticate with that user, you have two options:

1. Log in each time with that user and receive an expiring token to request with.
1. Generate a non-expiring API key for that user to request with.

<Banner type="success">
  **Tip:**

This is particularly useful as you can create a "user" that reflects an integration with a specific external service and assign a "role" or specific access only needed by that service/integration.

</Banner>

Technically, both of these options will work for third-party integrations but the second option with API key is simpler, because it reduces the amount of work that your integrations need to do to be authenticated properly.

To enable API keys on a collection, set the `useAPIKey` auth option to `true`. From there, a new interface will appear in the [Admin Panel](../admin/overview) for each document within the collection that allows you to generate an API key for each user in the Collection.

```ts
import type { CollectionConfig } from 'payload'

export const ThirdPartyAccess: CollectionConfig = {
  slug: 'third-party-access',
  auth: {
    useAPIKey: true, // highlight-line
  },
  fields: [],
}
```

User API keys are encrypted within the database, meaning that if your database is compromised,
your API keys will not be.

<Banner type="warning">
  **Important:**
  If you change your `PAYLOAD_SECRET`, you will need to regenerate your API keys.

The secret key is used to encrypt the API keys, so if you change the secret, existing API keys will
no longer be valid.

</Banner>

### HTTP Authentication

To authenticate REST or GraphQL API requests using an API key, set the `Authorization` header. The header is case-sensitive and needs the slug of the `auth.useAPIKey` enabled collection, then " API-Key ", followed by the `apiKey` that has been assigned. Payload's built-in middleware will then assign the user document to `req.user` and handle requests with the proper [Access Control](../access-control/overview). By doing this, Payload recognizes the request being made as a request by the user associated with that API key.

**For example, using Fetch:**

```ts
import Users from '../collections/Users'

const response = await fetch('http://localhost:3000/api/pages', {
  headers: {
    Authorization: `${Users.slug} API-Key ${YOUR_API_KEY}`,
  },
})
```

Payload ensures that the same, uniform [Access Control](../access-control/overview) is used across all authentication strategies. This enables you to utilize your existing Access Control configurations with both API keys and the standard email/password authentication. This consistency can aid in maintaining granular control over your API keys.

### API Key Only Auth

If you want to use API keys as the only authentication method for a collection, you can disable the default local strategy by setting `disableLocalStrategy` to `true` on the collection's `auth` property. This will disable the ability to authenticate with email and password, and will only allow for authentication via API key.

```ts
import type { CollectionConfig } from 'payload'

export const ThirdPartyAccess: CollectionConfig = {
  slug: 'third-party-access',
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true, // highlight-line
  },
}
```
```

--------------------------------------------------------------------------------

---[FILE: cookies.mdx]---
Location: payload-main/docs/authentication/cookies.mdx

```text
---
title: Cookie Strategy
label: Cookie Strategy
order: 40
desc: Enable HTTP Cookie based authentication to interface with Payload.
keywords: authentication, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Payload offers the ability to [Authenticate](./overview) via HTTP-only cookies. These can be read from the responses of `login`, `logout`, `refresh`, and `me` auth operations.

<Banner type="success">
  **Tip:** You can access the logged-in user from within [Access
  Control](../access-control/overview) and [Hooks](../hooks/overview) through
  the `req.user` argument. [More details](./token-data).
</Banner>

### Automatic browser inclusion

Modern browsers automatically include `http-only` cookies when making requests directly to URLs—meaning that if you are running your API on `https://example.com`, and you have logged in and visit `https://example.com/test-page`, your browser will automatically include the Payload authentication cookie for you.

### HTTP Authentication

However, if you use `fetch` or similar APIs to retrieve Payload resources from its REST or GraphQL API, you must specify to include credentials (cookies).

Fetch example, including credentials:

```ts
const response = await fetch('http://localhost:3000/api/pages', {
  credentials: 'include',
})

const pages = await response.json()
```

For more about including cookies in requests from your app to your Payload API, [read the MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Sending_a_request_with_credentials_included).

<Banner type="success">
  **Tip:** To make sure you have a Payload cookie set properly in your browser
  after logging in, you can use the browsers Developer Tools > Application >
  Cookies > [your-domain-here]. The Developer tools will still show HTTP-only
  cookies.
</Banner>

### CSRF Attacks

CSRF (cross-site request forgery) attacks are common and dangerous. By using an HTTP-only cookie, Payload removes many XSS vulnerabilities, however, CSRF attacks can still be possible.

For example, let's say you have a popular app `https://payload-finances.com` that allows users to manage finances, send and receive money. As Payload is using HTTP-only cookies, that means that browsers automatically will include cookies when sending requests to your domain - **no matter what page created the request**.

So, if a user of `https://payload-finances.com` is logged in and is browsing around on the internet, they might stumble onto a page with malicious intent. Let's look at an example:

```ts
// malicious-intent.com
// makes an authenticated request as on your behalf

const maliciousRequest = await fetch(`https://payload-finances.com/api/me`, {
  credentials: 'include',
}).then((res) => await res.json())
```

In this scenario, if your cookie was still valid, malicious-intent.com would be able to make requests like the one above on your behalf. This is a CSRF attack.

### CSRF Prevention

Define domains that you trust and are willing to accept Payload HTTP-only cookie based requests from. Use the `csrf` option on the base Payload Config to do this:

```ts
// payload.config.ts

import { buildConfig } from 'payload'

const config = buildConfig({
  serverURL: 'https://my-payload-instance.com',
  // highlight-start
  csrf: [
    // whitelist of domains to allow cookie auth from
    'https://your-frontend-app.com',
    'https://your-other-frontend-app.com',
    // `config.serverURL` is added by default if defined
  ],
  // highlight-end
  collections: [
    // collections here
  ],
})

export default config
```

#### Cross domain authentication

If your frontend is on a different domain than your Payload API then you will not be able to use HTTP-only cookies for authentication by default as they will be considered third-party cookies by the browser.
There are a few strategies to get around this:

##### 1. Use subdomains

Cookies can cross subdomains without being considered third party cookies, for example if your API is at api.example.com then you can authenticate from example.com.

##### 2. Configure cookies

If option 1 isn't possible, then you can get around this limitation by [configuring your cookies](./overview#config-options) on your authentication collection to achieve the following setup:

```
SameSite: None // allows the cookie to cross domains
Secure: true // ensures it's sent over HTTPS only
HttpOnly: true // ensures it's not accessible via client side JavaScript
```

Configuration example:

```ts
{
  slug: 'users',
  auth: {
    cookies: {
      sameSite: 'None',
      secure: true,
    }
  },
  fields: [
    // your auth fields here
  ]
},
```

If you're configuring [cors](../production/preventing-abuse#cross-origin-resource-sharing-cors) in your Payload config, you won't be able to use a wildcard anymore, you'll need to specify the list of allowed domains.

<Banner type="success">
  **Good to know:** Setting up `secure: true` will not work if you're developing
  on `http://localhost` or any non-https domain. For local development you
  should conditionally set this to `false` based on the environment.
</Banner>
```

--------------------------------------------------------------------------------

---[FILE: custom-strategies.mdx]---
Location: payload-main/docs/authentication/custom-strategies.mdx

```text
---
title: Custom Strategies
label: Custom Strategies
order: 60
desc: Create custom authentication strategies to handle everything auth in Payload.
keywords: authentication, config, configuration, overview, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

<Banner type="warning">
  This is an advanced feature, so only attempt this if you are an experienced
  developer. Otherwise, just let Payload's built-in authentication handle user
  auth for you.
</Banner>

### Creating a strategy

At the core, a strategy is a way to authenticate a user making a request. As of `3.0` we moved away from [Passport](https://www.passportjs.org) in favor of pulling back the curtain and putting you in full control.

A strategy is made up of the following:

| Parameter             | Description                                                               |
| --------------------- | ------------------------------------------------------------------------- |
| **`name`** \*         | The name of your strategy                                                 |
| **`authenticate`** \* | A function that takes in the parameters below and returns a user or null. |

The `authenticate` function is passed the following arguments:

| Argument               | Description                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **`canSetHeaders`** \* | Whether or not the strategy is being executed from a context where response headers can be set. Default is `false`. |
| **`headers`** \*       | The headers on the incoming request. Useful for retrieving identifiable information on a request.                   |
| **`payload`** \*       | The Payload class. Useful for authenticating the identifiable information against Payload.                          |
| **`isGraphQL`**        | Whether or not the strategy is being executed within the GraphQL endpoint. Default is `false`.                      |

### Example Strategy

At its core a strategy simply takes information from the incoming request and returns a user. This is exactly how Payload's built-in strategies function.

Your `authenticate` method should return an object containing a Payload user document and any optional headers that you'd like Payload to set for you when we return a response.

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    // highlight-start
    strategies: [
      {
        name: 'custom-strategy',
        authenticate: async ({ payload, headers }) => {
          const usersQuery = await payload.find({
            collection: 'users',
            where: {
              code: {
                equals: headers.get('code'),
              },
              secret: {
                equals: headers.get('secret'),
              },
            },
          })

          return {
            // Send the user with the collection slug back to authenticate,
            // or send null if no user should be authenticated
            user: usersQuery.docs[0] ? {
              collection: 'users',
              ...usersQuery.docs[0],
            } : null,

            // Optionally, you can return headers
            // that you'd like Payload to set here when
            // it returns the response
            responseHeaders: new Headers({
              'some-header': 'my header value'
            })
          }
        }
      }
    ]
    // highlight-end
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      index: true,
      unique: true,
    },
    {
      name: 'secret',
      type: 'text',
    },
  ]
}
```
```

--------------------------------------------------------------------------------

---[FILE: email.mdx]---
Location: payload-main/docs/authentication/email.mdx

```text
---
title: Authentication Emails
label: Email Verification
order: 30
desc: Email Verification allows users to verify their email address before their account is fully activated. Email Verification ties directly into the Email functionality that Payload provides.
keywords: authentication, email, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

[Authentication](./overview) ties directly into the [Email](../email/overview) functionality that Payload provides. This allows you to send emails to users for verification, password resets, and more. While Payload provides default email templates for these actions, you can customize them to fit your brand.

## Email Verification

Email Verification forces users to prove they have access to the email address they can authenticate. This will help to reduce spam accounts and ensure that users are who they say they are.

To enable Email Verification, use the `auth.verify` property on your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    verify: true, // highlight-line
  },
}
```

<Banner type="info">
  **Tip:** Verification emails are fully customizable. [More
  details](#generateemailhtml).
</Banner>

The following options are available:

| Option                     | Description                                                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`generateEmailHTML`**    | Allows for overriding the HTML within emails that are sent to users indicating how to validate their account. [More details](#generateemailhtml).     |
| **`generateEmailSubject`** | Allows for overriding the subject of the email that is sent to users indicating how to validate their account. [More details](#generateemailsubject). |

#### generateEmailHTML

Function that accepts one argument, containing `{ req, token, user }`, that allows for overriding the HTML within emails that are sent to users indicating how to validate their account. The function should return a string that supports HTML, which can optionally be a full HTML email.

```ts
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    verify: {
      // highlight-start
      generateEmailHTML: ({ req, token, user }) => {
        // Use the token provided to allow your user to verify their account
        const url = `https://yourfrontend.com/verify?token=${token}`

        return `Hey ${user.email}, verify your email by clicking here: ${url}`
      },
      // highlight-end
    },
  },
}
```

<Banner type="warning">
  **Important:** If you specify a different URL to send your users to for email
  verification, such as a page on the frontend of your app or similar, you need
  to handle making the call to the Payload REST or GraphQL verification
  operation yourself on your frontend, using the token that was provided for
  you. Above, it was passed via query parameter.
</Banner>

#### generateEmailSubject

Similarly to the above `generateEmailHTML`, you can also customize the subject of the email. The function arguments are the same but you can only return a string - not HTML.

```ts
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    verify: {
      // highlight-start
      generateEmailSubject: ({ req, user }) => {
        return `Hey ${user.email}, reset your password!`
      },
      // highlight-end
    },
  },
}
```

## Forgot Password

You can customize how the Forgot Password workflow operates with the following options on the `auth.forgotPassword` property:

```ts
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    forgotPassword: {
      // highlight-line
      // ...
    },
  },
}
```

The following options are available:

| Option                     | Description                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **`expiration`**           | Configure how long password reset tokens remain valid, specified in milliseconds.                                                               |
| **`generateEmailHTML`**    | Allows for overriding the HTML within emails that are sent to users attempting to reset their password. [More details](#generateEmailHTML).     |
| **`generateEmailSubject`** | Allows for overriding the subject of the email that is sent to users attempting to reset their password. [More details](#generateEmailSubject). |

<Banner type="success">
  **Tip:** Payload provides a built-in password reset page. If you don't need a
  custom frontend, you can link directly to `${serverURL}/admin/reset/${token}`.
  The admin and reset routes are configurable via `config.routes.admin` and
  `config.admin.routes.reset` respectively.
</Banner>

#### generateEmailHTML

This function allows for overriding the HTML within emails that are sent to users attempting to reset their password. The function should return a string that supports HTML, which can be a full HTML email.

```ts
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    forgotPassword: {
      // highlight-start
      generateEmailHTML: ({ req, token, user }) => {
        // Use the token provided to allow your user to reset their password
        const resetPasswordURL = `https://yourfrontend.com/reset-password?token=${token}`

        return `
          <!doctype html>
          <html>
            <body>
              <h1>Here is my custom email template!</h1>
              <p>Hello, ${user.email}!</p>
              <p>Click below to reset your password.</p>
              <p>
                <a href="${resetPasswordURL}">${resetPasswordURL}</a>
              </p>
            </body>
          </html>
        `
      },
      // highlight-end
    },
  },
}
```

<Banner type="warning">
  **Important:** If you specify a different URL to send your users to for
  resetting their password, such as a page on the frontend of your app or
  similar, you need to handle making the call to the Payload REST or GraphQL
  reset-password operation yourself on your frontend, using the token that was
  provided for you. Above, it was passed via query parameter.
</Banner>

<Banner type="success">
  **Tip:** HTML templating can be used to create custom email templates, inline
  CSS automatically, and more. You can make a reusable function that
  standardizes all email sent from Payload, which makes sending custom emails
  more DRY. Payload doesn't ship with an HTML templating engine, so you are free
  to choose your own.
</Banner>

The following arguments are passed to the `generateEmailHTML` function:

| Argument | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| `req`    | The request object.                                               |
| `token`  | The token that is generated for the user to reset their password. |
| `user`   | The user document that is attempting to reset their password.     |

#### generateEmailSubject

Similarly to the above `generateEmailHTML`, you can also customize the subject of the email. The function arguments are the same but you can only return a string - not HTML.

```ts
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    forgotPassword: {
      // highlight-start
      generateEmailSubject: ({ req, user }) => {
        return `Hey ${user.email}, reset your password!`
      },
      // highlight-end
    },
  },
}
```

The following arguments are passed to the `generateEmailSubject` function:

| Argument | Description                                                   |
| -------- | ------------------------------------------------------------- |
| `req`    | The request object.                                           |
| `user`   | The user document that is attempting to reset their password. |
```

--------------------------------------------------------------------------------

---[FILE: jwt.mdx]---
Location: payload-main/docs/authentication/jwt.mdx

```text
---
title: JWT Strategy
label: JWT Strategy
order: 40
desc: Enable JSON Web Token based authentication to interface with Payload.
keywords: authentication, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Payload offers the ability to [Authenticate](./overview) via JSON Web Tokens (JWT). These can be read from the responses of `login`, `logout`, `refresh`, and `me` auth operations.

<Banner type="success">
  **Tip:** You can access the logged-in user from within [Access
  Control](../access-control/overview) and [Hooks](../hooks/overview) through
  the `req.user` argument. [More details](./token-data).
</Banner>

### Identifying Users Via The Authorization Header

In addition to authenticating via an HTTP-only cookie, you can also identify users via the `Authorization` header on an HTTP request.

Example:

```ts
const user = await fetch('http://localhost:3000/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'dev@payloadcms.com',
    password: 'password',
  }),
}).then((req) => await req.json())

const request = await fetch('http://localhost:3000', {
  headers: {
    Authorization: `JWT ${user.token}`,
  },
})
```

### Omitting The Token

In some cases you may want to prevent the token from being returned from the auth operations. You can do that by setting `removeTokenFromResponses` to `true` like so:

```ts
import type { CollectionConfig } from 'payload'

export const UsersWithoutJWTs: CollectionConfig = {
  slug: 'users-without-jwts',
  auth: {
    removeTokenFromResponses: true, // highlight-line
  },
}
```

## External JWT Validation

When validating Payload-generated JWT tokens in external services, use the processed secret rather than your original secret key:

```ts
import crypto from 'node:crypto'

const secret = crypto
  .createHash('sha256')
  .update(process.env.PAYLOAD_SECRET)
  .digest('hex')
  .slice(0, 32)
```

<Banner type="info">
  **Note:** Payload processes your secret using SHA-256 hash and takes the first
  32 characters. This processed value is what's used for JWT operations, not
  your original secret.
</Banner>
```

--------------------------------------------------------------------------------

---[FILE: operations.mdx]---
Location: payload-main/docs/authentication/operations.mdx

```text
---
title: Authentication Operations
label: Operations
order: 20
desc: Enabling Authentication automatically makes key operations available such as Login, Logout, Verify, Unlock, Reset Password and more.
keywords: authentication, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Enabling [Authentication](./overview) on a [Collection](../configuration/collections) automatically exposes additional auth-based operations in the [Local API](../local-api/overview), [REST API](../rest-api/overview), and [GraphQL API](../graphql/overview).

## Access

The Access operation returns what a logged in user can and can't do with the collections and globals that are registered via your config. This data can be immensely helpful if your app needs to show and hide certain features based on [Access Control](../access-control/overview), just as the [Admin Panel](../admin/overview) does.

**REST API endpoint**:

`GET http://localhost:3000/api/access`

Example response:

```ts
{
  canAccessAdmin: true,
  collections: {
    pages: {
      create: {
        permission: true,
      },
      read: {
        permission: true,
      },
      update: {
        permission: true,
      },
      delete: {
        permission: true,
      },
      fields: {
        title: {
          create: {
            permission: true,
          },
          read: {
            permission: true,
          },
          update: {
            permission: true,
          },
        }
      }
    }
  }
}
```

**Example GraphQL Query**:

```graphql
query {
  Access {
    pages {
      read {
        permission
      }
    }
  }
}
```

Document access can also be queried on a collection/global basis. Access on a global can be queried like `http://localhost:3000/api/global-slug/access`, Collection document access can be queried like `http://localhost:3000/api/collection-slug/access/:id`.

## Me

Returns either a logged in user with token or null when there is no logged in user.

**REST API endpoint**:

`GET http://localhost:3000/api/[collection-slug]/me`

Example response:

```ts
{
  user: { // The JWT "payload" ;) from the logged in user
    email: 'dev@payloadcms.com',
    createdAt: "2020-12-27T21:16:45.645Z",
    updatedAt: "2021-01-02T18:37:41.588Z",
    id: "5ae8f9bde69e394e717c8832"
  },
  token: '34o4345324...', // The token that can be used to authenticate the user
  exp: 1609619861, // Unix timestamp representing when the user's token will expire
}
```

**Example GraphQL Query**:

```graphql
query {
  me[collection-singular-label] {
    user {
      email
    }
    exp
  }
}
```

## Login

Accepts an `email` and `password`. On success, it will return the logged in user as well as a token that can be used to authenticate. In the GraphQL and REST APIs, this operation also automatically sets an HTTP-only cookie including the user's token. If you pass a `res` to the Local API operation, Payload will set a cookie there as well.

**Example REST API login**:

```ts
const res = await fetch('http://localhost:3000/api/[collection-slug]/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'dev@payloadcms.com',
    password: 'this-is-not-our-password...or-is-it?',
  }),
})

const json = await res.json()

// JSON will be equal to the following:
/*
{
  user: {
    email: 'dev@payloadcms.com',
    createdAt: "2020-12-27T21:16:45.645Z",
    updatedAt: "2021-01-02T18:37:41.588Z",
    id: "5ae8f9bde69e394e717c8832"
  },
  token: '34o4345324...',
  exp: 1609619861
}
*/
```

**Example GraphQL Mutation**:

```graphql
mutation {
  login[collection-singular-label](email: "dev@payloadcms.com", password: "yikes") {
    user {
      email
    }
    exp
    token
  }
}
```

**Example Local API login**:

```ts
const result = await payload.login({
  collection: 'collection-slug',
  data: {
    email: 'dev@payloadcms.com',
    password: 'get-out',
  },
})
```

<Banner type="success">
  **Server Functions:** Payload offers a ready-to-use `login` server function
  that utilizes the Local API. For integration details and examples, check out
  the [Server Function
  docs](../local-api/server-functions#reusable-payload-server-functions).
</Banner>

## Logout

As Payload sets HTTP-only cookies, logging out cannot be done by just removing a cookie in JavaScript, as HTTP-only cookies are inaccessible by JS within the browser. So, Payload exposes a `logout` operation to delete the token in a safe way.

**Example REST API logout**:

```ts
const res = await fetch(
  'http://localhost:3000/api/[collection-slug]/logout?allSessions=false',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
```

**Example GraphQL Mutation**:

```
mutation {
  logoutUser(allSessions: false)
}
```

<Banner type="success">
  **Server Functions:** Payload provides a ready-to-use `logout` server function
  that manages the user's cookie for a seamless logout. For integration details
  and examples, check out the [Server Function
  docs](../local-api/server-functions#reusable-payload-server-functions).
</Banner>

#### Logging out with sessions enabled

By default, logging out will only end the session pertaining to the JWT that was used to log out with. However, you can pass `allSessions: true` to the logout operation in order to end all sessions for the user logging out.

## Refresh

Allows for "refreshing" JWTs. If your user has a token that is about to expire, but the user is still active and using the app, you might want to use the `refresh` operation to receive a new token by executing this operation via the authenticated user.

This operation requires a non-expired token to send back a new one. If the user's token has already expired, you will need to allow them to log in again to retrieve a new token.

If successful, this operation will automatically renew the user's HTTP-only cookie and will send back the updated token in JSON.

**Example REST API token refresh**:

```ts
const res = await fetch(
  'http://localhost:3000/api/[collection-slug]/refresh-token',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)

const json = await res.json()

// JSON will be equal to the following:
/*
{
  user: {
    email: 'dev@payloadcms.com',
    createdAt: "2020-12-27T21:16:45.645Z",
    updatedAt: "2021-01-02T18:37:41.588Z",
    id: "5ae8f9bde69e394e717c8832"
  },
  refreshedToken: '34o4345324...',
  exp: 1609619861
}
*/
```

**Example GraphQL Mutation**:

```
mutation {
  refreshToken[collection-singular-label] {
    user {
      email
    }
    refreshedToken
  }
}
```

<Banner type="success">
  **Server Functions:** Payload exports a ready-to-use `refresh` server function
  that automatically renews the user's token and updates the associated cookie.
  For integration details and examples, check out the [Server Function
  docs](../local-api/server-functions#reusable-payload-server-functions).
</Banner>

## Verify by Email

If your collection supports email verification, the Verify operation will be exposed which accepts a verification token and sets the user's `_verified` property to `true`, thereby allowing the user to authenticate with the Payload API.

**Example REST API user verification**:

```ts
const res = await fetch(
  `http://localhost:3000/api/[collection-slug]/verify/${TOKEN_HERE}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
```

**Example GraphQL Mutation**:

```graphql
mutation {
  verifyEmail[collection-singular-label](token: "TOKEN_HERE")
}
```

**Example Local API verification**:

```ts
const result = await payload.verifyEmail({
  collection: 'collection-slug',
  token: 'TOKEN_HERE',
})
```

**Note:** the token you need to pass to the `verifyEmail` function is unique to verification and is not the same as the token that you can retrieve from the `forgotPassword` operation. It can be found on the user document, as a hidden `_verificationToken` field. If you'd like to retrieve this token, you can use the Local API's `find` or `findByID` methods, setting `showHiddenFields: true`.

**Note:** if you do not have a `config.serverURL` set, Payload will attempt to create one for you if the user was created via REST or GraphQL by looking at the incoming `req`. But this is not supported if you are creating the user via the Local API's `payload.create()` method. If this applies to you, and you do not have a `serverURL` set, you may want to override your `verify.generateEmailHTML` function to provide a full URL to link the user to a proper verification page.

## Unlock

If a user locks themselves out and you wish to deliberately unlock them, you can utilize the Unlock operation. The [Admin Panel](../admin/overview) features an Unlock control automatically for all collections that feature max login attempts, but you can programmatically unlock users as well by using the Unlock operation.

To restrict who is allowed to unlock users, you can utilize the [`unlock`](../access-control/collections#unlock) access control function.

**Example REST API unlock**:

```ts
const res = await fetch(`http://localhost:3000/api/[collection-slug]/unlock`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

**Example GraphQL Mutation**:

```
mutation {
  unlock[collection-singular-label]
}
```

**Example Local API unlock**:

```ts
const result = await payload.unlock({
  collection: 'collection-slug',
})
```

## Forgot Password

Payload comes with built-in forgot password functionality. Submitting an email address to the Forgot Password operation will generate an email and send it to the respective email address with a link to reset their password.

The link to reset the user's password contains a token which is what allows the user to securely reset their password.

By default, the Forgot Password operations send users to the [Admin Panel](../admin/overview) to reset their password, but you can customize the generated email to send users to the frontend of your app instead by [overriding the email HTML](/docs/authentication/email#forgot-password).

**Example REST API Forgot Password**:

```ts
const res = await fetch(
  `http://localhost:3000/api/[collection-slug]/forgot-password`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'dev@payloadcms.com',
    }),
  },
)
```

**Example GraphQL Mutation**:

```
mutation {
  forgotPassword[collection-singular-label](email: "dev@payloadcms.com")
}
```

**Example Local API forgot password**:

```ts
const token = await payload.forgotPassword({
  collection: 'collection-slug',
  data: {
    email: 'dev@payloadcms.com',
  },
  disableEmail: false, // you can disable the auto-generation of email via Local API
})
```

<Banner type="info">
  **Note:** if you do not have a `config.serverURL` set, Payload will attempt to
  create one for you if the `forgot-password` operation was triggered via REST
  or GraphQL by looking at the incoming `req`. But this is not supported if you
  are calling `payload.forgotPassword()` via the Local API. If you do not have a
  `serverURL` set, you may want to override your
  `auth.forgotPassword.generateEmailHTML` function to provide a full URL to link
  the user to a proper reset-password page.
</Banner>

<Banner type="success">
  **Tip:**

You can stop the reset-password email from being sent via using the Local API. This is helpful if
you need to create user accounts programmatically, but not set their password for them. This
effectively generates a reset password token which you can then use to send to a page you create,
allowing a user to "complete" their account by setting their password. In the background, you'd
use the token to "reset" their password.

</Banner>

## Reset Password

After a user has "forgotten" their password and a token is generated, that token can be used to send to the reset password operation along with a new password which will allow the user to reset their password securely.

**Example REST API Reset Password**:

```ts
const res = await fetch(`http://localhost:3000/api/[collection-slug]/reset-password`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: 'TOKEN_GOES_HERE'
    password: 'not-today',
  }),
});

const json = await res.json();

// JSON will be equal to the following:
/*
{
  user: {
    email: 'dev@payloadcms.com',
    createdAt: "2020-12-27T21:16:45.645Z",
    updatedAt: "2021-01-02T18:37:41.588Z",
    id: "5ae8f9bde69e394e717c8832"
  },
  token: '34o4345324...',
  exp: 1609619861
}
*/
```

**Example GraphQL Mutation**:

```graphql
mutation {
  resetPassword[collection-singular-label](token: "TOKEN_GOES_HERE", password: "not-today")
}
```
```

--------------------------------------------------------------------------------

````
