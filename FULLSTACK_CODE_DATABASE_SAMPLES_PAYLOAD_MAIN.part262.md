---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 262
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 262 of 695)

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

---[FILE: createNewInStripe.ts]---
Location: payload-main/packages/plugin-stripe/src/hooks/createNewInStripe.ts

```typescript
import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { APIError } from 'payload'
import Stripe from 'stripe'

import type { StripePluginConfig } from '../types.js'

import { deepen } from '../utilities/deepen.js'

type HookArgsWithCustomCollection = {
  collection: CollectionConfig
} & Omit<Parameters<CollectionBeforeValidateHook>[0], 'collection'>

export type CollectionBeforeValidateHookWithArgs = (
  args: {
    collection?: CollectionConfig
    pluginConfig?: StripePluginConfig
  } & HookArgsWithCustomCollection,
) => Promise<Partial<any>>

export const createNewInStripe: CollectionBeforeValidateHookWithArgs = async (args) => {
  const { collection, data, operation, pluginConfig, req } = args

  const { logs, sync } = pluginConfig || {}

  const payload = req?.payload

  const dataRef = data || {}

  if (process.env.NODE_ENV === 'test') {
    dataRef.stripeID = 'test'
    return dataRef
  }

  if (payload) {
    if (data?.skipSync) {
      if (logs) {
        payload.logger.info(`Bypassing collection-level hooks.`)
      }
    } else {
      // initialize as 'false' so that all Payload admin events sync to Stripe
      // then conditionally set to 'true' to for events that originate from webhooks
      // this will prevent webhook events from triggering an unnecessary sync / infinite loop
      dataRef.skipSync = false

      const { slug: collectionSlug } = collection || {}
      const syncConfig = sync?.find((conf) => conf.collection === collectionSlug)

      if (syncConfig) {
        // combine all fields of this object and match their respective values within the document
        let syncedFields = syncConfig.fields.reduce(
          (acc, field) => {
            const { fieldPath, stripeProperty } = field

            acc[stripeProperty] = dataRef[fieldPath]
            return acc
          },
          {} as Record<string, any>,
        )

        syncedFields = deepen(syncedFields)

        // api version can only be the latest, stripe recommends ts ignoring it
        const stripe = new Stripe(pluginConfig?.stripeSecretKey || '', { apiVersion: '2022-08-01' })

        if (operation === 'update') {
          if (logs) {
            payload.logger.info(
              `A '${collectionSlug}' document has changed in Payload with ID: '${data?.id}', syncing with Stripe...`,
            )
          }

          // NOTE: the Stripe document will be created in the "afterChange" hook, so create a new stripe document here if no stripeID exists
          if (!dataRef.stripeID) {
            try {
              // NOTE: Typed as "any" because the "create" method is not standard across all Stripe resources
              const stripeResource = await stripe?.[syncConfig.stripeResourceType]?.create(
                // @ts-expect-error
                syncedFields,
              )

              if (logs) {
                payload.logger.info(
                  `✅ Successfully created new '${syncConfig.stripeResourceType}' resource in Stripe with ID: '${stripeResource.id}'.`,
                )
              }

              dataRef.stripeID = stripeResource.id

              // NOTE: this is to prevent sync in the "afterChange" hook
              dataRef.skipSync = true
            } catch (error: unknown) {
              const msg = error instanceof Error ? error.message : error
              if (logs) {
                payload.logger.error(`- Error creating Stripe document: ${msg}`)
              }
            }
          }
        }

        if (operation === 'create') {
          if (logs) {
            payload.logger.info(
              `A new '${collectionSlug}' document was created in Payload with ID: '${data?.id}', syncing with Stripe...`,
            )
          }

          try {
            if (logs) {
              payload.logger.info(
                `- Creating new '${syncConfig.stripeResourceType}' resource in Stripe...`,
              )
            }

            // NOTE: Typed as "any" because the "create" method is not standard across all Stripe resources
            const stripeResource = await stripe?.[syncConfig.stripeResourceType]?.create(
              // @ts-expect-error
              syncedFields,
            )

            if (logs) {
              payload.logger.info(
                `✅ Successfully created new '${syncConfig.stripeResourceType}' resource in Stripe with ID: '${stripeResource.id}'.`,
              )
            }

            dataRef.stripeID = stripeResource.id

            // IMPORTANT: this is to prevent sync in the "afterChange" hook
            dataRef.skipSync = true
          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : error
            throw new APIError(
              `Failed to create new '${syncConfig.stripeResourceType}' resource in Stripe: ${msg}`,
            )
          }
        }
      }
    }
  }

  return dataRef
}
```

--------------------------------------------------------------------------------

---[FILE: deleteFromStripe.ts]---
Location: payload-main/packages/plugin-stripe/src/hooks/deleteFromStripe.ts

```typescript
import type { CollectionAfterDeleteHook, CollectionConfig } from 'payload'

import { APIError } from 'payload'
import Stripe from 'stripe'

import type { StripePluginConfig } from '../types.js'

type HookArgsWithCustomCollection = {
  collection: CollectionConfig
} & Omit<Parameters<CollectionAfterDeleteHook>[0], 'collection'>

export type CollectionAfterDeleteHookWithArgs = (
  args: {
    collection?: CollectionConfig
    pluginConfig?: StripePluginConfig
  } & HookArgsWithCustomCollection,
) => Promise<void>

export const deleteFromStripe: CollectionAfterDeleteHookWithArgs = async (args) => {
  const { collection, doc, pluginConfig, req } = args

  const { logs, sync } = pluginConfig || {}

  const { payload } = req
  const { slug: collectionSlug } = collection || {}

  if (logs) {
    payload.logger.info(
      `Document with ID: '${doc?.id}' in collection: '${collectionSlug}' has been deleted, deleting from Stripe...`,
    )
  }

  if (process.env.NODE_ENV !== 'test') {
    if (logs) {
      payload.logger.info(`- Deleting Stripe document with ID: '${doc.stripeID}'...`)
    }

    const syncConfig = sync?.find((conf) => conf.collection === collectionSlug)

    if (syncConfig) {
      try {
        // api version can only be the latest, stripe recommends ts ignoring it
        const stripe = new Stripe(pluginConfig?.stripeSecretKey || '', { apiVersion: '2022-08-01' })

        const found = await stripe?.[syncConfig.stripeResourceType]?.retrieve(doc.stripeID)

        if (found) {
          await stripe?.[syncConfig.stripeResourceType]?.del(doc.stripeID)
          if (logs) {
            payload.logger.info(
              `✅ Successfully deleted Stripe document with ID: '${doc.stripeID}'.`,
            )
          }
        } else {
          if (logs) {
            payload.logger.info(
              `- Stripe document with ID: '${doc.stripeID}' not found, skipping...`,
            )
          }
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : error
        throw new APIError(`Failed to delete Stripe document with ID: '${doc.stripeID}': ${msg}`)
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: syncExistingWithStripe.ts]---
Location: payload-main/packages/plugin-stripe/src/hooks/syncExistingWithStripe.ts

```typescript
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { APIError } from 'payload'
import Stripe from 'stripe'

import type { StripePluginConfig } from '../types.js'

import { deepen } from '../utilities/deepen.js'

type HookArgsWithCustomCollection = {
  collection: CollectionConfig
} & Omit<Parameters<CollectionBeforeChangeHook>[0], 'collection'>

export type CollectionBeforeChangeHookWithArgs = (
  args: {
    collection?: CollectionConfig
    pluginConfig?: StripePluginConfig
  } & HookArgsWithCustomCollection,
) => Promise<Partial<any>>

export const syncExistingWithStripe: CollectionBeforeChangeHookWithArgs = async (args) => {
  const { collection, data, operation, originalDoc, pluginConfig, req } = args

  const { logs, sync } = pluginConfig || {}

  const { payload } = req

  const { slug: collectionSlug } = collection || {}

  if (process.env.NODE_ENV !== 'test' && !data.skipSync) {
    const syncConfig = sync?.find((conf) => conf.collection === collectionSlug)

    if (syncConfig) {
      if (operation === 'update') {
        // combine all fields of this object and match their respective values within the document
        let syncedFields = syncConfig.fields.reduce(
          (acc, field) => {
            const { fieldPath, stripeProperty } = field

            acc[stripeProperty] = data[fieldPath]
            return acc
          },
          {} as Record<string, any>,
        )

        syncedFields = deepen(syncedFields)

        if (logs) {
          payload.logger.info(
            `A '${collectionSlug}' document has changed in Payload with ID: '${originalDoc?._id}', syncing with Stripe...`,
          )
        }

        if (!data.stripeID) {
          // NOTE: the "beforeValidate" hook populates this
          if (logs) {
            payload.logger.error(`- There is no Stripe ID for this document, skipping.`)
          }
        } else {
          if (logs) {
            payload.logger.info(`- Syncing to Stripe resource with ID: '${data.stripeID}'...`)
          }

          try {
            // api version can only be the latest, stripe recommends ts ignoring it
            const stripe = new Stripe(pluginConfig?.stripeSecretKey || '', {
              apiVersion: '2022-08-01',
            })

            const stripeResource = await stripe?.[syncConfig?.stripeResourceType]?.update(
              data.stripeID,
              syncedFields,
            )

            if (logs) {
              payload.logger.info(
                `✅ Successfully synced Stripe resource with ID: '${stripeResource.id}'.`,
              )
            }
          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : error
            throw new APIError(`Failed to sync document with ID: '${data.id}' to Stripe: ${msg}`)
          }
        }
      }
    }
  }

  // Set back to 'false' so that all changes continue to sync to Stripe, see note in './createNewInStripe.ts'
  data.skipSync = false

  return data
}
```

--------------------------------------------------------------------------------

---[FILE: rest.ts]---
Location: payload-main/packages/plugin-stripe/src/routes/rest.ts

```typescript
import type { PayloadRequest } from 'payload'

import { addDataAndFileToRequest, Forbidden } from 'payload'

import type { StripePluginConfig } from '../types.js'

import { stripeProxy } from '../utilities/stripeProxy.js'

export const stripeREST = async (args: {
  pluginConfig: StripePluginConfig
  req: PayloadRequest
}): Promise<any> => {
  let responseStatus = 200
  let responseJSON

  const { pluginConfig, req } = args

  await addDataAndFileToRequest(req)

  const requestWithData = req
  const { data, payload, user } = requestWithData

  const { stripeSecretKey } = pluginConfig

  try {
    if (!user) {
      // TODO: make this customizable from the config
      throw new Forbidden(req.t)
    }

    responseJSON = await stripeProxy({
      stripeArgs: data?.stripeArgs, // example: ['cus_MGgt3Tuj3D66f2'] or [{ limit: 100 }, { stripeAccount: 'acct_1J9Z4pKZ4Z4Z4Z4Z' }]
      stripeMethod: data?.stripeMethod, // example: 'subscriptions.list',
      stripeSecretKey,
    })

    const { status } = responseJSON
    responseStatus = status
  } catch (error: unknown) {
    const message = `An error has occurred in the Stripe plugin REST handler: '${JSON.stringify(
      error,
    )}'`
    payload.logger.error(message)
    responseStatus = 500
    responseJSON = {
      message,
    }
  }

  return Response.json(responseJSON, {
    status: responseStatus,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: webhooks.ts]---
Location: payload-main/packages/plugin-stripe/src/routes/webhooks.ts

```typescript
import type { Config as PayloadConfig, PayloadRequest } from 'payload'

import Stripe from 'stripe'

import type { StripePluginConfig } from '../types.js'

import { handleWebhooks } from '../webhooks/index.js'

export const stripeWebhooks = async (args: {
  config: PayloadConfig
  pluginConfig: StripePluginConfig
  req: PayloadRequest
}): Promise<any> => {
  const { config, pluginConfig, req } = args
  let returnStatus = 200

  const { stripeSecretKey, stripeWebhooksEndpointSecret, webhooks } = pluginConfig

  if (stripeWebhooksEndpointSecret) {
    const stripe = new Stripe(stripeSecretKey, {
      // api version can only be the latest, stripe recommends ts ignoring it
      apiVersion: '2022-08-01',
      appInfo: {
        name: 'Stripe Payload Plugin',
        url: 'https://payloadcms.com',
      },
    })

    const body = await req.text!()
    const stripeSignature = req.headers.get('stripe-signature')

    if (stripeSignature) {
      let event: Stripe.Event | undefined

      try {
        event = stripe.webhooks.constructEvent(body, stripeSignature, stripeWebhooksEndpointSecret)
      } catch (err: unknown) {
        const msg: string = err instanceof Error ? err.message : JSON.stringify(err)
        req.payload.logger.error(`Error constructing Stripe event: ${msg}`)
        returnStatus = 400
      }

      if (event) {
        void handleWebhooks({
          config,
          event,
          payload: req.payload,
          pluginConfig,
          req,
          stripe,
        })

        // Fire external webhook handlers if they exist
        if (typeof webhooks === 'function') {
          void webhooks({
            config,
            event,
            payload: req.payload,
            pluginConfig,
            req,
            stripe,
          })
        }

        if (typeof webhooks === 'object') {
          const webhookEventHandler = webhooks[event.type]
          if (typeof webhookEventHandler === 'function') {
            void webhookEventHandler({
              config,
              event,
              payload: req.payload,
              pluginConfig,
              req,
              stripe,
            })
          }
        }
      }
    }
  }

  return Response.json(
    { received: true },
    {
      status: returnStatus,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: LinkToDoc.tsx]---
Location: payload-main/packages/plugin-stripe/src/ui/LinkToDoc.tsx
Signals: React

```typescript
'use client'
import type { UIFieldClientComponent } from 'payload'

import { CopyToClipboard, useFormFields } from '@payloadcms/ui'
import React from 'react'

export const LinkToDoc: UIFieldClientComponent = (props) => {
  const {
    field: { admin: { custom = {} } = {} },
  } = props
  const { isTestKey, nameOfIDField, stripeResourceType } = custom

  const field = useFormFields(([fields]) => (fields && fields?.[nameOfIDField]) || null)
  const { value: stripeID } = field || {}

  const stripeEnv = isTestKey ? 'test/' : ''
  const href = `https://dashboard.stripe.com/${stripeEnv}${stripeResourceType}/${stripeID}`

  if (stripeID) {
    return (
      <div>
        <div>
          <span
            className="label"
            style={{
              color: '#9A9A9A',
            }}
          >
            View in Stripe
          </span>
          <CopyToClipboard value={href} />
        </div>
        <div
          style={{
            fontWeight: '600',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <a href={href} rel="noreferrer noopener" target="_blank">
            {href}
          </a>
        </div>
      </div>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: deepen.ts]---
Location: payload-main/packages/plugin-stripe/src/utilities/deepen.ts

```typescript
// converts an object of dot notation keys to a nested object
// i.e. { 'price.stripePriceID': '123' } to { price: { stripePriceID: '123' } }

export const deepen = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {}

  for (const key in obj) {
    const value = obj[key]
    const keys = key.split('.')
    let current = result
    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        current[k] = value
      } else {
        current[k] = current[k] || {}
        current = current[k]
      }
    })
  }
  return result
}
```

--------------------------------------------------------------------------------

---[FILE: stripeProxy.ts]---
Location: payload-main/packages/plugin-stripe/src/utilities/stripeProxy.ts

```typescript
import lodashGet from 'lodash.get'
import Stripe from 'stripe'

import type { StripeProxy } from '../types.js'

export const stripeProxy: StripeProxy = async ({ stripeArgs, stripeMethod, stripeSecretKey }) => {
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2022-08-01',
    appInfo: {
      name: 'Stripe Payload Plugin',
      url: 'https://payloadcms.com',
    },
  })

  if (typeof stripeMethod === 'string') {
    const topLevelMethod = stripeMethod.split('.')[0] as keyof Stripe
    const contextToBind = stripe[topLevelMethod]
    // NOTE: 'lodashGet' uses dot notation to get the property of an object
    // NOTE: Stripe API methods using reference "this" within their functions, so we need to bind context
    const foundMethod = lodashGet(stripe, stripeMethod).bind(contextToBind)

    if (typeof foundMethod === 'function') {
      if (Array.isArray(stripeArgs)) {
        try {
          const stripeResponse = await foundMethod(...stripeArgs)
          return {
            data: stripeResponse,
            status: 200,
          }
        } catch (error: unknown) {
          return {
            message: `A Stripe API error has occurred: ${error}`,
            status: 404,
          }
        }
      } else {
        throw new Error(`Argument 'stripeArgs' must be an array.`)
      }
    } else {
      throw Error(
        `The provided Stripe method of '${stripeMethod}' is not a part of the Stripe API.`,
      )
    }
  } else {
    throw Error('You must provide a Stripe method to call.')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleCreatedOrUpdated.ts]---
Location: payload-main/packages/plugin-stripe/src/webhooks/handleCreatedOrUpdated.ts

```typescript
import { v4 as uuid } from 'uuid'

import type { SanitizedStripePluginConfig, StripeWebhookHandler } from '../types.js'

import { deepen } from '../utilities/deepen.js'

type HandleCreatedOrUpdated = (
  args: {
    resourceType: string
    syncConfig: SanitizedStripePluginConfig['sync'][0]
  } & Parameters<StripeWebhookHandler>[0],
) => Promise<void>

export const handleCreatedOrUpdated: HandleCreatedOrUpdated = async (args) => {
  const { config: payloadConfig, event, payload, pluginConfig, resourceType, syncConfig } = args

  const { logs } = pluginConfig || {}

  const stripeDoc: any = event?.data?.object || {}

  const { id: stripeID, object: eventObject } = stripeDoc

  // NOTE: the Stripe API does not nest fields, everything is an object at the top level
  // if the event object and resource type don't match, this change was not top-level
  const isNestedChange = eventObject !== resourceType

  // let stripeID = docID;
  // if (isNestedChange) {
  //   const parentResource = stripeDoc[resourceType];
  //   stripeID = parentResource;
  // }

  if (isNestedChange) {
    if (logs) {
      payload.logger.info(
        `- This change occurred on a nested field of ${resourceType}. Nested fields are not yet supported in auto-sync but can be manually setup.`,
      )
    }
  }

  if (!isNestedChange) {
    if (logs) {
      payload.logger.info(
        `- A new document was created or updated in Stripe, now syncing to Payload...`,
      )
    }

    const collectionSlug = syncConfig?.collection

    const isAuthCollection = Boolean(
      payloadConfig?.collections?.find((collection) => collection.slug === collectionSlug)?.auth,
    )

    // First, search for an existing document in Payload
    const payloadQuery = await payload.find({
      collection: collectionSlug,
      limit: 1,
      pagination: false,
      where: {
        stripeID: {
          equals: stripeID,
        },
      },
    })

    const foundDoc = payloadQuery.docs[0] as any

    // combine all properties of the Stripe doc and match their respective fields within the document
    let syncedData = syncConfig.fields.reduce(
      (acc, field) => {
        const { fieldPath, stripeProperty } = field

        acc[fieldPath] = stripeDoc[stripeProperty]
        return acc
      },
      {} as Record<string, any>,
    )

    syncedData = deepen({
      ...syncedData,
      skipSync: true,
      stripeID,
    })

    if (!foundDoc) {
      if (logs) {
        payload.logger.info(
          `- No existing '${collectionSlug}' document found with Stripe ID: '${stripeID}', creating new...`,
        )
      }

      // auth docs must use unique emails
      let authDoc = null

      if (isAuthCollection) {
        try {
          if (stripeDoc?.email) {
            const authQuery = await payload.find({
              collection: collectionSlug,
              limit: 1,
              pagination: false,
              where: {
                email: {
                  equals: stripeDoc.email,
                },
              },
            })

            authDoc = authQuery.docs[0] as any

            if (authDoc) {
              if (logs) {
                payload.logger.info(
                  `- Account already exists with e-mail: ${stripeDoc.email}, updating now...`,
                )
              }

              // account exists by email, so update it instead
              try {
                await payload.update({
                  id: authDoc.id,
                  collection: collectionSlug,
                  data: syncedData,
                })

                if (logs) {
                  payload.logger.info(
                    `✅ Successfully updated '${collectionSlug}' document in Payload with ID: '${authDoc.id}.'`,
                  )
                }
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : err
                if (logs) {
                  payload.logger.error(
                    `- Error updating existing '${collectionSlug}' document: ${msg}`,
                  )
                }
              }
            }
          } else {
            if (logs) {
              payload.logger.error(
                `No email was provided from Stripe, cannot create new '${collectionSlug}' document.`,
              )
            }
          }
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : error
          if (logs) {
            payload.logger.error(`Error looking up '${collectionSlug}' document in Payload: ${msg}`)
          }
        }
      }

      if (!isAuthCollection || (isAuthCollection && !authDoc)) {
        try {
          if (logs) {
            payload.logger.info(
              `- Creating new '${collectionSlug}' document in Payload with Stripe ID: '${stripeID}'.`,
            )
          }

          // generate a strong, unique password for the new user
          const password: string = uuid()

          await payload.create({
            collection: collectionSlug,
            data: {
              ...syncedData,
              password,
              passwordConfirm: password,
            },
            disableVerificationEmail: isAuthCollection ? true : undefined,
          })

          if (logs) {
            payload.logger.info(
              `✅ Successfully created new '${collectionSlug}' document in Payload with Stripe ID: '${stripeID}'.`,
            )
          }
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : error
          if (logs) {
            payload.logger.error(`Error creating new document in Payload: ${msg}`)
          }
        }
      }
    } else {
      if (logs) {
        payload.logger.info(
          `- Existing '${collectionSlug}' document found in Payload with Stripe ID: '${stripeID}', updating now...`,
        )
      }

      try {
        await payload.update({
          id: foundDoc.id,
          collection: collectionSlug,
          data: syncedData,
        })

        if (logs) {
          payload.logger.info(
            `✅ Successfully updated '${collectionSlug}' document in Payload from Stripe ID: '${stripeID}'.`,
          )
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : error
        if (logs) {
          payload.logger.error(`Error updating '${collectionSlug}' document in Payload: ${msg}`)
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleDeleted.ts]---
Location: payload-main/packages/plugin-stripe/src/webhooks/handleDeleted.ts

```typescript
import type { SanitizedStripePluginConfig, StripeWebhookHandler } from '../types.js'

type HandleDeleted = (
  args: {
    resourceType: string
    syncConfig: SanitizedStripePluginConfig['sync'][0]
  } & Parameters<StripeWebhookHandler>[0],
) => Promise<void>

export const handleDeleted: HandleDeleted = async (args) => {
  const { event, payload, pluginConfig, resourceType, syncConfig } = args

  const { logs } = pluginConfig || {}

  const collectionSlug = syncConfig?.collection

  const {
    id: stripeID,
    object: eventObject, // use this to determine if this is a nested field
  }: any = event?.data?.object || {}

  // if the event object and resource type don't match, this deletion was not top-level
  const isNestedDelete = eventObject !== resourceType

  if (isNestedDelete) {
    if (logs) {
      payload.logger.info(
        `- This deletion occurred on a nested field of ${resourceType}. Nested fields are not yet supported.`,
      )
    }
  }

  if (!isNestedDelete) {
    if (logs) {
      payload.logger.info(
        `- A '${resourceType}' resource was deleted in Stripe, now deleting '${collectionSlug}' document in Payload with Stripe ID: '${stripeID}'...`,
      )
    }

    try {
      const payloadQuery = await payload.find({
        collection: collectionSlug,
        limit: 1,
        pagination: false,
        where: {
          stripeID: {
            equals: stripeID,
          },
        },
      })

      const foundDoc = payloadQuery.docs[0] as any

      if (!foundDoc) {
        if (logs) {
          payload.logger.info(
            `- Nothing to delete, no existing document found with Stripe ID: '${stripeID}'.`,
          )
        }
      }

      if (foundDoc) {
        if (logs) {
          payload.logger.info(`- Deleting Payload document with ID: '${foundDoc.id}'...`)
        }

        try {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          payload.delete({
            id: foundDoc.id,
            collection: collectionSlug,
          })

          // NOTE: the `afterDelete` hook will trigger, which will attempt to delete the document from Stripe and safely error out
          // There is no known way of preventing this from happening. In other hooks we use the `skipSync` field, but here the document is already deleted.
          if (logs) {
            payload.logger.info(
              `- ✅ Successfully deleted Payload document with ID: '${foundDoc.id}'.`,
            )
          }
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : error
          if (logs) {
            payload.logger.error(`Error deleting document: ${msg}`)
          }
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : error
      if (logs) {
        payload.logger.error(`Error deleting document: ${msg}`)
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-stripe/src/webhooks/index.ts

```typescript
import type { StripeWebhookHandler } from '../types.js'

import { handleCreatedOrUpdated } from './handleCreatedOrUpdated.js'
import { handleDeleted } from './handleDeleted.js'

export const handleWebhooks: StripeWebhookHandler = (args) => {
  const { event, payload, pluginConfig } = args

  if (pluginConfig?.logs) {
    payload.logger.info(`🪝 Received Stripe '${event.type}' webhook event with ID: '${event.id}'.`)
  }

  // could also traverse into event.data.object.object to get the type, but that seems unreliable
  // use cli: `stripe resources` to see all available resources
  const resourceType = event.type.split('.')[0]
  const method = event.type.split('.').pop()

  const syncConfig = pluginConfig?.sync?.find(
    (sync) => sync.stripeResourceTypeSingular === resourceType,
  )

  if (syncConfig) {
    switch (method) {
      case 'created': {
        void handleCreatedOrUpdated({
          ...args,
          pluginConfig,
          resourceType,
          syncConfig,
        })
        break
      }
      case 'deleted': {
        void handleDeleted({
          ...args,
          pluginConfig,
          resourceType,
          syncConfig,
        })
        break
      }
      case 'updated': {
        void handleCreatedOrUpdated({
          ...args,
          pluginConfig,
          resourceType,
          syncConfig,
        })
        break
      }
      default: {
        break
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/richtext-lexical/.prettierignore

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
Location: payload-main/packages/richtext-lexical/.swcrc

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
    },
    "experimental": {
      "plugins": [
        [
          "swc-plugin-transform-remove-imports",
          {
            "test": "\\.(scss)$"
          }
        ]
      ]
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .swcrc-debug]---
Location: payload-main/packages/richtext-lexical/.swcrc-debug

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
        "development": true,
        "useBuiltins": true
      }
    },
    "keepClassNames": true,
    "preserveAllComments": true
  },
  "module": {
    "type": "es6"
  },
  "minify": false
}
```

--------------------------------------------------------------------------------

---[FILE: babel.config.cjs]---
Location: payload-main/packages/richtext-lexical/babel.config.cjs

```text
const fs = require('fs')

// Plugin options can be found here: https://github.com/facebook/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Options.ts#L38
const ReactCompilerConfig = {
  sources: (filename) => {
    const isInNodeModules = filename.includes('node_modules')
    if (
      isInNodeModules ||
      (!filename.endsWith('.tsx') && !filename.endsWith('.jsx') && !filename.endsWith('.js'))
    ) {
      return false
    }

    // Only compile files with 'use client' directives. We do not want to
    // accidentally compile React Server Components
    const file = fs.readFileSync(filename, 'utf8')
    if (file.includes("'use client'")) {
      return true
    }
    console.log('React compiler - skipping file: ' + filename)
    return false
  },
}

module.exports = function (api) {
  api.cache(false)

  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // must run first!
      /* [
         'babel-plugin-transform-remove-imports',
         {
           test: '\\.(scss|css)$',
         },
       ],*/
    ],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: bundle.js]---
Location: payload-main/packages/richtext-lexical/bundle.js

```javascript
import * as esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { sassPlugin } from 'esbuild-sass-plugin'

const directoryArg = process.argv[2] || 'dist'

const shouldSplit = process.argv.includes('--no-split') ? false : true

const removeCSSImports = {
  name: 'remove-css-imports',
  setup(build) {
    build.onLoad({ filter: /.*/ }, async (args) => {
      if (args.path.includes('node_modules') || !args.path.includes(dirname)) return
      const contents = await fs.promises.readFile(args.path, 'utf8')
      const withRemovedImports = contents.replace(/import\s+.*\.scss';?[\r\n\s]*/g, '')
      return { contents: withRemovedImports, loader: 'default' }
    })
  },
}

async function build() {
  //create empty directoryArg/exports/client_optimized dir
  await fs.promises.mkdir(`${directoryArg}/exports/client_optimized`, { recursive: true })

  // Bundle only the .scss files into a single css file
  await esbuild.build({
    entryPoints: ['src/exports/cssEntry.ts'],
    bundle: true,
    minify: true,
    outdir: `${directoryArg}/bundled_scss`,
    loader: { '.svg': 'dataurl' },
    packages: 'external',
    //external: ['*.svg'],
    plugins: [sassPlugin({ css: 'external' })],
  })

  try {
    await fs.promises.rename(`${directoryArg}/bundled_scss/cssEntry.css`, `dist/field/bundled.css`)
    fs.copyFileSync(
      `dist/field/bundled.css`,
      `${directoryArg}/exports/client_optimized/bundled.css`,
    )
    fs.rmSync(`${directoryArg}/bundled_scss`, { recursive: true })
  } catch (err) {
    console.error(`Error while renaming index.css: ${err}`)
    throw err
  }

  console.log(`${directoryArg}/field/bundled.css bundled successfully`)

  // Bundle `client.ts`
  const resultClient = await esbuild.build({
    entryPoints: ['dist/exports/client/index.js'],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    outdir: `${directoryArg}/exports/client_optimized`,
    //outfile: 'index.js',
    // IMPORTANT: splitting the client bundle means that the `use client` directive will be lost for every chunk
    splitting: shouldSplit,
    external: [
      '*.scss',
      '*.css',
      '*.svg',
      'qs-esm',
      '@dnd-kit/core',
      '@payloadcms/graphql',
      '@payloadcms/translations',
      'dequal',

      //'side-channel',
      '@payloadcms/ui',
      '@payloadcms/ui/*',
      '@payloadcms/ui/client',
      '@payloadcms/ui/shared',
      'lexical',
      'lexical/*',
      '@lexical',
      '@lexical/*',
      '@faceless-ui/*',
      'bson-objectid',
      'payload',
      'payload/*',
      'react',
      'react-dom',
      'next',
      'crypto',
      'lodash',
      'ui',
    ],
    packages: 'external',
    minify: true,
    metafile: true,
    treeShaking: true,

    tsconfig: path.resolve(dirname, './tsconfig.json'),
    plugins: [
      removeCSSImports,
      /*commonjs({
          ignore: ['date-fns', '@floating-ui/react'],
        }),*/
    ],
    sourcemap: true,
  })
  console.log('client/index.ts bundled successfully')

  fs.writeFileSync('meta_client.json', JSON.stringify(resultClient.metafile))
}

await build()
```

--------------------------------------------------------------------------------

---[FILE: eslint.config.js]---
Location: payload-main/packages/richtext-lexical/eslint.config.js

```javascript
import lexical from '@lexical/eslint-plugin'
import { rootEslintConfig, rootParserOptions } from '../../eslint.config.js'

/** @typedef {import('eslint').Linter.Config} Config */

/** @type {Config[]} */
export const index = [...rootEslintConfig]

export default index
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/richtext-lexical/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>
Portions Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

--------------------------------------------------------------------------------

````
