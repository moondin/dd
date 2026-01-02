---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 470
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 470 of 933)

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

---[FILE: mailgun.ts]---
Location: sim-main/apps/sim/blocks/blocks/mailgun.ts

```typescript
import { MailgunIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { SendMessageResult } from '@/tools/mailgun/types'

export const MailgunBlock: BlockConfig<SendMessageResult> = {
  type: 'mailgun',
  name: 'Mailgun',
  description: 'Send emails and manage mailing lists with Mailgun',
  longDescription:
    'Integrate Mailgun into your workflow. Send transactional emails, manage mailing lists and members, view domain information, and track email events. Supports text and HTML emails, tags for tracking, and comprehensive list management.',
  docsLink: 'https://docs.sim.ai/tools/mailgun',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: MailgunIcon,

  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        // Message Operations
        { label: 'Send Message', id: 'send_message' },
        { label: 'Get Message', id: 'get_message' },
        { label: 'List Messages', id: 'list_messages' },
        // Mailing List Operations
        { label: 'Create Mailing List', id: 'create_mailing_list' },
        { label: 'Get Mailing List', id: 'get_mailing_list' },
        { label: 'Add List Member', id: 'add_list_member' },
        // Domain Operations
        { label: 'List Domains', id: 'list_domains' },
        { label: 'Get Domain', id: 'get_domain' },
      ],
      value: () => 'send_message',
    },
    {
      id: 'apiKey',
      title: 'Mailgun API Key',
      type: 'short-input',
      password: true,
      placeholder: 'Enter your Mailgun API key',
      required: true,
    },
    {
      id: 'domain',
      title: 'Domain',
      type: 'short-input',
      placeholder: 'mg.example.com',
      condition: {
        field: 'operation',
        value: ['send_message', 'get_message', 'list_messages', 'get_domain'],
      },
      required: true,
    },
    // Send Message fields
    {
      id: 'from',
      title: 'From Email',
      type: 'short-input',
      placeholder: 'sender@example.com',
      condition: { field: 'operation', value: 'send_message' },
      required: true,
    },
    {
      id: 'to',
      title: 'To Email',
      type: 'short-input',
      placeholder: 'recipient@example.com',
      condition: { field: 'operation', value: 'send_message' },
      required: true,
    },
    {
      id: 'subject',
      title: 'Subject',
      type: 'short-input',
      placeholder: 'Email subject',
      condition: { field: 'operation', value: 'send_message' },
      required: true,
    },
    {
      id: 'text',
      title: 'Text Body',
      type: 'long-input',
      placeholder: 'Plain text email body',
      condition: { field: 'operation', value: 'send_message' },
    },
    {
      id: 'html',
      title: 'HTML Body',
      type: 'code',
      placeholder: '<html><body>HTML email body</body></html>',
      condition: { field: 'operation', value: 'send_message' },
    },
    {
      id: 'cc',
      title: 'CC',
      type: 'short-input',
      placeholder: 'cc@example.com',
      condition: { field: 'operation', value: 'send_message' },
    },
    {
      id: 'bcc',
      title: 'BCC',
      type: 'short-input',
      placeholder: 'bcc@example.com',
      condition: { field: 'operation', value: 'send_message' },
    },
    {
      id: 'tags',
      title: 'Tags',
      type: 'short-input',
      placeholder: 'tag1, tag2',
      condition: { field: 'operation', value: 'send_message' },
    },
    // Get Message fields
    {
      id: 'messageKey',
      title: 'Message Key',
      type: 'short-input',
      placeholder: 'Message storage key',
      condition: { field: 'operation', value: 'get_message' },
      required: true,
    },
    // List Messages fields
    {
      id: 'event',
      title: 'Event Type',
      type: 'dropdown',
      options: [
        { label: 'All Events', id: '' },
        { label: 'Accepted', id: 'accepted' },
        { label: 'Delivered', id: 'delivered' },
        { label: 'Failed', id: 'failed' },
        { label: 'Opened', id: 'opened' },
        { label: 'Clicked', id: 'clicked' },
        { label: 'Unsubscribed', id: 'unsubscribed' },
        { label: 'Complained', id: 'complained' },
        { label: 'Stored', id: 'stored' },
      ],
      value: () => '',
      condition: { field: 'operation', value: 'list_messages' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '100',
      condition: { field: 'operation', value: 'list_messages' },
    },
    // Create Mailing List fields
    {
      id: 'address',
      title: 'List Address',
      type: 'short-input',
      placeholder: 'list@example.com',
      condition: {
        field: 'operation',
        value: ['create_mailing_list', 'get_mailing_list', 'add_list_member'],
      },
      required: true,
    },
    {
      id: 'name',
      title: 'List Name',
      type: 'short-input',
      placeholder: 'My Mailing List',
      condition: { field: 'operation', value: 'create_mailing_list' },
    },
    {
      id: 'description',
      title: 'Description',
      type: 'long-input',
      placeholder: 'Description of the mailing list',
      condition: { field: 'operation', value: 'create_mailing_list' },
    },
    {
      id: 'accessLevel',
      title: 'Access Level',
      type: 'dropdown',
      options: [
        { label: 'Read Only', id: 'readonly' },
        { label: 'Members', id: 'members' },
        { label: 'Everyone', id: 'everyone' },
      ],
      value: () => 'readonly',
      condition: { field: 'operation', value: 'create_mailing_list' },
    },
    // Add List Member fields (reuse address from above for listAddress)
    {
      id: 'memberAddress',
      title: 'Member Email',
      type: 'short-input',
      placeholder: 'member@example.com',
      condition: { field: 'operation', value: 'add_list_member' },
      required: true,
    },
    {
      id: 'memberName',
      title: 'Member Name',
      type: 'short-input',
      placeholder: 'John Doe',
      condition: { field: 'operation', value: 'add_list_member' },
    },
    {
      id: 'vars',
      title: 'Custom Variables',
      type: 'code',
      placeholder: '{"key": "value"}',
      condition: { field: 'operation', value: 'add_list_member' },
    },
    {
      id: 'subscribed',
      title: 'Subscribed',
      type: 'dropdown',
      options: [
        { label: 'Yes', id: 'true' },
        { label: 'No', id: 'false' },
      ],
      value: () => 'true',
      condition: { field: 'operation', value: 'add_list_member' },
    },
  ],

  tools: {
    access: [
      'mailgun_send_message',
      'mailgun_get_message',
      'mailgun_list_messages',
      'mailgun_create_mailing_list',
      'mailgun_get_mailing_list',
      'mailgun_add_list_member',
      'mailgun_list_domains',
      'mailgun_get_domain',
    ],
    config: {
      tool: (params) => `mailgun_${params.operation}`,
      params: (params) => {
        const { operation, memberAddress, memberName, ...rest } = params

        // Handle special field mappings for add_list_member
        if (operation === 'add_list_member') {
          return {
            ...rest,
            listAddress: params.address,
            address: memberAddress,
            name: memberName,
            subscribed: params.subscribed === 'true',
          }
        }

        return rest
      },
    },
  },

  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Mailgun API key' },
    domain: { type: 'string', description: 'Mailgun domain' },
    // Message inputs
    from: { type: 'string', description: 'Sender email address' },
    to: { type: 'string', description: 'Recipient email address' },
    subject: { type: 'string', description: 'Email subject' },
    text: { type: 'string', description: 'Plain text body' },
    html: { type: 'string', description: 'HTML body' },
    cc: { type: 'string', description: 'CC email address' },
    bcc: { type: 'string', description: 'BCC email address' },
    tags: { type: 'string', description: 'Tags for the email' },
    messageKey: { type: 'string', description: 'Message storage key' },
    event: { type: 'string', description: 'Event type filter' },
    limit: { type: 'number', description: 'Number of events to return' },
    // Mailing list inputs
    address: { type: 'string', description: 'Mailing list address' },
    name: { type: 'string', description: 'List or member name' },
    description: { type: 'string', description: 'List description' },
    accessLevel: { type: 'string', description: 'List access level' },
    memberAddress: { type: 'string', description: 'Member email address' },
    memberName: { type: 'string', description: 'Member name' },
    vars: { type: 'string', description: 'Custom variables JSON' },
    subscribed: { type: 'string', description: 'Member subscription status' },
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    id: { type: 'string', description: 'Message ID' },
    message: { type: 'string', description: 'Response message' },
    items: { type: 'json', description: 'Array of items (messages, domains)' },
    list: { type: 'json', description: 'Mailing list details' },
    member: { type: 'json', description: 'Member details' },
    domain: { type: 'json', description: 'Domain details' },
    totalCount: { type: 'number', description: 'Total count of items' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: manual_trigger.ts]---
Location: sim-main/apps/sim/blocks/blocks/manual_trigger.ts
Signals: React

```typescript
import type { SVGProps } from 'react'
import { createElement } from 'react'
import { Play } from 'lucide-react'
import type { BlockConfig } from '@/blocks/types'

const ManualTriggerIcon = (props: SVGProps<SVGSVGElement>) => createElement(Play, props)

export const ManualTriggerBlock: BlockConfig = {
  type: 'manual_trigger',
  triggerAllowed: true,
  name: 'Manual (Legacy)',
  description: 'Legacy manual start block. Prefer the Start block.',
  longDescription:
    'Trigger the workflow manually without defining an input schema. Useful for simple runs where no structured input is needed.',
  bestPractices: `
  - Use when you want a simple manual start without defining an input format.
  - If you need structured inputs or child workflows to map variables from, prefer the Input Form Trigger.
  `,
  category: 'triggers',
  hideFromToolbar: true,
  bgColor: '#2563EB',
  icon: ManualTriggerIcon,
  subBlocks: [],
  tools: {
    access: [],
  },
  inputs: {},
  outputs: {},
  triggers: {
    enabled: true,
    available: ['manual'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: mcp.ts]---
Location: sim-main/apps/sim/blocks/blocks/mcp.ts

```typescript
import { McpIcon } from '@/components/icons'
import { createMcpToolId } from '@/lib/mcp/utils'
import type { BlockConfig } from '@/blocks/types'
import type { ToolResponse } from '@/tools/types'

export interface McpResponse extends ToolResponse {
  output: any // Raw structured response from MCP tool
}

export const McpBlock: BlockConfig<McpResponse> = {
  type: 'mcp',
  name: 'MCP Tool',
  description: 'Execute tools from Model Context Protocol (MCP) servers',
  longDescription:
    'Integrate MCP into the workflow. Can execute tools from MCP servers. Requires MCP servers in workspace settings.',
  docsLink: 'https://docs.sim.ai/mcp',
  category: 'tools',
  bgColor: '#181C1E',
  icon: McpIcon,
  subBlocks: [
    {
      id: 'server',
      title: 'MCP Server',
      type: 'mcp-server-selector',
      required: true,
      placeholder: 'Select an MCP server',
      description: 'Choose from configured MCP servers in your workspace',
    },
    {
      id: 'tool',
      title: 'Tool',
      type: 'mcp-tool-selector',
      required: true,
      placeholder: 'Select a tool',
      description: 'Available tools from the selected MCP server',
      dependsOn: ['server'],
      condition: {
        field: 'server',
        value: '',
        not: true, // Show when server is not empty
      },
    },
    {
      id: 'arguments',
      title: '',
      type: 'mcp-dynamic-args',
      description: '',
      condition: {
        field: 'tool',
        value: '',
        not: true, // Show when tool is not empty
      },
    },
  ],
  tools: {
    access: [], // No static tool access needed - tools are dynamically resolved
    config: {
      tool: (params: any) => {
        if (params.server && params.tool) {
          const serverId = params.server
          let toolName = params.tool

          if (toolName.startsWith(`${serverId}-`)) {
            toolName = toolName.substring(`${serverId}-`.length)
          }

          return createMcpToolId(serverId, toolName)
        }
        return 'mcp-dynamic'
      },
    },
  },
  inputs: {
    server: {
      type: 'string',
      description: 'MCP server ID to execute the tool on',
    },
    tool: {
      type: 'string',
      description: 'Name of the tool to execute',
    },
    arguments: {
      type: 'json',
      description: 'Arguments to pass to the tool',
      schema: {
        type: 'object',
        properties: {},
        additionalProperties: true,
      },
    },
  },
  outputs: {
    content: {
      type: 'array',
      description: 'Content array from MCP tool response - the standard format for all MCP tools',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: mem0.ts]---
Location: sim-main/apps/sim/blocks/blocks/mem0.ts

```typescript
import { Mem0Icon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { Mem0Response } from '@/tools/mem0/types'

export const Mem0Block: BlockConfig<Mem0Response> = {
  type: 'mem0',
  name: 'Mem0',
  description: 'Agent memory management',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate Mem0 into the workflow. Can add, search, and retrieve memories.',
  bgColor: '#181C1E',
  icon: Mem0Icon,
  category: 'tools',
  docsLink: 'https://docs.sim.ai/tools/mem0',
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Add Memories', id: 'add' },
        { label: 'Search Memories', id: 'search' },
        { label: 'Get Memories', id: 'get' },
      ],
      placeholder: 'Select an operation',
      value: () => 'add',
    },
    {
      id: 'userId',
      title: 'User ID',
      type: 'short-input',
      placeholder: 'Enter user identifier',
      value: () => 'userid', // Default to the working user ID from curl example
      required: true,
    },
    {
      id: 'messages',
      title: 'Messages',
      type: 'code',
      placeholder: 'JSON array, e.g. [{"role": "user", "content": "I love Sim!"}]',
      language: 'json',
      condition: {
        field: 'operation',
        value: 'add',
      },
      required: true,
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter search query to find relevant memories',
      condition: {
        field: 'operation',
        value: 'search',
      },
      required: true,
    },
    {
      id: 'memoryId',
      title: 'Memory ID',
      type: 'short-input',
      placeholder: 'Specific memory ID to retrieve',
      condition: {
        field: 'operation',
        value: 'get',
      },
    },
    {
      id: 'startDate',
      title: 'Start Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD',
      condition: {
        field: 'operation',
        value: 'get',
      },
    },
    {
      id: 'endDate',
      title: 'End Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD',
      condition: {
        field: 'operation',
        value: 'get',
      },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Mem0 API key',
      password: true,
      required: true,
    },
    {
      id: 'limit',
      title: 'Result Limit',
      type: 'slider',
      min: 1,
      max: 50,
      step: 1,
      integer: true,
      condition: {
        field: 'operation',
        value: ['search', 'get'],
      },
    },
  ],
  tools: {
    access: ['mem0_add_memories', 'mem0_search_memories', 'mem0_get_memories'],
    config: {
      tool: (params: Record<string, any>) => {
        const operation = params.operation || 'add'
        switch (operation) {
          case 'add':
            return 'mem0_add_memories'
          case 'search':
            return 'mem0_search_memories'
          case 'get':
            return 'mem0_get_memories'
          default:
            return 'mem0_add_memories'
        }
      },
      params: (params: Record<string, any>) => {
        // Create detailed error information for any missing required fields
        const errors: string[] = []

        // Validate required API key for all operations
        if (!params.apiKey) {
          errors.push('API Key is required')
        }

        // For search operation, validate required fields
        if (params.operation === 'search') {
          if (!params.query || params.query.trim() === '') {
            errors.push('Search Query is required')
          }

          if (!params.userId) {
            errors.push('User ID is required')
          }
        }

        // For add operation, validate required fields
        if (params.operation === 'add') {
          if (!params.messages) {
            errors.push('Messages are required for add operation')
          } else if (!Array.isArray(params.messages) || params.messages.length === 0) {
            errors.push('Messages must be a non-empty array')
          } else {
            for (const msg of params.messages) {
              if (!msg.role || !msg.content) {
                errors.push("Each message must have 'role' and 'content' properties")
                break
              }
            }
          }

          if (!params.userId) {
            errors.push('User ID is required')
          }
        }

        // Throw error if any required fields are missing
        if (errors.length > 0) {
          throw new Error(`Mem0 Block Error: ${errors.join(', ')}`)
        }

        const result: Record<string, any> = {
          apiKey: params.apiKey,
        }

        // Add any identifiers that are present
        if (params.userId) result.userId = params.userId

        // Add version if specified
        if (params.version) result.version = params.version

        if (params.limit) result.limit = params.limit

        const operation = params.operation || 'add'

        // Process operation-specific parameters
        switch (operation) {
          case 'add':
            if (params.messages) {
              try {
                // Ensure messages are properly formatted
                const messagesArray =
                  typeof params.messages === 'string'
                    ? JSON.parse(params.messages)
                    : params.messages

                // Validate message structure
                if (Array.isArray(messagesArray) && messagesArray.length > 0) {
                  let validMessages = true
                  for (const msg of messagesArray) {
                    if (!msg.role || !msg.content) {
                      validMessages = false
                      break
                    }
                  }
                  if (validMessages) {
                    result.messages = messagesArray
                  } else {
                    // Consistent with other error handling - collect in errors array
                    errors.push('Invalid message format - each message must have role and content')
                    throw new Error(
                      'Mem0 Block Error: Invalid message format - each message must have role and content'
                    )
                  }
                } else {
                  // Consistent with other error handling
                  errors.push('Messages must be a non-empty array')
                  throw new Error('Mem0 Block Error: Messages must be a non-empty array')
                }
              } catch (e: any) {
                if (!errors.includes('Messages must be valid JSON')) {
                  errors.push('Messages must be valid JSON')
                }
                throw new Error(`Mem0 Block Error: ${e.message || 'Messages must be valid JSON'}`)
              }
            }
            break
          case 'search':
            if (params.query) {
              result.query = params.query

              // Check if we have at least one identifier for search
              if (!params.userId) {
                errors.push('Search requires a User ID')
                throw new Error('Mem0 Block Error: Search requires a User ID')
              }
            } else {
              errors.push('Search requires a query parameter')
              throw new Error('Mem0 Block Error: Search requires a query parameter')
            }

            // Include limit if specified
            if (params.limit) {
              result.limit = Number(params.limit)
            }
            break
          case 'get':
            if (params.memoryId) {
              result.memoryId = params.memoryId
            }

            // Add date range filtering for v2 get memories
            if (params.startDate) {
              result.startDate = params.startDate
            }

            if (params.endDate) {
              result.endDate = params.endDate
            }
            break
        }

        return result
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Mem0 API key' },
    userId: { type: 'string', description: 'User identifier' },
    version: { type: 'string', description: 'API version' },
    messages: { type: 'json', description: 'Message data array' },
    query: { type: 'string', description: 'Search query' },
    memoryId: { type: 'string', description: 'Memory identifier' },
    startDate: { type: 'string', description: 'Start date filter' },
    endDate: { type: 'string', description: 'End date filter' },
    limit: { type: 'number', description: 'Result limit' },
  },
  outputs: {
    ids: { type: 'json', description: 'Memory identifiers' },
    memories: { type: 'json', description: 'Memory data' },
    searchResults: { type: 'json', description: 'Search results' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: memory.ts]---
Location: sim-main/apps/sim/blocks/blocks/memory.ts

```typescript
import { BrainIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'

export const MemoryBlock: BlockConfig = {
  type: 'memory',
  name: 'Memory',
  description: 'Add memory store',
  longDescription:
    'Integrate Memory into the workflow. Can add, get a memory, get all memories, and delete memories.',
  bgColor: '#F64F9E',
  bestPractices: `
  - Do not use this block unless the user explicitly asks for it.
  - Search up examples with memory blocks to understand YAML syntax. 
  - Used in conjunction with agent blocks to persist messages between runs. User messages should be added with role 'user' and assistant messages should be added with role 'assistant' with the agent sandwiched between.
  `,
  icon: BrainIcon,
  category: 'blocks',
  docsLink: 'https://docs.sim.ai/tools/memory',
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Add Memory', id: 'add' },
        { label: 'Get All Memories', id: 'getAll' },
        { label: 'Get Memory', id: 'get' },
        { label: 'Delete Memory', id: 'delete' },
      ],
      placeholder: 'Select operation',
      value: () => 'add',
    },
    {
      id: 'id',
      title: 'Conversation ID',
      type: 'short-input',
      placeholder: 'Enter conversation ID (e.g., user-123)',
      condition: {
        field: 'operation',
        value: 'add',
      },
      required: true,
    },
    {
      id: 'blockId',
      title: 'Block ID',
      type: 'short-input',
      placeholder: 'Enter block ID (optional, defaults to current block)',
      condition: {
        field: 'operation',
        value: 'add',
      },
      required: false,
    },
    {
      id: 'id',
      title: 'Conversation ID',
      type: 'short-input',
      placeholder: 'Enter conversation ID (e.g., user-123)',
      condition: {
        field: 'operation',
        value: 'get',
      },
      required: false,
    },
    {
      id: 'blockId',
      title: 'Block ID',
      type: 'short-input',
      placeholder: 'Enter block ID (optional)',
      condition: {
        field: 'operation',
        value: 'get',
      },
      required: false,
    },
    {
      id: 'blockName',
      title: 'Block Name',
      type: 'short-input',
      placeholder: 'Enter block name (optional)',
      condition: {
        field: 'operation',
        value: 'get',
      },
      required: false,
    },
    {
      id: 'id',
      title: 'Conversation ID',
      type: 'short-input',
      placeholder: 'Enter conversation ID (e.g., user-123)',
      condition: {
        field: 'operation',
        value: 'delete',
      },
      required: false,
    },
    {
      id: 'blockId',
      title: 'Block ID',
      type: 'short-input',
      placeholder: 'Enter block ID (optional)',
      condition: {
        field: 'operation',
        value: 'delete',
      },
      required: false,
    },
    {
      id: 'blockName',
      title: 'Block Name',
      type: 'short-input',
      placeholder: 'Enter block name (optional)',
      condition: {
        field: 'operation',
        value: 'delete',
      },
      required: false,
    },
    {
      id: 'role',
      title: 'Role',
      type: 'dropdown',
      options: [
        { label: 'User', id: 'user' },
        { label: 'Assistant', id: 'assistant' },
        { label: 'System', id: 'system' },
      ],
      placeholder: 'Select agent role',
      condition: {
        field: 'operation',
        value: 'add',
      },
      required: true,
    },
    {
      id: 'content',
      title: 'Content',
      type: 'short-input',
      placeholder: 'Enter message content',
      condition: {
        field: 'operation',
        value: 'add',
      },
      required: true,
    },
  ],
  tools: {
    access: ['memory_add', 'memory_get', 'memory_get_all', 'memory_delete'],
    config: {
      tool: (params: Record<string, any>) => {
        const operation = params.operation || 'add'
        switch (operation) {
          case 'add':
            return 'memory_add'
          case 'get':
            return 'memory_get'
          case 'getAll':
            return 'memory_get_all'
          case 'delete':
            return 'memory_delete'
          default:
            return 'memory_add'
        }
      },
      params: (params: Record<string, any>) => {
        const errors: string[] = []

        if (!params.operation) {
          errors.push('Operation is required')
        }

        const conversationId = params.id || params.conversationId

        if (params.operation === 'add') {
          if (!conversationId) {
            errors.push('Conversation ID is required for add operation')
          }
          if (!params.role) {
            errors.push('Role is required for agent memory')
          }
          if (!params.content) {
            errors.push('Content is required for agent memory')
          }
        }

        if (params.operation === 'get' || params.operation === 'delete') {
          if (!conversationId && !params.blockId && !params.blockName) {
            errors.push(
              `At least one of ID, blockId, or blockName is required for ${params.operation} operation`
            )
          }
        }

        if (errors.length > 0) {
          throw new Error(`Memory Block Error: ${errors.join(', ')}`)
        }

        const baseResult: Record<string, any> = {}

        if (params.operation === 'add') {
          const result: Record<string, any> = {
            ...baseResult,
            conversationId: conversationId,
            role: params.role,
            content: params.content,
          }
          if (params.blockId) {
            result.blockId = params.blockId
          }

          return result
        }

        if (params.operation === 'get') {
          const result: Record<string, any> = { ...baseResult }
          if (conversationId) result.conversationId = conversationId
          if (params.blockId) result.blockId = params.blockId
          if (params.blockName) result.blockName = params.blockName
          return result
        }

        if (params.operation === 'delete') {
          const result: Record<string, any> = { ...baseResult }
          if (conversationId) result.conversationId = conversationId
          if (params.blockId) result.blockId = params.blockId
          if (params.blockName) result.blockName = params.blockName
          return result
        }

        return baseResult
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    id: { type: 'string', description: 'Memory identifier (for add operation)' },
    conversationId: { type: 'string', description: 'Conversation identifier' },
    blockId: { type: 'string', description: 'Block identifier' },
    blockName: { type: 'string', description: 'Block name' },
    role: { type: 'string', description: 'Agent role' },
    content: { type: 'string', description: 'Memory content' },
  },
  outputs: {
    memories: { type: 'json', description: 'Memory data' },
    id: { type: 'string', description: 'Memory identifier' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: microsoft_excel.ts]---
Location: sim-main/apps/sim/blocks/blocks/microsoft_excel.ts

```typescript
import { MicrosoftExcelIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { MicrosoftExcelResponse } from '@/tools/microsoft_excel/types'

export const MicrosoftExcelBlock: BlockConfig<MicrosoftExcelResponse> = {
  type: 'microsoft_excel',
  name: 'Microsoft Excel',
  description: 'Read, write, and update data',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Microsoft Excel into the workflow. Can read, write, update, add to table, and create new worksheets.',
  docsLink: 'https://docs.sim.ai/tools/microsoft_excel',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: MicrosoftExcelIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Read Data', id: 'read' },
        { label: 'Write/Update Data', id: 'write' },
        { label: 'Add to Table', id: 'table_add' },
        { label: 'Add Worksheet', id: 'worksheet_add' },
      ],
      value: () => 'read',
    },
    {
      id: 'credential',
      title: 'Microsoft Account',
      type: 'oauth-input',
      serviceId: 'microsoft-excel',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'Files.Read',
        'Files.ReadWrite',
        'offline_access',
      ],
      placeholder: 'Select Microsoft account',
      required: true,
    },
    {
      id: 'spreadsheetId',
      title: 'Select Sheet',
      type: 'file-selector',
      canonicalParamId: 'spreadsheetId',
      serviceId: 'microsoft-excel',
      requiredScopes: [],
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      placeholder: 'Select a spreadsheet',
      dependsOn: ['credential'],
      mode: 'basic',
    },
    {
      id: 'manualSpreadsheetId',
      title: 'Spreadsheet ID',
      type: 'short-input',
      canonicalParamId: 'spreadsheetId',
      placeholder: 'Enter spreadsheet ID',
      dependsOn: ['credential'],
      mode: 'advanced',
    },
    {
      id: 'range',
      title: 'Range',
      type: 'short-input',
      placeholder: 'Sheet name and cell range (e.g., Sheet1!A1:D10)',
      condition: { field: 'operation', value: ['read', 'write', 'update'] },
    },
    {
      id: 'tableName',
      title: 'Table Name',
      type: 'short-input',
      placeholder: 'Name of the Excel table',
      condition: { field: 'operation', value: ['table_add'] },
      required: true,
    },
    {
      id: 'worksheetName',
      title: 'Worksheet Name',
      type: 'short-input',
      placeholder: 'Name of the new worksheet (max 31 characters)',
      condition: { field: 'operation', value: ['worksheet_add'] },
      required: true,
    },
    {
      id: 'values',
      title: 'Values',
      type: 'long-input',
      placeholder:
        'Enter values as JSON array of arrays (e.g., [["A1", "B1"], ["A2", "B2"]]) or an array of objects (e.g., [{"name":"John", "age":30}, {"name":"Jane", "age":25}])',
      condition: { field: 'operation', value: 'write' },
      required: true,
    },
    {
      id: 'valueInputOption',
      title: 'Value Input Option',
      type: 'dropdown',
      options: [
        { label: 'User Entered (Parse formulas)', id: 'USER_ENTERED' },
        { label: "Raw (Don't parse formulas)", id: 'RAW' },
      ],
      condition: { field: 'operation', value: 'write' },
    },
    {
      id: 'values',
      title: 'Values',
      type: 'long-input',
      placeholder:
        'Enter values as JSON array of arrays (e.g., [["A1", "B1"], ["A2", "B2"]]) or an array of objects (e.g., [{"name":"John", "age":30}, {"name":"Jane", "age":25}])',
      condition: { field: 'operation', value: 'update' },
      required: true,
    },
    {
      id: 'valueInputOption',
      title: 'Value Input Option',
      type: 'dropdown',
      options: [
        { label: 'User Entered (Parse formulas)', id: 'USER_ENTERED' },
        { label: "Raw (Don't parse formulas)", id: 'RAW' },
      ],
      condition: { field: 'operation', value: 'update' },
    },
    {
      id: 'values',
      title: 'Values',
      type: 'long-input',
      placeholder:
        'Enter values as JSON array of arrays (e.g., [["A1", "B1"], ["A2", "B2"]]) or an array of objects (e.g., [{"name":"John", "age":30}, {"name":"Jane", "age":25}])',
      condition: { field: 'operation', value: 'table_add' },
      required: true,
    },
  ],
  tools: {
    access: [
      'microsoft_excel_read',
      'microsoft_excel_write',
      'microsoft_excel_table_add',
      'microsoft_excel_worksheet_add',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'read':
            return 'microsoft_excel_read'
          case 'write':
            return 'microsoft_excel_write'
          case 'table_add':
            return 'microsoft_excel_table_add'
          case 'worksheet_add':
            return 'microsoft_excel_worksheet_add'
          default:
            throw new Error(`Invalid Microsoft Excel operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const {
          credential,
          values,
          spreadsheetId,
          manualSpreadsheetId,
          tableName,
          worksheetName,
          ...rest
        } = params

        const effectiveSpreadsheetId = (spreadsheetId || manualSpreadsheetId || '').trim()

        let parsedValues
        try {
          parsedValues = values ? JSON.parse(values as string) : undefined
        } catch (error) {
          throw new Error('Invalid JSON format for values')
        }

        if (!effectiveSpreadsheetId) {
          throw new Error('Spreadsheet ID is required.')
        }

        if (params.operation === 'table_add' && !tableName) {
          throw new Error('Table name is required for table operations.')
        }

        if (params.operation === 'worksheet_add' && !worksheetName) {
          throw new Error('Worksheet name is required for worksheet operations.')
        }

        const baseParams = {
          ...rest,
          spreadsheetId: effectiveSpreadsheetId,
          values: parsedValues,
          credential,
        }

        if (params.operation === 'table_add') {
          return {
            ...baseParams,
            tableName,
          }
        }

        if (params.operation === 'worksheet_add') {
          return {
            ...baseParams,
            worksheetName,
          }
        }

        return baseParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Microsoft Excel access token' },
    spreadsheetId: { type: 'string', description: 'Spreadsheet identifier' },
    manualSpreadsheetId: { type: 'string', description: 'Manual spreadsheet identifier' },
    range: { type: 'string', description: 'Cell range' },
    tableName: { type: 'string', description: 'Table name' },
    worksheetName: { type: 'string', description: 'Worksheet name' },
    values: { type: 'string', description: 'Cell values data' },
    valueInputOption: { type: 'string', description: 'Value input option' },
  },
  outputs: {
    data: { type: 'json', description: 'Excel range data with sheet information and cell values' },
    metadata: {
      type: 'json',
      description: 'Spreadsheet metadata including ID, URL, and sheet details',
    },
    updatedRange: { type: 'string', description: 'The range that was updated (write operations)' },
    updatedRows: { type: 'number', description: 'Number of rows updated (write operations)' },
    updatedColumns: { type: 'number', description: 'Number of columns updated (write operations)' },
    updatedCells: {
      type: 'number',
      description: 'Total number of cells updated (write operations)',
    },
    index: { type: 'number', description: 'Row index for table add operations' },
    values: { type: 'json', description: 'Cell values array for table add operations' },
    worksheet: {
      type: 'json',
      description: 'Details of the newly created worksheet (worksheet_add operations)',
    },
  },
}
```

--------------------------------------------------------------------------------

````
