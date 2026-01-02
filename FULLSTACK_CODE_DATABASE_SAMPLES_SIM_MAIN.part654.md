---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 654
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 654 of 933)

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

---[FILE: contact_bulk_update.ts]---
Location: sim-main/apps/sim/tools/apollo/contact_bulk_update.ts

```typescript
import type {
  ApolloContactBulkUpdateParams,
  ApolloContactBulkUpdateResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloContactBulkUpdateTool: ToolConfig<
  ApolloContactBulkUpdateParams,
  ApolloContactBulkUpdateResponse
> = {
  id: 'apollo_contact_bulk_update',
  name: 'Apollo Bulk Update Contacts',
  description:
    'Update up to 100 existing contacts at once in your Apollo database. Each contact must include an id field. Master key required.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
    contacts: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Array of contacts to update (max 100). Each contact must include id field, and optionally first_name, last_name, email, title, account_id, owner_id',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/contacts/bulk_update',
    method: 'POST',
    headers: (params: ApolloContactBulkUpdateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloContactBulkUpdateParams) => ({
      contacts: params.contacts.slice(0, 100),
    }),
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
        updated_contacts: data.contacts || data.updated_contacts || [],
        failed_contacts: data.failed_contacts || [],
        metadata: {
          total_submitted: data.contacts?.length || 0,
          updated: data.updated_contacts?.length || data.contacts?.length || 0,
          failed: data.failed_contacts?.length || 0,
        },
      },
    }
  },

  outputs: {
    updated_contacts: {
      type: 'json',
      description: 'Array of successfully updated contacts',
    },
    failed_contacts: {
      type: 'json',
      description: 'Array of contacts that failed to update',
    },
    metadata: {
      type: 'json',
      description: 'Bulk update metadata including counts of updated and failed contacts',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: contact_create.ts]---
Location: sim-main/apps/sim/tools/apollo/contact_create.ts

```typescript
import type { ApolloContactCreateParams, ApolloContactCreateResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloContactCreateTool: ToolConfig<
  ApolloContactCreateParams,
  ApolloContactCreateResponse
> = {
  id: 'apollo_contact_create',
  name: 'Apollo Create Contact',
  description: 'Create a new contact in your Apollo database',
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
      required: true,
      visibility: 'user-or-llm',
      description: 'First name of the contact',
    },
    last_name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Last name of the contact',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Email address of the contact',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Job title',
    },
    account_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Apollo account ID to associate with',
    },
    owner_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User ID of the contact owner',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/contacts',
    method: 'POST',
    headers: (params: ApolloContactCreateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloContactCreateParams) => {
      const body: any = {
        first_name: params.first_name,
        last_name: params.last_name,
      }
      if (params.email) body.email = params.email
      if (params.title) body.title = params.title
      if (params.account_id) body.account_id = params.account_id
      if (params.owner_id) body.owner_id = params.owner_id
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
        contact: data.contact || {},
        metadata: {
          created: !!data.contact,
        },
      },
    }
  },

  outputs: {
    contact: { type: 'json', description: 'Created contact data from Apollo' },
    metadata: { type: 'json', description: 'Creation metadata including created status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: contact_search.ts]---
Location: sim-main/apps/sim/tools/apollo/contact_search.ts

```typescript
import type { ApolloContactSearchParams, ApolloContactSearchResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloContactSearchTool: ToolConfig<
  ApolloContactSearchParams,
  ApolloContactSearchResponse
> = {
  id: 'apollo_contact_search',
  name: 'Apollo Search Contacts',
  description: "Search your team's contacts in Apollo",
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    q_keywords: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Keywords to search for',
    },
    contact_stage_ids: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'Filter by contact stage IDs',
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
    url: 'https://api.apollo.io/api/v1/contacts/search',
    method: 'POST',
    headers: (params: ApolloContactSearchParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloContactSearchParams) => {
      const body: any = {
        page: params.page || 1,
        per_page: Math.min(params.per_page || 25, 100),
      }
      if (params.q_keywords) body.q_keywords = params.q_keywords
      if (params.contact_stage_ids?.length) {
        body.contact_stage_ids = params.contact_stage_ids
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
        contacts: data.contacts || [],
        metadata: {
          page: data.pagination?.page || 1,
          per_page: data.pagination?.per_page || 25,
          total_entries: data.pagination?.total_entries || 0,
        },
      },
    }
  },

  outputs: {
    contacts: { type: 'json', description: 'Array of contacts matching the search criteria' },
    metadata: {
      type: 'json',
      description: 'Pagination information including page, per_page, and total_entries',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: contact_update.ts]---
Location: sim-main/apps/sim/tools/apollo/contact_update.ts

```typescript
import type { ApolloContactUpdateParams, ApolloContactUpdateResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloContactUpdateTool: ToolConfig<
  ApolloContactUpdateParams,
  ApolloContactUpdateResponse
> = {
  id: 'apollo_contact_update',
  name: 'Apollo Update Contact',
  description: 'Update an existing contact in your Apollo database',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    contact_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the contact to update',
    },
    first_name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'First name of the contact',
    },
    last_name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Last name of the contact',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Email address',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Job title',
    },
    account_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Apollo account ID',
    },
    owner_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User ID of the contact owner',
    },
  },

  request: {
    url: (params: ApolloContactUpdateParams) =>
      `https://api.apollo.io/api/v1/contacts/${params.contact_id}`,
    method: 'PATCH',
    headers: (params: ApolloContactUpdateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloContactUpdateParams) => {
      const body: any = {}
      if (params.first_name) body.first_name = params.first_name
      if (params.last_name) body.last_name = params.last_name
      if (params.email) body.email = params.email
      if (params.title) body.title = params.title
      if (params.account_id) body.account_id = params.account_id
      if (params.owner_id) body.owner_id = params.owner_id
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
        contact: data.contact || {},
        metadata: {
          updated: !!data.contact,
        },
      },
    }
  },

  outputs: {
    contact: { type: 'json', description: 'Updated contact data from Apollo' },
    metadata: { type: 'json', description: 'Update metadata including updated status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: email_accounts.ts]---
Location: sim-main/apps/sim/tools/apollo/email_accounts.ts

```typescript
import type { ApolloEmailAccountsParams, ApolloEmailAccountsResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloEmailAccountsTool: ToolConfig<
  ApolloEmailAccountsParams,
  ApolloEmailAccountsResponse
> = {
  id: 'apollo_email_accounts',
  name: 'Apollo Get Email Accounts',
  description: "Get list of team's linked email accounts in Apollo",
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/email_accounts',
    method: 'GET',
    headers: (params: ApolloEmailAccountsParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
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
        email_accounts: data.email_accounts || [],
        metadata: {
          total: data.email_accounts?.length || 0,
        },
      },
    }
  },

  outputs: {
    email_accounts: { type: 'json', description: 'Array of team email accounts linked in Apollo' },
    metadata: { type: 'json', description: 'Metadata including total count of email accounts' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/apollo/index.ts

```typescript
export { apolloAccountBulkCreateTool } from './account_bulk_create'
export { apolloAccountBulkUpdateTool } from './account_bulk_update'
export { apolloAccountCreateTool } from './account_create'
export { apolloAccountSearchTool } from './account_search'
export { apolloAccountUpdateTool } from './account_update'
export { apolloContactBulkCreateTool } from './contact_bulk_create'
export { apolloContactBulkUpdateTool } from './contact_bulk_update'
export { apolloContactCreateTool } from './contact_create'
export { apolloContactSearchTool } from './contact_search'
export { apolloContactUpdateTool } from './contact_update'
export { apolloEmailAccountsTool } from './email_accounts'
export { apolloOpportunityCreateTool } from './opportunity_create'
export { apolloOpportunityGetTool } from './opportunity_get'
export { apolloOpportunitySearchTool } from './opportunity_search'
export { apolloOpportunityUpdateTool } from './opportunity_update'
export { apolloOrganizationBulkEnrichTool } from './organization_bulk_enrich'
export { apolloOrganizationEnrichTool } from './organization_enrich'
export { apolloOrganizationSearchTool } from './organization_search'
export { apolloPeopleBulkEnrichTool } from './people_bulk_enrich'
export { apolloPeopleEnrichTool } from './people_enrich'
export { apolloPeopleSearchTool } from './people_search'
export { apolloSequenceAddContactsTool } from './sequence_add_contacts'
export { apolloSequenceSearchTool } from './sequence_search'
export { apolloTaskCreateTool } from './task_create'
export { apolloTaskSearchTool } from './task_search'
export type * from './types'
```

--------------------------------------------------------------------------------

---[FILE: opportunity_create.ts]---
Location: sim-main/apps/sim/tools/apollo/opportunity_create.ts

```typescript
import type {
  ApolloOpportunityCreateParams,
  ApolloOpportunityCreateResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloOpportunityCreateTool: ToolConfig<
  ApolloOpportunityCreateParams,
  ApolloOpportunityCreateResponse
> = {
  id: 'apollo_opportunity_create',
  name: 'Apollo Create Opportunity',
  description: 'Create a new deal for an account in your Apollo database (master key required)',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the opportunity/deal',
    },
    account_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the account this opportunity belongs to',
    },
    amount: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Monetary value of the opportunity',
    },
    stage_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the deal stage',
    },
    owner_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User ID of the opportunity owner',
    },
    close_date: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Expected close date (ISO 8601 format)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description or notes about the opportunity',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/opportunities',
    method: 'POST',
    headers: (params: ApolloOpportunityCreateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloOpportunityCreateParams) => {
      const body: any = {
        name: params.name,
        account_id: params.account_id,
      }
      if (params.amount !== undefined) body.amount = params.amount
      if (params.stage_id) body.stage_id = params.stage_id
      if (params.owner_id) body.owner_id = params.owner_id
      if (params.close_date) body.close_date = params.close_date
      if (params.description) body.description = params.description
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
        opportunity: data.opportunity || {},
        metadata: {
          created: !!data.opportunity,
        },
      },
    }
  },

  outputs: {
    opportunity: { type: 'json', description: 'Created opportunity data from Apollo' },
    metadata: { type: 'json', description: 'Creation metadata including created status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: opportunity_get.ts]---
Location: sim-main/apps/sim/tools/apollo/opportunity_get.ts

```typescript
import type { ApolloOpportunityGetParams, ApolloOpportunityGetResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloOpportunityGetTool: ToolConfig<
  ApolloOpportunityGetParams,
  ApolloOpportunityGetResponse
> = {
  id: 'apollo_opportunity_get',
  name: 'Apollo Get Opportunity',
  description: 'Retrieve complete details of a specific deal/opportunity by ID',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    opportunity_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the opportunity to retrieve',
    },
  },

  request: {
    url: (params: ApolloOpportunityGetParams) =>
      `https://api.apollo.io/api/v1/opportunities/${params.opportunity_id}`,
    method: 'GET',
    headers: (params: ApolloOpportunityGetParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
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
        opportunity: data.opportunity || {},
        metadata: {
          found: !!data.opportunity,
        },
      },
    }
  },

  outputs: {
    opportunity: { type: 'json', description: 'Complete opportunity data from Apollo' },
    metadata: { type: 'json', description: 'Retrieval metadata including found status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: opportunity_search.ts]---
Location: sim-main/apps/sim/tools/apollo/opportunity_search.ts

```typescript
import type {
  ApolloOpportunitySearchParams,
  ApolloOpportunitySearchResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloOpportunitySearchTool: ToolConfig<
  ApolloOpportunitySearchParams,
  ApolloOpportunitySearchResponse
> = {
  id: 'apollo_opportunity_search',
  name: 'Apollo Search Opportunities',
  description: "Search and list all deals/opportunities in your team's Apollo account",
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    q_keywords: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Keywords to search for in opportunity names',
    },
    account_ids: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'Filter by specific account IDs',
    },
    stage_ids: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'Filter by deal stage IDs',
    },
    owner_ids: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'Filter by opportunity owner IDs',
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
    url: 'https://api.apollo.io/api/v1/opportunities/search',
    method: 'POST',
    headers: (params: ApolloOpportunitySearchParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloOpportunitySearchParams) => {
      const body: any = {
        page: params.page || 1,
        per_page: Math.min(params.per_page || 25, 100),
      }
      if (params.q_keywords) body.q_keywords = params.q_keywords
      if (params.account_ids?.length) body.account_ids = params.account_ids
      if (params.stage_ids?.length) body.stage_ids = params.stage_ids
      if (params.owner_ids?.length) body.owner_ids = params.owner_ids
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
        opportunities: data.opportunities || [],
        metadata: {
          page: data.pagination?.page || 1,
          per_page: data.pagination?.per_page || 25,
          total_entries: data.pagination?.total_entries || 0,
        },
      },
    }
  },

  outputs: {
    opportunities: {
      type: 'json',
      description: 'Array of opportunities matching the search criteria',
    },
    metadata: {
      type: 'json',
      description: 'Pagination information including page, per_page, and total_entries',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: opportunity_update.ts]---
Location: sim-main/apps/sim/tools/apollo/opportunity_update.ts

```typescript
import type {
  ApolloOpportunityUpdateParams,
  ApolloOpportunityUpdateResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloOpportunityUpdateTool: ToolConfig<
  ApolloOpportunityUpdateParams,
  ApolloOpportunityUpdateResponse
> = {
  id: 'apollo_opportunity_update',
  name: 'Apollo Update Opportunity',
  description: 'Update an existing deal/opportunity in your Apollo database',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    opportunity_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the opportunity to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Name of the opportunity/deal',
    },
    amount: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Monetary value of the opportunity',
    },
    stage_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the deal stage',
    },
    owner_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User ID of the opportunity owner',
    },
    close_date: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Expected close date (ISO 8601 format)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description or notes about the opportunity',
    },
  },

  request: {
    url: (params: ApolloOpportunityUpdateParams) =>
      `https://api.apollo.io/api/v1/opportunities/${params.opportunity_id}`,
    method: 'PATCH',
    headers: (params: ApolloOpportunityUpdateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloOpportunityUpdateParams) => {
      const body: any = {}
      if (params.name) body.name = params.name
      if (params.amount !== undefined) body.amount = params.amount
      if (params.stage_id) body.stage_id = params.stage_id
      if (params.owner_id) body.owner_id = params.owner_id
      if (params.close_date) body.close_date = params.close_date
      if (params.description) body.description = params.description
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
        opportunity: data.opportunity || {},
        metadata: {
          updated: !!data.opportunity,
        },
      },
    }
  },

  outputs: {
    opportunity: { type: 'json', description: 'Updated opportunity data from Apollo' },
    metadata: { type: 'json', description: 'Update metadata including updated status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: organization_bulk_enrich.ts]---
Location: sim-main/apps/sim/tools/apollo/organization_bulk_enrich.ts

```typescript
import type {
  ApolloOrganizationBulkEnrichParams,
  ApolloOrganizationBulkEnrichResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloOrganizationBulkEnrichTool: ToolConfig<
  ApolloOrganizationBulkEnrichParams,
  ApolloOrganizationBulkEnrichResponse
> = {
  id: 'apollo_organization_bulk_enrich',
  name: 'Apollo Bulk Organization Enrichment',
  description: 'Enrich data for up to 10 organizations at once using Apollo',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    organizations: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of organizations to enrich (max 10)',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/organizations/bulk_enrich',
    method: 'POST',
    headers: (params: ApolloOrganizationBulkEnrichParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloOrganizationBulkEnrichParams) => ({
      details: params.organizations.slice(0, 10),
    }),
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
        organizations: data.matches || [],
        metadata: {
          total: data.matches?.length || 0,
          enriched: data.matches?.filter((o: any) => o).length || 0,
        },
      },
    }
  },

  outputs: {
    organizations: { type: 'json', description: 'Array of enriched organization data' },
    metadata: {
      type: 'json',
      description: 'Bulk enrichment metadata including total and enriched counts',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: organization_enrich.ts]---
Location: sim-main/apps/sim/tools/apollo/organization_enrich.ts

```typescript
import type {
  ApolloOrganizationEnrichParams,
  ApolloOrganizationEnrichResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloOrganizationEnrichTool: ToolConfig<
  ApolloOrganizationEnrichParams,
  ApolloOrganizationEnrichResponse
> = {
  id: 'apollo_organization_enrich',
  name: 'Apollo Organization Enrichment',
  description: 'Enrich data for a single organization using Apollo',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    organization_name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Name of the organization (at least one of organization_name or domain is required)',
    },
    domain: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Company domain (e.g., apollo.io) (at least one of domain or organization_name is required)',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/organizations/enrich',
    method: 'POST',
    headers: (params: ApolloOrganizationEnrichParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloOrganizationEnrichParams) => {
      // At least one identifier is required
      if (!params.organization_name && !params.domain) {
        throw new Error(
          'At least one of organization_name or domain is required for organization enrichment'
        )
      }

      const body: any = {}
      if (params.organization_name) body.name = params.organization_name
      if (params.domain) body.domain = params.domain
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
        organization: data.organization || {},
        metadata: {
          enriched: !!data.organization,
        },
      },
    }
  },

  outputs: {
    organization: { type: 'json', description: 'Enriched organization data from Apollo' },
    metadata: { type: 'json', description: 'Enrichment metadata including enriched status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: organization_search.ts]---
Location: sim-main/apps/sim/tools/apollo/organization_search.ts

```typescript
import type {
  ApolloOrganizationSearchParams,
  ApolloOrganizationSearchResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloOrganizationSearchTool: ToolConfig<
  ApolloOrganizationSearchParams,
  ApolloOrganizationSearchResponse
> = {
  id: 'apollo_organization_search',
  name: 'Apollo Organization Search',
  description: "Search Apollo's database for companies using filters",
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    organization_locations: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company locations to search',
    },
    organization_num_employees_ranges: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Employee count ranges (e.g., ["1-10", "11-50"])',
    },
    q_organization_keyword_tags: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Industry or keyword tags',
    },
    q_organization_name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Organization name to search for',
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
    url: 'https://api.apollo.io/api/v1/mixed_companies/search',
    method: 'POST',
    headers: (params: ApolloOrganizationSearchParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloOrganizationSearchParams) => {
      const body: any = {
        page: params.page || 1,
        per_page: Math.min(params.per_page || 25, 100),
      }

      if (params.organization_locations?.length) {
        body.organization_locations = params.organization_locations
      }
      if (params.organization_num_employees_ranges?.length) {
        body.organization_num_employees_ranges = params.organization_num_employees_ranges
      }
      if (params.q_organization_keyword_tags?.length) {
        body.q_organization_keyword_tags = params.q_organization_keyword_tags
      }
      if (params.q_organization_name) {
        body.q_organization_name = params.q_organization_name
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
        organizations: data.organizations || [],
        metadata: {
          page: data.pagination?.page || 1,
          per_page: data.pagination?.per_page || 25,
          total_entries: data.pagination?.total_entries || 0,
        },
      },
    }
  },

  outputs: {
    organizations: {
      type: 'json',
      description: 'Array of organizations matching the search criteria',
    },
    metadata: {
      type: 'json',
      description: 'Pagination information including page, per_page, and total_entries',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: people_bulk_enrich.ts]---
Location: sim-main/apps/sim/tools/apollo/people_bulk_enrich.ts

```typescript
import type {
  ApolloPeopleBulkEnrichParams,
  ApolloPeopleBulkEnrichResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloPeopleBulkEnrichTool: ToolConfig<
  ApolloPeopleBulkEnrichParams,
  ApolloPeopleBulkEnrichResponse
> = {
  id: 'apollo_people_bulk_enrich',
  name: 'Apollo Bulk People Enrichment',
  description: 'Enrich data for up to 10 people at once using Apollo',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    people: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of people to enrich (max 10)',
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
    url: 'https://api.apollo.io/api/v1/people/bulk_match',
    method: 'POST',
    headers: (params: ApolloPeopleBulkEnrichParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloPeopleBulkEnrichParams) => ({
      details: params.people.slice(0, 10),
      reveal_personal_emails: params.reveal_personal_emails,
      reveal_phone_number: params.reveal_phone_number,
    }),
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
        people: data.matches || [],
        metadata: {
          total: data.matches?.length || 0,
          enriched: data.matches?.filter((p: any) => p).length || 0,
        },
      },
    }
  },

  outputs: {
    people: { type: 'json', description: 'Array of enriched people data' },
    metadata: {
      type: 'json',
      description: 'Bulk enrichment metadata including total and enriched counts',
    },
  },
}
```

--------------------------------------------------------------------------------

````
