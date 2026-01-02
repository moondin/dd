---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 740
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 740 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/s3/index.ts

```typescript
import { s3CopyObjectTool } from '@/tools/s3/copy_object'
import { s3DeleteObjectTool } from '@/tools/s3/delete_object'
import { s3GetObjectTool } from '@/tools/s3/get_object'
import { s3ListObjectsTool } from '@/tools/s3/list_objects'
import { s3PutObjectTool } from '@/tools/s3/put_object'

export { s3GetObjectTool, s3PutObjectTool, s3ListObjectsTool, s3DeleteObjectTool, s3CopyObjectTool }
```

--------------------------------------------------------------------------------

---[FILE: list_objects.ts]---
Location: sim-main/apps/sim/tools/s3/list_objects.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export const s3ListObjectsTool: ToolConfig = {
  id: 's3_list_objects',
  name: 'S3 List Objects',
  description: 'List objects in an AWS S3 bucket',
  version: '1.0.0',

  params: {
    accessKeyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your AWS Access Key ID',
    },
    secretAccessKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your AWS Secret Access Key',
    },
    region: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AWS region (e.g., us-east-1)',
    },
    bucketName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'S3 bucket name',
    },
    prefix: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Prefix to filter objects (e.g., folder/)',
    },
    maxKeys: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of objects to return (default: 1000)',
    },
    continuationToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Token for pagination',
    },
  },

  request: {
    url: '/api/tools/s3/list-objects',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      region: params.region,
      bucketName: params.bucketName,
      prefix: params.prefix,
      maxKeys: params.maxKeys !== undefined ? Number(params.maxKeys) : undefined,
      continuationToken: params.continuationToken,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          objects: [],
          metadata: {
            error: data.error || 'Failed to list objects',
          },
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        objects: data.output.objects || [],
        metadata: {
          isTruncated: data.output.isTruncated,
          nextContinuationToken: data.output.nextContinuationToken,
          keyCount: data.output.keyCount,
          prefix: data.output.prefix,
        },
      },
    }
  },

  outputs: {
    objects: {
      type: 'array',
      description: 'List of S3 objects',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string', description: 'Object key' },
          size: { type: 'number', description: 'Object size in bytes' },
          lastModified: { type: 'string', description: 'Last modified timestamp' },
          etag: { type: 'string', description: 'Entity tag' },
        },
      },
    },
    metadata: {
      type: 'object',
      description: 'Listing metadata including pagination info',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: put_object.ts]---
Location: sim-main/apps/sim/tools/s3/put_object.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export const s3PutObjectTool: ToolConfig = {
  id: 's3_put_object',
  name: 'S3 Put Object',
  description: 'Upload a file to an AWS S3 bucket',
  version: '1.0.0',

  params: {
    accessKeyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your AWS Access Key ID',
    },
    secretAccessKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your AWS Secret Access Key',
    },
    region: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AWS region (e.g., us-east-1)',
    },
    bucketName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'S3 bucket name',
    },
    objectKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Object key/path in S3 (e.g., folder/filename.ext)',
    },
    file: {
      type: 'file',
      required: false,
      visibility: 'user-only',
      description: 'File to upload',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Text content to upload (alternative to file)',
    },
    contentType: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Content-Type header (auto-detected from file if not provided)',
    },
    acl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Access control list (e.g., private, public-read)',
    },
  },

  request: {
    url: '/api/tools/s3/put-object',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      region: params.region,
      bucketName: params.bucketName,
      objectKey: params.objectKey,
      file: params.file,
      content: params.content,
      contentType: params.contentType,
      acl: params.acl,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          url: '',
          metadata: {
            error: data.error || 'Failed to upload object',
          },
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        url: data.output.url,
        metadata: {
          etag: data.output.etag,
          location: data.output.location,
          key: data.output.key,
          bucket: data.output.bucket,
        },
      },
    }
  },

  outputs: {
    url: {
      type: 'string',
      description: 'URL of the uploaded S3 object',
    },
    metadata: {
      type: 'object',
      description: 'Upload metadata including ETag and location',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/s3/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface S3Response extends ToolResponse {
  output: {
    url?: string
    objects?: Array<{
      key: string
      size: number
      lastModified: string
      etag: string
    }>
    deleted?: boolean
    metadata: {
      fileType?: string
      size?: number
      name?: string
      lastModified?: string
      etag?: string
      location?: string
      key?: string
      bucket?: string
      isTruncated?: boolean
      nextContinuationToken?: string
      keyCount?: number
      prefix?: string
      deleteMarker?: boolean
      versionId?: string
      copySourceVersionId?: string
      error?: string
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/s3/utils.ts

```typescript
import crypto from 'crypto'

export function encodeS3PathComponent(pathComponent: string): string {
  return encodeURIComponent(pathComponent).replace(/%2F/g, '/')
}

export function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
): Buffer {
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid key provided to getSignatureKey')
  }
  const kDate = crypto.createHmac('sha256', `AWS4${key}`).update(dateStamp).digest()
  const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest()
  const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest()
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest()
  return kSigning
}

export function parseS3Uri(s3Uri: string): {
  bucketName: string
  region: string
  objectKey: string
} {
  try {
    const url = new URL(s3Uri)
    const hostname = url.hostname
    const bucketName = hostname.split('.')[0]
    const regionMatch = hostname.match(/s3[.-]([^.]+)\.amazonaws\.com/)
    const region = regionMatch ? regionMatch[1] : 'us-east-1'
    const objectKey = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname

    if (!bucketName || !objectKey) {
      throw new Error('Invalid S3 URI format')
    }

    return { bucketName, region, objectKey }
  } catch (_error) {
    throw new Error(
      'Invalid S3 Object URL format. Expected format: https://bucket-name.s3.region.amazonaws.com/path/to/file'
    )
  }
}

export function generatePresignedUrl(params: any, expiresIn = 3600): string {
  const date = new Date()
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const encodedPath = encodeS3PathComponent(params.objectKey)

  const _expires = Math.floor(Date.now() / 1000) + expiresIn

  const method = 'GET'
  const canonicalUri = `/${encodedPath}`
  const canonicalQueryString = `X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${encodeURIComponent(`${params.accessKeyId}/${dateStamp}/${params.region}/s3/aws4_request`)}&X-Amz-Date=${amzDate}&X-Amz-Expires=${expiresIn}&X-Amz-SignedHeaders=host`
  const canonicalHeaders = `host:${params.bucketName}.s3.${params.region}.amazonaws.com\n`
  const signedHeaders = 'host'
  const payloadHash = 'UNSIGNED-PAYLOAD'

  const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`

  const algorithm = 'AWS4-HMAC-SHA256'
  const credentialScope = `${dateStamp}/${params.region}/s3/aws4_request`
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`

  const signingKey = getSignatureKey(params.secretAccessKey, dateStamp, params.region, 's3')
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex')

  return `https://${params.bucketName}.s3.${params.region}.amazonaws.com/${encodedPath}?${canonicalQueryString}&X-Amz-Signature=${signature}`
}
```

--------------------------------------------------------------------------------

---[FILE: create_account.ts]---
Location: sim-main/apps/sim/tools/salesforce/create_account.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SalesforceCreateAccount')

export interface SalesforceCreateAccountParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  name: string
  type?: string
  industry?: string
  phone?: string
  website?: string
  billingStreet?: string
  billingCity?: string
  billingState?: string
  billingPostalCode?: string
  billingCountry?: string
  description?: string
  annualRevenue?: string
  numberOfEmployees?: string
}

export interface SalesforceCreateAccountResponse {
  success: boolean
  output: {
    id: string
    success: boolean
    created: boolean
    metadata: {
      operation: 'create_account'
    }
  }
}

export const salesforceCreateAccountTool: ToolConfig<
  SalesforceCreateAccountParams,
  SalesforceCreateAccountResponse
> = {
  id: 'salesforce_create_account',
  name: 'Create Account in Salesforce',
  description: 'Create a new account in Salesforce CRM',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
    },
    idToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
    },
    instanceUrl: {
      type: 'string',
      required: false,
      visibility: 'hidden',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Account name (required)',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Account type (e.g., Customer, Partner, Prospect)',
    },
    industry: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Industry (e.g., Technology, Healthcare, Finance)',
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Phone number',
    },
    website: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Website URL',
    },
    billingStreet: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Billing street address',
    },
    billingCity: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Billing city',
    },
    billingState: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Billing state/province',
    },
    billingPostalCode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Billing postal code',
    },
    billingCountry: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Billing country',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Account description',
    },
    annualRevenue: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Annual revenue (number)',
    },
    numberOfEmployees: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of employees (number)',
    },
  },

  request: {
    url: (params) => {
      let instanceUrl = params.instanceUrl

      if (!instanceUrl && params.idToken) {
        try {
          const base64Url = params.idToken.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
              .join('')
          )
          const decoded = JSON.parse(jsonPayload)

          if (decoded.profile) {
            const match = decoded.profile.match(/^(https:\/\/[^/]+)/)
            if (match) {
              instanceUrl = match[1]
            }
          } else if (decoded.sub) {
            const match = decoded.sub.match(/^(https:\/\/[^/]+)/)
            if (match && match[1] !== 'https://login.salesforce.com') {
              instanceUrl = match[1]
            }
          }
        } catch (error) {
          logger.error('Failed to decode Salesforce idToken', { error })
        }
      }

      if (!instanceUrl) {
        throw new Error('Salesforce instance URL is required but not provided')
      }

      return `${instanceUrl}/services/data/v59.0/sobjects/Account`
    },
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const body: Record<string, any> = {
        Name: params.name,
      }

      if (params.type) body.Type = params.type
      if (params.industry) body.Industry = params.industry
      if (params.phone) body.Phone = params.phone
      if (params.website) body.Website = params.website
      if (params.billingStreet) body.BillingStreet = params.billingStreet
      if (params.billingCity) body.BillingCity = params.billingCity
      if (params.billingState) body.BillingState = params.billingState
      if (params.billingPostalCode) body.BillingPostalCode = params.billingPostalCode
      if (params.billingCountry) body.BillingCountry = params.billingCountry
      if (params.description) body.Description = params.description
      if (params.annualRevenue) body.AnnualRevenue = Number.parseFloat(params.annualRevenue)
      if (params.numberOfEmployees)
        body.NumberOfEmployees = Number.parseInt(params.numberOfEmployees)

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('Salesforce API request failed', { data, status: response.status })
      throw new Error(data[0]?.message || data.message || 'Failed to create account in Salesforce')
    }

    return {
      success: true,
      output: {
        id: data.id,
        success: data.success,
        created: true,
        metadata: {
          operation: 'create_account' as const,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Created account data',
      properties: {
        id: { type: 'string', description: 'Created account ID' },
        success: { type: 'boolean', description: 'Salesforce operation success' },
        created: { type: 'boolean', description: 'Whether account was created' },
        metadata: { type: 'object', description: 'Operation metadata' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_case.ts]---
Location: sim-main/apps/sim/tools/salesforce/create_case.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceCreateCaseParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  subject: string
  status?: string
  priority?: string
  origin?: string
  contactId?: string
  accountId?: string
  description?: string
}

export interface SalesforceCreateCaseResponse {
  success: boolean
  output: {
    id: string
    success: boolean
    created: boolean
    metadata: {
      operation: 'create_case'
    }
  }
}

export const salesforceCreateCaseTool: ToolConfig<
  SalesforceCreateCaseParams,
  SalesforceCreateCaseResponse
> = {
  id: 'salesforce_create_case',
  name: 'Create Case in Salesforce',
  description: 'Create a new case',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
    },
    idToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
    },
    instanceUrl: {
      type: 'string',
      required: false,
      visibility: 'hidden',
    },
    subject: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Case subject (required)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Status (e.g., New, Working, Escalated)',
    },
    priority: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Priority (e.g., Low, Medium, High)',
    },
    origin: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Origin (e.g., Phone, Email, Web)',
    },
    contactId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Contact ID',
    },
    accountId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Account ID',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Description',
    },
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Case`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = { Subject: params.subject }
      if (params.status) body.Status = params.status
      if (params.priority) body.Priority = params.priority
      if (params.origin) body.Origin = params.origin
      if (params.contactId) body.ContactId = params.contactId
      if (params.accountId) body.AccountId = params.accountId
      if (params.description) body.Description = params.description
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to create case')
    return {
      success: true,
      output: {
        id: data.id,
        success: data.success,
        created: true,
        metadata: { operation: 'create_case' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Created case' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_contact.ts]---
Location: sim-main/apps/sim/tools/salesforce/create_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

const logger = createLogger('SalesforceContacts')

export interface SalesforceCreateContactParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  lastName: string
  firstName?: string
  email?: string
  phone?: string
  accountId?: string
  title?: string
  department?: string
  mailingStreet?: string
  mailingCity?: string
  mailingState?: string
  mailingPostalCode?: string
  mailingCountry?: string
  description?: string
}

export interface SalesforceCreateContactResponse {
  success: boolean
  output: {
    id: string
    success: boolean
    created: boolean
    metadata: { operation: 'create_contact' }
  }
}

export const salesforceCreateContactTool: ToolConfig<
  SalesforceCreateContactParams,
  SalesforceCreateContactResponse
> = {
  id: 'salesforce_create_contact',
  name: 'Create Contact in Salesforce',
  description: 'Create a new contact in Salesforce CRM',
  version: '1.0.0',

  oauth: { required: true, provider: 'salesforce' },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    lastName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Last name (required)',
    },
    firstName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'First name',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Email address',
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Phone number',
    },
    accountId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Account ID to associate contact with',
    },
    title: { type: 'string', required: false, visibility: 'user-only', description: 'Job title' },
    department: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Department',
    },
    mailingStreet: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mailing street',
    },
    mailingCity: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mailing city',
    },
    mailingState: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mailing state',
    },
    mailingPostalCode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mailing postal code',
    },
    mailingCountry: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mailing country',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Contact description',
    },
  },

  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/sobjects/Contact`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = { LastName: params.lastName }

      if (params.firstName) body.FirstName = params.firstName
      if (params.email) body.Email = params.email
      if (params.phone) body.Phone = params.phone
      if (params.accountId) body.AccountId = params.accountId
      if (params.title) body.Title = params.title
      if (params.department) body.Department = params.department
      if (params.mailingStreet) body.MailingStreet = params.mailingStreet
      if (params.mailingCity) body.MailingCity = params.mailingCity
      if (params.mailingState) body.MailingState = params.mailingState
      if (params.mailingPostalCode) body.MailingPostalCode = params.mailingPostalCode
      if (params.mailingCountry) body.MailingCountry = params.mailingCountry
      if (params.description) body.Description = params.description

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('Salesforce API request failed', { data, status: response.status })
      throw new Error(data[0]?.message || data.message || 'Failed to create contact in Salesforce')
    }

    return {
      success: true,
      output: {
        id: data.id,
        success: data.success,
        created: true,
        metadata: { operation: 'create_contact' as const },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Created contact data',
      properties: {
        id: { type: 'string', description: 'Created contact ID' },
        success: { type: 'boolean', description: 'Salesforce operation success' },
        created: { type: 'boolean', description: 'Whether contact was created' },
        metadata: { type: 'object', description: 'Operation metadata' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_lead.ts]---
Location: sim-main/apps/sim/tools/salesforce/create_lead.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceCreateLeadParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  lastName: string
  company: string
  firstName?: string
  email?: string
  phone?: string
  status?: string
  leadSource?: string
  title?: string
  description?: string
}

export interface SalesforceCreateLeadResponse {
  success: boolean
  output: {
    id: string
    success: boolean
    created: boolean
    metadata: {
      operation: 'create_lead'
    }
  }
}

export const salesforceCreateLeadTool: ToolConfig<
  SalesforceCreateLeadParams,
  SalesforceCreateLeadResponse
> = {
  id: 'salesforce_create_lead',
  name: 'Create Lead in Salesforce',
  description: 'Create a new lead',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    lastName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Last name (required)',
    },
    company: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Company (required)',
    },
    firstName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'First name',
    },
    email: { type: 'string', required: false, visibility: 'user-only', description: 'Email' },
    phone: { type: 'string', required: false, visibility: 'user-only', description: 'Phone' },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Lead status',
    },
    leadSource: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Lead source',
    },
    title: { type: 'string', required: false, visibility: 'user-only', description: 'Title' },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Description',
    },
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Lead`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = { LastName: params.lastName, Company: params.company }
      if (params.firstName) body.FirstName = params.firstName
      if (params.email) body.Email = params.email
      if (params.phone) body.Phone = params.phone
      if (params.status) body.Status = params.status
      if (params.leadSource) body.LeadSource = params.leadSource
      if (params.title) body.Title = params.title
      if (params.description) body.Description = params.description
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to create lead')
    return {
      success: true,
      output: {
        id: data.id,
        success: data.success,
        created: true,
        metadata: { operation: 'create_lead' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Created lead' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_opportunity.ts]---
Location: sim-main/apps/sim/tools/salesforce/create_opportunity.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceCreateOpportunityParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  name: string
  stageName: string
  closeDate: string
  accountId?: string
  amount?: string
  probability?: string
  description?: string
}

export interface SalesforceCreateOpportunityResponse {
  success: boolean
  output: {
    id: string
    success: boolean
    created: boolean
    metadata: {
      operation: 'create_opportunity'
    }
  }
}

export const salesforceCreateOpportunityTool: ToolConfig<
  SalesforceCreateOpportunityParams,
  SalesforceCreateOpportunityResponse
> = {
  id: 'salesforce_create_opportunity',
  name: 'Create Opportunity in Salesforce',
  description: 'Create a new opportunity',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Opportunity name (required)',
    },
    stageName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stage name (required)',
    },
    closeDate: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Close date YYYY-MM-DD (required)',
    },
    accountId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Account ID',
    },
    amount: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Amount (number)',
    },
    probability: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Probability (0-100)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Description',
    },
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Opportunity`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        Name: params.name,
        StageName: params.stageName,
        CloseDate: params.closeDate,
      }
      if (params.accountId) body.AccountId = params.accountId
      if (params.amount) body.Amount = Number.parseFloat(params.amount)
      if (params.probability) body.Probability = Number.parseInt(params.probability)
      if (params.description) body.Description = params.description
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok)
      throw new Error(data[0]?.message || data.message || 'Failed to create opportunity')
    return {
      success: true,
      output: {
        id: data.id,
        success: data.success,
        created: true,
        metadata: { operation: 'create_opportunity' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Created opportunity' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_task.ts]---
Location: sim-main/apps/sim/tools/salesforce/create_task.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceCreateTaskParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  subject: string
  status?: string
  priority?: string
  activityDate?: string
  whoId?: string
  whatId?: string
  description?: string
}

export interface SalesforceCreateTaskResponse {
  success: boolean
  output: {
    id: string
    success: boolean
    created: boolean
    metadata: {
      operation: 'create_task'
    }
  }
}

export const salesforceCreateTaskTool: ToolConfig<
  SalesforceCreateTaskParams,
  SalesforceCreateTaskResponse
> = {
  id: 'salesforce_create_task',
  name: 'Create Task in Salesforce',
  description: 'Create a new task',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
    },
    idToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
    },
    instanceUrl: {
      type: 'string',
      required: false,
      visibility: 'hidden',
    },
    subject: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Task subject (required)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Status (e.g., Not Started, In Progress, Completed)',
    },
    priority: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Priority (e.g., Low, Normal, High)',
    },
    activityDate: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Due date YYYY-MM-DD',
    },
    whoId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Related Contact/Lead ID',
    },
    whatId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Related Account/Opportunity ID',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Description',
    },
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Task`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = { Subject: params.subject }
      if (params.status) body.Status = params.status
      if (params.priority) body.Priority = params.priority
      if (params.activityDate) body.ActivityDate = params.activityDate
      if (params.whoId) body.WhoId = params.whoId
      if (params.whatId) body.WhatId = params.whatId
      if (params.description) body.Description = params.description
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to create task')
    return {
      success: true,
      output: {
        id: data.id,
        success: data.success,
        created: true,
        metadata: { operation: 'create_task' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Created task' },
  },
}
```

--------------------------------------------------------------------------------

````
