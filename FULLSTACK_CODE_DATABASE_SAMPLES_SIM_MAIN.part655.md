---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 655
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 655 of 933)

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

---[FILE: people_enrich.ts]---
Location: sim-main/apps/sim/tools/apollo/people_enrich.ts

```typescript
import type { ApolloPeopleEnrichParams, ApolloPeopleEnrichResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloPeopleEnrichTool: ToolConfig<
  ApolloPeopleEnrichParams,
  ApolloPeopleEnrichResponse
> = {
  id: 'apollo_people_enrich',
  name: 'Apollo People Enrichment',
  description: 'Enrich data for a single person using Apollo',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    first_name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'First name of the person',
    },
    last_name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Last name of the person',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Email address of the person',
    },
    organization_name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company name where the person works',
    },
    domain: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company domain (e.g., apollo.io)',
    },
    linkedin_url: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'LinkedIn profile URL',
    },
    reveal_personal_emails: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Reveal personal email addresses (uses credits)',
    },
    reveal_phone_number: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Reveal phone numbers (uses credits)',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/people/match',
    method: 'POST',
    headers: (params: ApolloPeopleEnrichParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloPeopleEnrichParams) => {
      const body: any = {}

      if (params.first_name) body.first_name = params.first_name
      if (params.last_name) body.last_name = params.last_name
      if (params.email) body.email = params.email
      if (params.organization_name) body.organization_name = params.organization_name
      if (params.domain) body.domain = params.domain
      if (params.linkedin_url) body.linkedin_url = params.linkedin_url
      if (params.reveal_personal_emails !== undefined) {
        body.reveal_personal_emails = params.reveal_personal_emails
      }
      if (params.reveal_phone_number !== undefined) {
        body.reveal_phone_number = params.reveal_phone_number
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        person: data.person || {},
        metadata: {
          enriched: !!data.person,
        },
      },
    }
  },

  outputs: {
    person: { type: 'json', description: 'Enriched person data from Apollo' },
    metadata: { type: 'json', description: 'Enrichment metadata including enriched status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: people_search.ts]---
Location: sim-main/apps/sim/tools/apollo/people_search.ts

```typescript
import type { ApolloPeopleSearchParams, ApolloPeopleSearchResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloPeopleSearchTool: ToolConfig<
  ApolloPeopleSearchParams,
  ApolloPeopleSearchResponse
> = {
  id: 'apollo_people_search',
  name: 'Apollo People Search',
  description: "Search Apollo's database for people using demographic filters",
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    person_titles: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Job titles to search for (e.g., ["CEO", "VP of Sales"])',
    },
    person_locations: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Locations to search in (e.g., ["San Francisco, CA", "New York, NY"])',
    },
    person_seniorities: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Seniority levels (e.g., ["senior", "executive", "manager"])',
    },
    organization_names: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company names to search within',
    },
    q_keywords: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Keywords to search for',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number for pagination (default: 1)',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Results per page (default: 25, max: 100)',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/mixed_people/search',
    method: 'POST',
    headers: (params: ApolloPeopleSearchParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloPeopleSearchParams) => {
      const body: any = {
        page: params.page || 1,
        per_page: Math.min(params.per_page || 25, 100),
      }

      if (params.person_titles && params.person_titles.length > 0) {
        body.person_titles = params.person_titles
      }
      if (params.person_locations && params.person_locations.length > 0) {
        body.person_locations = params.person_locations
      }
      if (params.person_seniorities && params.person_seniorities.length > 0) {
        body.person_seniorities = params.person_seniorities
      }
      if (params.organization_names && params.organization_names.length > 0) {
        body.organization_names = params.organization_names
      }
      if (params.q_keywords) {
        body.q_keywords = params.q_keywords
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        people: data.people || [],
        metadata: {
          page: data.pagination?.page || 1,
          per_page: data.pagination?.per_page || 25,
          total_entries: data.pagination?.total_entries || 0,
        },
      },
    }
  },

  outputs: {
    people: { type: 'json', description: 'Array of people matching the search criteria' },
    metadata: {
      type: 'json',
      description: 'Pagination information including page, per_page, and total_entries',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: sequence_add_contacts.ts]---
Location: sim-main/apps/sim/tools/apollo/sequence_add_contacts.ts

```typescript
import type {
  ApolloSequenceAddContactsParams,
  ApolloSequenceAddContactsResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloSequenceAddContactsTool: ToolConfig<
  ApolloSequenceAddContactsParams,
  ApolloSequenceAddContactsResponse
> = {
  id: 'apollo_sequence_add_contacts',
  name: 'Apollo Add Contacts to Sequence',
  description: 'Add contacts to an Apollo sequence',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
    sequence_id: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the sequence to add contacts to',
    },
    contact_ids: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of contact IDs to add to the sequence',
    },
    emailer_campaign_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Optional emailer campaign ID',
    },
    send_email_from_user_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User ID to send emails from',
    },
  },

  request: {
    url: (params: ApolloSequenceAddContactsParams) =>
      `https://api.apollo.io/api/v1/emailer_campaigns/${params.sequence_id}/add_contact_ids`,
    method: 'POST',
    headers: (params: ApolloSequenceAddContactsParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloSequenceAddContactsParams) => {
      const body: any = {
        contact_ids: params.contact_ids,
      }
      if (params.emailer_campaign_id) {
        body.emailer_campaign_id = params.emailer_campaign_id
      }
      if (params.send_email_from_user_id) {
        body.send_email_from_user_id = params.send_email_from_user_id
      }
      return body
    },
  },

  transformResponse: async (response: Response, params?: ApolloSequenceAddContactsParams) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        contacts_added: data.contacts || params?.contact_ids || [],
        metadata: {
          sequence_id: params?.sequence_id || '',
          total_added: data.contacts?.length || params?.contact_ids?.length || 0,
        },
      },
    }
  },

  outputs: {
    contacts_added: { type: 'json', description: 'Array of contact IDs added to the sequence' },
    metadata: {
      type: 'json',
      description: 'Sequence metadata including sequence_id and total_added count',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: sequence_search.ts]---
Location: sim-main/apps/sim/tools/apollo/sequence_search.ts

```typescript
import type { ApolloSequenceSearchParams, ApolloSequenceSearchResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloSequenceSearchTool: ToolConfig<
  ApolloSequenceSearchParams,
  ApolloSequenceSearchResponse
> = {
  id: 'apollo_sequence_search',
  name: 'Apollo Search Sequences',
  description: "Search for sequences/campaigns in your team's Apollo account (master key required)",
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
    q_name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search sequences by name',
    },
    active: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by active status (true for active sequences, false for inactive)',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number for pagination',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Results per page (max: 100)',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/emailer_campaigns/search',
    method: 'POST',
    headers: (params: ApolloSequenceSearchParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloSequenceSearchParams) => {
      const body: any = {
        page: params.page || 1,
        per_page: Math.min(params.per_page || 25, 100),
      }
      if (params.q_name) body.q_name = params.q_name
      if (params.active !== undefined) body.active = params.active
      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        sequences: data.emailer_campaigns || [],
        metadata: {
          page: data.pagination?.page || 1,
          per_page: data.pagination?.per_page || 25,
          total_entries: data.pagination?.total_entries || 0,
        },
      },
    }
  },

  outputs: {
    sequences: {
      type: 'json',
      description: 'Array of sequences/campaigns matching the search criteria',
    },
    metadata: {
      type: 'json',
      description: 'Pagination information including page, per_page, and total_entries',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: task_create.ts]---
Location: sim-main/apps/sim/tools/apollo/task_create.ts

```typescript
import type { ApolloTaskCreateParams, ApolloTaskCreateResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloTaskCreateTool: ToolConfig<ApolloTaskCreateParams, ApolloTaskCreateResponse> = {
  id: 'apollo_task_create',
  name: 'Apollo Create Task',
  description: 'Create a new task in Apollo',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
    note: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Task note/description',
    },
    contact_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Contact ID to associate with',
    },
    account_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Account ID to associate with',
    },
    due_at: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Due date in ISO format',
    },
    priority: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Task priority',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Task type',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/tasks/bulk_create',
    method: 'POST',
    headers: (params: ApolloTaskCreateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloTaskCreateParams) => {
      const body: any = { note: params.note }
      if (params.contact_id) body.contact_id = params.contact_id
      if (params.account_id) body.account_id = params.account_id
      if (params.due_at) body.due_at = params.due_at
      if (params.priority) body.priority = params.priority
      if (params.type) body.type = params.type
      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // Apollo's task creation endpoint currently only returns true, not the task object
    // Return the request params as the task data since the API doesn't return it
    return {
      success: true,
      output: {
        task: data.task || {
          note: '',
          created: true,
          message: 'Task created successfully. Apollo API does not return task details.',
        },
        metadata: {
          created: data === true || !!data.task,
        },
      },
    }
  },

  outputs: {
    task: { type: 'json', description: 'Created task data from Apollo' },
    metadata: { type: 'json', description: 'Creation metadata including created status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: task_search.ts]---
Location: sim-main/apps/sim/tools/apollo/task_search.ts

```typescript
import type { ApolloTaskSearchParams, ApolloTaskSearchResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloTaskSearchTool: ToolConfig<ApolloTaskSearchParams, ApolloTaskSearchResponse> = {
  id: 'apollo_task_search',
  name: 'Apollo Search Tasks',
  description: 'Search for tasks in Apollo',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
    contact_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by contact ID',
    },
    account_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by account ID',
    },
    completed: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by completion status',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number for pagination',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Results per page (max: 100)',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/tasks/search',
    method: 'POST',
    headers: (params: ApolloTaskSearchParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloTaskSearchParams) => {
      const body: any = {
        page: params.page || 1,
        per_page: Math.min(params.per_page || 25, 100),
      }
      if (params.contact_id) body.contact_id = params.contact_id
      if (params.account_id) body.account_id = params.account_id
      if (params.completed !== undefined) body.completed = params.completed
      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        tasks: data.tasks || [],
        metadata: {
          page: data.pagination?.page || 1,
          per_page: data.pagination?.per_page || 25,
          total_entries: data.pagination?.total_entries || 0,
        },
      },
    }
  },

  outputs: {
    tasks: { type: 'json', description: 'Array of tasks matching the search criteria' },
    metadata: {
      type: 'json',
      description: 'Pagination information including page, per_page, and total_entries',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/apollo/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Common types
export interface ApolloPerson {
  id: string
  first_name: string
  last_name: string
  name: string
  title: string
  email: string
  organization_name?: string
  linkedin_url?: string
  phone_numbers?: Array<{
    raw_number: string
    sanitized_number: string
    type: string
  }>
}

export interface ApolloOrganization {
  id: string
  name: string
  website_url?: string
  linkedin_url?: string
  industry?: string
  phone?: string
  employees?: number
  founded_year?: number
}

export interface ApolloContact {
  id: string
  first_name: string
  last_name: string
  email: string
  title?: string
  account_id?: string
  owner_id?: string
  created_at: string
}

export interface ApolloAccount {
  id: string
  name: string
  website_url?: string
  phone?: string
  owner_id?: string
  created_at: string
}

export interface ApolloTask {
  id: string
  note: string
  contact_id?: string
  account_id?: string
  due_at?: string
  completed: boolean
  created_at: string
}

export interface ApolloOpportunity {
  id: string
  name: string
  account_id: string
  amount?: number
  stage_id?: string
  owner_id?: string
  close_date?: string
  description?: string
  created_at: string
}

interface ApolloBaseParams {
  apiKey: string
}

// People Search Types
export interface ApolloPeopleSearchParams extends ApolloBaseParams {
  person_titles?: string[]
  person_locations?: string[]
  person_seniorities?: string[]
  organization_ids?: string[]
  organization_names?: string[]
  q_keywords?: string
  page?: number
  per_page?: number
}

export interface ApolloPeopleSearchResponse extends ToolResponse {
  output: {
    people: ApolloPerson[]
    metadata: {
      page: number
      per_page: number
      total_entries: number
    }
  }
}

// People Enrichment Types
export interface ApolloPeopleEnrichParams extends ApolloBaseParams {
  first_name?: string
  last_name?: string
  organization_name?: string
  email?: string
  domain?: string
  linkedin_url?: string
  reveal_personal_emails?: boolean
  reveal_phone_number?: boolean
}

export interface ApolloPeopleEnrichResponse extends ToolResponse {
  output: {
    person: ApolloPerson
    metadata: {
      enriched: boolean
    }
  }
}

// Bulk People Enrichment Types
export interface ApolloPeopleBulkEnrichParams extends ApolloBaseParams {
  people: Array<{
    first_name?: string
    last_name?: string
    organization_name?: string
    email?: string
    domain?: string
  }>
  reveal_personal_emails?: boolean
  reveal_phone_number?: boolean
}

export interface ApolloPeopleBulkEnrichResponse extends ToolResponse {
  output: {
    people: ApolloPerson[]
    metadata: {
      total: number
      enriched: number
    }
  }
}

// Organization Search Types
export interface ApolloOrganizationSearchParams extends ApolloBaseParams {
  organization_locations?: string[]
  organization_num_employees_ranges?: string[]
  q_organization_keyword_tags?: string[]
  q_organization_name?: string
  page?: number
  per_page?: number
}

export interface ApolloOrganizationSearchResponse extends ToolResponse {
  output: {
    organizations: ApolloOrganization[]
    metadata: {
      page: number
      per_page: number
      total_entries: number
    }
  }
}

// Organization Enrichment Types
export interface ApolloOrganizationEnrichParams extends ApolloBaseParams {
  organization_name?: string
  domain?: string
}

export interface ApolloOrganizationEnrichResponse extends ToolResponse {
  output: {
    organization: ApolloOrganization
    metadata: {
      enriched: boolean
    }
  }
}

// Bulk Organization Enrichment Types
export interface ApolloOrganizationBulkEnrichParams extends ApolloBaseParams {
  organizations: Array<{
    organization_name?: string
    domain?: string
  }>
}

export interface ApolloOrganizationBulkEnrichResponse extends ToolResponse {
  output: {
    organizations: ApolloOrganization[]
    metadata: {
      total: number
      enriched: number
    }
  }
}

// Contact Create Types
export interface ApolloContactCreateParams extends ApolloBaseParams {
  first_name: string
  last_name: string
  email?: string
  title?: string
  account_id?: string
  owner_id?: string
}

export interface ApolloContactCreateResponse extends ToolResponse {
  output: {
    contact: ApolloContact
    metadata: {
      created: boolean
    }
  }
}

// Contact Update Types
export interface ApolloContactUpdateParams extends ApolloBaseParams {
  contact_id: string
  first_name?: string
  last_name?: string
  email?: string
  title?: string
  account_id?: string
  owner_id?: string
}

export interface ApolloContactUpdateResponse extends ToolResponse {
  output: {
    contact: ApolloContact
    metadata: {
      updated: boolean
    }
  }
}

// Contact Bulk Create Types
export interface ApolloContactBulkCreateParams extends ApolloBaseParams {
  contacts: Array<{
    first_name: string
    last_name: string
    email?: string
    title?: string
    account_id?: string
    owner_id?: string
  }>
  run_dedupe?: boolean
}

export interface ApolloContactBulkCreateResponse extends ToolResponse {
  output: {
    created_contacts: ApolloContact[]
    existing_contacts: ApolloContact[]
    metadata: {
      total_submitted: number
      created: number
      existing: number
    }
  }
}

// Contact Bulk Update Types
export interface ApolloContactBulkUpdateParams extends ApolloBaseParams {
  contacts: Array<{
    id: string
    first_name?: string
    last_name?: string
    email?: string
    title?: string
    account_id?: string
    owner_id?: string
  }>
}

export interface ApolloContactBulkUpdateResponse extends ToolResponse {
  output: {
    updated_contacts: ApolloContact[]
    failed_contacts: Array<{ id: string; error: string }>
    metadata: {
      total_submitted: number
      updated: number
      failed: number
    }
  }
}

// Contact Search Types
export interface ApolloContactSearchParams extends ApolloBaseParams {
  q_keywords?: string
  contact_stage_ids?: string[]
  page?: number
  per_page?: number
}

export interface ApolloContactSearchResponse extends ToolResponse {
  output: {
    contacts: ApolloContact[]
    metadata: {
      page: number
      per_page: number
      total_entries: number
    }
  }
}

// Account Create Types
export interface ApolloAccountCreateParams extends ApolloBaseParams {
  name: string
  website_url?: string
  phone?: string
  owner_id?: string
}

export interface ApolloAccountCreateResponse extends ToolResponse {
  output: {
    account: ApolloAccount
    metadata: {
      created: boolean
    }
  }
}

// Account Update Types
export interface ApolloAccountUpdateParams extends ApolloBaseParams {
  account_id: string
  name?: string
  website_url?: string
  phone?: string
  owner_id?: string
}

export interface ApolloAccountUpdateResponse extends ToolResponse {
  output: {
    account: ApolloAccount
    metadata: {
      updated: boolean
    }
  }
}

// Account Search Types
export interface ApolloAccountSearchParams extends ApolloBaseParams {
  q_keywords?: string
  owner_id?: string
  account_stage_ids?: string[]
  page?: number
  per_page?: number
}

export interface ApolloAccountSearchResponse extends ToolResponse {
  output: {
    accounts: ApolloAccount[]
    metadata: {
      page: number
      per_page: number
      total_entries: number
    }
  }
}

// Account Bulk Create Types
export interface ApolloAccountBulkCreateParams extends ApolloBaseParams {
  accounts: Array<{
    name: string
    website_url?: string
    phone?: string
    owner_id?: string
  }>
}

export interface ApolloAccountBulkCreateResponse extends ToolResponse {
  output: {
    created_accounts: ApolloAccount[]
    failed_accounts: Array<{ name: string; error: string }>
    metadata: {
      total_submitted: number
      created: number
      failed: number
    }
  }
}

// Account Bulk Update Types
export interface ApolloAccountBulkUpdateParams extends ApolloBaseParams {
  accounts: Array<{
    id: string
    name?: string
    website_url?: string
    phone?: string
    owner_id?: string
  }>
}

export interface ApolloAccountBulkUpdateResponse extends ToolResponse {
  output: {
    updated_accounts: ApolloAccount[]
    failed_accounts: Array<{ id: string; error: string }>
    metadata: {
      total_submitted: number
      updated: number
      failed: number
    }
  }
}

// Sequence Add Contacts Types
export interface ApolloSequenceAddContactsParams extends ApolloBaseParams {
  sequence_id: string
  contact_ids: string[]
  emailer_campaign_id?: string
  send_email_from_user_id?: string
}

export interface ApolloSequenceAddContactsResponse extends ToolResponse {
  output: {
    contacts_added: string[]
    metadata: {
      sequence_id: string
      total_added: number
    }
  }
}

// Task Create Types
export interface ApolloTaskCreateParams extends ApolloBaseParams {
  note: string
  contact_id?: string
  account_id?: string
  due_at?: string
  priority?: string
  type?: string
}

export interface ApolloTaskCreateResponse extends ToolResponse {
  output: {
    task: ApolloTask
    metadata: {
      created: boolean
    }
  }
}

// Task Search Types
export interface ApolloTaskSearchParams extends ApolloBaseParams {
  contact_id?: string
  account_id?: string
  completed?: boolean
  page?: number
  per_page?: number
}

export interface ApolloTaskSearchResponse extends ToolResponse {
  output: {
    tasks: ApolloTask[]
    metadata: {
      page: number
      per_page: number
      total_entries: number
    }
  }
}

// Email Accounts List Types
export interface ApolloEmailAccountsParams extends ApolloBaseParams {}

export interface ApolloEmailAccountsResponse extends ToolResponse {
  output: {
    email_accounts: Array<{
      id: string
      email: string
      active: boolean
    }>
    metadata: {
      total: number
    }
  }
}

// Opportunity Create Types
export interface ApolloOpportunityCreateParams extends ApolloBaseParams {
  name: string
  account_id: string
  amount?: number
  stage_id?: string
  owner_id?: string
  close_date?: string
  description?: string
}

export interface ApolloOpportunityCreateResponse extends ToolResponse {
  output: {
    opportunity: ApolloOpportunity
    metadata: {
      created: boolean
    }
  }
}

// Opportunity Search Types
export interface ApolloOpportunitySearchParams extends ApolloBaseParams {
  q_keywords?: string
  account_ids?: string[]
  stage_ids?: string[]
  owner_ids?: string[]
  page?: number
  per_page?: number
}

export interface ApolloOpportunitySearchResponse extends ToolResponse {
  output: {
    opportunities: ApolloOpportunity[]
    metadata: {
      page: number
      per_page: number
      total_entries: number
    }
  }
}

// Opportunity Get Types
export interface ApolloOpportunityGetParams extends ApolloBaseParams {
  opportunity_id: string
}

export interface ApolloOpportunityGetResponse extends ToolResponse {
  output: {
    opportunity: ApolloOpportunity
    metadata: {
      found: boolean
    }
  }
}

// Opportunity Update Types
export interface ApolloOpportunityUpdateParams extends ApolloBaseParams {
  opportunity_id: string
  name?: string
  amount?: number
  stage_id?: string
  owner_id?: string
  close_date?: string
  description?: string
}

export interface ApolloOpportunityUpdateResponse extends ToolResponse {
  output: {
    opportunity: ApolloOpportunity
    metadata: {
      updated: boolean
    }
  }
}

// Sequence/Campaign Types
export interface ApolloSequence {
  id: string
  name: string
  active: boolean
  num_steps?: number
  num_contacts?: number
  created_at: string
  updated_at?: string
  user_id?: string
  permissions?: string
}

// Sequence Search Types
export interface ApolloSequenceSearchParams extends ApolloBaseParams {
  q_name?: string
  active?: boolean
  page?: number
  per_page?: number
}

export interface ApolloSequenceSearchResponse extends ToolResponse {
  output: {
    sequences: ApolloSequence[]
    metadata: {
      page: number
      per_page: number
      total_entries: number
    }
  }
}

// Union type for all Apollo responses
export type ApolloResponse =
  | ApolloPeopleSearchResponse
  | ApolloPeopleEnrichResponse
  | ApolloPeopleBulkEnrichResponse
  | ApolloOrganizationSearchResponse
  | ApolloOrganizationEnrichResponse
  | ApolloOrganizationBulkEnrichResponse
  | ApolloContactCreateResponse
  | ApolloContactUpdateResponse
  | ApolloContactBulkCreateResponse
  | ApolloContactBulkUpdateResponse
  | ApolloContactSearchResponse
  | ApolloAccountCreateResponse
  | ApolloAccountUpdateResponse
  | ApolloAccountSearchResponse
  | ApolloAccountBulkCreateResponse
  | ApolloAccountBulkUpdateResponse
  | ApolloSequenceAddContactsResponse
  | ApolloTaskCreateResponse
  | ApolloTaskSearchResponse
  | ApolloEmailAccountsResponse
  | ApolloSequenceSearchResponse
  | ApolloOpportunityCreateResponse
  | ApolloOpportunitySearchResponse
  | ApolloOpportunityGetResponse
  | ApolloOpportunityUpdateResponse
```

--------------------------------------------------------------------------------

---[FILE: get_author_papers.ts]---
Location: sim-main/apps/sim/tools/arxiv/get_author_papers.ts

```typescript
import type { ArxivGetAuthorPapersParams, ArxivGetAuthorPapersResponse } from '@/tools/arxiv/types'
import { extractTotalResults, parseArxivXML } from '@/tools/arxiv/utils'
import type { ToolConfig } from '@/tools/types'

export const getAuthorPapersTool: ToolConfig<
  ArxivGetAuthorPapersParams,
  ArxivGetAuthorPapersResponse
> = {
  id: 'arxiv_get_author_papers',
  name: 'ArXiv Get Author Papers',
  description: 'Search for papers by a specific author on ArXiv.',
  version: '1.0.0',

  params: {
    authorName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Author name to search for',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 10, max: 2000)',
    },
  },

  request: {
    url: (params: ArxivGetAuthorPapersParams) => {
      const baseUrl = 'https://export.arxiv.org/api/query'
      const searchParams = new URLSearchParams()

      searchParams.append('search_query', `au:"${params.authorName}"`)
      searchParams.append(
        'max_results',
        (params.maxResults ? Math.min(Number(params.maxResults), 2000) : 10).toString()
      )
      searchParams.append('sortBy', 'submittedDate')
      searchParams.append('sortOrder', 'descending')

      return `${baseUrl}?${searchParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/xml',
    }),
  },

  transformResponse: async (response: Response) => {
    const xmlText = await response.text()

    // Parse XML response
    const papers = parseArxivXML(xmlText)
    const totalResults = extractTotalResults(xmlText)

    return {
      success: true,
      output: {
        authorPapers: papers,
        totalResults,
        authorName: '', // Will be filled by the calling code
      },
    }
  },

  outputs: {
    authorPapers: {
      type: 'json',
      description: 'Array of papers authored by the specified author',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          summary: { type: 'string' },
          authors: { type: 'string' },
          published: { type: 'string' },
          updated: { type: 'string' },
          link: { type: 'string' },
          pdfLink: { type: 'string' },
          categories: { type: 'string' },
          primaryCategory: { type: 'string' },
          comment: { type: 'string' },
          journalRef: { type: 'string' },
          doi: { type: 'string' },
        },
      },
    },
    totalResults: {
      type: 'number',
      description: 'Total number of papers found for the author',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_paper.ts]---
Location: sim-main/apps/sim/tools/arxiv/get_paper.ts

```typescript
import type { ArxivGetPaperParams, ArxivGetPaperResponse } from '@/tools/arxiv/types'
import { parseArxivXML } from '@/tools/arxiv/utils'
import type { ToolConfig } from '@/tools/types'

export const getPaperTool: ToolConfig<ArxivGetPaperParams, ArxivGetPaperResponse> = {
  id: 'arxiv_get_paper',
  name: 'ArXiv Get Paper',
  description: 'Get detailed information about a specific ArXiv paper by its ID.',
  version: '1.0.0',

  params: {
    paperId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ArXiv paper ID (e.g., "1706.03762")',
    },
  },

  request: {
    url: (params: ArxivGetPaperParams) => {
      // Clean paper ID - remove arxiv.org URLs if present
      let paperId = params.paperId
      if (paperId.includes('arxiv.org/abs/')) {
        paperId = paperId.split('arxiv.org/abs/')[1]
      }

      const baseUrl = 'https://export.arxiv.org/api/query'
      const searchParams = new URLSearchParams()
      searchParams.append('id_list', paperId)

      return `${baseUrl}?${searchParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/xml',
    }),
  },

  transformResponse: async (response: Response) => {
    const xmlText = await response.text()
    const papers = parseArxivXML(xmlText)

    return {
      success: true,
      output: {
        paper: papers[0] || null,
      },
    }
  },

  outputs: {
    paper: {
      type: 'json',
      description: 'Detailed information about the requested ArXiv paper',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          summary: { type: 'string' },
          authors: { type: 'string' },
          published: { type: 'string' },
          updated: { type: 'string' },
          link: { type: 'string' },
          pdfLink: { type: 'string' },
          categories: { type: 'string' },
          primaryCategory: { type: 'string' },
          comment: { type: 'string' },
          journalRef: { type: 'string' },
          doi: { type: 'string' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/arxiv/index.ts

```typescript
import { getAuthorPapersTool } from '@/tools/arxiv/get_author_papers'
import { getPaperTool } from '@/tools/arxiv/get_paper'
import { searchTool } from '@/tools/arxiv/search'

export const arxivSearchTool = searchTool
export const arxivGetPaperTool = getPaperTool
export const arxivGetAuthorPapersTool = getAuthorPapersTool
```

--------------------------------------------------------------------------------

````
