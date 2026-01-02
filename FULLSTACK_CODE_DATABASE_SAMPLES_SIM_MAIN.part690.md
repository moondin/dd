---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 690
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 690 of 933)

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

---[FILE: email_finder.ts]---
Location: sim-main/apps/sim/tools/hunter/email_finder.ts

```typescript
import type { HunterEmailFinderParams, HunterEmailFinderResponse } from '@/tools/hunter/types'
import type { ToolConfig } from '@/tools/types'

export const emailFinderTool: ToolConfig<HunterEmailFinderParams, HunterEmailFinderResponse> = {
  id: 'hunter_email_finder',
  name: 'Hunter Email Finder',
  description:
    'Finds the most likely email address for a person given their name and company domain.',
  version: '1.0.0',

  params: {
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Company domain name',
    },
    first_name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: "Person's first name",
    },
    last_name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: "Person's last name",
    },
    company: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company name',
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
      const url = new URL('https://api.hunter.io/v2/email-finder')
      url.searchParams.append('domain', params.domain)
      url.searchParams.append('first_name', params.first_name)
      url.searchParams.append('last_name', params.last_name)
      url.searchParams.append('api_key', params.apiKey)

      if (params.company) url.searchParams.append('company', params.company)

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
        email: data.data?.email || '',
        score: data.data?.score || 0,
        sources: data.data?.sources || [],
        verification: data.data?.verification || {},
      },
    }
  },

  outputs: {
    email: {
      type: 'string',
      description: 'The found email address',
    },
    score: {
      type: 'number',
      description: 'Confidence score for the found email address',
    },
    sources: {
      type: 'array',
      description:
        'Array of sources where the email was found, each containing domain, uri, extracted_on, last_seen_on, and still_on_page',
    },
    verification: {
      type: 'object',
      description: 'Verification information containing date and status',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: email_verifier.ts]---
Location: sim-main/apps/sim/tools/hunter/email_verifier.ts

```typescript
import type { HunterEmailVerifierParams, HunterEmailVerifierResponse } from '@/tools/hunter/types'
import type { ToolConfig } from '@/tools/types'

export const emailVerifierTool: ToolConfig<HunterEmailVerifierParams, HunterEmailVerifierResponse> =
  {
    id: 'hunter_email_verifier',
    name: 'Hunter Email Verifier',
    description:
      'Verifies the deliverability of an email address and provides detailed verification status.',
    version: '1.0.0',

    params: {
      email: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The email address to verify',
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
        const url = new URL('https://api.hunter.io/v2/email-verifier')
        url.searchParams.append('email', params.email)
        url.searchParams.append('api_key', params.apiKey)

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
          result: data.data?.result || 'unknown',
          score: data.data?.score || 0,
          email: data.data?.email || '',
          regexp: data.data?.regexp || false,
          gibberish: data.data?.gibberish || false,
          disposable: data.data?.disposable || false,
          webmail: data.data?.webmail || false,
          mx_records: data.data?.mx_records || false,
          smtp_server: data.data?.smtp_server || false,
          smtp_check: data.data?.smtp_check || false,
          accept_all: data.data?.accept_all || false,
          block: data.data?.block || false,
          status: data.data?.status || 'unknown',
          sources: data.data?.sources || [],
        },
      }
    },

    outputs: {
      result: {
        type: 'string',
        description: 'Deliverability result: deliverable, undeliverable, or risky',
      },
      score: {
        type: 'number',
        description: 'Confidence score for the verification result',
      },
      email: {
        type: 'string',
        description: 'The verified email address',
      },
      regexp: {
        type: 'boolean',
        description: 'Whether the email follows a valid regex pattern',
      },
      gibberish: {
        type: 'boolean',
        description: 'Whether the email appears to be gibberish',
      },
      disposable: {
        type: 'boolean',
        description: 'Whether the email is from a disposable email provider',
      },
      webmail: {
        type: 'boolean',
        description: 'Whether the email is from a webmail provider',
      },
      mx_records: {
        type: 'boolean',
        description: 'Whether MX records exist for the domain',
      },
      smtp_server: {
        type: 'boolean',
        description: 'Whether the SMTP server is reachable',
      },
      smtp_check: {
        type: 'boolean',
        description: 'Whether the SMTP check was successful',
      },
      accept_all: {
        type: 'boolean',
        description: 'Whether the domain accepts all email addresses',
      },
      block: {
        type: 'boolean',
        description: 'Whether the email is blocked',
      },
      status: {
        type: 'string',
        description:
          'Verification status: valid, invalid, accept_all, webmail, disposable, or unknown',
      },
      sources: {
        type: 'array',
        description: 'Array of sources where the email was found',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/hunter/index.ts

```typescript
import { companiesFindTool } from '@/tools/hunter/companies_find'
import { discoverTool } from '@/tools/hunter/discover'
import { domainSearchTool } from '@/tools/hunter/domain_search'
import { emailCountTool } from '@/tools/hunter/email_count'
import { emailFinderTool } from '@/tools/hunter/email_finder'
import { emailVerifierTool } from '@/tools/hunter/email_verifier'

export const hunterDiscoverTool = discoverTool
export const hunterDomainSearchTool = domainSearchTool
export const hunterEmailFinderTool = emailFinderTool
export const hunterEmailVerifierTool = emailVerifierTool
export const hunterCompaniesFindTool = companiesFindTool
export const hunterEmailCountTool = emailCountTool
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/hunter/types.ts

```typescript
// Common types for Hunter.io tools
import type { ToolResponse } from '@/tools/types'

// Common parameters for all Hunter.io tools
export interface HunterBaseParams {
  apiKey: string
}

// Discover tool types
export interface HunterDiscoverParams extends HunterBaseParams {
  query?: string
  domain?: string
  headcount?: string
  company_type?: string
  technology?: string
}

export interface HunterDiscoverResult {
  domain: string
  name: string
  headcount?: number
  technologies?: string[]
  email_count?: number
}

export interface HunterDiscoverResponse extends ToolResponse {
  output: {
    results: HunterDiscoverResult[]
  }
}

// Domain Search tool types
export interface HunterDomainSearchParams extends HunterBaseParams {
  domain: string
  limit?: number
  offset?: number
  type?: 'personal' | 'generic' | 'all'
  seniority?: 'junior' | 'senior' | 'executive' | 'all'
  department?: string
}

export interface HunterEmail {
  value: string
  type: string
  confidence: number
  sources: Array<{
    domain: string
    uri: string
    extracted_on: string
    last_seen_on: string
    still_on_page: boolean
  }>
  first_name: string
  last_name: string
  position: string
  seniority: string
  department: string
  linkedin: string
  twitter: string
  phone_number: string
  verification: {
    date: string
    status: string
  }
}

export interface HunterDomainSearchResponse extends ToolResponse {
  output: {
    domain: string
    disposable: boolean
    webmail: boolean
    accept_all: boolean
    pattern: string
    organization: string
    description: string
    industry: string
    twitter: string
    facebook: string
    linkedin: string
    instagram: string
    youtube: string
    technologies: string[]
    country: string
    state: string
    city: string
    postal_code: string
    street: string
    emails: HunterEmail[]
  }
}

// Email Finder tool types
export interface HunterEmailFinderParams extends HunterBaseParams {
  domain: string
  first_name: string
  last_name: string
  company?: string
}

export interface HunterEmailFinderResponse extends ToolResponse {
  output: {
    email: string
    score: number
    sources: Array<{
      domain: string
      uri: string
      extracted_on: string
      last_seen_on: string
      still_on_page: boolean
    }>
    verification: {
      date: string
      status: string
    }
  }
}

// Email Verifier tool types
export interface HunterEmailVerifierParams extends HunterBaseParams {
  email: string
}

export interface HunterEmailVerifierResponse extends ToolResponse {
  output: {
    result: 'deliverable' | 'undeliverable' | 'risky'
    score: number
    email: string
    regexp: boolean
    gibberish: boolean
    disposable: boolean
    webmail: boolean
    mx_records: boolean
    smtp_server: boolean
    smtp_check: boolean
    accept_all: boolean
    block: boolean
    status: 'valid' | 'invalid' | 'accept_all' | 'webmail' | 'disposable' | 'unknown'
    sources: Array<{
      domain: string
      uri: string
      extracted_on: string
      last_seen_on: string
      still_on_page: boolean
    }>
  }
}

// Enrichment tool types
export interface HunterEnrichmentParams extends HunterBaseParams {
  email?: string
  domain?: string
  linkedin_handle?: string
}

export interface HunterEnrichmentResponse extends ToolResponse {
  output: {
    person?: {
      first_name: string
      last_name: string
      email: string
      position: string
      seniority: string
      department: string
      linkedin: string
      twitter: string
      phone_number: string
    }
    company?: {
      name: string
      domain: string
      industry: string
      size: string
      country: string
      linkedin: string
      twitter: string
    }
  }
}

// Email Count tool types
export interface HunterEmailCountParams extends HunterBaseParams {
  domain?: string
  company?: string
  type?: 'personal' | 'generic' | 'all'
}

export interface HunterEmailCountResponse extends ToolResponse {
  output: {
    total: number
    personal_emails: number
    generic_emails: number
    department: {
      executive: number
      it: number
      finance: number
      management: number
      sales: number
      legal: number
      support: number
      hr: number
      marketing: number
      communication: number
    }
    seniority: {
      junior: number
      senior: number
      executive: number
    }
  }
}

export type HunterResponse =
  | HunterDiscoverResponse
  | HunterDomainSearchResponse
  | HunterEmailFinderResponse
  | HunterEmailVerifierResponse
  | HunterEnrichmentResponse
  | HunterEmailCountResponse
```

--------------------------------------------------------------------------------

---[FILE: actions_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/actions_list.ts

```typescript
import type {
  IncidentioActionsListParams,
  IncidentioActionsListResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const actionsListTool: ToolConfig<
  IncidentioActionsListParams,
  IncidentioActionsListResponse
> = {
  id: 'incidentio_actions_list',
  name: 'incident.io Actions List',
  description: 'List actions from incident.io. Optionally filter by incident ID.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    incident_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter actions by incident ID',
    },
    page_size: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of actions to return per page',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.incident.io/v2/actions')

      if (params.incident_id) {
        url.searchParams.append('incident_id', params.incident_id)
      }

      if (params.page_size) {
        url.searchParams.append('page_size', params.page_size.toString())
      }

      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        actions:
          data.actions?.map((action: any) => ({
            id: action.id,
            description: action.description || '',
            assignee: action.assignee
              ? {
                  id: action.assignee.id,
                  name: action.assignee.name,
                  email: action.assignee.email,
                }
              : undefined,
            status: action.status,
            due_at: action.due_at,
            created_at: action.created_at,
            updated_at: action.updated_at,
            incident_id: action.incident_id,
            creator: action.creator
              ? {
                  id: action.creator.id,
                  name: action.creator.name,
                  email: action.creator.email,
                }
              : undefined,
            completed_at: action.completed_at,
            external_issue_reference: action.external_issue_reference
              ? {
                  provider: action.external_issue_reference.provider,
                  issue_name: action.external_issue_reference.issue_name,
                  issue_permalink: action.external_issue_reference.issue_permalink,
                }
              : undefined,
          })) || [],
      },
    }
  },

  outputs: {
    actions: {
      type: 'array',
      description: 'List of actions',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Action ID' },
          description: { type: 'string', description: 'Action description' },
          assignee: {
            type: 'object',
            description: 'Assigned user',
            properties: {
              id: { type: 'string', description: 'User ID' },
              name: { type: 'string', description: 'User name' },
              email: { type: 'string', description: 'User email' },
            },
          },
          status: { type: 'string', description: 'Action status' },
          due_at: { type: 'string', description: 'Due date/time' },
          created_at: { type: 'string', description: 'Creation timestamp' },
          updated_at: { type: 'string', description: 'Last update timestamp' },
          incident_id: { type: 'string', description: 'Associated incident ID' },
          creator: {
            type: 'object',
            description: 'User who created the action',
            properties: {
              id: { type: 'string', description: 'User ID' },
              name: { type: 'string', description: 'User name' },
              email: { type: 'string', description: 'User email' },
            },
          },
          completed_at: { type: 'string', description: 'Completion timestamp' },
          external_issue_reference: {
            type: 'object',
            description: 'External issue tracking reference',
            optional: true,
            properties: {
              provider: {
                type: 'string',
                description: 'Issue tracking provider (e.g., Jira, Linear)',
              },
              issue_name: { type: 'string', description: 'Issue identifier' },
              issue_permalink: { type: 'string', description: 'URL to the external issue' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: actions_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/actions_show.ts

```typescript
import type {
  IncidentioActionsShowParams,
  IncidentioActionsShowResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const actionsShowTool: ToolConfig<
  IncidentioActionsShowParams,
  IncidentioActionsShowResponse
> = {
  id: 'incidentio_actions_show',
  name: 'incident.io Actions Show',
  description: 'Get detailed information about a specific action from incident.io.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Action ID',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/actions/${params.id}`,
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        action: {
          id: data.action.id,
          description: data.action.description || '',
          assignee: data.action.assignee
            ? {
                id: data.action.assignee.id,
                name: data.action.assignee.name,
                email: data.action.assignee.email,
              }
            : undefined,
          status: data.action.status,
          due_at: data.action.due_at,
          created_at: data.action.created_at,
          updated_at: data.action.updated_at,
          incident_id: data.action.incident_id,
          creator: data.action.creator
            ? {
                id: data.action.creator.id,
                name: data.action.creator.name,
                email: data.action.creator.email,
              }
            : undefined,
          completed_at: data.action.completed_at,
          external_issue_reference: data.action.external_issue_reference
            ? {
                provider: data.action.external_issue_reference.provider,
                issue_name: data.action.external_issue_reference.issue_name,
                issue_permalink: data.action.external_issue_reference.issue_permalink,
              }
            : undefined,
        },
      },
    }
  },

  outputs: {
    action: {
      type: 'object',
      description: 'Action details',
      properties: {
        id: { type: 'string', description: 'Action ID' },
        description: { type: 'string', description: 'Action description' },
        assignee: {
          type: 'object',
          description: 'Assigned user',
          properties: {
            id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', description: 'User email' },
          },
        },
        status: { type: 'string', description: 'Action status' },
        due_at: { type: 'string', description: 'Due date/time' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
        incident_id: { type: 'string', description: 'Associated incident ID' },
        creator: {
          type: 'object',
          description: 'User who created the action',
          properties: {
            id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', description: 'User email' },
          },
        },
        completed_at: { type: 'string', description: 'Completion timestamp' },
        external_issue_reference: {
          type: 'object',
          description: 'External issue tracking reference',
          optional: true,
          properties: {
            provider: {
              type: 'string',
              description: 'Issue tracking provider (e.g., Jira, Linear)',
            },
            issue_name: { type: 'string', description: 'Issue identifier' },
            issue_permalink: { type: 'string', description: 'URL to the external issue' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: custom_fields_create.ts]---
Location: sim-main/apps/sim/tools/incidentio/custom_fields_create.ts

```typescript
import type { CustomFieldsCreateParams, CustomFieldsCreateResponse } from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const customFieldsCreateTool: ToolConfig<
  CustomFieldsCreateParams,
  CustomFieldsCreateResponse
> = {
  id: 'incidentio_custom_fields_create',
  name: 'incident.io Custom Fields Create',
  description: 'Create a new custom field in incident.io.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the custom field',
    },
    description: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Description of the custom field (required)',
    },
    field_type: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Type of the custom field (e.g., text, single_select, multi_select, numeric, datetime, link, user, team)',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/custom_fields',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      return {
        name: params.name,
        field_type: params.field_type,
        description: params.description,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        custom_field: {
          id: data.custom_field.id,
          name: data.custom_field.name,
          description: data.custom_field.description,
          field_type: data.custom_field.field_type,
          created_at: data.custom_field.created_at,
          updated_at: data.custom_field.updated_at,
          options: data.custom_field.options,
        },
      },
    }
  },

  outputs: {
    custom_field: {
      type: 'object',
      description: 'Created custom field',
      properties: {
        id: { type: 'string', description: 'Custom field ID' },
        name: { type: 'string', description: 'Custom field name' },
        description: { type: 'string', description: 'Custom field description' },
        field_type: { type: 'string', description: 'Custom field type' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: custom_fields_delete.ts]---
Location: sim-main/apps/sim/tools/incidentio/custom_fields_delete.ts

```typescript
import type { CustomFieldsDeleteParams, CustomFieldsDeleteResponse } from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const customFieldsDeleteTool: ToolConfig<
  CustomFieldsDeleteParams,
  CustomFieldsDeleteResponse
> = {
  id: 'incidentio_custom_fields_delete',
  name: 'incident.io Custom Fields Delete',
  description: 'Delete a custom field from incident.io.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Custom field ID',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/custom_fields/${params.id}`,
    method: 'DELETE',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    return {
      success: true,
      output: {
        message: 'Custom field successfully deleted',
      },
    }
  },

  outputs: {
    message: {
      type: 'string',
      description: 'Success message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: custom_fields_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/custom_fields_list.ts

```typescript
import type { CustomFieldsListParams, CustomFieldsListResponse } from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const customFieldsListTool: ToolConfig<CustomFieldsListParams, CustomFieldsListResponse> = {
  id: 'incidentio_custom_fields_list',
  name: 'incident.io Custom Fields List',
  description: 'List all custom fields from incident.io.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/custom_fields',
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        custom_fields: data.custom_fields.map((field: any) => ({
          id: field.id,
          name: field.name,
          description: field.description,
          field_type: field.field_type,
          created_at: field.created_at,
          updated_at: field.updated_at,
          options: field.options,
        })),
      },
    }
  },

  outputs: {
    custom_fields: {
      type: 'array',
      description: 'List of custom fields',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Custom field ID' },
          name: { type: 'string', description: 'Custom field name' },
          description: { type: 'string', description: 'Custom field description' },
          field_type: { type: 'string', description: 'Custom field type' },
          created_at: { type: 'string', description: 'Creation timestamp' },
          updated_at: { type: 'string', description: 'Last update timestamp' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: custom_fields_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/custom_fields_show.ts

```typescript
import type { CustomFieldsShowParams, CustomFieldsShowResponse } from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const customFieldsShowTool: ToolConfig<CustomFieldsShowParams, CustomFieldsShowResponse> = {
  id: 'incidentio_custom_fields_show',
  name: 'incident.io Custom Fields Show',
  description: 'Get detailed information about a specific custom field from incident.io.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Custom field ID',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/custom_fields/${params.id}`,
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        custom_field: {
          id: data.custom_field.id,
          name: data.custom_field.name,
          description: data.custom_field.description,
          field_type: data.custom_field.field_type,
          created_at: data.custom_field.created_at,
          updated_at: data.custom_field.updated_at,
          options: data.custom_field.options,
        },
      },
    }
  },

  outputs: {
    custom_field: {
      type: 'object',
      description: 'Custom field details',
      properties: {
        id: { type: 'string', description: 'Custom field ID' },
        name: { type: 'string', description: 'Custom field name' },
        description: { type: 'string', description: 'Custom field description' },
        field_type: { type: 'string', description: 'Custom field type' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: custom_fields_update.ts]---
Location: sim-main/apps/sim/tools/incidentio/custom_fields_update.ts

```typescript
import type { CustomFieldsUpdateParams, CustomFieldsUpdateResponse } from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const customFieldsUpdateTool: ToolConfig<
  CustomFieldsUpdateParams,
  CustomFieldsUpdateResponse
> = {
  id: 'incidentio_custom_fields_update',
  name: 'incident.io Custom Fields Update',
  description: 'Update an existing custom field in incident.io.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Custom field ID',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'New name for the custom field (required)',
    },
    description: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'New description for the custom field (required)',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/custom_fields/${params.id}`,
    method: 'PUT',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        name: params.name,
        description: params.description,
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        custom_field: {
          id: data.custom_field.id,
          name: data.custom_field.name,
          description: data.custom_field.description,
          field_type: data.custom_field.field_type,
          created_at: data.custom_field.created_at,
          updated_at: data.custom_field.updated_at,
          options: data.custom_field.options,
        },
      },
    }
  },

  outputs: {
    custom_field: {
      type: 'object',
      description: 'Updated custom field',
      properties: {
        id: { type: 'string', description: 'Custom field ID' },
        name: { type: 'string', description: 'Custom field name' },
        description: { type: 'string', description: 'Custom field description' },
        field_type: { type: 'string', description: 'Custom field type' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: escalations_create.ts]---
Location: sim-main/apps/sim/tools/incidentio/escalations_create.ts

```typescript
import type {
  IncidentioEscalationsCreateParams,
  IncidentioEscalationsCreateResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const escalationsCreateTool: ToolConfig<
  IncidentioEscalationsCreateParams,
  IncidentioEscalationsCreateResponse
> = {
  id: 'incidentio_escalations_create',
  name: 'Create Escalation',
  description: 'Create a new escalation policy in incident.io',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    idempotency_key: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Unique identifier to prevent duplicate escalation creation. Use a UUID or unique string.',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Title of the escalation',
    },
    escalation_path_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'ID of the escalation path to use (required if user_ids not provided)',
    },
    user_ids: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Comma-separated list of user IDs to notify (required if escalation_path_id not provided)',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/escalations',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        idempotency_key: params.idempotency_key,
        title: params.title,
      }

      if (params.escalation_path_id) {
        body.escalation_path_id = params.escalation_path_id
      }

      if (params.user_ids) {
        body.user_ids = params.user_ids.split(',').map((id: string) => id.trim())
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        escalation: data.escalation || data,
      },
    }
  },

  outputs: {
    escalation: {
      type: 'object',
      description: 'The created escalation policy',
      properties: {
        id: { type: 'string', description: 'The escalation policy ID' },
        name: { type: 'string', description: 'The escalation policy name' },
        created_at: { type: 'string', description: 'When the escalation policy was created' },
        updated_at: { type: 'string', description: 'When the escalation policy was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: escalations_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/escalations_list.ts

```typescript
import type {
  IncidentioEscalationsListParams,
  IncidentioEscalationsListResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const escalationsListTool: ToolConfig<
  IncidentioEscalationsListParams,
  IncidentioEscalationsListResponse
> = {
  id: 'incidentio_escalations_list',
  name: 'List Escalations',
  description: 'List all escalation policies in incident.io',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    page_size: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results per page (default: 25)',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.incident.io/v2/escalations')
      if (params.page_size) {
        url.searchParams.append('page_size', params.page_size.toString())
      }
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        escalations: data.escalations || [],
      },
    }
  },

  outputs: {
    escalations: {
      type: 'array',
      description: 'List of escalation policies',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The escalation policy ID' },
          name: { type: 'string', description: 'The escalation policy name' },
          created_at: { type: 'string', description: 'When the escalation policy was created' },
          updated_at: {
            type: 'string',
            description: 'When the escalation policy was last updated',
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: escalations_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/escalations_show.ts

```typescript
import type {
  IncidentioEscalationsShowParams,
  IncidentioEscalationsShowResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const escalationsShowTool: ToolConfig<
  IncidentioEscalationsShowParams,
  IncidentioEscalationsShowResponse
> = {
  id: 'incidentio_escalations_show',
  name: 'Show Escalation',
  description: 'Get details of a specific escalation policy in incident.io',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the escalation policy',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/escalations/${params.id}`,
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        escalation: data.escalation || data,
      },
    }
  },

  outputs: {
    escalation: {
      type: 'object',
      description: 'The escalation policy details',
      properties: {
        id: { type: 'string', description: 'The escalation policy ID' },
        name: { type: 'string', description: 'The escalation policy name' },
        created_at: { type: 'string', description: 'When the escalation policy was created' },
        updated_at: { type: 'string', description: 'When the escalation policy was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
