---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 465
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 465 of 933)

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

---[FILE: intercom.ts]---
Location: sim-main/apps/sim/blocks/blocks/intercom.ts

```typescript
import { IntercomIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'

export const IntercomBlock: BlockConfig = {
  type: 'intercom',
  name: 'Intercom',
  description: 'Manage contacts, companies, conversations, tickets, and messages in Intercom',
  longDescription:
    'Integrate Intercom into the workflow. Can create, get, update, list, search, and delete contacts; create, get, and list companies; get, list, reply, and search conversations; create and get tickets; and create messages.',
  docsLink: 'https://docs.sim.ai/tools/intercom',
  authMode: AuthMode.ApiKey,
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: IntercomIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Create Contact', id: 'create_contact' },
        { label: 'Get Contact', id: 'get_contact' },
        { label: 'Update Contact', id: 'update_contact' },
        { label: 'List Contacts', id: 'list_contacts' },
        { label: 'Search Contacts', id: 'search_contacts' },
        { label: 'Delete Contact', id: 'delete_contact' },
        { label: 'Create Company', id: 'create_company' },
        { label: 'Get Company', id: 'get_company' },
        { label: 'List Companies', id: 'list_companies' },
        { label: 'Get Conversation', id: 'get_conversation' },
        { label: 'List Conversations', id: 'list_conversations' },
        { label: 'Reply to Conversation', id: 'reply_conversation' },
        { label: 'Search Conversations', id: 'search_conversations' },
        { label: 'Create Ticket', id: 'create_ticket' },
        { label: 'Get Ticket', id: 'get_ticket' },
        { label: 'Create Message', id: 'create_message' },
      ],
      value: () => 'create_contact',
    },
    {
      id: 'accessToken',
      title: 'Access Token',
      type: 'short-input',
      password: true,
      placeholder: 'Enter your Intercom access token',
      required: true,
    },
    // Contact fields
    {
      id: 'contactId',
      title: 'Contact ID',
      type: 'short-input',
      placeholder: 'Contact ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['get_contact', 'update_contact', 'delete_contact'],
      },
    },
    {
      id: 'email',
      title: 'Email',
      type: 'short-input',
      placeholder: 'Contact email',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact'],
      },
    },
    {
      id: 'external_id',
      title: 'External ID',
      type: 'short-input',
      placeholder: 'External identifier for the contact',
      condition: {
        field: 'operation',
        value: ['create_contact'],
      },
    },
    {
      id: 'phone',
      title: 'Phone',
      type: 'short-input',
      placeholder: 'Contact phone number',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact'],
      },
    },
    {
      id: 'name',
      title: 'Name',
      type: 'short-input',
      placeholder: 'Contact name',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact'],
      },
    },
    {
      id: 'avatar',
      title: 'Avatar URL',
      type: 'short-input',
      placeholder: 'Avatar image URL',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact'],
      },
    },
    {
      id: 'signed_up_at',
      title: 'Signed Up At',
      type: 'short-input',
      placeholder: 'Unix timestamp',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact'],
      },
    },
    {
      id: 'last_seen_at',
      title: 'Last Seen At',
      type: 'short-input',
      placeholder: 'Unix timestamp',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact'],
      },
    },
    {
      id: 'owner_id',
      title: 'Owner ID',
      type: 'short-input',
      placeholder: 'Admin ID',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact'],
      },
    },
    {
      id: 'unsubscribed_from_emails',
      title: 'Unsubscribed from Emails',
      type: 'dropdown',
      options: [
        { label: 'True', id: 'true' },
        { label: 'False', id: 'false' },
      ],
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact'],
      },
    },
    {
      id: 'custom_attributes',
      title: 'Custom Attributes',
      type: 'long-input',
      placeholder: 'JSON object with custom attributes',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact'],
      },
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'JSON search query or text',
      required: true,
      condition: {
        field: 'operation',
        value: ['search_contacts', 'search_conversations'],
      },
    },
    // Company fields
    {
      id: 'companyId',
      title: 'Company ID',
      type: 'short-input',
      placeholder: 'Intercom company ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['get_company'],
      },
    },
    {
      id: 'company_id',
      title: 'Company ID (External)',
      type: 'short-input',
      placeholder: 'Your unique identifier for the company',
      required: true,
      condition: {
        field: 'operation',
        value: ['create_company'],
      },
    },
    {
      id: 'company_name',
      title: 'Company Name',
      type: 'short-input',
      placeholder: 'Company name',
      condition: {
        field: 'operation',
        value: ['create_company'],
      },
    },
    {
      id: 'website',
      title: 'Website',
      type: 'short-input',
      placeholder: 'Company website',
      condition: {
        field: 'operation',
        value: ['create_company'],
      },
    },
    {
      id: 'plan',
      title: 'Plan',
      type: 'short-input',
      placeholder: 'Subscription plan',
      condition: {
        field: 'operation',
        value: ['create_company'],
      },
    },
    {
      id: 'size',
      title: 'Size',
      type: 'short-input',
      placeholder: 'Number of employees',
      condition: {
        field: 'operation',
        value: ['create_company'],
      },
    },
    {
      id: 'industry',
      title: 'Industry',
      type: 'short-input',
      placeholder: 'Company industry',
      condition: {
        field: 'operation',
        value: ['create_company'],
      },
    },
    {
      id: 'monthly_spend',
      title: 'Monthly Spend',
      type: 'short-input',
      placeholder: 'Revenue amount',
      condition: {
        field: 'operation',
        value: ['create_company'],
      },
    },
    // Conversation fields
    {
      id: 'conversationId',
      title: 'Conversation ID',
      type: 'short-input',
      placeholder: 'Conversation ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['get_conversation', 'reply_conversation'],
      },
    },
    {
      id: 'display_as',
      title: 'Display As',
      type: 'dropdown',
      options: [
        { label: 'HTML', id: 'html' },
        { label: 'Plain Text', id: 'plaintext' },
      ],
      condition: {
        field: 'operation',
        value: ['get_conversation'],
      },
    },
    {
      id: 'message_type',
      title: 'Message Type',
      type: 'dropdown',
      options: [
        { label: 'Comment', id: 'comment' },
        { label: 'Note', id: 'note' },
      ],
      required: true,
      condition: {
        field: 'operation',
        value: ['reply_conversation'],
      },
    },
    {
      id: 'body',
      title: 'Message Body',
      type: 'long-input',
      placeholder: 'Message text',
      required: true,
      condition: {
        field: 'operation',
        value: ['reply_conversation', 'create_message'],
      },
    },
    {
      id: 'admin_id',
      title: 'Admin ID',
      type: 'short-input',
      placeholder: 'ID of the admin sending the message',
      required: true,
      condition: {
        field: 'operation',
        value: ['reply_conversation'],
      },
    },
    {
      id: 'attachment_urls',
      title: 'Attachment URLs',
      type: 'short-input',
      placeholder: 'Comma-separated image URLs (max 10)',
      condition: {
        field: 'operation',
        value: ['reply_conversation'],
      },
    },
    // Ticket fields
    {
      id: 'ticketId',
      title: 'Ticket ID',
      type: 'short-input',
      placeholder: 'Ticket ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['get_ticket'],
      },
    },
    {
      id: 'ticket_type_id',
      title: 'Ticket Type ID',
      type: 'short-input',
      placeholder: 'ID of the ticket type',
      required: true,
      condition: {
        field: 'operation',
        value: ['create_ticket'],
      },
    },
    {
      id: 'contacts',
      title: 'Contacts',
      type: 'long-input',
      placeholder: 'JSON array of contact identifiers',
      required: true,
      condition: {
        field: 'operation',
        value: ['create_ticket'],
      },
    },
    {
      id: 'ticket_attributes',
      title: 'Ticket Attributes',
      type: 'long-input',
      placeholder: 'JSON object with ticket attributes',
      required: true,
      condition: {
        field: 'operation',
        value: ['create_ticket'],
      },
    },
    // Message fields
    {
      id: 'message_type_msg',
      title: 'Message Type',
      type: 'dropdown',
      options: [
        { label: 'In-App', id: 'inapp' },
        { label: 'Email', id: 'email' },
      ],
      required: true,
      condition: {
        field: 'operation',
        value: ['create_message'],
      },
    },
    {
      id: 'subject',
      title: 'Subject',
      type: 'short-input',
      placeholder: 'Email subject (for email type)',
      condition: {
        field: 'operation',
        value: ['create_message'],
      },
    },
    {
      id: 'from_type',
      title: 'From Type',
      type: 'dropdown',
      options: [{ label: 'Admin', id: 'admin' }],
      required: true,
      condition: {
        field: 'operation',
        value: ['create_message'],
      },
    },
    {
      id: 'from_id',
      title: 'From ID',
      type: 'short-input',
      placeholder: 'Admin ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['create_message'],
      },
    },
    {
      id: 'to_type',
      title: 'To Type',
      type: 'dropdown',
      options: [{ label: 'Contact', id: 'contact' }],
      required: true,
      condition: {
        field: 'operation',
        value: ['create_message'],
      },
    },
    {
      id: 'to_id',
      title: 'To ID',
      type: 'short-input',
      placeholder: 'Contact ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['create_message'],
      },
    },
    // Pagination fields
    {
      id: 'per_page',
      title: 'Per Page',
      type: 'short-input',
      placeholder: 'Results per page (max: 150)',
      condition: {
        field: 'operation',
        value: [
          'list_contacts',
          'search_contacts',
          'list_companies',
          'list_conversations',
          'search_conversations',
        ],
      },
    },
    {
      id: 'starting_after',
      title: 'Starting After',
      type: 'short-input',
      placeholder: 'Cursor for pagination',
      condition: {
        field: 'operation',
        value: ['list_contacts', 'search_contacts', 'list_conversations', 'search_conversations'],
      },
    },
    {
      id: 'page',
      title: 'Page',
      type: 'short-input',
      placeholder: 'Page number',
      condition: {
        field: 'operation',
        value: ['list_companies'],
      },
    },
  ],
  tools: {
    access: [
      'intercom_create_contact',
      'intercom_get_contact',
      'intercom_update_contact',
      'intercom_list_contacts',
      'intercom_search_contacts',
      'intercom_delete_contact',
      'intercom_create_company',
      'intercom_get_company',
      'intercom_list_companies',
      'intercom_get_conversation',
      'intercom_list_conversations',
      'intercom_reply_conversation',
      'intercom_search_conversations',
      'intercom_create_ticket',
      'intercom_get_ticket',
      'intercom_create_message',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'create_contact':
            return 'intercom_create_contact'
          case 'get_contact':
            return 'intercom_get_contact'
          case 'update_contact':
            return 'intercom_update_contact'
          case 'list_contacts':
            return 'intercom_list_contacts'
          case 'search_contacts':
            return 'intercom_search_contacts'
          case 'delete_contact':
            return 'intercom_delete_contact'
          case 'create_company':
            return 'intercom_create_company'
          case 'get_company':
            return 'intercom_get_company'
          case 'list_companies':
            return 'intercom_list_companies'
          case 'get_conversation':
            return 'intercom_get_conversation'
          case 'list_conversations':
            return 'intercom_list_conversations'
          case 'reply_conversation':
            return 'intercom_reply_conversation'
          case 'search_conversations':
            return 'intercom_search_conversations'
          case 'create_ticket':
            return 'intercom_create_ticket'
          case 'get_ticket':
            return 'intercom_get_ticket'
          case 'create_message':
            return 'intercom_create_message'
          default:
            throw new Error(`Unknown operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { operation, message_type_msg, company_name, ...rest } = params
        const cleanParams: Record<string, any> = {}

        // Special mapping for message_type in create_message
        if (operation === 'create_message' && message_type_msg) {
          cleanParams.message_type = message_type_msg
        }

        // Special mapping for company name
        if (operation === 'create_company' && company_name) {
          cleanParams.name = company_name
        }

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            cleanParams[key] = value
          }
        })

        return cleanParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    accessToken: { type: 'string', description: 'Intercom API access token' },
  },
  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: { type: 'json', description: 'Operation result data' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: jina.ts]---
Location: sim-main/apps/sim/blocks/blocks/jina.ts

```typescript
import { JinaAIIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { ReadUrlResponse, SearchResponse } from '@/tools/jina/types'

export const JinaBlock: BlockConfig<ReadUrlResponse | SearchResponse> = {
  type: 'jina',
  name: 'Jina',
  description: 'Search the web or extract content from URLs',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Jina AI into the workflow. Search the web and get LLM-friendly results, or extract clean content from specific URLs with advanced parsing options.',
  docsLink: 'https://docs.sim.ai/tools/jina',
  category: 'tools',
  bgColor: '#333333',
  icon: JinaAIIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Read URL', id: 'jina_read_url' },
        { label: 'Search', id: 'jina_search' },
      ],
      value: () => 'jina_read_url',
    },
    // Read URL params
    {
      id: 'url',
      title: 'URL',
      type: 'short-input',
      required: true,
      placeholder: 'https://example.com',
      condition: { field: 'operation', value: 'jina_read_url' },
    },
    {
      id: 'returnFormat',
      title: 'Return Format',
      type: 'dropdown',
      options: [
        { label: 'Markdown', id: 'markdown' },
        { label: 'HTML', id: 'html' },
        { label: 'Text', id: 'text' },
        { label: 'Screenshot', id: 'screenshot' },
        { label: 'Pageshot', id: 'pageshot' },
      ],
      value: () => 'markdown',
      condition: { field: 'operation', value: 'jina_read_url' },
    },
    {
      id: 'retainImages',
      title: 'Retain Images',
      type: 'dropdown',
      options: [
        { label: 'All', id: 'all' },
        { label: 'None', id: 'none' },
      ],
      value: () => 'all',
      condition: { field: 'operation', value: 'jina_read_url' },
    },
    {
      id: 'readUrlOptions',
      title: 'Options',
      type: 'checkbox-list',
      options: [
        { label: 'Use Reader LM v2 (3x cost)', id: 'useReaderLMv2' },
        { label: 'Gather Links', id: 'gatherLinks' },
        { label: 'Gather Images', id: 'withImagesummary' },
        { label: 'Generate Image Alt Text', id: 'withGeneratedAlt' },
        { label: 'Include Iframes', id: 'withIframe' },
        { label: 'Include Shadow DOM', id: 'withShadowDom' },
        { label: 'JSON Response', id: 'jsonResponse' },
        { label: 'No Cache', id: 'noCache' },
        { label: 'Do Not Track', id: 'dnt' },
        { label: 'Disable GitHub Flavored Markdown', id: 'noGfm' },
      ],
      condition: { field: 'operation', value: 'jina_read_url' },
    },
    // Search params
    {
      id: 'q',
      title: 'Search Query',
      type: 'long-input',
      required: true,
      placeholder: 'Enter your search query...',
      condition: { field: 'operation', value: 'jina_search' },
    },
    {
      id: 'num',
      title: 'Number of Results',
      type: 'short-input',
      placeholder: '5',
      condition: { field: 'operation', value: 'jina_search' },
    },
    {
      id: 'site',
      title: 'Site Restriction',
      type: 'short-input',
      placeholder: 'jina.ai,github.com (comma-separated)',
      condition: { field: 'operation', value: 'jina_search' },
    },
    {
      id: 'searchReturnFormat',
      title: 'Return Format',
      type: 'dropdown',
      options: [
        { label: 'Markdown', id: 'markdown' },
        { label: 'HTML', id: 'html' },
        { label: 'Text', id: 'text' },
      ],
      value: () => 'markdown',
      condition: { field: 'operation', value: 'jina_search' },
    },
    {
      id: 'searchRetainImages',
      title: 'Retain Images',
      type: 'dropdown',
      options: [
        { label: 'All', id: 'all' },
        { label: 'None', id: 'none' },
      ],
      value: () => 'all',
      condition: { field: 'operation', value: 'jina_search' },
    },
    {
      id: 'searchOptions',
      title: 'Options',
      type: 'checkbox-list',
      options: [
        { label: 'Include Favicons', id: 'withFavicon' },
        { label: 'Gather Images', id: 'withImagesummary' },
        { label: 'Gather Links', id: 'withLinksummary' },
        { label: 'Generate Image Alt Text', id: 'withGeneratedAlt' },
        { label: 'No Cache', id: 'noCache' },
        { label: 'No Content (metadata only)', id: 'respondWith' },
      ],
      condition: { field: 'operation', value: 'jina_search' },
    },
    // API Key (shared)
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      required: true,
      placeholder: 'Enter your Jina API key',
      password: true,
    },
  ],
  tools: {
    access: ['jina_read_url', 'jina_search'],
    config: {
      tool: (params) => {
        return params.operation || 'jina_read_url'
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Jina API key' },
    // Read URL inputs
    url: { type: 'string', description: 'URL to extract' },
    useReaderLMv2: { type: 'boolean', description: 'Use Reader LM v2 (3x cost)' },
    gatherLinks: { type: 'boolean', description: 'Gather page links' },
    jsonResponse: { type: 'boolean', description: 'JSON response format' },
    withImagesummary: { type: 'boolean', description: 'Gather images' },
    retainImages: { type: 'string', description: 'Retain images setting' },
    returnFormat: { type: 'string', description: 'Output format' },
    withIframe: { type: 'boolean', description: 'Include iframes' },
    withShadowDom: { type: 'boolean', description: 'Include Shadow DOM' },
    noCache: { type: 'boolean', description: 'Bypass cache' },
    withGeneratedAlt: { type: 'boolean', description: 'Generate image alt text' },
    robotsTxt: { type: 'string', description: 'Bot User-Agent' },
    dnt: { type: 'boolean', description: 'Do Not Track' },
    noGfm: { type: 'boolean', description: 'Disable GitHub Flavored Markdown' },
    // Search inputs
    q: { type: 'string', description: 'Search query' },
    num: { type: 'number', description: 'Number of results' },
    site: { type: 'string', description: 'Site restriction' },
    withFavicon: { type: 'boolean', description: 'Include favicons' },
    withLinksummary: { type: 'boolean', description: 'Gather links' },
    respondWith: { type: 'string', description: 'Response mode' },
    searchReturnFormat: { type: 'string', description: 'Search output format' },
    searchRetainImages: { type: 'string', description: 'Search retain images' },
  },
  outputs: {
    // Read URL outputs
    content: { type: 'string', description: 'Extracted content' },
    links: { type: 'array', description: 'List of links from page' },
    images: { type: 'array', description: 'List of images from page' },
    // Search outputs
    results: {
      type: 'array',
      description: 'Array of search results with title, description, url, and content',
    },
  },
}
```

--------------------------------------------------------------------------------

````
