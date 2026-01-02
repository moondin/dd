---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 689
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 689 of 933)

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

---[FILE: search_contacts.ts]---
Location: sim-main/apps/sim/tools/hubspot/search_contacts.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  HubSpotSearchContactsParams,
  HubSpotSearchContactsResponse,
} from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotSearchContacts')

export const hubspotSearchContactsTool: ToolConfig<
  HubSpotSearchContactsParams,
  HubSpotSearchContactsResponse
> = {
  id: 'hubspot_search_contacts',
  name: 'Search Contacts in HubSpot',
  description: 'Search for contacts in HubSpot using filters, sorting, and queries',
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
    url: () => 'https://api.hubapi.com/crm/v3/objects/contacts/search',
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
      throw new Error(data.message || 'Failed to search contacts in HubSpot')
    }

    const result = {
      contacts: data.results || [],
      total: data.total,
      paging: data.paging,
      metadata: {
        operation: 'search_contacts' as const,
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
    contacts: { type: 'array', description: 'Array of matching HubSpot contact objects' },
    total: { type: 'number', description: 'Total number of matching contacts' },
    paging: { type: 'object', description: 'Pagination information' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/hubspot/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Common HubSpot types
export interface HubSpotUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  roleId?: string
  primaryTeamId?: string
  superAdmin?: boolean
}

export interface HubSpotContact {
  id: string
  properties: Record<string, any>
  createdAt: string
  updatedAt: string
  archived: boolean
  associations?: Record<string, any>
}

export interface HubSpotPaging {
  next?: {
    after: string
    link?: string
  }
}

// Users
export interface HubSpotGetUsersResponse extends ToolResponse {
  output: {
    users: HubSpotUser[]
    metadata: {
      operation: 'get_users'
      totalItems?: number
    }
    success: boolean
  }
}

export interface HubSpotGetUsersParams {
  accessToken: string
  limit?: string
}

// List Contacts
export interface HubSpotListContactsResponse extends ToolResponse {
  output: {
    contacts: HubSpotContact[]
    paging?: HubSpotPaging
    metadata: {
      operation: 'list_contacts'
      totalReturned: number
      hasMore: boolean
    }
    success: boolean
  }
}

export interface HubSpotListContactsParams {
  accessToken: string
  limit?: string
  after?: string
  properties?: string
  associations?: string
}

// Get Contact
export interface HubSpotGetContactResponse extends ToolResponse {
  output: {
    contact: HubSpotContact
    metadata: {
      operation: 'get_contact'
      contactId: string
    }
    success: boolean
  }
}

export interface HubSpotGetContactParams {
  accessToken: string
  contactId: string
  idProperty?: string
  properties?: string
  associations?: string
}

// Create Contact
export interface HubSpotCreateContactResponse extends ToolResponse {
  output: {
    contact: HubSpotContact
    metadata: {
      operation: 'create_contact'
      contactId: string
    }
    success: boolean
  }
}

export interface HubSpotCreateContactParams {
  accessToken: string
  properties: Record<string, any>
  associations?: Array<{
    to: { id: string }
    types: Array<{
      associationCategory: string
      associationTypeId: number
    }>
  }>
}

// Update Contact
export interface HubSpotUpdateContactResponse extends ToolResponse {
  output: {
    contact: HubSpotContact
    metadata: {
      operation: 'update_contact'
      contactId: string
    }
    success: boolean
  }
}

export interface HubSpotUpdateContactParams {
  accessToken: string
  contactId: string
  idProperty?: string
  properties: Record<string, any>
}

// Search Contacts
export interface HubSpotSearchContactsResponse extends ToolResponse {
  contacts: HubSpotContact[]
  total: number
  paging?: HubSpotPaging
  metadata: {
    operation: 'search_contacts'
    totalReturned: number
    total: number
  }
}

export interface HubSpotSearchContactsParams {
  accessToken: string
  filterGroups?: Array<{
    filters: Array<{
      propertyName: string
      operator: string
      value: string
    }>
  }>
  sorts?: Array<{
    propertyName: string
    direction: 'ASCENDING' | 'DESCENDING'
  }>
  query?: string
  properties?: string[]
  limit?: number
  after?: string
}

// Companies (same structure as contacts)
export type HubSpotCompany = HubSpotContact
export type HubSpotListCompaniesParams = HubSpotListContactsParams
export type HubSpotListCompaniesResponse = Omit<HubSpotListContactsResponse, 'output'> & {
  output: {
    companies: HubSpotContact[]
    paging?: HubSpotPaging
    metadata: {
      operation: 'list_companies'
      totalReturned: number
      hasMore: boolean
    }
    success: boolean
  }
}
export type HubSpotGetCompanyParams = HubSpotGetContactParams & { companyId: string }
export type HubSpotGetCompanyResponse = Omit<HubSpotGetContactResponse, 'output'> & {
  output: {
    company: HubSpotContact
    metadata: {
      operation: 'get_company'
      companyId: string
    }
    success: boolean
  }
}
export type HubSpotCreateCompanyParams = HubSpotCreateContactParams
export type HubSpotCreateCompanyResponse = Omit<HubSpotCreateContactResponse, 'output'> & {
  output: {
    company: HubSpotContact
    metadata: {
      operation: 'create_company'
      companyId: string
    }
    success: boolean
  }
}
export type HubSpotUpdateCompanyParams = HubSpotUpdateContactParams & { companyId: string }
export type HubSpotUpdateCompanyResponse = Omit<HubSpotUpdateContactResponse, 'output'> & {
  output: {
    company: HubSpotContact
    metadata: {
      operation: 'update_company'
      companyId: string
    }
    success: boolean
  }
}
export type HubSpotSearchCompaniesParams = HubSpotSearchContactsParams
export interface HubSpotSearchCompaniesResponse extends ToolResponse {
  companies: HubSpotContact[]
  total: number
  paging?: HubSpotPaging
  metadata: {
    operation: 'search_companies'
    totalReturned: number
    total: number
  }
}

// Deals (same structure as contacts)
export type HubSpotDeal = HubSpotContact
export type HubSpotListDealsParams = HubSpotListContactsParams
export type HubSpotListDealsResponse = Omit<HubSpotListContactsResponse, 'output'> & {
  output: {
    deals: HubSpotContact[]
    paging?: HubSpotPaging
    metadata: {
      operation: 'list_deals'
      totalReturned: number
      hasMore: boolean
    }
    success: boolean
  }
}

// Generic HubSpot response type for the block
export type HubSpotResponse =
  | HubSpotGetUsersResponse
  | HubSpotListContactsResponse
  | HubSpotGetContactResponse
  | HubSpotCreateContactResponse
  | HubSpotUpdateContactResponse
  | HubSpotSearchContactsResponse
  | HubSpotListCompaniesResponse
  | HubSpotGetCompanyResponse
  | HubSpotCreateCompanyResponse
  | HubSpotUpdateCompanyResponse
  | HubSpotSearchCompaniesResponse
  | HubSpotListDealsResponse
```

--------------------------------------------------------------------------------

---[FILE: update_company.ts]---
Location: sim-main/apps/sim/tools/hubspot/update_company.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  HubSpotUpdateCompanyParams,
  HubSpotUpdateCompanyResponse,
} from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotUpdateCompany')

export const hubspotUpdateCompanyTool: ToolConfig<
  HubSpotUpdateCompanyParams,
  HubSpotUpdateCompanyResponse
> = {
  id: 'hubspot_update_company',
  name: 'Update Company in HubSpot',
  description: 'Update an existing company in HubSpot by ID or domain',
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
      description: 'The ID or domain of the company to update',
    },
    idProperty: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Property to use as unique identifier (e.g., "domain"). If not specified, uses record ID',
    },
    properties: {
      type: 'object',
      required: true,
      visibility: 'user-only',
      description: 'Company properties to update as JSON object',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.hubapi.com/crm/v3/objects/companies/${params.companyId}`
      if (params.idProperty) {
        return `${baseUrl}?idProperty=${params.idProperty}`
      }
      return baseUrl
    },
    method: 'PATCH',
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

      return {
        properties,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('HubSpot API request failed', { data, status: response.status })
      throw new Error(data.message || 'Failed to update company in HubSpot')
    }

    return {
      success: true,
      output: {
        company: data,
        metadata: {
          operation: 'update_company' as const,
          companyId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    company: { type: 'object', description: 'Updated HubSpot company object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_contact.ts]---
Location: sim-main/apps/sim/tools/hubspot/update_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  HubSpotUpdateContactParams,
  HubSpotUpdateContactResponse,
} from '@/tools/hubspot/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('HubSpotUpdateContact')

export const hubspotUpdateContactTool: ToolConfig<
  HubSpotUpdateContactParams,
  HubSpotUpdateContactResponse
> = {
  id: 'hubspot_update_contact',
  name: 'Update Contact in HubSpot',
  description: 'Update an existing contact in HubSpot by ID or email',
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
      description: 'The ID or email of the contact to update',
    },
    idProperty: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Property to use as unique identifier (e.g., "email"). If not specified, uses record ID',
    },
    properties: {
      type: 'object',
      required: true,
      visibility: 'user-only',
      description: 'Contact properties to update as JSON object',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.hubapi.com/crm/v3/objects/contacts/${params.contactId}`
      if (params.idProperty) {
        return `${baseUrl}?idProperty=${params.idProperty}`
      }
      return baseUrl
    },
    method: 'PATCH',
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

      return {
        properties,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('HubSpot API request failed', { data, status: response.status })
      throw new Error(data.message || 'Failed to update contact in HubSpot')
    }

    return {
      success: true,
      output: {
        contact: data,
        metadata: {
          operation: 'update_contact' as const,
          contactId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    contact: { type: 'object', description: 'Updated HubSpot contact object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: chat.ts]---
Location: sim-main/apps/sim/tools/huggingface/chat.ts

```typescript
import type {
  HuggingFaceChatParams,
  HuggingFaceChatResponse,
  HuggingFaceMessage,
  HuggingFaceRequestBody,
} from '@/tools/huggingface/types'
import type { ToolConfig } from '@/tools/types'

export const chatTool: ToolConfig<HuggingFaceChatParams, HuggingFaceChatResponse> = {
  id: 'huggingface_chat',
  name: 'Hugging Face Chat',
  description: 'Generate completions using Hugging Face Inference API',
  version: '1.0',

  params: {
    systemPrompt: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'System prompt to guide the model behavior',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The user message content to send to the model',
    },
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The provider to use for the API request (e.g., novita, cerebras, etc.)',
    },
    model: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Model to use for chat completions (e.g., deepseek/deepseek-v3-0324)',
    },
    maxTokens: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of tokens to generate',
    },
    temperature: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Sampling temperature (0-2). Higher values make output more random',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Hugging Face API token',
    },
  },

  request: {
    method: 'POST',
    url: (params) => {
      // Provider-specific endpoint mapping
      const endpointMap: Record<string, string> = {
        novita: '/v3/openai/chat/completions',
        cerebras: '/v1/chat/completions',
        cohere: '/v1/chat/completions',
        fal: '/v1/chat/completions',
        fireworks: '/v1/chat/completions',
        hyperbolic: '/v1/chat/completions',
        'hf-inference': '/v1/chat/completions',
        nebius: '/v1/chat/completions',
        nscale: '/v1/chat/completions',
        replicate: '/v1/chat/completions',
        sambanova: '/v1/chat/completions',
        together: '/v1/chat/completions',
      }

      const endpoint = endpointMap[params.provider] || '/v1/chat/completions'
      return `https://router.huggingface.co/${params.provider}${endpoint}`
    },
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const messages: HuggingFaceMessage[] = []

      // Add system prompt if provided
      if (params.systemPrompt) {
        messages.push({
          role: 'system',
          content: params.systemPrompt,
        })
      }

      // Add user message
      messages.push({
        role: 'user',
        content: params.content,
      })

      const body: HuggingFaceRequestBody = {
        model: params.model,
        messages: messages,
        stream: false,
      }

      // Add optional parameters if provided
      if (params.temperature !== undefined) {
        body.temperature = Number(params.temperature)
      }

      if (params.maxTokens !== undefined) {
        body.max_tokens = Number(params.maxTokens)
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        content: data.choices?.[0]?.message?.content || '',
        model: data.model || 'unknown',
        usage: data.usage
          ? {
              prompt_tokens: data.usage.prompt_tokens || 0,
              completion_tokens: data.usage.completion_tokens || 0,
              total_tokens: data.usage.total_tokens || 0,
            }
          : {
              prompt_tokens: 0,
              completion_tokens: 0,
              total_tokens: 0,
            },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Chat completion results',
      properties: {
        content: { type: 'string', description: 'Generated text content' },
        model: { type: 'string', description: 'Model used for generation' },
        usage: {
          type: 'object',
          description: 'Token usage information',
          properties: {
            prompt_tokens: { type: 'number', description: 'Number of tokens in the prompt' },
            completion_tokens: {
              type: 'number',
              description: 'Number of tokens in the completion',
            },
            total_tokens: { type: 'number', description: 'Total number of tokens used' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/huggingface/index.ts

```typescript
import { chatTool } from '@/tools/huggingface/chat'

export const huggingfaceChatTool = chatTool
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/huggingface/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface HuggingFaceUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface HuggingFaceMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface HuggingFaceRequestBody {
  model: string
  messages: HuggingFaceMessage[]
  stream: boolean
  temperature?: number
  max_tokens?: number
}

export interface HuggingFaceChatParams {
  apiKey: string
  provider: string
  model: string
  content: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
  stream?: boolean
}

export interface HuggingFaceChatResponse extends ToolResponse {
  output: {
    content: string
    model: string
    usage: HuggingFaceUsage
  }
}
```

--------------------------------------------------------------------------------

---[FILE: companies_find.ts]---
Location: sim-main/apps/sim/tools/hunter/companies_find.ts

```typescript
import type { HunterEnrichmentParams, HunterEnrichmentResponse } from '@/tools/hunter/types'
import type { ToolConfig } from '@/tools/types'

export const companiesFindTool: ToolConfig<HunterEnrichmentParams, HunterEnrichmentResponse> = {
  id: 'hunter_companies_find',
  name: 'Hunter Companies Find',
  description: 'Enriches company data using domain name.',
  version: '1.0.0',

  params: {
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Domain to find company data for',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Hunter.io API Key',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.hunter.io/v2/companies/find')
      url.searchParams.append('api_key', params.apiKey)
      url.searchParams.append('domain', params.domain || '')

      return url.toString()
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        person: undefined,
        company: data.data
          ? {
              name: data.data.name || '',
              domain: data.data.domain || '',
              industry: data.data.industry || '',
              size: data.data.size || '',
              country: data.data.country || '',
              linkedin: data.data.linkedin || '',
              twitter: data.data.twitter || '',
            }
          : undefined,
      },
    }
  },

  outputs: {
    person: {
      type: 'object',
      description: 'Person information (undefined for companies_find tool)',
    },
    company: {
      type: 'object',
      description:
        'Company information including name, domain, industry, size, country, linkedin, and twitter',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: discover.ts]---
Location: sim-main/apps/sim/tools/hunter/discover.ts

```typescript
import type { HunterDiscoverParams, HunterDiscoverResponse } from '@/tools/hunter/types'
import type { ToolConfig } from '@/tools/types'

export const discoverTool: ToolConfig<HunterDiscoverParams, HunterDiscoverResponse> = {
  id: 'hunter_discover',
  name: 'Hunter Discover',
  description: 'Returns companies matching a set of criteria using Hunter.io AI-powered search.',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Natural language search query for companies',
    },
    domain: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company domain names to filter by',
    },
    headcount: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company size filter (e.g., "1-10", "11-50")',
    },
    company_type: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Type of organization',
    },
    technology: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Technology used by companies',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Hunter.io API Key',
    },
  },

  request: {
    url: (params) => {
      // Validate that at least one search parameter is provided
      if (
        !params.query &&
        !params.domain &&
        !params.headcount &&
        !params.company_type &&
        !params.technology
      ) {
        throw new Error(
          'At least one search parameter (query, domain, headcount, company_type, or technology) must be provided'
        )
      }

      const url = new URL('https://api.hunter.io/v2/discover')
      url.searchParams.append('api_key', params.apiKey)
      return url.toString()
    },
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      // Add optional parameters if provided
      if (params.query) body.query = params.query
      if (params.domain) body.organization = { domain: [params.domain] }
      if (params.headcount) body.headcount = params.headcount
      if (params.company_type) body.company_type = params.company_type
      if (params.technology) {
        body.technology = {
          include: [params.technology],
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        results:
          data.data?.map((company: any) => ({
            domain: company.domain || '',
            name: company.organization || '',
            headcount: company.headcount,
            technologies: company.technologies || [],
            email_count: company.emails_count?.total || 0,
          })) || [],
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      description:
        'Array of companies matching the search criteria, each containing domain, name, headcount, technologies, and email_count',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: domain_search.ts]---
Location: sim-main/apps/sim/tools/hunter/domain_search.ts

```typescript
import type { HunterDomainSearchParams, HunterDomainSearchResponse } from '@/tools/hunter/types'
import type { ToolConfig } from '@/tools/types'

export const domainSearchTool: ToolConfig<HunterDomainSearchParams, HunterDomainSearchResponse> = {
  id: 'hunter_domain_search',
  name: 'Hunter Domain Search',
  description: 'Returns all the email addresses found using one given domain name, with sources.',
  version: '1.0.0',

  params: {
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Domain name to search for email addresses',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum email addresses to return (default: 10)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'hidden',
      description: 'Number of email addresses to skip',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter for personal or generic emails',
    },
    seniority: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by seniority level: junior, senior, or executive',
    },
    department: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by specific departments (e.g., sales, marketing)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Hunter.io API Key',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.hunter.io/v2/domain-search')
      url.searchParams.append('domain', params.domain)
      url.searchParams.append('api_key', params.apiKey)

      if (params.limit) url.searchParams.append('limit', Number(params.limit).toString())
      if (params.offset) url.searchParams.append('offset', Number(params.offset).toString())
      if (params.type && params.type !== 'all') url.searchParams.append('type', params.type)
      if (params.seniority && params.seniority !== 'all')
        url.searchParams.append('seniority', params.seniority)
      if (params.department) url.searchParams.append('department', params.department)

      return url.toString()
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        domain: data.data?.domain || '',
        disposable: data.data?.disposable || false,
        webmail: data.data?.webmail || false,
        accept_all: data.data?.accept_all || false,
        pattern: data.data?.pattern || '',
        organization: data.data?.organization || '',
        description: data.data?.description || '',
        industry: data.data?.industry || '',
        twitter: data.data?.twitter || '',
        facebook: data.data?.facebook || '',
        linkedin: data.data?.linkedin || '',
        instagram: data.data?.instagram || '',
        youtube: data.data?.youtube || '',
        technologies: data.data?.technologies || [],
        country: data.data?.country || '',
        state: data.data?.state || '',
        city: data.data?.city || '',
        postal_code: data.data?.postal_code || '',
        street: data.data?.street || '',
        emails:
          data.data?.emails?.map((email: any) => ({
            value: email.value || '',
            type: email.type || '',
            confidence: email.confidence || 0,
            sources: email.sources || [],
            first_name: email.first_name || '',
            last_name: email.last_name || '',
            position: email.position || '',
            seniority: email.seniority || '',
            department: email.department || '',
            linkedin: email.linkedin || '',
            twitter: email.twitter || '',
            phone_number: email.phone_number || '',
            verification: email.verification || {},
          })) || [],
      },
    }
  },

  outputs: {
    domain: {
      type: 'string',
      description: 'The searched domain name',
    },
    disposable: {
      type: 'boolean',
      description: 'Whether the domain accepts disposable email addresses',
    },
    webmail: {
      type: 'boolean',
      description: 'Whether the domain is a webmail provider',
    },
    accept_all: {
      type: 'boolean',
      description: 'Whether the domain accepts all email addresses',
    },
    pattern: {
      type: 'string',
      description: 'The email pattern used by the organization',
    },
    organization: {
      type: 'string',
      description: 'The organization name',
    },
    description: {
      type: 'string',
      description: 'Description of the organization',
    },
    industry: {
      type: 'string',
      description: 'Industry of the organization',
    },
    twitter: {
      type: 'string',
      description: 'Twitter profile of the organization',
    },
    facebook: {
      type: 'string',
      description: 'Facebook profile of the organization',
    },
    linkedin: {
      type: 'string',
      description: 'LinkedIn profile of the organization',
    },
    instagram: {
      type: 'string',
      description: 'Instagram profile of the organization',
    },
    youtube: {
      type: 'string',
      description: 'YouTube channel of the organization',
    },
    technologies: {
      type: 'array',
      description: 'Array of technologies used by the organization',
    },
    country: {
      type: 'string',
      description: 'Country where the organization is located',
    },
    state: {
      type: 'string',
      description: 'State where the organization is located',
    },
    city: {
      type: 'string',
      description: 'City where the organization is located',
    },
    postal_code: {
      type: 'string',
      description: 'Postal code of the organization',
    },
    street: {
      type: 'string',
      description: 'Street address of the organization',
    },
    emails: {
      type: 'array',
      description:
        'Array of email addresses found for the domain, each containing value, type, confidence, sources, and person details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: email_count.ts]---
Location: sim-main/apps/sim/tools/hunter/email_count.ts

```typescript
import type { HunterEmailCountParams, HunterEmailCountResponse } from '@/tools/hunter/types'
import type { ToolConfig } from '@/tools/types'

export const emailCountTool: ToolConfig<HunterEmailCountParams, HunterEmailCountResponse> = {
  id: 'hunter_email_count',
  name: 'Hunter Email Count',
  description: 'Returns the total number of email addresses found for a domain or company.',
  version: '1.0.0',

  params: {
    domain: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Domain to count emails for (required if company not provided)',
    },
    company: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company name to count emails for (required if domain not provided)',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter for personal or generic emails only',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Hunter.io API Key',
    },
  },

  request: {
    url: (params) => {
      if (!params.domain && !params.company) {
        throw new Error('Either domain or company must be provided')
      }

      const url = new URL('https://api.hunter.io/v2/email-count')
      url.searchParams.append('api_key', params.apiKey)

      if (params.domain) url.searchParams.append('domain', params.domain)
      if (params.company) url.searchParams.append('company', params.company)
      if (params.type && params.type !== 'all') url.searchParams.append('type', params.type)

      return url.toString()
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        total: data.data?.total || 0,
        personal_emails: data.data?.personal_emails || 0,
        generic_emails: data.data?.generic_emails || 0,
        department: data.data?.department || {
          executive: 0,
          it: 0,
          finance: 0,
          management: 0,
          sales: 0,
          legal: 0,
          support: 0,
          hr: 0,
          marketing: 0,
          communication: 0,
        },
        seniority: data.data?.seniority || {
          junior: 0,
          senior: 0,
          executive: 0,
        },
      },
    }
  },

  outputs: {
    total: {
      type: 'number',
      description: 'Total number of email addresses found',
    },
    personal_emails: {
      type: 'number',
      description: 'Number of personal email addresses found',
    },
    generic_emails: {
      type: 'number',
      description: 'Number of generic email addresses found',
    },
    department: {
      type: 'object',
      description:
        'Breakdown of email addresses by department (executive, it, finance, management, sales, legal, support, hr, marketing, communication)',
    },
    seniority: {
      type: 'object',
      description: 'Breakdown of email addresses by seniority level (junior, senior, executive)',
    },
  },
}
```

--------------------------------------------------------------------------------

````
