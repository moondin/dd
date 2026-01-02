---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 148
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 148 of 695)

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

---[FILE: README.md]---
Location: payload-main/packages/email-nodemailer/README.md

```text
# Nodemailer Email Adapter for Payload

This adapter allows you to send emails using the [Nodemailer](https://nodemailer.com/) library.

It abstracts all of the email functionality that was in Payload by default in 2.x into a separate package.

**NOTE:** Configuring email in Payload 3.0 is now completely optional. However, you will receive a startup warning that email is not configured and also a message if you attempt to send an email.

## Installation

```sh
pnpm add @payloadcms/email-nodemailer nodemailer
```

## Usage

### Using nodemailer.createTransport

```ts
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'info@payloadcms.com',
    defaultFromName: 'Payload',
    // Any Nodemailer transport
    transport: await nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),
})
```

### Using transportOptions

```ts
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'info@payloadcms.com',
    defaultFromName: 'Payload',
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
})
```

During development, if you pass nothing to `nodemailerAdapter`, it will use the [ethereal.email](https://ethereal.email) service.

This will log the ethereal.email details to console on startup.

```ts
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  email: nodemailerAdapter(), // This will be the old ethereal.email functionality
})
```
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/email-nodemailer/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/email-nodemailer/src/index.ts

```typescript
/* eslint-disable no-console */
import type { Transporter } from 'nodemailer'
import type SMTPConnection from 'nodemailer/lib/smtp-connection'
import type { EmailAdapter } from 'payload'

import nodemailer from 'nodemailer'
import { InvalidConfiguration } from 'payload'

export type NodemailerAdapterArgs = {
  defaultFromAddress: string
  defaultFromName: string
  skipVerify?: boolean
  transport?: Transporter
  transportOptions?: SMTPConnection.Options
}

type NodemailerAdapter = EmailAdapter<unknown>

/**
 * Creates an email adapter using nodemailer
 *
 * If no email configuration is provided, an ethereal email test account is returned
 */
export const nodemailerAdapter = async (
  args?: NodemailerAdapterArgs,
): Promise<NodemailerAdapter> => {
  const { defaultFromAddress, defaultFromName, transport } = await buildEmail(args)

  const adapter: NodemailerAdapter = () => ({
    name: 'nodemailer',
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      return await transport.sendMail({
        from: `${defaultFromName} <${defaultFromAddress}>`,
        ...message,
      })
    },
  })
  return adapter
}

async function buildEmail(emailConfig?: NodemailerAdapterArgs): Promise<{
  defaultFromAddress: string
  defaultFromName: string
  transport: Transporter
}> {
  if (!emailConfig) {
    const transport = await createMockAccount(emailConfig)
    if (!transport) {
      throw new InvalidConfiguration('Unable to create Nodemailer test account.')
    }

    return {
      defaultFromAddress: 'info@payloadcms.com',
      defaultFromName: 'Payload',
      transport,
    }
  }

  // Create or extract transport
  let transport: Transporter
  if ('transport' in emailConfig && emailConfig.transport) {
    ;({ transport } = emailConfig)
  } else if ('transportOptions' in emailConfig && emailConfig.transportOptions) {
    transport = nodemailer.createTransport(emailConfig.transportOptions)
  } else {
    transport = await createMockAccount(emailConfig)
  }

  if (!emailConfig.skipVerify) {
    await verifyTransport(transport)
  }

  return {
    defaultFromAddress: emailConfig.defaultFromAddress,
    defaultFromName: emailConfig.defaultFromName,
    transport,
  }
}

async function verifyTransport(transport: Transporter) {
  try {
    await transport.verify()
  } catch (err: unknown) {
    console.error({ err, msg: 'Error verifying Nodemailer transport.' })
  }
}

/**
 * Use ethereal.email to create a mock email account
 */
async function createMockAccount(emailConfig?: NodemailerAdapterArgs) {
  try {
    const etherealAccount = await nodemailer.createTestAccount()

    const smtpOptions = {
      ...(emailConfig || {}),
      auth: {
        pass: etherealAccount.pass,
        user: etherealAccount.user,
      },
      fromAddress: emailConfig?.defaultFromAddress,
      fromName: emailConfig?.defaultFromName,
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
    }
    const transport = nodemailer.createTransport(smtpOptions)
    const { pass, user, web } = etherealAccount

    console.info('E-mail configured with ethereal.email test account. ')
    console.info(`Log into mock email provider at ${web}`)
    console.info(`Mock email account username: ${user}`)
    console.info(`Mock email account password: ${pass}`)
    return transport
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error({ err, msg: 'There was a problem setting up the mock email handler' })
      throw new InvalidConfiguration(
        `Unable to create Nodemailer test account. Error: ${err.message}`,
      )
    }
    throw new InvalidConfiguration('Unable to create Nodemailer test account.')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: plugin.spec.ts]---
Location: payload-main/packages/email-nodemailer/src/plugin.spec.ts

```typescript
import type { Transporter } from 'nodemailer'

import { jest } from '@jest/globals'
import nodemailer from 'nodemailer'

import type { NodemailerAdapterArgs } from './index.js'

import { nodemailerAdapter } from './index.js'

const defaultArgs: NodemailerAdapterArgs = {
  defaultFromAddress: 'test@test.com',
  defaultFromName: 'Test',
}

describe('email-nodemailer', () => {
  describe('transport verification', () => {
    let mockedVerify: jest.Mock<Transporter['verify']>
    let mockTransport: Transporter

    beforeEach(() => {
      mockedVerify = jest.fn<Transporter['verify']>()
      mockTransport = nodemailer.createTransport({
        name: 'existing-transport',
        // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-misused-promises
        send: async (mail) => {
          // eslint-disable-next-line no-console
          console.log('mock send', mail)
        },
        verify: mockedVerify,
        version: '0.0.1',
      })
    })

    it('should be invoked when skipVerify = false', async () => {
      await nodemailerAdapter({
        ...defaultArgs,
        skipVerify: false,
        transport: mockTransport,
      })

      expect(mockedVerify.mock.calls).toHaveLength(1)
    })

    it('should be invoked when skipVerify is undefined', async () => {
      await nodemailerAdapter({
        ...defaultArgs,
        skipVerify: false,
        transport: mockTransport,
      })

      expect(mockedVerify.mock.calls).toHaveLength(1)
    })

    it('should not be invoked when skipVerify = true', async () => {
      await nodemailerAdapter({
        ...defaultArgs,
        skipVerify: true,
        transport: mockTransport,
      })

      expect(mockedVerify.mock.calls).toHaveLength(0)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/email-resend/.prettierignore

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
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/email-resend/.swcrc

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
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .swcrc-build]---
Location: payload-main/packages/email-resend/.swcrc-build

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "exclude": [
    "/**/mocks",
    "/**/*.spec.ts"
  ],
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: payload-main/packages/email-resend/jest.config.js

```javascript
/** @type {import('jest').Config} */
const customJestConfig = {
  rootDir: '.',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*spec.ts'],
  testTimeout: 10000,
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  verbose: true,
}

export default customJestConfig
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/email-resend/LICENSE.md

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
Location: payload-main/packages/email-resend/package.json

```json
{
  "name": "@payloadcms/email-resend",
  "version": "3.68.5",
  "description": "Payload Resend Email Adapter",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/email-resend"
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
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc-build --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "jest"
  },
  "devDependencies": {
    "@types/jest": "29.5.12",
    "jest": "^29.7.0",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/email-resend/README.md

```text
# Resend REST Email Adapter

This adapter allows you to send emails using the [Resend](https://resend.com) REST API.

## Installation

```sh
pnpm add @payloadcms/email-resend
```

## Usage

- Sign up for a [Resend](https://resend.com) account
- Set up a domain
- Create an API key
- Set API key as RESEND_API_KEY environment variable
- Configure your Payload config

```ts
// payload.config.js
import { resendAdapter } from '@payloadcms/email-resend'

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'dev@payloadcms.com',
    defaultFromName: 'Payload CMS',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
```
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/email-resend/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: email-resend.spec.ts]---
Location: payload-main/packages/email-resend/src/email-resend.spec.ts

```typescript
import type { Payload } from 'payload'

import { jest } from '@jest/globals'

import { resendAdapter } from './index.js'

describe('email-resend', () => {
  const defaultFromAddress = 'dev@payloadcms.com'
  const defaultFromName = 'Payload CMS'
  const apiKey = 'test-api-key'
  const from = 'dev@payloadcms.com'
  const to = from
  const subject = 'This was sent on init'
  const text = 'This is my message body'

  const mockPayload = {} as unknown as Payload

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle sending an email', async () => {
    global.fetch = jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          json: () => {
            return { id: 'test-id' }
          },
        }),
      ) as jest.Mock,
    ) as jest.Mock

    const adapter = resendAdapter({
      apiKey,
      defaultFromAddress,
      defaultFromName,
    })

    await adapter({ payload: mockPayload }).sendEmail({
      from,
      subject,
      text,
      to,
    })

    // @ts-expect-error
    expect(global.fetch.mock.calls[0][0]).toStrictEqual('https://api.resend.com/emails')
    // @ts-expect-error
    const request = global.fetch.mock.calls[0][1]
    expect(request.headers.Authorization).toStrictEqual(`Bearer ${apiKey}`)
    expect(JSON.parse(request.body)).toMatchObject({
      from,
      subject,
      text,
      to,
    })
  })

  it('should throw an error if the email fails to send', async () => {
    const errorResponse = {
      name: 'validation_error',
      message: 'error information',
      statusCode: 403,
    }
    global.fetch = jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          json: () => errorResponse,
        }),
      ) as jest.Mock,
    ) as jest.Mock

    const adapter = resendAdapter({
      apiKey,
      defaultFromAddress,
      defaultFromName,
    })

    await expect(() =>
      adapter({ payload: mockPayload }).sendEmail({
        from,
        subject,
        text,
        to,
      }),
    ).rejects.toThrow(
      `Error sending email: ${errorResponse.statusCode} ${errorResponse.name} - ${errorResponse.message}`,
    )
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/email-resend/src/index.ts

```typescript
import type { EmailAdapter, SendEmailOptions } from 'payload'

import { APIError } from 'payload'

export type ResendAdapterArgs = {
  apiKey: string
  defaultFromAddress: string
  defaultFromName: string
}

type ResendAdapter = EmailAdapter<ResendResponse>

type ResendError = {
  message: string
  name: string
  statusCode: number
}

type ResendResponse = { id: string } | ResendError

/**
 * Email adapter for [Resend](https://resend.com) REST API
 */
export const resendAdapter = (args: ResendAdapterArgs): ResendAdapter => {
  const { apiKey, defaultFromAddress, defaultFromName } = args

  const adapter: ResendAdapter = () => ({
    name: 'resend-rest',
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      // Map the Payload email options to Resend email options
      const sendEmailOptions = mapPayloadEmailToResendEmail(
        message,
        defaultFromAddress,
        defaultFromName,
      )

      const res = await fetch('https://api.resend.com/emails', {
        body: JSON.stringify(sendEmailOptions),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const data = (await res.json()) as ResendResponse

      if ('id' in data) {
        return data
      } else {
        const statusCode = data.statusCode || res.status
        let formattedError = `Error sending email: ${statusCode}`
        if (data.name && data.message) {
          formattedError += ` ${data.name} - ${data.message}`
        }

        throw new APIError(formattedError, statusCode)
      }
    },
  })

  return adapter
}

function mapPayloadEmailToResendEmail(
  message: SendEmailOptions,
  defaultFromAddress: string,
  defaultFromName: string,
): ResendSendEmailOptions {
  return {
    // Required
    from: mapFromAddress(message.from, defaultFromName, defaultFromAddress),
    subject: message.subject ?? '',
    to: mapAddresses(message.to),

    // Other To fields
    bcc: mapAddresses(message.bcc),
    cc: mapAddresses(message.cc),
    reply_to: mapAddresses(message.replyTo),

    // Optional
    attachments: mapAttachments(message.attachments),
    html: message.html?.toString() || '',
    text: message.text?.toString() || '',
  } as ResendSendEmailOptions
}

function mapFromAddress(
  address: SendEmailOptions['from'],
  defaultFromName: string,
  defaultFromAddress: string,
): ResendSendEmailOptions['from'] {
  if (!address) {
    return `${defaultFromName} <${defaultFromAddress}>`
  }

  if (typeof address === 'string') {
    return address
  }

  return `${address.name} <${address.address}>`
}

function mapAddresses(addresses: SendEmailOptions['to']): ResendSendEmailOptions['to'] {
  if (!addresses) {
    return ''
  }

  if (typeof addresses === 'string') {
    return addresses
  }

  if (Array.isArray(addresses)) {
    return addresses.map((address) => (typeof address === 'string' ? address : address.address))
  }

  return [addresses.address]
}

function mapAttachments(
  attachments: SendEmailOptions['attachments'],
): ResendSendEmailOptions['attachments'] {
  if (!attachments) {
    return []
  }

  return attachments.map((attachment) => {
    if (!attachment.filename || !attachment.content) {
      throw new APIError('Attachment is missing filename or content', 400)
    }

    if (typeof attachment.content === 'string') {
      return {
        content: Buffer.from(attachment.content),
        filename: attachment.filename,
      }
    }

    if (attachment.content instanceof Buffer) {
      return {
        content: attachment.content,
        filename: attachment.filename,
      }
    }

    throw new APIError('Attachment content must be a string or a buffer', 400)
  })
}

type ResendSendEmailOptions = {
  /**
   * Filename and content of attachments (max 40mb per email)
   *
   * @link https://resend.com/docs/api-reference/emails/send-email#body-parameters
   */
  attachments?: Attachment[]
  /**
   * Blind carbon copy recipient email address. For multiple addresses, send as an array of strings.
   *
   * @link https://resend.com/docs/api-reference/emails/send-email#body-parameters
   */
  bcc?: string | string[]

  /**
   * Carbon copy recipient email address. For multiple addresses, send as an array of strings.
   *
   * @link https://resend.com/docs/api-reference/emails/send-email#body-parameters
   */
  cc?: string | string[]
  /**
   * Sender email address. To include a friendly name, use the format `"Your Name <sender@domain.com>"`
   *
   * @link https://resend.com/docs/api-reference/emails/send-email#body-parameters
   */
  from: string
  /**
   * Custom headers to add to the email.
   *
   * @link https://resend.com/docs/api-reference/emails/send-email#body-parameters
   */
  headers?: Record<string, string>
  /**
   * The HTML version of the message.
   *
   * @link https://resend.com/api-reference/emails/send-email#body-parameters
   */
  html?: string
  /**
   * Reply-to email address. For multiple addresses, send as an array of strings.
   *
   * @link https://resend.com/docs/api-reference/emails/send-email#body-parameters
   */
  reply_to?: string | string[]
  /**
   * Email subject.
   *
   * @link https://resend.com/docs/api-reference/emails/send-email#body-parameters
   */
  subject: string
  /**
   * Email tags
   *
   * @link https://resend.com/docs/api-reference/emails/send-email#body-parameters
   */
  tags?: Tag[]
  /**
   * The plain text version of the message.
   *
   * @link https://resend.com/api-reference/emails/send-email#body-parameters
   */
  text?: string
  /**
   * Recipient email address. For multiple addresses, send as an array of strings. Max 50.
   *
   * @link https://resend.com/docs/api-reference/emails/send-email#body-parameters
   */
  to: string | string[]
}

type Attachment = {
  /** Content of an attached file. */
  content?: Buffer | string
  /** Name of attached file. */
  filename?: false | string | undefined
  /** Path where the attachment file is hosted */
  path?: string
}

export type Tag = {
  /**
   * The name of the email tag. It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-). It can contain no more than 256 characters.
   */
  name: string
  /**
   * The value of the email tag. It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-). It can contain no more than 256 characters.
   */
  value: string
}
```

--------------------------------------------------------------------------------

---[FILE: deepMerge.js]---
Location: payload-main/packages/eslint-config/deepMerge.js

```javascript
/**
 * obj2 has priority over obj1
 *
 * Merges obj2 into obj1
 */
export function _deepMerge(obj1, obj2, doNotMergeInNulls = true) {
  const output = { ...obj1 }

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (doNotMergeInNulls) {
        if (
          (obj2[key] === null || obj2[key] === undefined) &&
          obj1[key] !== null &&
          obj1[key] !== undefined
        ) {
          continue
        }
      }

      // Check if both are arrays
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        // Merge each element in the arrays

        // We need the Array.from, map rather than a normal map because this handles holes in arrays properly. A simple .map would skip holes.
        output[key] = Array.from(obj2[key], (item, index) => {
          if (doNotMergeInNulls) {
            if (
              (item === undefined || item === null) &&
              obj1[key][index] !== null &&
              obj1[key][index] !== undefined
            ) {
              return obj1[key][index]
            }
          }

          if (typeof item === 'object' && !Array.isArray(item) && obj1[key][index]) {
            // Deep merge for objects in arrays
            return deepMerge(obj1[key][index], item, doNotMergeInNulls)
          }
          return item
        })
      } else if (typeof obj2[key] === 'object' && !Array.isArray(obj2[key]) && obj1[key]) {
        // Existing behavior for objects
        output[key] = deepMerge(obj1[key], obj2[key], doNotMergeInNulls)
      } else {
        // Direct assignment for values
        output[key] = obj2[key]
      }
    }
  }

  return output
}

export function deepMerge(...objs) {
  return objs.reduce((acc, obj) => _deepMerge(acc, obj), {})
}
```

--------------------------------------------------------------------------------

---[FILE: index.mjs]---
Location: payload-main/packages/eslint-config/index.mjs

```text
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import perfectionist from 'eslint-plugin-perfectionist'
import { configs as regexpPluginConfigs } from 'eslint-plugin-regexp'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import payloadPlugin from '@payloadcms/eslint-plugin'
import reactExtends from './configs/react/index.mjs'
import jestExtends from './configs/jest/index.mjs'
import globals from 'globals'
import importX from 'eslint-plugin-import-x'
import typescriptParser from '@typescript-eslint/parser'
import { deepMerge } from './deepMerge.js'
import reactCompiler from 'eslint-plugin-react-compiler'

const baseRules = {
  // This rule makes no sense when overriding class methods. This is used a lot in richtext-lexical.
  'class-methods-use-this': 'off',
  curly: ['warn', 'all'],
  'arrow-body-style': 0,
  'import-x/prefer-default-export': 'off',
  'no-restricted-exports': ['warn', { restrictDefaultExports: { direct: true } }],
  'no-console': 'warn',
  'no-sparse-arrays': 'off',
  'no-underscore-dangle': 'off',
  'no-use-before-define': 'off',
  'object-shorthand': 'warn',
  'no-useless-escape': 'warn',
  'import-x/no-duplicates': 'warn',
  'perfectionist/sort-objects': [
    'error',
    {
      type: 'natural',
      order: 'asc',
      partitionByComment: true,
      partitionByNewLine: true,
      groups: ['top', 'unknown'],
      customGroups: {
        top: ['_id', 'id', 'name', 'slug', 'type'],
      },
    },
  ],
  /*'perfectionist/sort-object-types': [
    'error',
    {
      partitionByNewLine: true,
    },
  ],
  'perfectionist/sort-interfaces': [
    'error',
    {
      partitionByNewLine': true,
    },
  ],*/
  'payload/no-jsx-import-statements': 'error',
}

const reactA11yRules = {
  'jsx-a11y/anchor-is-valid': 'warn',
  'jsx-a11y/control-has-associated-label': 'warn',
  'jsx-a11y/no-static-element-interactions': 'warn',
  'jsx-a11y/label-has-associated-control': 'warn',
}

const typescriptRules = {
  '@typescript-eslint/no-use-before-define': 'off',

  // Type-aware any rules:
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/unbound-method': 'warn',
  '@typescript-eslint/consistent-type-imports': 'warn',
  '@typescript-eslint/no-explicit-any': 'warn',
  // Type-aware any rules end

  // ts-expect preferred over ts-ignore. It will error if the expected error is no longer present.
  '@typescript-eslint/ban-ts-comment': 'warn', // Recommended over deprecated @typescript-eslint/prefer-ts-expect-error: https://github.com/typescript-eslint/typescript-eslint/issues/8333. Set to warn to ease migration.
  // By default, it errors for unused variables. This is annoying, warnings are enough.
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false,
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^(_|ignore)',
    },
  ],
  '@typescript-eslint/no-base-to-string': 'warn',
  '@typescript-eslint/restrict-template-expressions': 'warn',
  '@typescript-eslint/no-redundant-type-constituents': 'warn',
  '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
  '@typescript-eslint/no-misused-promises': [
    'error',
    {
      // See https://github.com/typescript-eslint/typescript-eslint/issues/4619 and https://github.com/typescript-eslint/typescript-eslint/pull/4623
      // Don't want something like <button onClick={someAsyncFunction}> to error
      checksVoidReturn: {
        attributes: false,
        arguments: false,
      },
    },
  ],
  '@typescript-eslint/no-empty-object-type': 'warn',
}

/** @typedef {import('eslint').Linter.Config} Config */

/** @type {FlatConfig} */
const baseExtends = deepMerge(
  js.configs.recommended,
  perfectionist.configs['recommended-natural'],
  regexpPluginConfigs['flat/recommended'],
)

/** @type {Config[]} */
export const rootEslintConfig = [
  {
    name: 'Settings',
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: {
          // This is necessary because `tsconfig.base.json` defines `"rootDir": "${configDir}/src"`,
          // And the following files aren't in src because they aren't transpiled.
          // This is typescript-eslint's way of adding files that aren't included in tsconfig.
          // See: https://typescript-eslint.io/troubleshooting/typed-linting/#i-get-errors-telling-me--was-not-found-by-the-project-service-consider-either-including-it-in-the-tsconfigjson-or-including-it-in-allowdefaultproject
          // The best practice is to have a tsconfig.json that covers ALL files and is used for
          // typechecking (with noEmit), and a `tsconfig.build.json` that is used for the build
          // (or alternatively, swc, tsup or tsdown). That's what we should ideally do, in which case
          // this hardcoded list wouldn't be necessary. Note that these files don't currently go
          // through ts, only through eslint.
          allowDefaultProject: [
            '../payload/bin.js',
            '../payload/bundle.js',
            '../next/babel.config.cjs',
            '../next/bundleScss.js',
            '../ui/babel.config.cjs',
            '../ui/bundle.js',
            '../graphql/bin.js',
            '../richtext-lexical/babel.config.cjs',
            '../richtext-lexical/bundle.js',
            '../richtext-lexical/scripts/translateNewKeys.ts',
            '../db-postgres/bundle.js',
            '../db-postgres/relationships-v2-v3.mjs',
            '../db-postgres/scripts/renamePredefinedMigrations.ts',
            '../db-sqlite/bundle.js',
            '../db-d1-sqlite/bundle.js',
            '../db-vercel-postgres/relationships-v2-v3.mjs',
            '../db-vercel-postgres/scripts/renamePredefinedMigrations.ts',
            '../plugin-cloud-storage/azure.d.ts',
            '../plugin-cloud-storage/azure.js',
            '../plugin-cloud-storage/gcs.d.ts',
            '../plugin-cloud-storage/gcs.js',
            '../plugin-cloud-storage/s3.d.ts',
            '../plugin-cloud-storage/s3.js',
            '../plugin-redirects/types.d.ts',
            '../plugin-redirects/types.js',
            '../translations/scripts/translateNewKeys/applyEslintFixes.ts',
            '../translations/scripts/translateNewKeys/findMissingKeys.ts',
            '../translations/scripts/translateNewKeys/generateTsObjectLiteral.ts',
            '../translations/scripts/translateNewKeys/index.ts',
            '../translations/scripts/translateNewKeys/run.ts',
            '../translations/scripts/translateNewKeys/sortKeys.ts',
            '../translations/scripts/translateNewKeys/translateText.ts',
            '../create-payload-app/bin/cli.js',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: typescriptParser,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      'import-x': importX,
    },
  },
  {
    name: 'TypeScript',
    // has 3 entries: https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/typescript-eslint/src/configs/recommended-type-checked.ts
    ...deepMerge(
      baseExtends,
      tseslint.configs.recommendedTypeChecked[0],
      tseslint.configs.recommendedTypeChecked[1],
      tseslint.configs.recommendedTypeChecked[2],
      eslintConfigPrettier,
      {
        plugins: {
          payload: payloadPlugin,
        },
        rules: {
          ...baseRules,
          ...typescriptRules,
        },
      },
    ),
    files: ['**/*.ts'],
  },
  {
    name: 'TypeScript-React',
    ...deepMerge(
      baseExtends,
      tseslint.configs.recommendedTypeChecked[0],
      tseslint.configs.recommendedTypeChecked[1],
      tseslint.configs.recommendedTypeChecked[2],
      reactExtends,
      eslintConfigPrettier,
      {
        plugins: {
          payload: payloadPlugin,
        },
        rules: {
          ...baseRules,
          ...typescriptRules,
          ...reactA11yRules,
        },
      },
    ),
    files: ['**/*.tsx'],
  },
  {
    name: 'Unit Tests',
    ...deepMerge(jestExtends, {
      plugins: {
        payload: payloadPlugin,
      },
      rules: {
        ...baseRules,
        ...typescriptRules,
        '@typescript-eslint/unbound-method': 'off',
      },
    }),
    files: ['**/*.spec.ts'],
  },
  {
    name: 'Payload Config',
    plugins: {
      payload: payloadPlugin,
    },
    rules: {
      'no-restricted-exports': 'off',
    },
    files: ['*.config.ts', 'config.ts'],
  },
  {
    name: 'React Compiler',
    ...reactCompiler.configs.recommended,
  },
]

export default rootEslintConfig
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/eslint-config/LICENSE.md

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
Location: payload-main/packages/eslint-config/package.json
Signals: React

```json
{
  "name": "@payloadcms/eslint-config",
  "version": "3.28.0",
  "description": "Payload styles for ESLint and Prettier",
  "keywords": [],
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/eslint-config"
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
    "@payloadcms/eslint-plugin": "workspace:*",
    "@types/eslint": "9.6.1",
    "@typescript-eslint/parser": "8.26.1",
    "eslint": "9.22.0",
    "eslint-config-prettier": "10.1.1",
    "eslint-plugin-import-x": "4.6.1",
    "eslint-plugin-jest": "28.11.0",
    "eslint-plugin-jest-dom": "5.5.0",
    "eslint-plugin-jsx-a11y": "6.10.2",
    "eslint-plugin-perfectionist": "3.9.1",
    "eslint-plugin-react-compiler": "19.1.0-rc.2",
    "eslint-plugin-react-hooks": "0.0.0-experimental-d331ba04-20250307",
    "eslint-plugin-regexp": "2.7.0",
    "globals": "16.0.0",
    "typescript": "5.7.3",
    "typescript-eslint": "8.26.1"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.mjs]---
Location: payload-main/packages/eslint-config/configs/jest/index.mjs

```text
import jestRules from './rules/jest.mjs'
import jestDomRules from './rules/jest-dom.mjs'
import jestDom from 'eslint-plugin-jest-dom'
import jest from 'eslint-plugin-jest'
import { deepMerge } from '../../deepMerge.js'

/** @type {import('eslint').Linter.Config} */
export const index = deepMerge(
  {
    rules: jestRules,
  },
  {
    rules: jestDomRules,
  },
  {
    plugins: {
      jest,
      'jest-dom': jestDom,
    },
  },
)

export default index
```

--------------------------------------------------------------------------------

---[FILE: jest-dom.mjs]---
Location: payload-main/packages/eslint-config/configs/jest/rules/jest-dom.mjs

```text
/** @type {import('eslint').Linter.Config} */
export const index = {
  'jest-dom/prefer-checked': 'error',
  'jest-dom/prefer-enabled-disabled': 'error',
  'jest-dom/prefer-focus': 'error',
  'jest-dom/prefer-required': 'error',
  'jest-dom/prefer-to-have-attribute': 'error',
}

export default index
```

--------------------------------------------------------------------------------

````
