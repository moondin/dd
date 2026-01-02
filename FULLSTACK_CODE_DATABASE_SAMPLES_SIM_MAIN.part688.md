---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 688
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 688 of 933)

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

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/http/utils.ts

```typescript
import { isTest } from '@/lib/core/config/feature-flags'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import type { TableRow } from '@/tools/types'

const logger = createLogger('HTTPRequestUtils')

/**
 * Creates a set of default headers used in HTTP requests
 * @param customHeaders Additional user-provided headers to include
 * @param url Target URL for the request (used for setting Host header)
 * @returns Record of HTTP headers
 */
export const getDefaultHeaders = (
  customHeaders: Record<string, string> = {},
  url?: string
): Record<string, string> => {
  const headers: Record<string, string> = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    Referer: getBaseUrl(),
    'Sec-Ch-Ua': 'Chromium;v=91, Not-A.Brand;v=99',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    ...customHeaders,
  }

  // Add Host header if not provided and URL is valid
  if (url) {
    try {
      const hostname = new URL(url).host
      if (hostname && !customHeaders.Host && !customHeaders.host) {
        headers.Host = hostname
      }
    } catch (_e) {
      // Invalid URL, will be caught later
    }
  }

  return headers
}

/**
 * Processes a URL with path parameters and query parameters
 * @param url Base URL to process
 * @param pathParams Path parameters to replace in the URL
 * @param queryParams Query parameters to add to the URL
 * @returns Processed URL with path params replaced and query params added
 */
export const processUrl = (
  url: string,
  pathParams?: Record<string, string>,
  queryParams?: TableRow[] | null
): string => {
  // Strip any surrounding quotes
  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1)
  }

  // Replace path parameters
  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value))
    })
  }

  // Handle query parameters
  if (queryParams) {
    const queryParamsObj = transformTable(queryParams)

    // Verify if URL already has query params to use proper separator
    const separator = url.includes('?') ? '&' : '?'

    // Build query string manually to avoid double-encoding issues
    const queryParts: string[] = []

    for (const [key, value] of Object.entries(queryParamsObj)) {
      if (value !== undefined && value !== null) {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      }
    }

    if (queryParts.length > 0) {
      url += separator + queryParts.join('&')
    }
  }

  return url
}

// Check if a URL needs proxy to avoid CORS/method restrictions
export const shouldUseProxy = (url: string): boolean => {
  // Skip proxying in test environment
  if (isTest) {
    return false
  }

  // Only consider proxying in browser environment
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const _urlObj = new URL(url)
    const currentOrigin = window.location.origin

    // Don't proxy same-origin or localhost requests
    if (url.startsWith(currentOrigin) || url.includes('localhost')) {
      return false
    }

    return true // Proxy all cross-origin requests for consistency
  } catch (e) {
    logger.warn('URL parsing failed:', e)
    return false
  }
}

/**
 * Transforms a table from the store format to a key-value object
 * Local copy of the function to break circular dependencies
 * @param table Array of table rows from the store
 * @returns Record of key-value pairs
 */
export const transformTable = (table: TableRow[] | null): Record<string, any> => {
  if (!table) return {}

  return table.reduce(
    (acc, row) => {
      if (row.cells?.Key && row.cells?.Value !== undefined) {
        // Extract the Value cell as is - it should already be properly resolved
        // by the InputResolver based on variable type (number, string, boolean etc.)
        const value = row.cells.Value

        // Store the correctly typed value in the result object
        acc[row.cells.Key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: create_company.ts]---
Location: sim-main/apps/sim/tools/hubspot/create_company.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  HubSpotCreateCompanyParams,
  HubSpotCreateCompanyResponse,
} from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotCreateCompany')

export const hubspotCreateCompanyTool: ToolConfig<
  HubSpotCreateCompanyParams,
  HubSpotCreateCompanyResponse
> = {
  id: 'hubspot_create_company',
  name: 'Create Company in HubSpot',
  description: 'Create a new company in HubSpot',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'hubspot',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the HubSpot API',
    },
    properties: {
      type: 'object',
      required: true,
      visibility: 'user-only',
      description: 'Company properties as JSON object (e.g., name, domain, city, industry)',
    },
    associations: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'Array of associations to create with the company',
    },
  },

  request: {
    url: () => 'https://api.hubapi.com/crm/v3/objects/companies',
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
      let properties = params.properties
      if (typeof properties === 'string') {
        try {
          properties = JSON.parse(properties)
        } catch (e) {
          throw new Error('Invalid JSON format for properties. Please provide a valid JSON object.')
        }
      }

      const body: any = {
        properties,
      }

      if (params.associations && params.associations.length > 0) {
        body.associations = params.associations
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('HubSpot API request failed', { data, status: response.status })
      throw new Error(data.message || 'Failed to create company in HubSpot')
    }

    return {
      success: true,
      output: {
        company: data,
        metadata: {
          operation: 'create_company' as const,
          companyId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    company: { type: 'object', description: 'Created HubSpot company object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_contact.ts]---
Location: sim-main/apps/sim/tools/hubspot/create_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  HubSpotCreateContactParams,
  HubSpotCreateContactResponse,
} from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotCreateContact')

export const hubspotCreateContactTool: ToolConfig<
  HubSpotCreateContactParams,
  HubSpotCreateContactResponse
> = {
  id: 'hubspot_create_contact',
  name: 'Create Contact in HubSpot',
  description:
    'Create a new contact in HubSpot. Requires at least one of: email, firstname, or lastname',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'hubspot',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the HubSpot API',
    },
    properties: {
      type: 'object',
      required: true,
      visibility: 'user-only',
      description:
        'Contact properties as JSON object. Must include at least one of: email, firstname, or lastname',
    },
    associations: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description:
        'Array of associations to create with the contact (e.g., companies, deals). Each object should have "to" (with "id") and "types" (with "associationCategory" and "associationTypeId")',
    },
  },

  request: {
    url: () => 'https://api.hubapi.com/crm/v3/objects/contacts',
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
      let properties = params.properties
      if (typeof properties === 'string') {
        try {
          properties = JSON.parse(properties)
        } catch (e) {
          throw new Error('Invalid JSON format for properties. Please provide a valid JSON object.')
        }
      }

      const body: any = {
        properties,
      }

      if (params.associations && params.associations.length > 0) {
        body.associations = params.associations
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('HubSpot API request failed', { data, status: response.status })
      throw new Error(data.message || 'Failed to create contact in HubSpot')
    }

    return {
      success: true,
      output: {
        contact: data,
        metadata: {
          operation: 'create_contact' as const,
          contactId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    contact: { type: 'object', description: 'Created HubSpot contact object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_company.ts]---
Location: sim-main/apps/sim/tools/hubspot/get_company.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { HubSpotGetCompanyParams, HubSpotGetCompanyResponse } from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotGetCompany')

export const hubspotGetCompanyTool: ToolConfig<HubSpotGetCompanyParams, HubSpotGetCompanyResponse> =
  {
    id: 'hubspot_get_company',
    name: 'Get Company from HubSpot',
    description: 'Retrieve a single company by ID or domain from HubSpot',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'hubspot',
    },

    params: {
      accessToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'The access token for the HubSpot API',
      },
      companyId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The ID or domain of the company to retrieve',
      },
      idProperty: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description:
          'Property to use as unique identifier (e.g., "domain"). If not specified, uses record ID',
      },
      properties: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Comma-separated list of properties to return',
      },
      associations: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Comma-separated list of object types to retrieve associated IDs for',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = `https://api.hubapi.com/crm/v3/objects/companies/${params.companyId}`
        const queryParams = new URLSearchParams()

        if (params.idProperty) {
          queryParams.append('idProperty', params.idProperty)
        }
        if (params.properties) {
          queryParams.append('properties', params.properties)
        }
        if (params.associations) {
          queryParams.append('associations', params.associations)
        }

        const queryString = queryParams.toString()
        return queryString ? `${baseUrl}?${queryString}` : baseUrl
      },
      method: 'GET',
      headers: (params) => {
        if (!params.accessToken) {
          throw new Error('Access token is required')
        }

        return {
          Authorization: `Bearer ${params.accessToken}`,
          'Content-Type': 'application/json',
        }
      },
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!response.ok) {
        logger.error('HubSpot API request failed', { data, status: response.status })
        throw new Error(data.message || 'Failed to get company from HubSpot')
      }

      return {
        success: true,
        output: {
          company: data,
          metadata: {
            operation: 'get_company' as const,
            companyId: data.id,
          },
          success: true,
        },
      }
    },

    outputs: {
      company: { type: 'object', description: 'HubSpot company object with properties' },
      metadata: { type: 'object', description: 'Operation metadata' },
      success: { type: 'boolean', description: 'Operation success status' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_contact.ts]---
Location: sim-main/apps/sim/tools/hubspot/get_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { HubSpotGetContactParams, HubSpotGetContactResponse } from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotGetContact')

export const hubspotGetContactTool: ToolConfig<HubSpotGetContactParams, HubSpotGetContactResponse> =
  {
    id: 'hubspot_get_contact',
    name: 'Get Contact from HubSpot',
    description: 'Retrieve a single contact by ID or email from HubSpot',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'hubspot',
    },

    params: {
      accessToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'The access token for the HubSpot API',
      },
      contactId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The ID or email of the contact to retrieve',
      },
      idProperty: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description:
          'Property to use as unique identifier (e.g., "email"). If not specified, uses record ID',
      },
      properties: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Comma-separated list of properties to return',
      },
      associations: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Comma-separated list of object types to retrieve associated IDs for',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = `https://api.hubapi.com/crm/v3/objects/contacts/${params.contactId}`
        const queryParams = new URLSearchParams()

        if (params.idProperty) {
          queryParams.append('idProperty', params.idProperty)
        }
        if (params.properties) {
          queryParams.append('properties', params.properties)
        }
        if (params.associations) {
          queryParams.append('associations', params.associations)
        }

        const queryString = queryParams.toString()
        return queryString ? `${baseUrl}?${queryString}` : baseUrl
      },
      method: 'GET',
      headers: (params) => {
        if (!params.accessToken) {
          throw new Error('Access token is required')
        }

        return {
          Authorization: `Bearer ${params.accessToken}`,
          'Content-Type': 'application/json',
        }
      },
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!response.ok) {
        logger.error('HubSpot API request failed', { data, status: response.status })
        throw new Error(data.message || 'Failed to get contact from HubSpot')
      }

      return {
        success: true,
        output: {
          contact: data,
          metadata: {
            operation: 'get_contact' as const,
            contactId: data.id,
          },
          success: true,
        },
      }
    },

    outputs: {
      contact: { type: 'object', description: 'HubSpot contact object with properties' },
      metadata: { type: 'object', description: 'Operation metadata' },
      success: { type: 'boolean', description: 'Operation success status' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_users.ts]---
Location: sim-main/apps/sim/tools/hubspot/get_users.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { HubSpotGetUsersParams, HubSpotGetUsersResponse } from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotGetUsers')

export const hubspotGetUsersTool: ToolConfig<HubSpotGetUsersParams, HubSpotGetUsersResponse> = {
  id: 'hubspot_get_users',
  name: 'Get Users from HubSpot',
  description: 'Retrieve all users from HubSpot account',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'hubspot',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the HubSpot API',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 100)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = 'https://api.hubapi.com/crm/v3/objects/users'
      const queryParams = new URLSearchParams()

      if (params.limit) {
        queryParams.append('limit', params.limit)
      }

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('HubSpot API request failed', { data, status: response.status })
      throw new Error(data.message || 'Failed to fetch users from HubSpot')
    }

    const users = data.results || []

    return {
      success: true,
      output: {
        users,
        metadata: {
          operation: 'get_users' as const,
          totalItems: users.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    users: { type: 'array', description: 'Array of HubSpot user objects' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/hubspot/index.ts

```typescript
export { hubspotCreateCompanyTool } from './create_company'
export { hubspotCreateContactTool } from './create_contact'
export { hubspotGetCompanyTool } from './get_company'
export { hubspotGetContactTool } from './get_contact'
export { hubspotGetUsersTool } from './get_users'
export { hubspotListCompaniesTool } from './list_companies'
export { hubspotListContactsTool } from './list_contacts'
export { hubspotListDealsTool } from './list_deals'
export { hubspotSearchCompaniesTool } from './search_companies'
export { hubspotSearchContactsTool } from './search_contacts'
export { hubspotUpdateCompanyTool } from './update_company'
export { hubspotUpdateContactTool } from './update_contact'
```

--------------------------------------------------------------------------------

---[FILE: list_companies.ts]---
Location: sim-main/apps/sim/tools/hubspot/list_companies.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  HubSpotListCompaniesParams,
  HubSpotListCompaniesResponse,
} from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotListCompanies')

export const hubspotListCompaniesTool: ToolConfig<
  HubSpotListCompaniesParams,
  HubSpotListCompaniesResponse
> = {
  id: 'hubspot_list_companies',
  name: 'List Companies from HubSpot',
  description: 'Retrieve all companies from HubSpot account with pagination support',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'hubspot',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the HubSpot API',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results per page (max 100, default 100)',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Pagination cursor for next page of results',
    },
    properties: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of properties to return',
    },
    associations: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of object types to retrieve associated IDs for',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = 'https://api.hubapi.com/crm/v3/objects/companies'
      const queryParams = new URLSearchParams()

      if (params.limit) {
        queryParams.append('limit', params.limit)
      }
      if (params.after) {
        queryParams.append('after', params.after)
      }
      if (params.properties) {
        queryParams.append('properties', params.properties)
      }
      if (params.associations) {
        queryParams.append('associations', params.associations)
      }

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('HubSpot API request failed', { data, status: response.status })
      throw new Error(data.message || 'Failed to list companies from HubSpot')
    }

    return {
      success: true,
      output: {
        companies: data.results || [],
        paging: data.paging,
        metadata: {
          operation: 'list_companies' as const,
          totalReturned: data.results?.length || 0,
          hasMore: !!data.paging?.next,
        },
        success: true,
      },
    }
  },

  outputs: {
    companies: { type: 'array', description: 'Array of HubSpot company objects' },
    paging: { type: 'object', description: 'Pagination information' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_contacts.ts]---
Location: sim-main/apps/sim/tools/hubspot/list_contacts.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { HubSpotListContactsParams, HubSpotListContactsResponse } from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotListContacts')

export const hubspotListContactsTool: ToolConfig<
  HubSpotListContactsParams,
  HubSpotListContactsResponse
> = {
  id: 'hubspot_list_contacts',
  name: 'List Contacts from HubSpot',
  description: 'Retrieve all contacts from HubSpot account with pagination support',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'hubspot',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the HubSpot API',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results per page (max 100, default 100)',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Pagination cursor for next page of results',
    },
    properties: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Comma-separated list of properties to return (e.g., "email,firstname,lastname")',
    },
    associations: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of object types to retrieve associated IDs for',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = 'https://api.hubapi.com/crm/v3/objects/contacts'
      const queryParams = new URLSearchParams()

      if (params.limit) {
        queryParams.append('limit', params.limit)
      }
      if (params.after) {
        queryParams.append('after', params.after)
      }
      if (params.properties) {
        queryParams.append('properties', params.properties)
      }
      if (params.associations) {
        queryParams.append('associations', params.associations)
      }

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('HubSpot API request failed', { data, status: response.status })
      throw new Error(data.message || 'Failed to list contacts from HubSpot')
    }

    return {
      success: true,
      output: {
        contacts: data.results || [],
        paging: data.paging,
        metadata: {
          operation: 'list_contacts' as const,
          totalReturned: data.results?.length || 0,
          hasMore: !!data.paging?.next,
        },
        success: true,
      },
    }
  },

  outputs: {
    contacts: { type: 'array', description: 'Array of HubSpot contact objects' },
    paging: { type: 'object', description: 'Pagination information' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_deals.ts]---
Location: sim-main/apps/sim/tools/hubspot/list_deals.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { HubSpotListDealsParams, HubSpotListDealsResponse } from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotListDeals')

export const hubspotListDealsTool: ToolConfig<HubSpotListDealsParams, HubSpotListDealsResponse> = {
  id: 'hubspot_list_deals',
  name: 'List Deals from HubSpot',
  description: 'Retrieve all deals from HubSpot account with pagination support',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'hubspot',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the HubSpot API',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results per page (max 100, default 100)',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Pagination cursor for next page of results',
    },
    properties: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of properties to return',
    },
    associations: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of object types to retrieve associated IDs for',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = 'https://api.hubapi.com/crm/v3/objects/deals'
      const queryParams = new URLSearchParams()

      if (params.limit) {
        queryParams.append('limit', params.limit)
      }
      if (params.after) {
        queryParams.append('after', params.after)
      }
      if (params.properties) {
        queryParams.append('properties', params.properties)
      }
      if (params.associations) {
        queryParams.append('associations', params.associations)
      }

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('HubSpot API request failed', { data, status: response.status })
      throw new Error(data.message || 'Failed to list deals from HubSpot')
    }

    return {
      success: true,
      output: {
        deals: data.results || [],
        paging: data.paging,
        metadata: {
          operation: 'list_deals' as const,
          totalReturned: data.results?.length || 0,
          hasMore: !!data.paging?.next,
        },
        success: true,
      },
    }
  },

  outputs: {
    deals: { type: 'array', description: 'Array of HubSpot deal objects' },
    paging: { type: 'object', description: 'Pagination information' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_companies.ts]---
Location: sim-main/apps/sim/tools/hubspot/search_companies.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  HubSpotSearchCompaniesParams,
  HubSpotSearchCompaniesResponse,
} from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotSearchCompanies')

export const hubspotSearchCompaniesTool: ToolConfig<
  HubSpotSearchCompaniesParams,
  HubSpotSearchCompaniesResponse
> = {
  id: 'hubspot_search_companies',
  name: 'Search Companies in HubSpot',
  description: 'Search for companies in HubSpot using filters, sorting, and queries',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'hubspot',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the HubSpot API',
    },
    filterGroups: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description:
        'Array of filter groups. Each group contains filters with propertyName, operator, and value',
    },
    sorts: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description:
        'Array of sort objects with propertyName and direction ("ASCENDING" or "DESCENDING")',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Search query string',
    },
    properties: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'Array of property names to return',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (max 100)',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Pagination cursor for next page',
    },
  },

  request: {
    url: () => 'https://api.hubapi.com/crm/v3/objects/companies/search',
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
      const body: any = {}

      if (params.filterGroups) {
        let parsedFilterGroups = params.filterGroups
        if (typeof params.filterGroups === 'string') {
          try {
            parsedFilterGroups = JSON.parse(params.filterGroups)
          } catch (e) {
            throw new Error(`Invalid JSON for filterGroups: ${(e as Error).message}`)
          }
        }
        if (Array.isArray(parsedFilterGroups) && parsedFilterGroups.length > 0) {
          body.filterGroups = parsedFilterGroups
        }
      }
      if (params.sorts) {
        let parsedSorts = params.sorts
        if (typeof params.sorts === 'string') {
          try {
            parsedSorts = JSON.parse(params.sorts)
          } catch (e) {
            throw new Error(`Invalid JSON for sorts: ${(e as Error).message}`)
          }
        }
        if (Array.isArray(parsedSorts) && parsedSorts.length > 0) {
          body.sorts = parsedSorts
        }
      }
      if (params.query) {
        body.query = params.query
      }
      if (params.properties) {
        let parsedProperties = params.properties
        if (typeof params.properties === 'string') {
          try {
            parsedProperties = JSON.parse(params.properties)
          } catch (e) {
            throw new Error(`Invalid JSON for properties: ${(e as Error).message}`)
          }
        }
        if (Array.isArray(parsedProperties) && parsedProperties.length > 0) {
          body.properties = parsedProperties
        }
      }
      if (params.limit) {
        body.limit = params.limit
      }
      if (params.after) {
        body.after = params.after
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('HubSpot API request failed', { data, status: response.status })
      throw new Error(data.message || 'Failed to search companies in HubSpot')
    }

    const result = {
      companies: data.results || [],
      total: data.total,
      paging: data.paging,
      metadata: {
        operation: 'search_companies' as const,
        totalReturned: data.results?.length || 0,
        total: data.total,
      },
    }

    return {
      success: true,
      output: result,
      ...result,
    }
  },

  outputs: {
    companies: { type: 'array', description: 'Array of matching HubSpot company objects' },
    total: { type: 'number', description: 'Total number of matching companies' },
    paging: { type: 'object', description: 'Pagination information' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

````
