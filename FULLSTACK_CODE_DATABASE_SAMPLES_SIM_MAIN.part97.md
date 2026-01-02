---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 97
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 97 of 933)

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

---[FILE: zendesk.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/zendesk.mdx

```text
---
title: Zendesk
description: Manage support tickets, users, and organizations in Zendesk
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zendesk"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zendesk](https://www.zendesk.com/) is a leading customer service and support platform that empowers organizations to efficiently manage support tickets, users, and organizations through a robust set of tools and APIs. The Zendesk integration in Sim lets your agents automate key support operations and synchronize your support data with the rest of your workflow.

With Zendesk in Sim, you can:

- **Manage Tickets:**
  - Retrieve lists of support tickets with advanced filtering and sorting.
  - Get detailed information on a single ticket for tracking and resolution.
  - Create new tickets individually or in bulk to log customer issues programmatically.
  - Update tickets or apply bulk updates to streamline complex workflows.
  - Delete or merge tickets as cases are resolved or duplicates arise.

- **User Management:**
  - Retrieve lists of users or search users by criteria to keep your customer and agent directories up-to-date.
  - Get detailed information on individual users or the current logged-in user.
  - Create new users or onboard them in bulk, automating customer and agent provisioning.
  - Update or bulk update user details to ensure information accuracy.
  - Delete users as needed for privacy or account management.

- **Organization Management:**
  - List, search, and autocomplete organizations for streamlined support and account management.
  - Get organization details and keep your database organized.
  - Create, update, or delete organizations to reflect changes in your customer base.
  - Perform bulk organization creation for large onboarding efforts.

- **Advanced Search & Analytics:**
  - Use versatile search endpoints to quickly locate tickets, users, or organizations by any field.
  - Retrieve counts of search results to power reporting and analytics.

By leveraging Zendesk’s Sim integration, your automated workflows can seamlessly handle support ticket triage, user onboarding/offboarding, company management, and keep your support operations running smoothly. Whether you’re integrating support with product, CRM, or automation systems, Zendesk tools in Sim provide robust, programmatic control to power best-in-class support at scale.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Zendesk into the workflow. Can get tickets, get ticket, create ticket, create tickets bulk, update ticket, update tickets bulk, delete ticket, merge tickets, get users, get user, get current user, search users, create user, create users bulk, update user, update users bulk, delete user, get organizations, get organization, autocomplete organizations, create organization, create organizations bulk, update organization, delete organization, search, search count.



## Tools

### `zendesk_get_tickets`

Retrieve a list of tickets from Zendesk with optional filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain \(e.g., "mycompany" for mycompany.zendesk.com\) |
| `status` | string | No | Filter by status \(new, open, pending, hold, solved, closed\) |
| `priority` | string | No | Filter by priority \(low, normal, high, urgent\) |
| `type` | string | No | Filter by type \(problem, incident, question, task\) |
| `assigneeId` | string | No | Filter by assignee user ID |
| `organizationId` | string | No | Filter by organization ID |
| `sortBy` | string | No | Sort field \(created_at, updated_at, priority, status\) |
| `sortOrder` | string | No | Sort order \(asc or desc\) |
| `perPage` | string | No | Results per page \(default: 100, max: 100\) |
| `page` | string | No | Page number |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tickets` | array | Array of ticket objects |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |

### `zendesk_get_ticket`

Get a single ticket by ID from Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `ticketId` | string | Yes | Ticket ID to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ticket` | object | Ticket object |
| `metadata` | object | Operation metadata |

### `zendesk_create_ticket`

Create a new ticket in Zendesk with support for custom fields

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `subject` | string | No | Ticket subject \(optional - will be auto-generated if not provided\) |
| `description` | string | Yes | Ticket description \(first comment\) |
| `priority` | string | No | Priority \(low, normal, high, urgent\) |
| `status` | string | No | Status \(new, open, pending, hold, solved, closed\) |
| `type` | string | No | Type \(problem, incident, question, task\) |
| `tags` | string | No | Comma-separated tags |
| `assigneeId` | string | No | Assignee user ID |
| `groupId` | string | No | Group ID |
| `requesterId` | string | No | Requester user ID |
| `customFields` | string | No | Custom fields as JSON object \(e.g., \{"field_id": "value"\}\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ticket` | object | Created ticket object |
| `metadata` | object | Operation metadata |

### `zendesk_create_tickets_bulk`

Create multiple tickets in Zendesk at once (max 100)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `tickets` | string | Yes | JSON array of ticket objects to create \(max 100\). Each ticket should have subject and comment properties. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job status object |
| `metadata` | object | Operation metadata |

### `zendesk_update_ticket`

Update an existing ticket in Zendesk with support for custom fields

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `ticketId` | string | Yes | Ticket ID to update |
| `subject` | string | No | New ticket subject |
| `comment` | string | No | Add a comment to the ticket |
| `priority` | string | No | Priority \(low, normal, high, urgent\) |
| `status` | string | No | Status \(new, open, pending, hold, solved, closed\) |
| `type` | string | No | Type \(problem, incident, question, task\) |
| `tags` | string | No | Comma-separated tags |
| `assigneeId` | string | No | Assignee user ID |
| `groupId` | string | No | Group ID |
| `customFields` | string | No | Custom fields as JSON object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ticket` | object | Updated ticket object |
| `metadata` | object | Operation metadata |

### `zendesk_update_tickets_bulk`

Update multiple tickets in Zendesk at once (max 100)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `ticketIds` | string | Yes | Comma-separated ticket IDs to update \(max 100\) |
| `status` | string | No | New status for all tickets |
| `priority` | string | No | New priority for all tickets |
| `assigneeId` | string | No | New assignee ID for all tickets |
| `groupId` | string | No | New group ID for all tickets |
| `tags` | string | No | Comma-separated tags to add to all tickets |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job status object |
| `metadata` | object | Operation metadata |

### `zendesk_delete_ticket`

Delete a ticket from Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `ticketId` | string | Yes | Ticket ID to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Deletion success |
| `metadata` | object | Operation metadata |

### `zendesk_merge_tickets`

Merge multiple tickets into a target ticket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `targetTicketId` | string | Yes | Target ticket ID \(tickets will be merged into this one\) |
| `sourceTicketIds` | string | Yes | Comma-separated source ticket IDs to merge |
| `targetComment` | string | No | Comment to add to target ticket after merge |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job status object |
| `metadata` | object | Operation metadata |

### `zendesk_get_users`

Retrieve a list of users from Zendesk with optional filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain \(e.g., "mycompany" for mycompany.zendesk.com\) |
| `role` | string | No | Filter by role \(end-user, agent, admin\) |
| `permissionSet` | string | No | Filter by permission set ID |
| `perPage` | string | No | Results per page \(default: 100, max: 100\) |
| `page` | string | No | Page number |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `users` | array | Array of user objects |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |

### `zendesk_get_user`

Get a single user by ID from Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `userId` | string | Yes | User ID to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | User object |
| `metadata` | object | Operation metadata |

### `zendesk_get_current_user`

Get the currently authenticated user from Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | Current user object |
| `metadata` | object | Operation metadata |

### `zendesk_search_users`

Search for users in Zendesk using a query string

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `query` | string | No | Search query string |
| `externalId` | string | No | External ID to search by |
| `perPage` | string | No | Results per page \(default: 100, max: 100\) |
| `page` | string | No | Page number |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `users` | array | Array of user objects |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |

### `zendesk_create_user`

Create a new user in Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `name` | string | Yes | User name |
| `userEmail` | string | No | User email |
| `role` | string | No | User role \(end-user, agent, admin\) |
| `phone` | string | No | User phone number |
| `organizationId` | string | No | Organization ID |
| `verified` | string | No | Set to "true" to skip email verification |
| `tags` | string | No | Comma-separated tags |
| `customFields` | string | No | Custom fields as JSON object \(e.g., \{"field_id": "value"\}\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | Created user object |
| `metadata` | object | Operation metadata |

### `zendesk_create_users_bulk`

Create multiple users in Zendesk using bulk import

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `users` | string | Yes | JSON array of user objects to create |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job status object |
| `metadata` | object | Operation metadata |

### `zendesk_update_user`

Update an existing user in Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `userId` | string | Yes | User ID to update |
| `name` | string | No | New user name |
| `userEmail` | string | No | New user email |
| `role` | string | No | User role \(end-user, agent, admin\) |
| `phone` | string | No | User phone number |
| `organizationId` | string | No | Organization ID |
| `verified` | string | No | Set to "true" to mark user as verified |
| `tags` | string | No | Comma-separated tags |
| `customFields` | string | No | Custom fields as JSON object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | Updated user object |
| `metadata` | object | Operation metadata |

### `zendesk_update_users_bulk`

Update multiple users in Zendesk using bulk update

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `users` | string | Yes | JSON array of user objects to update \(must include id field\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job status object |
| `metadata` | object | Operation metadata |

### `zendesk_delete_user`

Delete a user from Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `userId` | string | Yes | User ID to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Deletion success |
| `metadata` | object | Operation metadata |

### `zendesk_get_organizations`

Retrieve a list of organizations from Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain \(e.g., "mycompany" for mycompany.zendesk.com\) |
| `perPage` | string | No | Results per page \(default: 100, max: 100\) |
| `page` | string | No | Page number |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `organizations` | array | Array of organization objects |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |

### `zendesk_get_organization`

Get a single organization by ID from Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `organizationId` | string | Yes | Organization ID to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `organization` | object | Organization object |
| `metadata` | object | Operation metadata |

### `zendesk_autocomplete_organizations`

Autocomplete organizations in Zendesk by name prefix (for name matching/autocomplete)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `name` | string | Yes | Organization name to search for |
| `perPage` | string | No | Results per page \(default: 100, max: 100\) |
| `page` | string | No | Page number |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `organizations` | array | Array of organization objects |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |

### `zendesk_create_organization`

Create a new organization in Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `name` | string | Yes | Organization name |
| `domainNames` | string | No | Comma-separated domain names |
| `details` | string | No | Organization details |
| `notes` | string | No | Organization notes |
| `tags` | string | No | Comma-separated tags |
| `customFields` | string | No | Custom fields as JSON object \(e.g., \{"field_id": "value"\}\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `organization` | object | Created organization object |
| `metadata` | object | Operation metadata |

### `zendesk_create_organizations_bulk`

Create multiple organizations in Zendesk using bulk import

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `organizations` | string | Yes | JSON array of organization objects to create |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `jobStatus` | object | Job status object |
| `metadata` | object | Operation metadata |

### `zendesk_update_organization`

Update an existing organization in Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `organizationId` | string | Yes | Organization ID to update |
| `name` | string | No | New organization name |
| `domainNames` | string | No | Comma-separated domain names |
| `details` | string | No | Organization details |
| `notes` | string | No | Organization notes |
| `tags` | string | No | Comma-separated tags |
| `customFields` | string | No | Custom fields as JSON object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `organization` | object | Updated organization object |
| `metadata` | object | Operation metadata |

### `zendesk_delete_organization`

Delete an organization from Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `organizationId` | string | Yes | Organization ID to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Deletion success |
| `metadata` | object | Operation metadata |

### `zendesk_search`

Unified search across tickets, users, and organizations in Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `query` | string | Yes | Search query string |
| `sortBy` | string | No | Sort field \(relevance, created_at, updated_at, priority, status, ticket_type\) |
| `sortOrder` | string | No | Sort order \(asc or desc\) |
| `perPage` | string | No | Results per page \(default: 100, max: 100\) |
| `page` | string | No | Page number |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Array of result objects |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |

### `zendesk_search_count`

Count the number of search results matching a query in Zendesk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | Yes | Your Zendesk email address |
| `apiToken` | string | Yes | Zendesk API token |
| `subdomain` | string | Yes | Your Zendesk subdomain |
| `query` | string | Yes | Search query string |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `count` | number | Number of matching results |
| `metadata` | object | Operation metadata |



## Notes

- Category: `tools`
- Type: `zendesk`
```

--------------------------------------------------------------------------------

---[FILE: zep.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/zep.mdx

```text
---
title: Zep
description: Long-term memory for AI agents
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zep"
  color="#E8E8E8"
/>

## Usage Instructions

Integrate Zep for long-term memory management. Create threads, add messages, retrieve context with AI-powered summaries and facts extraction.



## Tools

### `zep_create_thread`

Start a new conversation thread in Zep

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Yes | Unique identifier for the thread |
| `userId` | string | Yes | User ID associated with the thread |
| `apiKey` | string | Yes | Your Zep API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `threadId` | string | The thread ID |
| `userId` | string | The user ID |
| `uuid` | string | Internal UUID |
| `createdAt` | string | Creation timestamp |
| `projectUuid` | string | Project UUID |

### `zep_get_threads`

List all conversation threads

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `pageSize` | number | No | Number of threads to retrieve per page |
| `pageNumber` | number | No | Page number for pagination |
| `orderBy` | string | No | Field to order results by \(created_at, updated_at, user_id, thread_id\) |
| `asc` | boolean | No | Order direction: true for ascending, false for descending |
| `apiKey` | string | Yes | Your Zep API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `threads` | array | Array of thread objects |
| `responseCount` | number | Number of threads in this response |
| `totalCount` | number | Total number of threads available |

### `zep_delete_thread`

Delete a conversation thread from Zep

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Yes | Thread ID to delete |
| `apiKey` | string | Yes | Your Zep API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Whether the thread was deleted |

### `zep_get_context`

Retrieve user context from a thread with summary or basic mode

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Yes | Thread ID to get context from |
| `mode` | string | No | Context mode: "summary" \(natural language\) or "basic" \(raw facts\) |
| `minRating` | number | No | Minimum rating by which to filter relevant facts |
| `apiKey` | string | Yes | Your Zep API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `context` | string | The context string \(summary or basic mode\) |

### `zep_get_messages`

Retrieve messages from a thread

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Yes | Thread ID to get messages from |
| `limit` | number | No | Maximum number of messages to return |
| `cursor` | string | No | Cursor for pagination |
| `lastn` | number | No | Number of most recent messages to return \(overrides limit and cursor\) |
| `apiKey` | string | Yes | Your Zep API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `messages` | array | Array of message objects |
| `rowCount` | number | Number of messages in this response |
| `totalCount` | number | Total number of messages in the thread |

### `zep_add_messages`

Add messages to an existing thread

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | Yes | Thread ID to add messages to |
| `messages` | json | Yes | Array of message objects with role and content |
| `apiKey` | string | Yes | Your Zep API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `threadId` | string | The thread ID |
| `added` | boolean | Whether messages were added successfully |
| `messageIds` | array | Array of added message UUIDs |

### `zep_add_user`

Create a new user in Zep

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Yes | Unique identifier for the user |
| `email` | string | No | User email address |
| `firstName` | string | No | User first name |
| `lastName` | string | No | User last name |
| `metadata` | json | No | Additional metadata as JSON object |
| `apiKey` | string | Yes | Your Zep API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `userId` | string | The user ID |
| `email` | string | User email |
| `firstName` | string | User first name |
| `lastName` | string | User last name |
| `uuid` | string | Internal UUID |
| `createdAt` | string | Creation timestamp |
| `metadata` | object | User metadata |

### `zep_get_user`

Retrieve user information from Zep

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Yes | User ID to retrieve |
| `apiKey` | string | Yes | Your Zep API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `userId` | string | The user ID |
| `email` | string | User email |
| `firstName` | string | User first name |
| `lastName` | string | User last name |
| `uuid` | string | Internal UUID |
| `createdAt` | string | Creation timestamp |
| `updatedAt` | string | Last update timestamp |
| `metadata` | object | User metadata |

### `zep_get_user_threads`

List all conversation threads for a specific user

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Yes | User ID to get threads for |
| `limit` | number | No | Maximum number of threads to return |
| `apiKey` | string | Yes | Your Zep API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `threads` | array | Array of thread objects for this user |
| `totalCount` | number | Total number of threads returned |



## Notes

- Category: `tools`
- Type: `zep`
```

--------------------------------------------------------------------------------

---[FILE: zoom.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/zoom.mdx

```text
---
title: Zoom
description: Create and manage Zoom meetings and recordings
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zoom"
  color="#2D8CFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zoom](https://zoom.us/) is a leading cloud-based communications platform for video meetings, webinars, and online collaboration. It allows users and organizations to easily schedule, host, and manage meetings, providing tools for screen sharing, chat, recordings, and more.

With Zoom, you can:

- **Schedule and manage meetings**: Create instant or scheduled meetings, including recurring events
- **Configure meeting options**: Set meeting passwords, enable waiting rooms, and control participant video/audio
- **Send invitations and share details**: Retrieve meeting invitations and information for easy sharing
- **Get and update meeting data**: Access meeting details, modify existing meetings, and manage settings programmatically

In Sim, the Zoom integration empowers your agents to automate scheduling and meeting management. Use tool actions to:

- Programmatically create new meetings with custom settings
- List all meetings for a specific user (or yourself)
- Retrieve details or invitations for any meeting
- Update or delete existing meetings directly from your automations

To connect to Zoom, drop the Zoom block and click `Connect` to authenticate with your Zoom account. Once connected, you can use the Zoom tools to create, list, update, and delete Zoom meetings. At any given time, you can disconnect your Zoom account by clicking `Disconnect` in Settings > Integrations, and access to your Zoom account will be revoked immediatley.

These capabilities let you streamline remote collaboration, automate recurring video sessions, and manage your organization's Zoom environment all as part of your workflows.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Zoom into workflows. Create, list, update, and delete Zoom meetings. Get meeting details, invitations, recordings, and participants. Manage cloud recordings programmatically.



## Tools

### `zoom_create_meeting`

Create a new Zoom meeting

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Yes | The user ID or email address. Use "me" for the authenticated user. |
| `topic` | string | Yes | Meeting topic |
| `type` | number | No | Meeting type: 1=instant, 2=scheduled, 3=recurring no fixed time, 8=recurring fixed time |
| `startTime` | string | No | Meeting start time in ISO 8601 format \(e.g., 2025-06-03T10:00:00Z\) |
| `duration` | number | No | Meeting duration in minutes |
| `timezone` | string | No | Timezone for the meeting \(e.g., America/Los_Angeles\) |
| `password` | string | No | Meeting password |
| `agenda` | string | No | Meeting agenda |
| `hostVideo` | boolean | No | Start with host video on |
| `participantVideo` | boolean | No | Start with participant video on |
| `joinBeforeHost` | boolean | No | Allow participants to join before host |
| `muteUponEntry` | boolean | No | Mute participants upon entry |
| `waitingRoom` | boolean | No | Enable waiting room |
| `autoRecording` | string | No | Auto recording setting: local, cloud, or none |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `meeting` | object | The created meeting with all its properties |

### `zoom_list_meetings`

List all meetings for a Zoom user

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Yes | The user ID or email address. Use "me" for the authenticated user. |
| `type` | string | No | Meeting type filter: scheduled, live, upcoming, upcoming_meetings, or previous_meetings |
| `pageSize` | number | No | Number of records per page \(max 300\) |
| `nextPageToken` | string | No | Token for pagination to get next page of results |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `meetings` | array | List of meetings |
| `pageInfo` | object | Pagination information |

### `zoom_get_meeting`

Get details of a specific Zoom meeting

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Yes | The meeting ID |
| `occurrenceId` | string | No | Occurrence ID for recurring meetings |
| `showPreviousOccurrences` | boolean | No | Show previous occurrences for recurring meetings |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `meeting` | object | The meeting details |

### `zoom_update_meeting`

Update an existing Zoom meeting

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Yes | The meeting ID to update |
| `topic` | string | No | Meeting topic |
| `type` | number | No | Meeting type: 1=instant, 2=scheduled, 3=recurring no fixed time, 8=recurring fixed time |
| `startTime` | string | No | Meeting start time in ISO 8601 format \(e.g., 2025-06-03T10:00:00Z\) |
| `duration` | number | No | Meeting duration in minutes |
| `timezone` | string | No | Timezone for the meeting \(e.g., America/Los_Angeles\) |
| `password` | string | No | Meeting password |
| `agenda` | string | No | Meeting agenda |
| `hostVideo` | boolean | No | Start with host video on |
| `participantVideo` | boolean | No | Start with participant video on |
| `joinBeforeHost` | boolean | No | Allow participants to join before host |
| `muteUponEntry` | boolean | No | Mute participants upon entry |
| `waitingRoom` | boolean | No | Enable waiting room |
| `autoRecording` | string | No | Auto recording setting: local, cloud, or none |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the meeting was updated successfully |

### `zoom_delete_meeting`

Delete or cancel a Zoom meeting

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Yes | The meeting ID to delete |
| `occurrenceId` | string | No | Occurrence ID for deleting a specific occurrence of a recurring meeting |
| `scheduleForReminder` | boolean | No | Send cancellation reminder email to registrants |
| `cancelMeetingReminder` | boolean | No | Send cancellation email to registrants and alternative hosts |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the meeting was deleted successfully |

### `zoom_get_meeting_invitation`

Get the meeting invitation text for a Zoom meeting

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Yes | The meeting ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `invitation` | string | The meeting invitation text |

### `zoom_list_recordings`

List all cloud recordings for a Zoom user

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Yes | The user ID or email address. Use "me" for the authenticated user. |
| `from` | string | No | Start date in yyyy-mm-dd format \(within last 6 months\) |
| `to` | string | No | End date in yyyy-mm-dd format |
| `pageSize` | number | No | Number of records per page \(max 300\) |
| `nextPageToken` | string | No | Token for pagination to get next page of results |
| `trash` | boolean | No | Set to true to list recordings from trash |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `recordings` | array | List of recordings |
| `pageInfo` | object | Pagination information |

### `zoom_get_meeting_recordings`

Get all recordings for a specific Zoom meeting

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Yes | The meeting ID or meeting UUID |
| `includeFolderItems` | boolean | No | Include items within a folder |
| `ttl` | number | No | Time to live for download URLs in seconds \(max 604800\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `recording` | object | The meeting recording with all files |

### `zoom_delete_recording`

Delete cloud recordings for a Zoom meeting

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Yes | The meeting ID or meeting UUID |
| `recordingId` | string | No | Specific recording file ID to delete. If not provided, deletes all recordings. |
| `action` | string | No | Delete action: "trash" \(move to trash\) or "delete" \(permanently delete\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the recording was deleted successfully |

### `zoom_list_past_participants`

List participants from a past Zoom meeting

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | Yes | The past meeting ID or UUID |
| `pageSize` | number | No | Number of records per page \(max 300\) |
| `nextPageToken` | string | No | Token for pagination to get next page of results |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `participants` | array | List of meeting participants |
| `pageInfo` | object | Pagination information |



## Notes

- Category: `tools`
- Type: `zoom`
```

--------------------------------------------------------------------------------

````
