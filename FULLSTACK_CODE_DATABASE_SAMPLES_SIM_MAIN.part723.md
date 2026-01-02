---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 723
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 723 of 933)

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
Location: sim-main/apps/sim/tools/mongodb/query.ts

```typescript
import type { MongoDBQueryParams, MongoDBResponse } from '@/tools/mongodb/types'
import type { ToolConfig } from '@/tools/types'

export const queryTool: ToolConfig<MongoDBQueryParams, MongoDBResponse> = {
  id: 'mongodb_query',
  name: 'MongoDB Query',
  description: 'Execute find operation on MongoDB collection',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'MongoDB server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'MongoDB server port (default: 27017)',
    },
    database: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database name to connect to',
    },
    username: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'MongoDB username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'MongoDB password',
    },
    authSource: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Authentication database',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    collection: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Collection name to query',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'MongoDB query filter as JSON string',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of documents to return',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort criteria as JSON string',
    },
  },

  request: {
    url: '/api/tools/mongodb/query',
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
      authSource: params.authSource,
      ssl: params.ssl || 'preferred',
      collection: params.collection,
      query: params.query,
      limit: params.limit ? Number(params.limit) : undefined,
      sort: params.sort,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'MongoDB query failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Query executed successfully',
        documents: data.documents || [],
        documentCount: data.documentCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    documents: { type: 'array', description: 'Array of documents returned from the query' },
    documentCount: { type: 'number', description: 'Number of documents returned' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/mongodb/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface MongoDBConnectionConfig {
  host: string
  port: number
  database: string
  username?: string
  password?: string
  authSource?: string
  ssl?: 'disabled' | 'required' | 'preferred'
}

export interface MongoDBQueryParams extends MongoDBConnectionConfig {
  collection: string
  query?: string
  limit?: number
  sort?: string
}

export interface MongoDBInsertParams extends MongoDBConnectionConfig {
  collection: string
  documents: unknown[]
}

export interface MongoDBUpdateParams extends MongoDBConnectionConfig {
  collection: string
  filter: string
  update: string
  upsert?: boolean
  multi?: boolean
}

export interface MongoDBDeleteParams extends MongoDBConnectionConfig {
  collection: string
  filter: string
  multi?: boolean
}

export interface MongoDBExecuteParams extends MongoDBConnectionConfig {
  collection: string
  pipeline: string
}

export interface MongoDBBaseResponse extends ToolResponse {
  output: {
    message: string
    documents?: unknown[]
    documentCount: number
    insertedId?: string
    insertedIds?: string[]
    modifiedCount?: number
    deletedCount?: number
    matchedCount?: number
  }
  error?: string
}

export interface MongoDBQueryResponse extends MongoDBBaseResponse {}
export interface MongoDBInsertResponse extends MongoDBBaseResponse {}
export interface MongoDBUpdateResponse extends MongoDBBaseResponse {}
export interface MongoDBDeleteResponse extends MongoDBBaseResponse {}
export interface MongoDBExecuteResponse extends MongoDBBaseResponse {}
export interface MongoDBResponse extends MongoDBBaseResponse {}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/mongodb/update.ts

```typescript
import type { MongoDBResponse, MongoDBUpdateParams } from '@/tools/mongodb/types'
import type { ToolConfig } from '@/tools/types'

export const updateTool: ToolConfig<MongoDBUpdateParams, MongoDBResponse> = {
  id: 'mongodb_update',
  name: 'MongoDB Update',
  description: 'Update documents in MongoDB collection',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'MongoDB server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'MongoDB server port (default: 27017)',
    },
    database: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database name to connect to',
    },
    username: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'MongoDB username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'MongoDB password',
    },
    authSource: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Authentication database',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    collection: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Collection name to update',
    },
    filter: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Filter criteria as JSON string',
    },
    update: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Update operations as JSON string',
    },
    upsert: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Create document if not found',
    },
    multi: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Update multiple documents',
    },
  },

  request: {
    url: '/api/tools/mongodb/update',
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
      authSource: params.authSource,
      ssl: params.ssl || 'preferred',
      collection: params.collection,
      filter: params.filter,
      update: params.update,
      upsert: params.upsert || false,
      multi: params.multi || false,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'MongoDB update failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Documents updated successfully',
        matchedCount: data.matchedCount || 0,
        modifiedCount: data.modifiedCount || 0,
        documentCount: data.documentCount || 0,
        insertedId: data.insertedId,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    matchedCount: { type: 'number', description: 'Number of documents matched by filter' },
    modifiedCount: { type: 'number', description: 'Number of documents modified' },
    documentCount: { type: 'number', description: 'Total number of documents affected' },
    insertedId: { type: 'string', description: 'ID of inserted document (if upsert)' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/mysql/delete.ts

```typescript
import type { MySQLDeleteParams, MySQLResponse } from '@/tools/mysql/types'
import type { ToolConfig } from '@/tools/types'

export const deleteTool: ToolConfig<MySQLDeleteParams, MySQLResponse> = {
  id: 'mysql_delete',
  name: 'MySQL Delete',
  description: 'Delete records from MySQL database',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'MySQL server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'MySQL server port (default: 3306)',
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
      description: 'Database username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database password',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name to delete from',
    },
    where: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'WHERE clause condition (without WHERE keyword)',
    },
  },

  request: {
    url: '/api/tools/mysql/delete',
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
      ssl: params.ssl || 'required',
      table: params.table,
      where: params.where,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'MySQL delete failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Data deleted successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Array of deleted rows' },
    rowCount: { type: 'number', description: 'Number of rows deleted' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: execute.ts]---
Location: sim-main/apps/sim/tools/mysql/execute.ts

```typescript
import type { MySQLExecuteParams, MySQLResponse } from '@/tools/mysql/types'
import type { ToolConfig } from '@/tools/types'

export const executeTool: ToolConfig<MySQLExecuteParams, MySQLResponse> = {
  id: 'mysql_execute',
  name: 'MySQL Execute',
  description: 'Execute raw SQL query on MySQL database',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'MySQL server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'MySQL server port (default: 3306)',
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
      description: 'Database username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database password',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Raw SQL query to execute',
    },
  },

  request: {
    url: '/api/tools/mysql/execute',
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
      ssl: params.ssl || 'required',
      query: params.query,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'MySQL execute failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Query executed successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Array of rows returned from the query' },
    rowCount: { type: 'number', description: 'Number of rows affected' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/mysql/index.ts

```typescript
import { deleteTool } from './delete'
import { executeTool } from './execute'
import { insertTool } from './insert'
import { queryTool } from './query'
import { updateTool } from './update'

export const mysqlDeleteTool = deleteTool
export const mysqlExecuteTool = executeTool
export const mysqlInsertTool = insertTool
export const mysqlQueryTool = queryTool
export const mysqlUpdateTool = updateTool

export * from './types'
```

--------------------------------------------------------------------------------

---[FILE: insert.ts]---
Location: sim-main/apps/sim/tools/mysql/insert.ts

```typescript
import type { MySQLInsertParams, MySQLResponse } from '@/tools/mysql/types'
import type { ToolConfig } from '@/tools/types'

export const insertTool: ToolConfig<MySQLInsertParams, MySQLResponse> = {
  id: 'mysql_insert',
  name: 'MySQL Insert',
  description: 'Insert new record into MySQL database',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'MySQL server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'MySQL server port (default: 3306)',
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
      description: 'Database username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database password',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name to insert into',
    },
    data: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Data to insert as key-value pairs',
    },
  },

  request: {
    url: '/api/tools/mysql/insert',
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
      ssl: params.ssl || 'required',
      table: params.table,
      data: params.data,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'MySQL insert failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Data inserted successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Array of inserted rows' },
    rowCount: { type: 'number', description: 'Number of rows inserted' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: query.ts]---
Location: sim-main/apps/sim/tools/mysql/query.ts

```typescript
import type { MySQLQueryParams, MySQLResponse } from '@/tools/mysql/types'
import type { ToolConfig } from '@/tools/types'

export const queryTool: ToolConfig<MySQLQueryParams, MySQLResponse> = {
  id: 'mysql_query',
  name: 'MySQL Query',
  description: 'Execute SELECT query on MySQL database',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'MySQL server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'MySQL server port (default: 3306)',
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
      description: 'Database username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database password',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'SQL SELECT query to execute',
    },
  },

  request: {
    url: '/api/tools/mysql/query',
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
      ssl: params.ssl || 'required',
      query: params.query,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'MySQL query failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Query executed successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Array of rows returned from the query' },
    rowCount: { type: 'number', description: 'Number of rows returned' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/mysql/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface MySQLConnectionConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl: 'disabled' | 'required' | 'preferred'
}

export interface MySQLQueryParams extends MySQLConnectionConfig {
  query: string
}

export interface MySQLInsertParams extends MySQLConnectionConfig {
  table: string
  data: Record<string, unknown>
}

export interface MySQLUpdateParams extends MySQLConnectionConfig {
  table: string
  data: Record<string, unknown>
  where: string
}

export interface MySQLDeleteParams extends MySQLConnectionConfig {
  table: string
  where: string
}

export interface MySQLExecuteParams extends MySQLConnectionConfig {
  query: string
}

export interface MySQLBaseResponse extends ToolResponse {
  output: {
    message: string
    rows: unknown[]
    rowCount: number
  }
  error?: string
}

export interface MySQLQueryResponse extends MySQLBaseResponse {}
export interface MySQLInsertResponse extends MySQLBaseResponse {}
export interface MySQLUpdateResponse extends MySQLBaseResponse {}
export interface MySQLDeleteResponse extends MySQLBaseResponse {}
export interface MySQLExecuteResponse extends MySQLBaseResponse {}
export interface MySQLResponse extends MySQLBaseResponse {}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/mysql/update.ts

```typescript
import type { MySQLResponse, MySQLUpdateParams } from '@/tools/mysql/types'
import type { ToolConfig } from '@/tools/types'

export const updateTool: ToolConfig<MySQLUpdateParams, MySQLResponse> = {
  id: 'mysql_update',
  name: 'MySQL Update',
  description: 'Update existing records in MySQL database',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'MySQL server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'MySQL server port (default: 3306)',
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
      description: 'Database username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database password',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name to update',
    },
    data: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Data to update as key-value pairs',
    },
    where: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'WHERE clause condition (without WHERE keyword)',
    },
  },

  request: {
    url: '/api/tools/mysql/update',
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
      ssl: params.ssl || 'required',
      table: params.table,
      data: params.data,
      where: params.where,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'MySQL update failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Data updated successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Array of updated rows' },
    rowCount: { type: 'number', description: 'Number of rows updated' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: sim-main/apps/sim/tools/neo4j/create.ts

```typescript
import type { Neo4jCreateParams, Neo4jResponse } from '@/tools/neo4j/types'
import type { ToolConfig } from '@/tools/types'

export const createTool: ToolConfig<Neo4jCreateParams, Neo4jResponse> = {
  id: 'neo4j_create',
  name: 'Neo4j Create',
  description:
    'Execute CREATE statements to add new nodes and relationships to Neo4j graph database',
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
      description: 'Cypher CREATE statement to execute',
    },
    parameters: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Parameters for the Cypher query as a JSON object',
    },
  },

  request: {
    url: '/api/tools/neo4j/create',
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
      throw new Error(data.error || 'Neo4j create operation failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Create operation executed successfully',
        summary: data.summary,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    summary: {
      type: 'json',
      description: 'Creation summary with counters for nodes and relationships created',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/neo4j/delete.ts

```typescript
import type { Neo4jDeleteParams, Neo4jResponse } from '@/tools/neo4j/types'
import type { ToolConfig } from '@/tools/types'

export const deleteTool: ToolConfig<Neo4jDeleteParams, Neo4jResponse> = {
  id: 'neo4j_delete',
  name: 'Neo4j Delete',
  description:
    'Execute DELETE or DETACH DELETE statements to remove nodes and relationships from Neo4j',
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
      description: 'Cypher query with MATCH and DELETE/DETACH DELETE statements',
    },
    parameters: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Parameters for the Cypher query as a JSON object',
    },
    detach: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to use DETACH DELETE to remove relationships before deleting nodes',
    },
  },

  request: {
    url: '/api/tools/neo4j/delete',
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
      detach: params.detach,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Neo4j delete operation failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Delete operation executed successfully',
        summary: data.summary,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    summary: {
      type: 'json',
      description: 'Delete summary with counters for nodes and relationships deleted',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: execute.ts]---
Location: sim-main/apps/sim/tools/neo4j/execute.ts

```typescript
import type { Neo4jExecuteParams, Neo4jResponse } from '@/tools/neo4j/types'
import type { ToolConfig } from '@/tools/types'

export const executeTool: ToolConfig<Neo4jExecuteParams, Neo4jResponse> = {
  id: 'neo4j_execute',
  name: 'Neo4j Execute',
  description: 'Execute arbitrary Cypher queries on Neo4j graph database for complex operations',
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
      description: 'Cypher query to execute (any valid Cypher statement)',
    },
    parameters: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Parameters for the Cypher query as a JSON object',
    },
  },

  request: {
    url: '/api/tools/neo4j/execute',
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
      throw new Error(data.error || 'Neo4j execute operation failed')
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
    summary: { type: 'json', description: 'Execution summary with timing and counters' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/neo4j/index.ts

```typescript
import { createTool } from './create'
import { deleteTool } from './delete'
import { executeTool } from './execute'
import { mergeTool } from './merge'
import { queryTool } from './query'
import { updateTool } from './update'

export const neo4jCreateTool = createTool
export const neo4jDeleteTool = deleteTool
export const neo4jExecuteTool = executeTool
export const neo4jMergeTool = mergeTool
export const neo4jQueryTool = queryTool
export const neo4jUpdateTool = updateTool
export * from './types'
```

--------------------------------------------------------------------------------

---[FILE: merge.ts]---
Location: sim-main/apps/sim/tools/neo4j/merge.ts

```typescript
import type { Neo4jMergeParams, Neo4jResponse } from '@/tools/neo4j/types'
import type { ToolConfig } from '@/tools/types'

export const mergeTool: ToolConfig<Neo4jMergeParams, Neo4jResponse> = {
  id: 'neo4j_merge',
  name: 'Neo4j Merge',
  description:
    'Execute MERGE statements to find or create nodes and relationships in Neo4j (upsert operation)',
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
      description: 'Cypher MERGE statement to execute',
    },
    parameters: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Parameters for the Cypher query as a JSON object',
    },
  },

  request: {
    url: '/api/tools/neo4j/merge',
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
      throw new Error(data.error || 'Neo4j merge operation failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Merge operation executed successfully',
        summary: data.summary,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    summary: {
      type: 'json',
      description: 'Merge summary with counters for nodes/relationships created or matched',
    },
  },
}
```

--------------------------------------------------------------------------------

````
