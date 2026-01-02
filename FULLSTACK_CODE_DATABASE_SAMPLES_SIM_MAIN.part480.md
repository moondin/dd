---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 480
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 480 of 933)

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

---[FILE: qdrant.ts]---
Location: sim-main/apps/sim/blocks/blocks/qdrant.ts

```typescript
import { QdrantIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { QdrantResponse } from '@/tools/qdrant/types'

export const QdrantBlock: BlockConfig<QdrantResponse> = {
  type: 'qdrant',
  name: 'Qdrant',
  description: 'Use Qdrant vector database',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate Qdrant into the workflow. Can upsert, search, and fetch points.',
  docsLink: 'https://qdrant.tech/documentation/',
  category: 'tools',
  bgColor: '#1A223F',
  icon: QdrantIcon,

  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Upsert', id: 'upsert' },
        { label: 'Search', id: 'search' },
        { label: 'Fetch', id: 'fetch' },
      ],
      value: () => 'upsert',
    },
    // Upsert fields
    {
      id: 'url',
      title: 'Qdrant URL',
      type: 'short-input',
      placeholder: 'http://localhost:6333',
      condition: { field: 'operation', value: 'upsert' },
      required: true,
    },
    {
      id: 'collection',
      title: 'Collection',
      type: 'short-input',
      placeholder: 'my-collection',
      condition: { field: 'operation', value: 'upsert' },
      required: true,
    },
    {
      id: 'points',
      title: 'Points',
      type: 'long-input',
      placeholder: '[{"id": 1, "vector": [0.1, 0.2], "payload": {"category": "a"}}]',
      condition: { field: 'operation', value: 'upsert' },
      required: true,
    },
    // Search fields
    {
      id: 'url',
      title: 'Qdrant URL',
      type: 'short-input',
      placeholder: 'http://localhost:6333',
      condition: { field: 'operation', value: 'search' },
      required: true,
    },
    {
      id: 'collection',
      title: 'Collection',
      type: 'short-input',
      placeholder: 'my-collection',
      condition: { field: 'operation', value: 'search' },
      required: true,
    },
    {
      id: 'vector',
      title: 'Query Vector',
      type: 'long-input',
      placeholder: '[0.1, 0.2]',
      condition: { field: 'operation', value: 'search' },
      required: true,
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'search' },
    },
    {
      id: 'filter',
      title: 'Filter',
      type: 'long-input',
      placeholder: '{"must":[{"key":"city","match":{"value":"London"}}]}',
      condition: { field: 'operation', value: 'search' },
    },
    {
      id: 'search_return_data',
      title: 'Return Data',
      type: 'dropdown',
      options: [
        { label: 'Payload Only', id: 'payload_only' },
        { label: 'Vector Only', id: 'vector_only' },
        { label: 'Both Payload and Vector', id: 'both' },
        { label: 'None (IDs and scores only)', id: 'none' },
      ],
      value: () => 'payload_only',
      condition: { field: 'operation', value: 'search' },
    },
    // Fetch fields
    {
      id: 'url',
      title: 'Qdrant URL',
      type: 'short-input',
      placeholder: 'http://localhost:6333',
      condition: { field: 'operation', value: 'fetch' },
      required: true,
    },
    {
      id: 'collection',
      title: 'Collection',
      type: 'short-input',
      placeholder: 'my-collection',
      condition: { field: 'operation', value: 'fetch' },
      required: true,
    },
    {
      id: 'ids',
      title: 'IDs',
      type: 'long-input',
      placeholder: '["370446a3-310f-58db-8ce7-31db947c6c1e"]',
      condition: { field: 'operation', value: 'fetch' },
      required: true,
    },
    {
      id: 'fetch_return_data',
      title: 'Return Data',
      type: 'dropdown',
      options: [
        { label: 'Payload Only', id: 'payload_only' },
        { label: 'Vector Only', id: 'vector_only' },
        { label: 'Both Payload and Vector', id: 'both' },
        { label: 'None (IDs only)', id: 'none' },
      ],
      value: () => 'payload_only',
      condition: { field: 'operation', value: 'fetch' },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Your Qdrant API key (optional)',
      password: true,
      required: true,
    },
  ],

  tools: {
    access: ['qdrant_upsert_points', 'qdrant_search_vector', 'qdrant_fetch_points'],
    config: {
      tool: (params: Record<string, any>) => {
        switch (params.operation) {
          case 'upsert':
            return 'qdrant_upsert_points'
          case 'search':
            return 'qdrant_search_vector'
          case 'fetch':
            return 'qdrant_fetch_points'
          default:
            throw new Error('Invalid operation selected')
        }
      },
    },
  },

  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    url: { type: 'string', description: 'Qdrant server URL' },
    apiKey: { type: 'string', description: 'Qdrant API key' },
    collection: { type: 'string', description: 'Collection name' },
    points: { type: 'json', description: 'Points to upsert' },
    vector: { type: 'json', description: 'Query vector' },
    limit: { type: 'number', description: 'Result limit' },
    filter: { type: 'json', description: 'Search filter' },
    ids: { type: 'json', description: 'Point identifiers' },
    search_return_data: { type: 'string', description: 'Data to return from search' },
    fetch_return_data: { type: 'string', description: 'Data to return from fetch' },
    with_payload: { type: 'boolean', description: 'Include payload' },
    with_vector: { type: 'boolean', description: 'Include vectors' },
  },

  outputs: {
    matches: { type: 'json', description: 'Search matches' },
    upsertedCount: { type: 'number', description: 'Upserted count' },
    data: { type: 'json', description: 'Response data' },
    status: { type: 'string', description: 'Operation status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: rds.ts]---
Location: sim-main/apps/sim/blocks/blocks/rds.ts

```typescript
import { RDSIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { RdsResponse } from '@/tools/rds/types'

export const RDSBlock: BlockConfig<RdsResponse> = {
  type: 'rds',
  name: 'Amazon RDS',
  description: 'Connect to Amazon RDS via Data API',
  longDescription:
    'Integrate Amazon RDS Aurora Serverless into the workflow using the Data API. Can query, insert, update, delete, and execute raw SQL without managing database connections.',
  docsLink: 'https://docs.sim.ai/tools/rds',
  category: 'tools',
  bgColor: 'linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)',
  icon: RDSIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Query (SELECT)', id: 'query' },
        { label: 'Insert Data', id: 'insert' },
        { label: 'Update Data', id: 'update' },
        { label: 'Delete Data', id: 'delete' },
        { label: 'Execute Raw SQL', id: 'execute' },
      ],
      value: () => 'query',
    },
    {
      id: 'region',
      title: 'AWS Region',
      type: 'short-input',
      placeholder: 'us-east-1',
      required: true,
    },
    {
      id: 'accessKeyId',
      title: 'AWS Access Key ID',
      type: 'short-input',
      placeholder: 'AKIA...',
      password: true,
      required: true,
    },
    {
      id: 'secretAccessKey',
      title: 'AWS Secret Access Key',
      type: 'short-input',
      placeholder: 'Your secret access key',
      password: true,
      required: true,
    },
    {
      id: 'resourceArn',
      title: 'Resource ARN',
      type: 'short-input',
      placeholder: 'arn:aws:rds:us-east-1:123456789:cluster:my-cluster',
      required: true,
    },
    {
      id: 'secretArn',
      title: 'Secret ARN',
      type: 'short-input',
      placeholder: 'arn:aws:secretsmanager:us-east-1:123456789:secret:my-secret',
      required: true,
    },
    {
      id: 'database',
      title: 'Database Name',
      type: 'short-input',
      placeholder: 'your_database',
      required: false,
    },
    // Table field for insert/update/delete operations
    {
      id: 'table',
      title: 'Table Name',
      type: 'short-input',
      placeholder: 'users',
      condition: { field: 'operation', value: 'insert' },
      required: true,
    },
    {
      id: 'table',
      title: 'Table Name',
      type: 'short-input',
      placeholder: 'users',
      condition: { field: 'operation', value: 'update' },
      required: true,
    },
    {
      id: 'table',
      title: 'Table Name',
      type: 'short-input',
      placeholder: 'users',
      condition: { field: 'operation', value: 'delete' },
      required: true,
    },
    // SQL Query field
    {
      id: 'query',
      title: 'SQL Query',
      type: 'code',
      placeholder: 'SELECT * FROM users WHERE active = true',
      condition: { field: 'operation', value: 'query' },
      required: true,
      wandConfig: {
        enabled: true,
        maintainHistory: true,
        prompt: `You are an expert SQL database developer. Write SQL queries based on the user's request.

### CONTEXT
{context}

### CRITICAL INSTRUCTION
Return ONLY the SQL query. Do not include any explanations, markdown formatting, comments, or additional text. Just the raw SQL query.

### QUERY GUIDELINES
1. **Syntax**: Use standard SQL syntax compatible with both MySQL and PostgreSQL
2. **Performance**: Write efficient queries with proper indexing considerations
3. **Security**: Use parameterized queries when applicable
4. **Readability**: Format queries with proper indentation and spacing
5. **Best Practices**: Follow standard SQL naming conventions

### EXAMPLES

**Simple Select**: "Get all active users"
→ SELECT id, name, email, created_at
  FROM users
  WHERE active = true
  ORDER BY created_at DESC;

**Complex Join**: "Get users with their order counts and total spent"
→ SELECT
      u.id,
      u.name,
      u.email,
      COUNT(o.id) as order_count,
      COALESCE(SUM(o.total), 0) as total_spent
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
  WHERE u.active = true
  GROUP BY u.id, u.name, u.email
  HAVING COUNT(o.id) > 0
  ORDER BY total_spent DESC;

### REMEMBER
Return ONLY the SQL query - no explanations, no markdown, no extra text.`,
        placeholder: 'Describe the SQL query you need...',
        generationType: 'sql-query',
      },
    },
    {
      id: 'query',
      title: 'SQL Query',
      type: 'code',
      placeholder: 'SELECT * FROM table_name',
      condition: { field: 'operation', value: 'execute' },
      required: true,
      wandConfig: {
        enabled: true,
        maintainHistory: true,
        prompt: `You are an expert SQL database developer. Write SQL queries based on the user's request.

### CONTEXT
{context}

### CRITICAL INSTRUCTION
Return ONLY the SQL query. Do not include any explanations, markdown formatting, comments, or additional text. Just the raw SQL query.

### QUERY GUIDELINES
1. **Syntax**: Use standard SQL syntax compatible with both MySQL and PostgreSQL
2. **Performance**: Write efficient queries with proper indexing considerations
3. **Security**: Use parameterized queries when applicable
4. **Readability**: Format queries with proper indentation and spacing
5. **Best Practices**: Follow standard SQL naming conventions

### EXAMPLES

**Simple Select**: "Get all active users"
→ SELECT id, name, email, created_at
  FROM users
  WHERE active = true
  ORDER BY created_at DESC;

**Create Table**: "Create a users table"
→ CREATE TABLE users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

### REMEMBER
Return ONLY the SQL query - no explanations, no markdown, no extra text.`,
        placeholder: 'Describe the SQL query you need...',
        generationType: 'sql-query',
      },
    },
    // Data for insert operations
    {
      id: 'data',
      title: 'Data (JSON)',
      type: 'code',
      placeholder: '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "active": true\n}',
      condition: { field: 'operation', value: 'insert' },
      required: true,
    },
    // Set clause for updates
    {
      id: 'data',
      title: 'Update Data (JSON)',
      type: 'code',
      placeholder: '{\n  "name": "Jane Doe",\n  "email": "jane@example.com"\n}',
      condition: { field: 'operation', value: 'update' },
      required: true,
    },
    // Conditions for update/delete (parameterized for SQL injection prevention)
    {
      id: 'conditions',
      title: 'Conditions (JSON)',
      type: 'code',
      placeholder: '{\n  "id": 1\n}',
      condition: { field: 'operation', value: 'update' },
      required: true,
    },
    {
      id: 'conditions',
      title: 'Conditions (JSON)',
      type: 'code',
      placeholder: '{\n  "id": 1\n}',
      condition: { field: 'operation', value: 'delete' },
      required: true,
    },
  ],
  tools: {
    access: ['rds_query', 'rds_insert', 'rds_update', 'rds_delete', 'rds_execute'],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'query':
            return 'rds_query'
          case 'insert':
            return 'rds_insert'
          case 'update':
            return 'rds_update'
          case 'delete':
            return 'rds_delete'
          case 'execute':
            return 'rds_execute'
          default:
            throw new Error(`Invalid RDS operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { operation, data, conditions, ...rest } = params

        // Parse JSON fields
        const parseJson = (value: unknown, fieldName: string) => {
          if (!value) return undefined
          if (typeof value === 'object') return value
          if (typeof value === 'string' && value.trim()) {
            try {
              return JSON.parse(value)
            } catch (parseError) {
              const errorMsg =
                parseError instanceof Error ? parseError.message : 'Unknown JSON error'
              throw new Error(`Invalid JSON in ${fieldName}: ${errorMsg}`)
            }
          }
          return undefined
        }

        const parsedData = parseJson(data, 'data')
        const parsedConditions = parseJson(conditions, 'conditions')

        // Build connection config
        const connectionConfig = {
          region: rest.region,
          accessKeyId: rest.accessKeyId,
          secretAccessKey: rest.secretAccessKey,
          resourceArn: rest.resourceArn,
          secretArn: rest.secretArn,
          database: rest.database,
        }

        // Build params object
        const result: Record<string, unknown> = { ...connectionConfig }

        if (rest.table) result.table = rest.table
        if (rest.query) result.query = rest.query
        if (parsedConditions !== undefined) result.conditions = parsedConditions
        if (parsedData !== undefined) result.data = parsedData

        return result
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Database operation to perform' },
    region: { type: 'string', description: 'AWS region' },
    accessKeyId: { type: 'string', description: 'AWS access key ID' },
    secretAccessKey: { type: 'string', description: 'AWS secret access key' },
    resourceArn: { type: 'string', description: 'Aurora DB cluster ARN' },
    secretArn: { type: 'string', description: 'Secrets Manager secret ARN' },
    database: { type: 'string', description: 'Database name' },
    table: { type: 'string', description: 'Table name' },
    query: { type: 'string', description: 'SQL query to execute' },
    data: { type: 'json', description: 'Data for insert/update operations' },
    conditions: { type: 'json', description: 'Conditions for update/delete (e.g., {"id": 1})' },
  },
  outputs: {
    message: {
      type: 'string',
      description: 'Success or error message describing the operation outcome',
    },
    rows: {
      type: 'array',
      description: 'Array of rows returned from the query',
    },
    rowCount: {
      type: 'number',
      description: 'Number of rows affected by the operation',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: reddit.ts]---
Location: sim-main/apps/sim/blocks/blocks/reddit.ts

```typescript
import { RedditIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { RedditResponse } from '@/tools/reddit/types'

export const RedditBlock: BlockConfig<RedditResponse> = {
  type: 'reddit',
  name: 'Reddit',
  description: 'Access Reddit data and content',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Reddit into workflows. Read posts, comments, and search content. Submit posts, vote, reply, edit, and manage your Reddit account.',
  docsLink: 'https://docs.sim.ai/tools/reddit',
  category: 'tools',
  bgColor: '#FF5700',
  icon: RedditIcon,
  subBlocks: [
    // Operation selection
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Get Posts', id: 'get_posts' },
        { label: 'Get Comments', id: 'get_comments' },
        { label: 'Get Controversial Posts', id: 'get_controversial' },
        { label: 'Search Subreddit', id: 'search' },
        { label: 'Submit Post', id: 'submit_post' },
        { label: 'Vote', id: 'vote' },
        { label: 'Save', id: 'save' },
        { label: 'Unsave', id: 'unsave' },
        { label: 'Reply', id: 'reply' },
        { label: 'Edit', id: 'edit' },
        { label: 'Delete', id: 'delete' },
        { label: 'Subscribe', id: 'subscribe' },
      ],
      value: () => 'get_posts',
    },

    // Reddit OAuth Authentication
    {
      id: 'credential',
      title: 'Reddit Account',
      type: 'oauth-input',
      serviceId: 'reddit',
      requiredScopes: [
        'identity',
        'read',
        'submit',
        'vote',
        'save',
        'edit',
        'subscribe',
        'history',
        'privatemessages',
        'account',
        'mysubreddits',
        'flair',
        'report',
        'modposts',
        'modflair',
        'modmail',
      ],
      placeholder: 'Select Reddit account',
      required: true,
    },

    // Common fields - appear for all actions
    {
      id: 'subreddit',
      title: 'Subreddit',
      type: 'short-input',
      placeholder: 'Enter subreddit name (without r/)',
      condition: {
        field: 'operation',
        value: ['get_posts', 'get_comments', 'get_controversial', 'search'],
      },
      required: true,
    },

    // Get Posts specific fields
    {
      id: 'sort',
      title: 'Sort By',
      type: 'dropdown',
      options: [
        { label: 'Hot', id: 'hot' },
        { label: 'New', id: 'new' },
        { label: 'Top', id: 'top' },
        { label: 'Rising', id: 'rising' },
      ],
      condition: {
        field: 'operation',
        value: 'get_posts',
      },
      required: true,
    },
    {
      id: 'time',
      title: 'Time Filter (for Top sort)',
      type: 'dropdown',
      options: [
        { label: 'Day', id: 'day' },
        { label: 'Week', id: 'week' },
        { label: 'Month', id: 'month' },
        { label: 'Year', id: 'year' },
        { label: 'All Time', id: 'all' },
      ],
      condition: {
        field: 'operation',
        value: 'get_posts',
        and: {
          field: 'sort',
          value: 'top',
        },
      },
    },
    {
      id: 'limit',
      title: 'Max Posts',
      type: 'short-input',
      placeholder: '10',
      condition: {
        field: 'operation',
        value: 'get_posts',
      },
    },

    // Get Comments specific fields
    {
      id: 'postId',
      title: 'Post ID',
      type: 'short-input',
      placeholder: 'Enter post ID',
      condition: {
        field: 'operation',
        value: 'get_comments',
      },
      required: true,
    },
    {
      id: 'commentSort',
      title: 'Sort Comments By',
      type: 'dropdown',
      options: [
        { label: 'Confidence', id: 'confidence' },
        { label: 'Top', id: 'top' },
        { label: 'New', id: 'new' },
        { label: 'Controversial', id: 'controversial' },
        { label: 'Old', id: 'old' },
        { label: 'Random', id: 'random' },
        { label: 'Q&A', id: 'qa' },
      ],
      condition: {
        field: 'operation',
        value: 'get_comments',
      },
    },
    {
      id: 'commentLimit',
      title: 'Number of Comments',
      type: 'short-input',
      placeholder: '50',
      condition: {
        field: 'operation',
        value: 'get_comments',
      },
    },

    // Get Controversial specific fields
    {
      id: 'controversialTime',
      title: 'Time Filter',
      type: 'dropdown',
      options: [
        { label: 'Hour', id: 'hour' },
        { label: 'Day', id: 'day' },
        { label: 'Week', id: 'week' },
        { label: 'Month', id: 'month' },
        { label: 'Year', id: 'year' },
        { label: 'All Time', id: 'all' },
      ],
      condition: {
        field: 'operation',
        value: 'get_controversial',
      },
    },
    {
      id: 'controversialLimit',
      title: 'Max Posts',
      type: 'short-input',
      placeholder: '10',
      condition: {
        field: 'operation',
        value: 'get_controversial',
      },
    },

    // Search specific fields
    {
      id: 'searchQuery',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Enter search query',
      condition: {
        field: 'operation',
        value: 'search',
      },
      required: true,
    },
    {
      id: 'searchSort',
      title: 'Sort By',
      type: 'dropdown',
      options: [
        { label: 'Relevance', id: 'relevance' },
        { label: 'Hot', id: 'hot' },
        { label: 'Top', id: 'top' },
        { label: 'New', id: 'new' },
        { label: 'Comments', id: 'comments' },
      ],
      condition: {
        field: 'operation',
        value: 'search',
      },
    },
    {
      id: 'searchTime',
      title: 'Time Filter',
      type: 'dropdown',
      options: [
        { label: 'Hour', id: 'hour' },
        { label: 'Day', id: 'day' },
        { label: 'Week', id: 'week' },
        { label: 'Month', id: 'month' },
        { label: 'Year', id: 'year' },
        { label: 'All Time', id: 'all' },
      ],
      condition: {
        field: 'operation',
        value: 'search',
      },
    },
    {
      id: 'searchLimit',
      title: 'Max Results',
      type: 'short-input',
      placeholder: '10',
      condition: {
        field: 'operation',
        value: 'search',
      },
    },

    // Submit Post specific fields
    {
      id: 'submitSubreddit',
      title: 'Subreddit',
      type: 'short-input',
      placeholder: 'Enter subreddit name (without r/)',
      condition: {
        field: 'operation',
        value: 'submit_post',
      },
      required: true,
    },
    {
      id: 'title',
      title: 'Post Title',
      type: 'short-input',
      placeholder: 'Enter post title',
      condition: {
        field: 'operation',
        value: 'submit_post',
      },
      required: true,
    },
    {
      id: 'postType',
      title: 'Post Type',
      type: 'dropdown',
      options: [
        { label: 'Text Post', id: 'text' },
        { label: 'Link Post', id: 'link' },
      ],
      condition: {
        field: 'operation',
        value: 'submit_post',
      },
      value: () => 'text',
      required: true,
    },
    {
      id: 'text',
      title: 'Post Text (Markdown)',
      type: 'long-input',
      placeholder: 'Enter post text in markdown format',
      condition: {
        field: 'operation',
        value: 'submit_post',
        and: {
          field: 'postType',
          value: 'text',
        },
      },
    },
    {
      id: 'url',
      title: 'URL',
      type: 'short-input',
      placeholder: 'Enter URL to share',
      condition: {
        field: 'operation',
        value: 'submit_post',
        and: {
          field: 'postType',
          value: 'link',
        },
      },
    },
    {
      id: 'nsfw',
      title: 'Mark as NSFW',
      type: 'dropdown',
      options: [
        { label: 'No', id: 'false' },
        { label: 'Yes', id: 'true' },
      ],
      condition: {
        field: 'operation',
        value: 'submit_post',
      },
      value: () => 'false',
    },
    {
      id: 'spoiler',
      title: 'Mark as Spoiler',
      type: 'dropdown',
      options: [
        { label: 'No', id: 'false' },
        { label: 'Yes', id: 'true' },
      ],
      condition: {
        field: 'operation',
        value: 'submit_post',
      },
      value: () => 'false',
    },

    // Vote specific fields
    {
      id: 'voteId',
      title: 'Post/Comment ID',
      type: 'short-input',
      placeholder: 'Enter thing ID (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
      condition: {
        field: 'operation',
        value: 'vote',
      },
      required: true,
    },
    {
      id: 'voteDirection',
      title: 'Vote Direction',
      type: 'dropdown',
      options: [
        { label: 'Upvote', id: '1' },
        { label: 'Unvote', id: '0' },
        { label: 'Downvote', id: '-1' },
      ],
      condition: {
        field: 'operation',
        value: 'vote',
      },
      value: () => '1',
      required: true,
    },

    // Save/Unsave specific fields
    {
      id: 'saveId',
      title: 'Post/Comment ID',
      type: 'short-input',
      placeholder: 'Enter thing ID (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
      condition: {
        field: 'operation',
        value: ['save', 'unsave'],
      },
      required: true,
    },
    {
      id: 'saveCategory',
      title: 'Category',
      type: 'short-input',
      placeholder: 'Enter category name',
      condition: {
        field: 'operation',
        value: 'save',
      },
    },

    // Reply specific fields
    {
      id: 'replyParentId',
      title: 'Parent Post/Comment ID',
      type: 'short-input',
      placeholder: 'Enter thing ID to reply to (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
      condition: {
        field: 'operation',
        value: 'reply',
      },
      required: true,
    },
    {
      id: 'replyText',
      title: 'Reply Text (Markdown)',
      type: 'long-input',
      placeholder: 'Enter reply text in markdown format',
      condition: {
        field: 'operation',
        value: 'reply',
      },
      required: true,
    },

    // Edit specific fields
    {
      id: 'editThingId',
      title: 'Post/Comment ID',
      type: 'short-input',
      placeholder: 'Enter thing ID to edit (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
      condition: {
        field: 'operation',
        value: 'edit',
      },
      required: true,
    },
    {
      id: 'editText',
      title: 'New Text (Markdown)',
      type: 'long-input',
      placeholder: 'Enter new text in markdown format',
      condition: {
        field: 'operation',
        value: 'edit',
      },
      required: true,
    },

    // Delete specific fields
    {
      id: 'deleteId',
      title: 'Post/Comment ID',
      type: 'short-input',
      placeholder: 'Enter thing ID to delete (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
      condition: {
        field: 'operation',
        value: 'delete',
      },
      required: true,
    },

    // Subscribe specific fields
    {
      id: 'subscribeSubreddit',
      title: 'Subreddit',
      type: 'short-input',
      placeholder: 'Enter subreddit name (without r/)',
      condition: {
        field: 'operation',
        value: 'subscribe',
      },
      required: true,
    },
    {
      id: 'subscribeAction',
      title: 'Action',
      type: 'dropdown',
      options: [
        { label: 'Subscribe', id: 'sub' },
        { label: 'Unsubscribe', id: 'unsub' },
      ],
      condition: {
        field: 'operation',
        value: 'subscribe',
      },
      value: () => 'sub',
      required: true,
    },
  ],
  tools: {
    access: [
      'reddit_get_posts',
      'reddit_get_comments',
      'reddit_get_controversial',
      'reddit_search',
      'reddit_submit_post',
      'reddit_vote',
      'reddit_save',
      'reddit_unsave',
      'reddit_reply',
      'reddit_edit',
      'reddit_delete',
      'reddit_subscribe',
    ],
    config: {
      tool: (inputs) => {
        const operation = inputs.operation || 'get_posts'

        if (operation === 'get_comments') {
          return 'reddit_get_comments'
        }

        if (operation === 'get_controversial') {
          return 'reddit_get_controversial'
        }

        if (operation === 'search') {
          return 'reddit_search'
        }

        if (operation === 'submit_post') {
          return 'reddit_submit_post'
        }

        if (operation === 'vote') {
          return 'reddit_vote'
        }

        if (operation === 'save') {
          return 'reddit_save'
        }

        if (operation === 'unsave') {
          return 'reddit_unsave'
        }

        if (operation === 'reply') {
          return 'reddit_reply'
        }

        if (operation === 'edit') {
          return 'reddit_edit'
        }

        if (operation === 'delete') {
          return 'reddit_delete'
        }

        if (operation === 'subscribe') {
          return 'reddit_subscribe'
        }

        return 'reddit_get_posts'
      },
      params: (inputs) => {
        const operation = inputs.operation || 'get_posts'
        const { credential, ...rest } = inputs

        if (operation === 'get_comments') {
          return {
            postId: rest.postId,
            subreddit: rest.subreddit,
            sort: rest.commentSort,
            limit: rest.commentLimit ? Number.parseInt(rest.commentLimit) : undefined,
            credential: credential,
          }
        }

        if (operation === 'get_controversial') {
          return {
            subreddit: rest.subreddit,
            time: rest.controversialTime,
            limit: rest.controversialLimit ? Number.parseInt(rest.controversialLimit) : undefined,
            credential: credential,
          }
        }

        if (operation === 'search') {
          return {
            subreddit: rest.subreddit,
            query: rest.searchQuery,
            sort: rest.searchSort,
            time: rest.searchTime,
            limit: rest.searchLimit ? Number.parseInt(rest.searchLimit) : undefined,
            credential: credential,
          }
        }

        if (operation === 'submit_post') {
          return {
            subreddit: rest.submitSubreddit,
            title: rest.title,
            text: rest.postType === 'text' ? rest.text : undefined,
            url: rest.postType === 'link' ? rest.url : undefined,
            nsfw: rest.nsfw === 'true',
            spoiler: rest.spoiler === 'true',
            credential: credential,
          }
        }

        if (operation === 'vote') {
          return {
            id: rest.voteId,
            dir: Number.parseInt(rest.voteDirection),
            credential: credential,
          }
        }

        if (operation === 'save') {
          return {
            id: rest.saveId,
            category: rest.saveCategory,
            credential: credential,
          }
        }

        if (operation === 'unsave') {
          return {
            id: rest.saveId,
            credential: credential,
          }
        }

        if (operation === 'reply') {
          return {
            parent_id: rest.replyParentId,
            text: rest.replyText,
            credential: credential,
          }
        }

        if (operation === 'edit') {
          return {
            thing_id: rest.editThingId,
            text: rest.editText,
            credential: credential,
          }
        }

        if (operation === 'delete') {
          return {
            id: rest.deleteId,
            credential: credential,
          }
        }

        if (operation === 'subscribe') {
          return {
            subreddit: rest.subscribeSubreddit,
            action: rest.subscribeAction,
            credential: credential,
          }
        }

        return {
          subreddit: rest.subreddit,
          sort: rest.sort,
          limit: rest.limit ? Number.parseInt(rest.limit) : undefined,
          time: rest.sort === 'top' ? rest.time : undefined,
          credential: credential,
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Reddit access token' },
    subreddit: { type: 'string', description: 'Subreddit name' },
    sort: { type: 'string', description: 'Sort order' },
    time: { type: 'string', description: 'Time filter' },
    limit: { type: 'number', description: 'Maximum posts' },
    postId: { type: 'string', description: 'Post identifier' },
    commentSort: { type: 'string', description: 'Comment sort order' },
    commentLimit: { type: 'number', description: 'Maximum comments' },
    controversialTime: { type: 'string', description: 'Time filter for controversial posts' },
    controversialLimit: { type: 'number', description: 'Maximum controversial posts' },
    searchQuery: { type: 'string', description: 'Search query text' },
    searchSort: { type: 'string', description: 'Search result sort order' },
    searchTime: { type: 'string', description: 'Time filter for search results' },
    searchLimit: { type: 'number', description: 'Maximum search results' },
    submitSubreddit: { type: 'string', description: 'Subreddit to submit post to' },
    title: { type: 'string', description: 'Post title' },
    postType: { type: 'string', description: 'Type of post (text or link)' },
    text: { type: 'string', description: 'Post text content in markdown' },
    url: { type: 'string', description: 'URL for link posts' },
    nsfw: { type: 'boolean', description: 'Mark post as NSFW' },
    spoiler: { type: 'boolean', description: 'Mark post as spoiler' },
    voteId: { type: 'string', description: 'Post or comment ID to vote on' },
    voteDirection: {
      type: 'number',
      description: 'Vote direction (1=upvote, 0=unvote, -1=downvote)',
    },
    saveId: { type: 'string', description: 'Post or comment ID to save/unsave' },
    saveCategory: { type: 'string', description: 'Category for saved items' },
    replyParentId: { type: 'string', description: 'Parent post or comment ID to reply to' },
    replyText: { type: 'string', description: 'Reply text in markdown' },
    editThingId: { type: 'string', description: 'Post or comment ID to edit' },
    editText: { type: 'string', description: 'New text content in markdown' },
    deleteId: { type: 'string', description: 'Post or comment ID to delete' },
    subscribeSubreddit: { type: 'string', description: 'Subreddit to subscribe/unsubscribe' },
    subscribeAction: { type: 'string', description: 'Subscribe action (sub or unsub)' },
  },
  outputs: {
    subreddit: { type: 'string', description: 'Subreddit name' },
    posts: { type: 'json', description: 'Posts data' },
    post: { type: 'json', description: 'Single post data' },
    comments: { type: 'json', description: 'Comments data' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: resend.ts]---
Location: sim-main/apps/sim/blocks/blocks/resend.ts

```typescript
import { ResendIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { MailSendResult } from '@/tools/resend/types'

export const ResendBlock: BlockConfig<MailSendResult> = {
  type: 'resend',
  name: 'Resend',
  description: 'Send emails with Resend.',
  longDescription: 'Integrate Resend into the workflow. Can send emails. Requires API Key.',
  docsLink: 'https://docs.sim.ai/tools/resend',
  category: 'tools',
  bgColor: '#181C1E',
  icon: ResendIcon,

  subBlocks: [
    {
      id: 'fromAddress',
      title: 'From Address',
      type: 'short-input',
      placeholder: 'sender@yourdomain.com',
      required: true,
    },
    {
      id: 'to',
      title: 'To',
      type: 'short-input',
      placeholder: 'recipient@example.com',
      required: true,
    },
    {
      id: 'subject',
      title: 'Subject',
      type: 'short-input',
      placeholder: 'Email subject',
      required: true,
    },
    {
      id: 'body',
      title: 'Body',
      type: 'long-input',
      placeholder: 'Email body content',
      required: true,
    },
    {
      id: 'contentType',
      title: 'Content Type',
      type: 'dropdown',
      options: [
        { label: 'Plain Text', id: 'text' },
        { label: 'HTML', id: 'html' },
      ],
      value: () => 'text',
      required: false,
    },
    {
      id: 'resendApiKey',
      title: 'Resend API Key',
      type: 'short-input',
      placeholder: 'Your Resend API key',
      required: true,
      password: true,
    },
  ],

  tools: {
    access: ['resend_send'],
    config: {
      tool: () => 'resend_send',
      params: (params) => ({
        resendApiKey: params.resendApiKey,
        fromAddress: params.fromAddress,
        to: params.to,
        subject: params.subject,
        body: params.body,
      }),
    },
  },

  inputs: {
    fromAddress: { type: 'string', description: 'Email address to send from' },
    to: { type: 'string', description: 'Recipient email address' },
    subject: { type: 'string', description: 'Email subject' },
    body: { type: 'string', description: 'Email body content' },
    contentType: { type: 'string', description: 'Content type (text or html)' },
    resendApiKey: { type: 'string', description: 'Resend API key for sending emails' },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the email was sent successfully' },
    to: { type: 'string', description: 'Recipient email address' },
    subject: { type: 'string', description: 'Email subject' },
    body: { type: 'string', description: 'Email body content' },
  },
}
```

--------------------------------------------------------------------------------

````
