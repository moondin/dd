---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 724
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 724 of 933)

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

---[FILE: query.ts]---
Location: sim-main/apps/sim/tools/neo4j/query.ts

```typescript
import type { Neo4jQueryParams, Neo4jResponse } from '@/tools/neo4j/types'
import type { ToolConfig } from '@/tools/types'

export const queryTool: ToolConfig<Neo4jQueryParams, Neo4jResponse> = {
  id: 'neo4j_query',
  name: 'Neo4j Query',
  description:
    'Execute MATCH queries to read nodes and relationships from Neo4j graph database. For best performance and to prevent large result sets, include LIMIT in your query (e.g., "MATCH (n:User) RETURN n LIMIT 100") or use LIMIT $limit with a limit parameter.',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Neo4j server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'Neo4j server port (default: 7687 for Bolt protocol)',
    },
    database: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database name to connect to',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Neo4j username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Neo4j password',
    },
    encryption: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Connection encryption mode (enabled, disabled)',
    },
    cypherQuery: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Cypher query to execute (typically MATCH statements)',
    },
    parameters: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Parameters for the Cypher query as a JSON object. Use for any dynamic values including LIMIT (e.g., query: "MATCH (n) RETURN n LIMIT $limit", parameters: {limit: 100}).',
    },
  },

  request: {
    url: '/api/tools/neo4j/query',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port),
      database: params.database,
      username: params.username,
      password: params.password,
      encryption: params.encryption || 'disabled',
      cypherQuery: params.cypherQuery,
      parameters: params.parameters,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Neo4j query failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Query executed successfully',
        records: data.records || [],
        recordCount: data.recordCount || 0,
        summary: data.summary,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    records: { type: 'array', description: 'Array of records returned from the query' },
    recordCount: { type: 'number', description: 'Number of records returned' },
    summary: { type: 'json', description: 'Query execution summary with timing and counters' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/neo4j/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface Neo4jConnectionConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  encryption?: 'enabled' | 'disabled'
}

export interface Neo4jQueryParams extends Neo4jConnectionConfig {
  cypherQuery: string
  parameters?: Record<string, unknown>
}

export interface Neo4jCreateParams extends Neo4jConnectionConfig {
  cypherQuery: string
  parameters?: Record<string, unknown>
}

export interface Neo4jMergeParams extends Neo4jConnectionConfig {
  cypherQuery: string
  parameters?: Record<string, unknown>
}

export interface Neo4jUpdateParams extends Neo4jConnectionConfig {
  cypherQuery: string
  parameters?: Record<string, unknown>
}

export interface Neo4jDeleteParams extends Neo4jConnectionConfig {
  cypherQuery: string
  parameters?: Record<string, unknown>
  detach?: boolean
}

export interface Neo4jExecuteParams extends Neo4jConnectionConfig {
  cypherQuery: string
  parameters?: Record<string, unknown>
}

export interface Neo4jBaseResponse extends ToolResponse {
  output: {
    message: string
    records?: unknown[]
    recordCount?: number
    summary?: {
      resultAvailableAfter: number
      resultConsumedAfter: number
      counters?: {
        nodesCreated: number
        nodesDeleted: number
        relationshipsCreated: number
        relationshipsDeleted: number
        propertiesSet: number
        labelsAdded: number
        labelsRemoved: number
        indexesAdded: number
        indexesRemoved: number
        constraintsAdded: number
        constraintsRemoved: number
      }
    }
  }
  error?: string
}

export interface Neo4jQueryResponse extends Neo4jBaseResponse {}
export interface Neo4jCreateResponse extends Neo4jBaseResponse {}
export interface Neo4jMergeResponse extends Neo4jBaseResponse {}
export interface Neo4jUpdateResponse extends Neo4jBaseResponse {}
export interface Neo4jDeleteResponse extends Neo4jBaseResponse {}
export interface Neo4jExecuteResponse extends Neo4jBaseResponse {}
export interface Neo4jResponse extends Neo4jBaseResponse {}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/neo4j/update.ts

```typescript
import type { Neo4jResponse, Neo4jUpdateParams } from '@/tools/neo4j/types'
import type { ToolConfig } from '@/tools/types'

export const updateTool: ToolConfig<Neo4jUpdateParams, Neo4jResponse> = {
  id: 'neo4j_update',
  name: 'Neo4j Update',
  description:
    'Execute SET statements to update properties of existing nodes and relationships in Neo4j',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Neo4j server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'Neo4j server port (default: 7687 for Bolt protocol)',
    },
    database: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database name to connect to',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Neo4j username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Neo4j password',
    },
    encryption: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Connection encryption mode (enabled, disabled)',
    },
    cypherQuery: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Cypher query with MATCH and SET statements to update properties',
    },
    parameters: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Parameters for the Cypher query as a JSON object',
    },
  },

  request: {
    url: '/api/tools/neo4j/update',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port),
      database: params.database,
      username: params.username,
      password: params.password,
      encryption: params.encryption || 'disabled',
      cypherQuery: params.cypherQuery,
      parameters: params.parameters,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Neo4j update operation failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Update operation executed successfully',
        summary: data.summary,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    summary: { type: 'json', description: 'Update summary with counters for properties set' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_database.ts]---
Location: sim-main/apps/sim/tools/notion/create_database.ts

```typescript
import type { NotionCreateDatabaseParams, NotionResponse } from '@/tools/notion/types'
import type { ToolConfig } from '@/tools/types'

export const notionCreateDatabaseTool: ToolConfig<NotionCreateDatabaseParams, NotionResponse> = {
  id: 'notion_create_database',
  name: 'Create Notion Database',
  description: 'Create a new database in Notion with custom properties',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'notion',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Notion OAuth access token',
    },
    parentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the parent page where the database will be created',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Title for the new database',
    },
    properties: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Database properties as JSON object (optional, will create a default "Name" property if empty)',
    },
  },

  request: {
    url: () => 'https://api.notion.com/v1/databases',
    method: 'POST',
    headers: (params: NotionCreateDatabaseParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      }
    },
    body: (params: NotionCreateDatabaseParams) => {
      let parsedProperties

      // Handle properties - use provided JSON or default to Name property
      if (params.properties?.trim()) {
        try {
          parsedProperties = JSON.parse(params.properties)
        } catch (error) {
          throw new Error(
            `Invalid properties JSON: ${error instanceof Error ? error.message : String(error)}`
          )
        }
      } else {
        // Default properties with a Name column
        parsedProperties = {
          Name: {
            title: {},
          },
        }
      }

      // Format parent ID
      const formattedParentId = params.parentId.replace(
        /(.{8})(.{4})(.{4})(.{4})(.{12})/,
        '$1-$2-$3-$4-$5'
      )

      const body = {
        parent: {
          type: 'page_id',
          page_id: formattedParentId,
        },
        title: [
          {
            type: 'text',
            text: {
              content: params.title,
            },
          },
        ],
        properties: parsedProperties,
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract database title
    const title = data.title?.map((t: any) => t.plain_text || '').join('') || 'Untitled Database'

    // Extract properties for display
    const properties = data.properties || {}
    const propertyList = Object.entries(properties)
      .map(([name, prop]: [string, any]) => `  ${name}: ${prop.type}`)
      .join('\n')

    const content = [
      `Database "${title}" created successfully!`,
      '',
      'Properties:',
      propertyList,
      '',
      `Database ID: ${data.id}`,
      `URL: ${data.url}`,
    ].join('\n')

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
          title,
          url: data.url,
          createdTime: data.created_time,
          properties: data.properties,
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Success message with database details and properties list',
    },
    metadata: {
      type: 'object',
      description:
        'Database metadata including ID, title, URL, creation time, and properties schema',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_page.ts]---
Location: sim-main/apps/sim/tools/notion/create_page.ts

```typescript
import type { NotionCreatePageParams, NotionResponse } from '@/tools/notion/types'
import type { ToolConfig } from '@/tools/types'

export const notionCreatePageTool: ToolConfig<NotionCreatePageParams, NotionResponse> = {
  id: 'notion_create_page',
  name: 'Notion Page Creator',
  description: 'Create a new page in Notion',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'notion',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Notion OAuth access token',
    },
    parentId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the parent page',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Title of the new page',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional content to add to the page upon creation',
    },
  },

  request: {
    url: () => 'https://api.notion.com/v1/pages',
    method: 'POST',
    headers: (params: NotionCreatePageParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      }
    },
    body: (params: NotionCreatePageParams) => {
      // Format parent ID with hyphens if needed
      const formattedParentId = params.parentId.replace(
        /(.{8})(.{4})(.{4})(.{4})(.{12})/,
        '$1-$2-$3-$4-$5'
      )

      // Prepare the body for page parent
      const body: any = {
        parent: {
          type: 'page_id',
          page_id: formattedParentId,
        },
      }

      // Add title if provided
      if (params.title) {
        body.properties = {
          title: {
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: params.title,
                },
              },
            ],
          },
        }
      } else {
        body.properties = {}
      }

      // Add content if provided
      if (params.content) {
        body.children = [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: params.content,
                  },
                },
              ],
            },
          },
        ]
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    let pageTitle = 'Untitled'

    // Try to extract the title from properties
    if (data.properties?.title) {
      const titleProperty = data.properties.title
      if (
        titleProperty.title &&
        Array.isArray(titleProperty.title) &&
        titleProperty.title.length > 0
      ) {
        pageTitle = titleProperty.title.map((t: any) => t.plain_text || '').join('')
      }
    }

    return {
      success: true,
      output: {
        content: `Successfully created page "${pageTitle}"`,
        metadata: {
          title: pageTitle,
          pageId: data.id,
          url: data.url,
          lastEditedTime: data.last_edited_time,
          createdTime: data.created_time,
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Success message confirming page creation',
    },
    metadata: {
      type: 'object',
      description: 'Page metadata including title, page ID, URL, and timestamps',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/notion/index.ts

```typescript
import { notionCreateDatabaseTool } from '@/tools/notion/create_database'
import { notionCreatePageTool } from '@/tools/notion/create_page'
import { notionQueryDatabaseTool } from '@/tools/notion/query_database'
import { notionReadTool } from '@/tools/notion/read'
import { notionReadDatabaseTool } from '@/tools/notion/read_database'
import { notionSearchTool } from '@/tools/notion/search'
import { notionUpdatePageTool } from '@/tools/notion/update_page'
import { notionWriteTool } from '@/tools/notion/write'

export {
  notionReadTool,
  notionReadDatabaseTool,
  notionWriteTool,
  notionCreatePageTool,
  notionUpdatePageTool,
  notionQueryDatabaseTool,
  notionSearchTool,
  notionCreateDatabaseTool,
}
```

--------------------------------------------------------------------------------

---[FILE: query_database.ts]---
Location: sim-main/apps/sim/tools/notion/query_database.ts

```typescript
import type { NotionQueryDatabaseParams, NotionResponse } from '@/tools/notion/types'
import { extractTitle, formatPropertyValue } from '@/tools/notion/utils'
import type { ToolConfig } from '@/tools/types'

export const notionQueryDatabaseTool: ToolConfig<NotionQueryDatabaseParams, NotionResponse> = {
  id: 'notion_query_database',
  name: 'Query Notion Database',
  description: 'Query and filter Notion database entries with advanced filtering',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'notion',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Notion OAuth access token',
    },
    databaseId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the database to query',
    },
    filter: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter conditions as JSON (optional)',
    },
    sorts: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort criteria as JSON array (optional)',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 100, max: 100)',
    },
  },

  request: {
    url: (params: NotionQueryDatabaseParams) => {
      const formattedId = params.databaseId.replace(
        /(.{8})(.{4})(.{4})(.{4})(.{12})/,
        '$1-$2-$3-$4-$5'
      )
      return `https://api.notion.com/v1/databases/${formattedId}/query`
    },
    method: 'POST',
    headers: (params: NotionQueryDatabaseParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      }
    },
    body: (params: NotionQueryDatabaseParams) => {
      const body: any = {}

      // Add filter if provided
      if (params.filter) {
        try {
          body.filter = JSON.parse(params.filter)
        } catch (error) {
          throw new Error(
            `Invalid filter JSON: ${error instanceof Error ? error.message : String(error)}`
          )
        }
      }

      // Add sorts if provided
      if (params.sorts) {
        try {
          body.sorts = JSON.parse(params.sorts)
        } catch (error) {
          throw new Error(
            `Invalid sorts JSON: ${error instanceof Error ? error.message : String(error)}`
          )
        }
      }

      // Add page size if provided
      if (params.pageSize) {
        body.page_size = Math.min(Number(params.pageSize), 100)
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    const results = data.results || []

    // Format the results into readable content
    const content = results
      .map((page: any, index: number) => {
        const properties = page.properties || {}
        const title = extractTitle(properties)
        const propertyValues = Object.entries(properties)
          .map(([key, value]: [string, any]) => {
            const formattedValue = formatPropertyValue(value)
            return `  ${key}: ${formattedValue}`
          })
          .join('\n')

        return `Entry ${index + 1}${title ? ` - ${title}` : ''}:\n${propertyValues}`
      })
      .join('\n\n')

    return {
      success: true,
      output: {
        content: content || 'No results found',
        metadata: {
          totalResults: results.length,
          hasMore: data.has_more || false,
          nextCursor: data.next_cursor || null,
          results: results,
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Formatted list of database entries with their properties',
    },
    metadata: {
      type: 'object',
      description:
        'Query metadata including total results count, pagination info, and raw results array',
      properties: {
        totalResults: { type: 'number', description: 'Number of results returned' },
        hasMore: { type: 'boolean', description: 'Whether more results are available' },
        nextCursor: { type: 'string', description: 'Cursor for pagination', optional: true },
        results: {
          type: 'array',
          description: 'Raw Notion page objects',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Page ID' },
              properties: { type: 'object', description: 'Page properties' },
              created_time: { type: 'string', description: 'Creation timestamp' },
              last_edited_time: { type: 'string', description: 'Last edit timestamp' },
              url: { type: 'string', description: 'Page URL' },
              archived: { type: 'boolean', description: 'Whether page is archived' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read.ts]---
Location: sim-main/apps/sim/tools/notion/read.ts

```typescript
import type { NotionReadParams, NotionResponse } from '@/tools/notion/types'
import type { ToolConfig } from '@/tools/types'

export const notionReadTool: ToolConfig<NotionReadParams, NotionResponse> = {
  id: 'notion_read',
  name: 'Notion Reader',
  description: 'Read content from a Notion page',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'notion',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Notion OAuth access token',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the Notion page to read',
    },
  },

  request: {
    url: (params: NotionReadParams) => {
      // Format page ID with hyphens if needed
      const formattedId = params.pageId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')

      // Use the page endpoint to get page properties
      return `https://api.notion.com/v1/pages/${formattedId}`
    },
    method: 'GET',
    headers: (params: NotionReadParams) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, params?: NotionReadParams) => {
    const data = await response.json()
    let pageTitle = 'Untitled'

    // Extract title from properties
    if (data.properties?.title) {
      const titleProperty = data.properties.title
      if (
        titleProperty.title &&
        Array.isArray(titleProperty.title) &&
        titleProperty.title.length > 0
      ) {
        pageTitle = titleProperty.title.map((t: any) => t.plain_text || '').join('')
      }
    }

    // Now fetch the page content using blocks endpoint
    const pageId = params?.pageId
    const accessToken = params?.accessToken

    if (!pageId || !accessToken) {
      return {
        success: true,
        output: {
          content: '',
          metadata: {
            title: pageTitle,
            lastEditedTime: data.last_edited_time,
            createdTime: data.created_time,
            url: data.url,
          },
        },
      }
    }

    // Format page ID for blocks endpoint
    const formattedId = pageId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')

    // Fetch page content using blocks endpoint
    const blocksResponse = await fetch(
      `https://api.notion.com/v1/blocks/${formattedId}/children?page_size=100`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      }
    )

    if (!blocksResponse.ok) {
      // If we can't get blocks, still return the page metadata
      return {
        success: true,
        output: {
          content: '',
          metadata: {
            title: pageTitle,
            lastEditedTime: data.last_edited_time,
            createdTime: data.created_time,
            url: data.url,
          },
        },
      }
    }

    const blocksData = await blocksResponse.json()

    // Extract text content from blocks
    const blocks = blocksData.results || []
    const content = blocks
      .map((block: any) => {
        if (block.type === 'paragraph') {
          return block.paragraph.rich_text.map((text: any) => text.plain_text).join('')
        }
        if (block.type === 'heading_1') {
          return `# ${block.heading_1.rich_text.map((text: any) => text.plain_text).join('')}`
        }
        if (block.type === 'heading_2') {
          return `## ${block.heading_2.rich_text.map((text: any) => text.plain_text).join('')}`
        }
        if (block.type === 'heading_3') {
          return `### ${block.heading_3.rich_text.map((text: any) => text.plain_text).join('')}`
        }
        if (block.type === 'bulleted_list_item') {
          return `• ${block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('')}`
        }
        if (block.type === 'numbered_list_item') {
          return `1. ${block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('')}`
        }
        if (block.type === 'to_do') {
          const checked = block.to_do.checked ? '[x]' : '[ ]'
          return `${checked} ${block.to_do.rich_text.map((text: any) => text.plain_text).join('')}`
        }
        return ''
      })
      .filter(Boolean)
      .join('\n\n')

    return {
      success: true,
      output: {
        content: content,
        metadata: {
          title: pageTitle,
          lastEditedTime: data.last_edited_time,
          createdTime: data.created_time,
          url: data.url,
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Page content in markdown format with headers, paragraphs, lists, and todos',
    },
    metadata: {
      type: 'object',
      description: 'Page metadata including title, URL, and timestamps',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read_database.ts]---
Location: sim-main/apps/sim/tools/notion/read_database.ts

```typescript
import type { NotionResponse } from '@/tools/notion/types'
import type { ToolConfig } from '@/tools/types'

export interface NotionReadDatabaseParams {
  databaseId: string
  accessToken: string
}

export const notionReadDatabaseTool: ToolConfig<NotionReadDatabaseParams, NotionResponse> = {
  id: 'notion_read_database',
  name: 'Read Notion Database',
  description: 'Read database information and structure from Notion',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'notion',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Notion OAuth access token',
    },
    databaseId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the Notion database to read',
    },
  },

  request: {
    url: (params: NotionReadDatabaseParams) => {
      // Format database ID with hyphens if needed
      const formattedId = params.databaseId.replace(
        /(.{8})(.{4})(.{4})(.{4})(.{12})/,
        '$1-$2-$3-$4-$5'
      )

      return `https://api.notion.com/v1/databases/${formattedId}`
    },
    method: 'GET',
    headers: (params: NotionReadDatabaseParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract database title
    const title = data.title?.map((t: any) => t.plain_text || '').join('') || 'Untitled Database'

    // Extract properties for display
    const properties = data.properties || {}
    const propertyList = Object.entries(properties)
      .map(([name, prop]: [string, any]) => `  ${name}: ${prop.type}`)
      .join('\n')

    const content = [
      `Database: ${title}`,
      '',
      'Properties:',
      propertyList,
      '',
      `Database ID: ${data.id}`,
      `URL: ${data.url}`,
      `Created: ${data.created_time ? new Date(data.created_time).toLocaleDateString() : 'Unknown'}`,
      `Last edited: ${data.last_edited_time ? new Date(data.last_edited_time).toLocaleDateString() : 'Unknown'}`,
    ].join('\n')

    return {
      success: true,
      output: {
        content,
        metadata: {
          title,
          url: data.url,
          id: data.id,
          createdTime: data.created_time,
          lastEditedTime: data.last_edited_time,
          properties: data.properties,
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Database information including title, properties schema, and metadata',
    },
    metadata: {
      type: 'object',
      description: 'Database metadata including title, ID, URL, timestamps, and properties schema',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/notion/search.ts

```typescript
import type { NotionResponse, NotionSearchParams } from '@/tools/notion/types'
import { extractTitleFromItem } from '@/tools/notion/utils'
import type { ToolConfig } from '@/tools/types'

export const notionSearchTool: ToolConfig<NotionSearchParams, NotionResponse> = {
  id: 'notion_search',
  name: 'Search Notion Workspace',
  description: 'Search across all pages and databases in Notion workspace',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'notion',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Notion OAuth access token',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Search terms (leave empty to get all pages)',
    },
    filterType: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by object type: page, database, or leave empty for all',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 100, max: 100)',
    },
  },

  request: {
    url: () => 'https://api.notion.com/v1/search',
    method: 'POST',
    headers: (params: NotionSearchParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      }
    },
    body: (params: NotionSearchParams) => {
      const body: any = {}

      // Add query if provided
      if (params.query?.trim()) {
        body.query = params.query.trim()
      }

      // Add filter if provided (skip 'all' as it means no filter)
      if (
        params.filterType &&
        params.filterType !== 'all' &&
        ['page', 'database'].includes(params.filterType)
      ) {
        body.filter = {
          value: params.filterType,
          property: 'object',
        }
      }

      // Add page size if provided
      if (params.pageSize) {
        body.page_size = Math.min(Number(params.pageSize), 100)
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    const results = data.results || []

    // Format the results into readable content
    const content = results
      .map((item: any, index: number) => {
        const objectType = item.object === 'page' ? 'Page' : 'Database'
        const title = extractTitleFromItem(item)
        const url = item.url || ''
        const lastEdited = item.last_edited_time
          ? new Date(item.last_edited_time).toLocaleDateString()
          : ''

        return [
          `${index + 1}. ${objectType}: ${title}`,
          `   URL: ${url}`,
          lastEdited ? `   Last edited: ${lastEdited}` : '',
        ]
          .filter(Boolean)
          .join('\n')
      })
      .join('\n\n')

    return {
      success: true,
      output: {
        content: content || 'No results found',
        metadata: {
          totalResults: results.length,
          hasMore: data.has_more || false,
          nextCursor: data.next_cursor || null,
          results: results,
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Formatted list of search results including pages and databases',
    },
    metadata: {
      type: 'object',
      description:
        'Search metadata including total results count, pagination info, and raw results array',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/notion/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface NotionReadParams {
  pageId: string
  accessToken: string
}

export interface NotionResponse extends ToolResponse {
  output: {
    content: string
    metadata?: {
      title?: string
      lastEditedTime?: string
      createdTime?: string
      url?: string
      // Additional metadata for query/search operations
      totalResults?: number
      hasMore?: boolean
      nextCursor?: string | null
      results?: any[]
      // Additional metadata for create operations
      id?: string
      properties?: Record<string, any>
    }
  }
}

export interface NotionWriteParams {
  pageId: string
  content: string
  accessToken: string
}

export interface NotionCreatePageParams {
  parentId: string
  title?: string
  content?: string
  accessToken: string
}

export interface NotionUpdatePageParams {
  pageId: string
  properties: Record<string, any>
  accessToken: string
}

export interface NotionQueryDatabaseParams {
  databaseId: string
  filter?: string
  sorts?: string
  pageSize?: number
  accessToken: string
}

export interface NotionSearchParams {
  query?: string
  filterType?: string
  pageSize?: number
  accessToken: string
}

export interface NotionCreateDatabaseParams {
  parentId: string
  title: string
  properties?: string
  accessToken: string
}

export interface NotionReadDatabaseParams {
  databaseId: string
  accessToken: string
}
```

--------------------------------------------------------------------------------

---[FILE: update_page.ts]---
Location: sim-main/apps/sim/tools/notion/update_page.ts

```typescript
import type { NotionResponse, NotionUpdatePageParams } from '@/tools/notion/types'
import type { ToolConfig } from '@/tools/types'

export const notionUpdatePageTool: ToolConfig<NotionUpdatePageParams, NotionResponse> = {
  id: 'notion_update_page',
  name: 'Notion Page Updater',
  description: 'Update properties of a Notion page',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'notion',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Notion OAuth access token',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the page to update',
    },
    properties: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description: 'JSON object of properties to update',
    },
  },

  request: {
    url: (params: NotionUpdatePageParams) => {
      // Format page ID with hyphens if needed
      const formattedId = params.pageId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
      return `https://api.notion.com/v1/pages/${formattedId}`
    },
    method: 'PATCH',
    headers: (params: NotionUpdatePageParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      }
    },
    body: (params: NotionUpdatePageParams) => ({
      properties: params.properties,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    let pageTitle = 'Untitled'

    // Try to extract the title from properties
    if (data.properties?.title) {
      const titleProperty = data.properties.title
      if (
        titleProperty.title &&
        Array.isArray(titleProperty.title) &&
        titleProperty.title.length > 0
      ) {
        pageTitle = titleProperty.title.map((t: any) => t.plain_text || '').join('')
      }
    }

    return {
      success: true,
      output: {
        content: 'Successfully updated page properties',
        metadata: {
          title: pageTitle,
          pageId: data.id,
          url: data.url,
          lastEditedTime: data.last_edited_time,
          updatedTime: new Date().toISOString(),
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Success message confirming page properties update',
    },
    metadata: {
      type: 'object',
      description: 'Page metadata including title, page ID, URL, and update timestamps',
    },
  },
}
```

--------------------------------------------------------------------------------

````
