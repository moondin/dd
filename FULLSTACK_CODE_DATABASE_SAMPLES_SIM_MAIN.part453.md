---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 453
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 453 of 933)

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

---[FILE: duckduckgo.ts]---
Location: sim-main/apps/sim/blocks/blocks/duckduckgo.ts

```typescript
import { DuckDuckGoIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { DuckDuckGoResponse } from '@/tools/duckduckgo/types'

export const DuckDuckGoBlock: BlockConfig<DuckDuckGoResponse> = {
  type: 'duckduckgo',
  name: 'DuckDuckGo',
  description: 'Search with DuckDuckGo',
  longDescription:
    'Search the web using DuckDuckGo Instant Answers API. Returns instant answers, abstracts, related topics, and more. Free to use without an API key.',
  docsLink: 'https://docs.sim.ai/tools/duckduckgo',
  category: 'tools',
  bgColor: '#FFFFFF',
  icon: DuckDuckGoIcon,
  subBlocks: [
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter your search query...',
      required: true,
    },
    {
      id: 'noHtml',
      title: 'Remove HTML',
      type: 'switch',
      defaultValue: true,
    },
    {
      id: 'skipDisambig',
      title: 'Skip Disambiguation',
      type: 'switch',
    },
  ],
  tools: {
    access: ['duckduckgo_search'],
    config: {
      tool: () => 'duckduckgo_search',
    },
  },
  inputs: {
    query: { type: 'string', description: 'Search query terms' },
    noHtml: { type: 'boolean', description: 'Remove HTML from text in results' },
    skipDisambig: { type: 'boolean', description: 'Skip disambiguation results' },
  },
  outputs: {
    heading: { type: 'string', description: 'The heading/title of the instant answer' },
    abstract: { type: 'string', description: 'A short abstract summary of the topic' },
    abstractText: { type: 'string', description: 'Plain text version of the abstract' },
    abstractSource: { type: 'string', description: 'The source of the abstract' },
    abstractURL: { type: 'string', description: 'URL to the source of the abstract' },
    image: { type: 'string', description: 'URL to an image related to the topic' },
    answer: { type: 'string', description: 'Direct answer if available' },
    answerType: { type: 'string', description: 'Type of the answer' },
    type: { type: 'string', description: 'Response type (A, D, C, N, E)' },
    relatedTopics: { type: 'json', description: 'Array of related topics' },
    results: { type: 'json', description: 'Array of external link results' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: dynamodb.ts]---
Location: sim-main/apps/sim/blocks/blocks/dynamodb.ts

```typescript
import { DynamoDBIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { DynamoDBResponse } from '@/tools/dynamodb/types'

export const DynamoDBBlock: BlockConfig<DynamoDBResponse> = {
  type: 'dynamodb',
  name: 'Amazon DynamoDB',
  description: 'Connect to Amazon DynamoDB',
  longDescription:
    'Integrate Amazon DynamoDB into workflows. Supports Get, Put, Query, Scan, Update, and Delete operations on DynamoDB tables.',
  docsLink: 'https://docs.sim.ai/tools/dynamodb',
  category: 'tools',
  bgColor: 'linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)',
  icon: DynamoDBIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Get Item', id: 'get' },
        { label: 'Put Item', id: 'put' },
        { label: 'Query', id: 'query' },
        { label: 'Scan', id: 'scan' },
        { label: 'Update Item', id: 'update' },
        { label: 'Delete Item', id: 'delete' },
      ],
      value: () => 'get',
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
      id: 'tableName',
      title: 'Table Name',
      type: 'short-input',
      placeholder: 'my-table',
      required: true,
    },
    // Key field for get, update, delete operations
    {
      id: 'key',
      title: 'Key (JSON)',
      type: 'code',
      placeholder: '{\n  "pk": "user#123"\n}',
      condition: { field: 'operation', value: 'get' },
      required: true,
    },
    {
      id: 'key',
      title: 'Key (JSON)',
      type: 'code',
      placeholder: '{\n  "pk": "user#123"\n}',
      condition: { field: 'operation', value: 'update' },
      required: true,
    },
    {
      id: 'key',
      title: 'Key (JSON)',
      type: 'code',
      placeholder: '{\n  "pk": "user#123"\n}',
      condition: { field: 'operation', value: 'delete' },
      required: true,
    },
    // Consistent read for get
    {
      id: 'consistentRead',
      title: 'Consistent Read',
      type: 'dropdown',
      options: [
        { label: 'Eventually Consistent', id: 'false' },
        { label: 'Strongly Consistent', id: 'true' },
      ],
      value: () => 'false',
      condition: { field: 'operation', value: 'get' },
    },
    // Item for put operation
    {
      id: 'item',
      title: 'Item (JSON)',
      type: 'code',
      placeholder:
        '{\n  "pk": "user#123",\n  "name": "John Doe",\n  "email": "john@example.com"\n}',
      condition: { field: 'operation', value: 'put' },
      required: true,
    },
    // Key condition expression for query
    {
      id: 'keyConditionExpression',
      title: 'Key Condition Expression',
      type: 'short-input',
      placeholder: 'pk = :pk',
      condition: { field: 'operation', value: 'query' },
      required: true,
    },
    // Update expression for update operation
    {
      id: 'updateExpression',
      title: 'Update Expression',
      type: 'short-input',
      placeholder: 'SET #name = :name',
      condition: { field: 'operation', value: 'update' },
      required: true,
    },
    // Filter expression for query and scan
    {
      id: 'filterExpression',
      title: 'Filter Expression',
      type: 'short-input',
      placeholder: 'attribute_exists(email)',
      condition: { field: 'operation', value: 'query' },
    },
    {
      id: 'filterExpression',
      title: 'Filter Expression',
      type: 'short-input',
      placeholder: 'attribute_exists(email)',
      condition: { field: 'operation', value: 'scan' },
    },
    // Projection expression for scan
    {
      id: 'projectionExpression',
      title: 'Projection Expression',
      type: 'short-input',
      placeholder: 'pk, #name, email',
      condition: { field: 'operation', value: 'scan' },
    },
    // Expression attribute names for query, scan, update
    {
      id: 'expressionAttributeNames',
      title: 'Expression Attribute Names (JSON)',
      type: 'code',
      placeholder: '{\n  "#name": "name"\n}',
      condition: { field: 'operation', value: 'query' },
    },
    {
      id: 'expressionAttributeNames',
      title: 'Expression Attribute Names (JSON)',
      type: 'code',
      placeholder: '{\n  "#name": "name"\n}',
      condition: { field: 'operation', value: 'scan' },
    },
    {
      id: 'expressionAttributeNames',
      title: 'Expression Attribute Names (JSON)',
      type: 'code',
      placeholder: '{\n  "#name": "name"\n}',
      condition: { field: 'operation', value: 'update' },
    },
    // Expression attribute values for query, scan, update
    {
      id: 'expressionAttributeValues',
      title: 'Expression Attribute Values (JSON)',
      type: 'code',
      placeholder: '{\n  ":pk": "user#123",\n  ":name": "Jane"\n}',
      condition: { field: 'operation', value: 'query' },
    },
    {
      id: 'expressionAttributeValues',
      title: 'Expression Attribute Values (JSON)',
      type: 'code',
      placeholder: '{\n  ":status": "active"\n}',
      condition: { field: 'operation', value: 'scan' },
    },
    {
      id: 'expressionAttributeValues',
      title: 'Expression Attribute Values (JSON)',
      type: 'code',
      placeholder: '{\n  ":name": "Jane Doe"\n}',
      condition: { field: 'operation', value: 'update' },
    },
    // Index name for query
    {
      id: 'indexName',
      title: 'Index Name',
      type: 'short-input',
      placeholder: 'GSI1',
      condition: { field: 'operation', value: 'query' },
    },
    // Limit for query and scan
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '100',
      condition: { field: 'operation', value: 'query' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '100',
      condition: { field: 'operation', value: 'scan' },
    },
    // Condition expression for update and delete
    {
      id: 'conditionExpression',
      title: 'Condition Expression',
      type: 'short-input',
      placeholder: 'attribute_exists(pk)',
      condition: { field: 'operation', value: 'update' },
    },
    {
      id: 'conditionExpression',
      title: 'Condition Expression',
      type: 'short-input',
      placeholder: 'attribute_exists(pk)',
      condition: { field: 'operation', value: 'delete' },
    },
  ],
  tools: {
    access: [
      'dynamodb_get',
      'dynamodb_put',
      'dynamodb_query',
      'dynamodb_scan',
      'dynamodb_update',
      'dynamodb_delete',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'get':
            return 'dynamodb_get'
          case 'put':
            return 'dynamodb_put'
          case 'query':
            return 'dynamodb_query'
          case 'scan':
            return 'dynamodb_scan'
          case 'update':
            return 'dynamodb_update'
          case 'delete':
            return 'dynamodb_delete'
          default:
            throw new Error(`Invalid DynamoDB operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const {
          operation,
          key,
          item,
          expressionAttributeNames,
          expressionAttributeValues,
          consistentRead,
          limit,
          ...rest
        } = params

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

        const parsedKey = parseJson(key, 'key')
        const parsedItem = parseJson(item, 'item')
        const parsedExpressionAttributeNames = parseJson(
          expressionAttributeNames,
          'expressionAttributeNames'
        )
        const parsedExpressionAttributeValues = parseJson(
          expressionAttributeValues,
          'expressionAttributeValues'
        )

        // Build connection config
        const connectionConfig = {
          region: rest.region,
          accessKeyId: rest.accessKeyId,
          secretAccessKey: rest.secretAccessKey,
        }

        // Build params object
        const result: Record<string, unknown> = {
          ...connectionConfig,
          tableName: rest.tableName,
        }

        if (parsedKey !== undefined) result.key = parsedKey
        if (parsedItem !== undefined) result.item = parsedItem
        if (rest.keyConditionExpression) result.keyConditionExpression = rest.keyConditionExpression
        if (rest.updateExpression) result.updateExpression = rest.updateExpression
        if (rest.filterExpression) result.filterExpression = rest.filterExpression
        if (rest.projectionExpression) result.projectionExpression = rest.projectionExpression
        if (parsedExpressionAttributeNames !== undefined) {
          result.expressionAttributeNames = parsedExpressionAttributeNames
        }
        if (parsedExpressionAttributeValues !== undefined) {
          result.expressionAttributeValues = parsedExpressionAttributeValues
        }
        if (rest.indexName) result.indexName = rest.indexName
        if (limit) result.limit = Number.parseInt(String(limit), 10)
        if (rest.conditionExpression) result.conditionExpression = rest.conditionExpression
        // Handle consistentRead - dropdown sends 'true'/'false' strings or boolean
        if (consistentRead === 'true' || consistentRead === true) {
          result.consistentRead = true
        }

        return result
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'DynamoDB operation to perform' },
    region: { type: 'string', description: 'AWS region' },
    accessKeyId: { type: 'string', description: 'AWS access key ID' },
    secretAccessKey: { type: 'string', description: 'AWS secret access key' },
    tableName: { type: 'string', description: 'DynamoDB table name' },
    key: { type: 'json', description: 'Primary key for get/update/delete operations' },
    item: { type: 'json', description: 'Item to put into the table' },
    keyConditionExpression: { type: 'string', description: 'Key condition for query operations' },
    updateExpression: { type: 'string', description: 'Update expression for update operations' },
    filterExpression: { type: 'string', description: 'Filter expression for query/scan' },
    projectionExpression: { type: 'string', description: 'Attributes to retrieve in scan' },
    expressionAttributeNames: { type: 'json', description: 'Attribute name mappings' },
    expressionAttributeValues: { type: 'json', description: 'Expression attribute values' },
    indexName: { type: 'string', description: 'Secondary index name for query' },
    limit: { type: 'number', description: 'Maximum items to return' },
    conditionExpression: { type: 'string', description: 'Condition for update/delete' },
    consistentRead: { type: 'string', description: 'Use strongly consistent read' },
  },
  outputs: {
    message: {
      type: 'string',
      description: 'Success or error message describing the operation outcome',
    },
    item: {
      type: 'json',
      description: 'Single item returned from get or update operation',
    },
    items: {
      type: 'array',
      description: 'Array of items returned from query or scan',
    },
    count: {
      type: 'number',
      description: 'Number of items returned',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: elasticsearch.ts]---
Location: sim-main/apps/sim/blocks/blocks/elasticsearch.ts

```typescript
import { ElasticsearchIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { ElasticsearchResponse } from '@/tools/elasticsearch/types'

export const ElasticsearchBlock: BlockConfig<ElasticsearchResponse> = {
  type: 'elasticsearch',
  name: 'Elasticsearch',
  description: 'Search, index, and manage data in Elasticsearch',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Elasticsearch into workflows for powerful search, indexing, and data management. Supports document CRUD operations, advanced search queries, bulk operations, index management, and cluster monitoring. Works with both self-hosted and Elastic Cloud deployments.',
  docsLink: 'https://docs.sim.ai/tools/elasticsearch',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: ElasticsearchIcon,
  subBlocks: [
    // Operation selector
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        // Document Operations
        { label: 'Search', id: 'elasticsearch_search' },
        { label: 'Index Document', id: 'elasticsearch_index_document' },
        { label: 'Get Document', id: 'elasticsearch_get_document' },
        { label: 'Update Document', id: 'elasticsearch_update_document' },
        { label: 'Delete Document', id: 'elasticsearch_delete_document' },
        { label: 'Bulk Operations', id: 'elasticsearch_bulk' },
        { label: 'Count Documents', id: 'elasticsearch_count' },
        // Index Management
        { label: 'Create Index', id: 'elasticsearch_create_index' },
        { label: 'Delete Index', id: 'elasticsearch_delete_index' },
        { label: 'Get Index Info', id: 'elasticsearch_get_index' },
        // Cluster Operations
        { label: 'Cluster Health', id: 'elasticsearch_cluster_health' },
        { label: 'Cluster Stats', id: 'elasticsearch_cluster_stats' },
      ],
      value: () => 'elasticsearch_search',
    },

    // Deployment type
    {
      id: 'deploymentType',
      title: 'Deployment Type',
      type: 'dropdown',
      options: [
        { label: 'Self-Hosted', id: 'self_hosted' },
        { label: 'Elastic Cloud', id: 'cloud' },
      ],
      value: () => 'self_hosted',
    },

    // Self-hosted host
    {
      id: 'host',
      title: 'Elasticsearch Host',
      type: 'short-input',
      placeholder: 'https://localhost:9200',
      required: true,
      condition: { field: 'deploymentType', value: 'self_hosted' },
    },

    // Cloud ID
    {
      id: 'cloudId',
      title: 'Cloud ID',
      type: 'short-input',
      placeholder: 'deployment-name:base64-encoded-data',
      required: true,
      condition: { field: 'deploymentType', value: 'cloud' },
    },

    // Authentication method
    {
      id: 'authMethod',
      title: 'Authentication Method',
      type: 'dropdown',
      options: [
        { label: 'API Key', id: 'api_key' },
        { label: 'Basic Auth', id: 'basic_auth' },
      ],
      value: () => 'api_key',
    },

    // API Key
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter encoded API key',
      password: true,
      required: true,
      condition: { field: 'authMethod', value: 'api_key' },
    },

    // Username
    {
      id: 'username',
      title: 'Username',
      type: 'short-input',
      placeholder: 'Enter username',
      required: true,
      condition: { field: 'authMethod', value: 'basic_auth' },
    },

    // Password
    {
      id: 'password',
      title: 'Password',
      type: 'short-input',
      placeholder: 'Enter password',
      password: true,
      required: true,
      condition: { field: 'authMethod', value: 'basic_auth' },
    },

    // Index name - for most operations
    {
      id: 'index',
      title: 'Index Name',
      type: 'short-input',
      placeholder: 'my-index',
      required: true,
      condition: {
        field: 'operation',
        value: [
          'elasticsearch_search',
          'elasticsearch_index_document',
          'elasticsearch_get_document',
          'elasticsearch_update_document',
          'elasticsearch_delete_document',
          'elasticsearch_bulk',
          'elasticsearch_count',
          'elasticsearch_create_index',
          'elasticsearch_delete_index',
          'elasticsearch_get_index',
        ],
      },
    },

    // Document ID - for get/update/delete
    {
      id: 'documentId',
      title: 'Document ID',
      type: 'short-input',
      placeholder: 'unique-document-id',
      required: true,
      condition: {
        field: 'operation',
        value: [
          'elasticsearch_get_document',
          'elasticsearch_update_document',
          'elasticsearch_delete_document',
        ],
      },
    },

    // Optional Document ID - for index document
    {
      id: 'documentId',
      title: 'Document ID',
      type: 'short-input',
      placeholder: 'Leave empty for auto-generated ID',
      condition: { field: 'operation', value: 'elasticsearch_index_document' },
    },

    // Document body - for index
    {
      id: 'document',
      title: 'Document',
      type: 'code',
      placeholder: '{ "field": "value", "another_field": 123 }',
      required: true,
      condition: { field: 'operation', value: 'elasticsearch_index_document' },
    },

    // Document body - for update (partial)
    {
      id: 'document',
      title: 'Partial Document',
      type: 'code',
      placeholder: '{ "field_to_update": "new_value" }',
      required: true,
      condition: { field: 'operation', value: 'elasticsearch_update_document' },
    },

    // Search query
    {
      id: 'query',
      title: 'Search Query',
      type: 'code',
      placeholder: '{ "match": { "field": "search term" } }',
      condition: { field: 'operation', value: 'elasticsearch_search' },
    },

    // Count query
    {
      id: 'query',
      title: 'Query',
      type: 'code',
      placeholder: '{ "match": { "field": "value" } }',
      condition: { field: 'operation', value: 'elasticsearch_count' },
    },

    // Search size
    {
      id: 'size',
      title: 'Number of Results',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'elasticsearch_search' },
    },

    // Search from (offset)
    {
      id: 'from',
      title: 'Offset',
      type: 'short-input',
      placeholder: '0',
      condition: { field: 'operation', value: 'elasticsearch_search' },
    },

    // Sort
    {
      id: 'sort',
      title: 'Sort',
      type: 'code',
      placeholder: '[{ "field": { "order": "asc" } }]',
      condition: { field: 'operation', value: 'elasticsearch_search' },
    },

    // Source includes
    {
      id: 'sourceIncludes',
      title: 'Fields to Include',
      type: 'short-input',
      placeholder: 'field1, field2 (comma-separated)',
      condition: {
        field: 'operation',
        value: ['elasticsearch_search', 'elasticsearch_get_document'],
      },
    },

    // Source excludes
    {
      id: 'sourceExcludes',
      title: 'Fields to Exclude',
      type: 'short-input',
      placeholder: 'field1, field2 (comma-separated)',
      condition: {
        field: 'operation',
        value: ['elasticsearch_search', 'elasticsearch_get_document'],
      },
    },

    // Bulk operations
    {
      id: 'operations',
      title: 'Bulk Operations',
      type: 'code',
      placeholder:
        '{ "index": { "_index": "my-index", "_id": "1" } }\n{ "field": "value" }\n{ "delete": { "_index": "my-index", "_id": "2" } }',
      required: true,
      condition: { field: 'operation', value: 'elasticsearch_bulk' },
    },

    // Index settings
    {
      id: 'settings',
      title: 'Index Settings',
      type: 'code',
      placeholder: '{ "number_of_shards": 1, "number_of_replicas": 1 }',
      condition: { field: 'operation', value: 'elasticsearch_create_index' },
    },

    // Index mappings
    {
      id: 'mappings',
      title: 'Index Mappings',
      type: 'code',
      placeholder: '{ "properties": { "field": { "type": "text" } } }',
      condition: { field: 'operation', value: 'elasticsearch_create_index' },
    },

    // Refresh option
    {
      id: 'refresh',
      title: 'Refresh',
      type: 'dropdown',
      options: [
        { label: 'Default', id: '' },
        { label: 'Wait For', id: 'wait_for' },
        { label: 'Immediate', id: 'true' },
        { label: 'None', id: 'false' },
      ],
      value: () => '',
      condition: {
        field: 'operation',
        value: [
          'elasticsearch_index_document',
          'elasticsearch_delete_document',
          'elasticsearch_bulk',
        ],
      },
    },

    // Cluster health wait for status
    {
      id: 'waitForStatus',
      title: 'Wait for Status',
      type: 'dropdown',
      options: [
        { label: 'None', id: '' },
        { label: 'Green', id: 'green' },
        { label: 'Yellow', id: 'yellow' },
        { label: 'Red', id: 'red' },
      ],
      value: () => '',
      condition: { field: 'operation', value: 'elasticsearch_cluster_health' },
    },

    // Cluster health timeout
    {
      id: 'timeout',
      title: 'Timeout (seconds)',
      type: 'short-input',
      placeholder: '30',
      condition: { field: 'operation', value: 'elasticsearch_cluster_health' },
    },

    // Retry on conflict
    {
      id: 'retryOnConflict',
      title: 'Retry on Conflict',
      type: 'short-input',
      placeholder: '3',
      condition: { field: 'operation', value: 'elasticsearch_update_document' },
    },
  ],

  tools: {
    access: [
      'elasticsearch_search',
      'elasticsearch_index_document',
      'elasticsearch_get_document',
      'elasticsearch_update_document',
      'elasticsearch_delete_document',
      'elasticsearch_bulk',
      'elasticsearch_count',
      'elasticsearch_create_index',
      'elasticsearch_delete_index',
      'elasticsearch_get_index',
      'elasticsearch_cluster_health',
      'elasticsearch_cluster_stats',
    ],
    config: {
      tool: (params) => {
        // Convert numeric strings to numbers
        if (params.size) {
          params.size = Number(params.size)
        }
        if (params.from) {
          params.from = Number(params.from)
        }
        if (params.retryOnConflict) {
          params.retryOnConflict = Number(params.retryOnConflict)
        }
        // Append 's' to timeout for Elasticsearch time format
        if (params.timeout && !params.timeout.endsWith('s')) {
          params.timeout = `${params.timeout}s`
        }

        // Return the operation as the tool ID
        return params.operation || 'elasticsearch_search'
      },
    },
  },

  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    deploymentType: { type: 'string', description: 'self_hosted or cloud' },
    host: { type: 'string', description: 'Elasticsearch host URL' },
    cloudId: { type: 'string', description: 'Elastic Cloud ID' },
    authMethod: { type: 'string', description: 'api_key or basic_auth' },
    apiKey: { type: 'string', description: 'API key for authentication' },
    username: { type: 'string', description: 'Username for basic auth' },
    password: { type: 'string', description: 'Password for basic auth' },
    index: { type: 'string', description: 'Index name' },
    documentId: { type: 'string', description: 'Document ID' },
    document: { type: 'string', description: 'Document body as JSON' },
    query: { type: 'string', description: 'Search query as JSON' },
    size: { type: 'number', description: 'Number of results' },
    from: { type: 'number', description: 'Starting offset' },
    sort: { type: 'string', description: 'Sort specification as JSON' },
    sourceIncludes: { type: 'string', description: 'Fields to include' },
    sourceExcludes: { type: 'string', description: 'Fields to exclude' },
    operations: { type: 'string', description: 'Bulk operations as NDJSON' },
    settings: { type: 'string', description: 'Index settings as JSON' },
    mappings: { type: 'string', description: 'Index mappings as JSON' },
    refresh: { type: 'string', description: 'Refresh policy' },
    waitForStatus: { type: 'string', description: 'Wait for cluster status' },
    timeout: { type: 'string', description: 'Timeout for wait operations' },
    retryOnConflict: { type: 'number', description: 'Retry attempts on conflict' },
  },

  outputs: {
    // Search outputs
    hits: { type: 'json', description: 'Search results' },
    took: { type: 'number', description: 'Time taken in milliseconds' },
    timed_out: { type: 'boolean', description: 'Whether the operation timed out' },
    aggregations: { type: 'json', description: 'Aggregation results' },
    // Document outputs
    _index: { type: 'string', description: 'Index name' },
    _id: { type: 'string', description: 'Document ID' },
    _version: { type: 'number', description: 'Document version' },
    _source: { type: 'json', description: 'Document content' },
    result: { type: 'string', description: 'Operation result' },
    found: { type: 'boolean', description: 'Whether document was found' },
    // Bulk outputs
    errors: { type: 'boolean', description: 'Whether any errors occurred' },
    items: { type: 'json', description: 'Bulk operation results' },
    // Count outputs
    count: { type: 'number', description: 'Document count' },
    // Index outputs
    acknowledged: { type: 'boolean', description: 'Whether operation was acknowledged' },
    // Cluster outputs
    cluster_name: { type: 'string', description: 'Cluster name' },
    status: { type: 'string', description: 'Cluster health status' },
    number_of_nodes: { type: 'number', description: 'Number of nodes' },
    indices: { type: 'json', description: 'Index statistics' },
    nodes: { type: 'json', description: 'Node statistics' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: elevenlabs.ts]---
Location: sim-main/apps/sim/blocks/blocks/elevenlabs.ts

```typescript
import { ElevenLabsIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { ElevenLabsBlockResponse } from '@/tools/elevenlabs/types'

export const ElevenLabsBlock: BlockConfig<ElevenLabsBlockResponse> = {
  type: 'elevenlabs',
  name: 'ElevenLabs',
  description: 'Convert TTS using ElevenLabs',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate ElevenLabs into the workflow. Can convert text to speech.',
  docsLink: 'https://docs.sim.ai/tools/elevenlabs',
  category: 'tools',
  bgColor: '#181C1E',
  icon: ElevenLabsIcon,

  subBlocks: [
    {
      id: 'text',
      title: 'Text',
      type: 'long-input',
      placeholder: 'Enter the text to convert to speech',
      required: true,
    },
    {
      id: 'voiceId',
      title: 'Voice ID',
      type: 'short-input',
      placeholder: 'Enter the voice ID',
      required: true,
    },
    {
      id: 'modelId',
      title: 'Model ID',
      type: 'dropdown',
      options: [
        { label: 'eleven_monolingual_v1', id: 'eleven_monolingual_v1' },
        { label: 'eleven_multilingual_v2', id: 'eleven_multilingual_v2' },
        { label: 'eleven_turbo_v2', id: 'eleven_turbo_v2' },
        { label: 'eleven_turbo_v2_5', id: 'eleven_turbo_v2_5' },
        { label: 'eleven_flash_v2_5', id: 'eleven_flash_v2_5' },
        { label: 'eleven_v3', id: 'eleven_v3' },
      ],
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your ElevenLabs API key',
      password: true,
      required: true,
    },
  ],

  tools: {
    access: ['elevenlabs_tts'],
    config: {
      tool: () => 'elevenlabs_tts',
      params: (params) => ({
        apiKey: params.apiKey,
        text: params.text,
        voiceId: params.voiceId,
        modelId: params.modelId,
      }),
    },
  },

  inputs: {
    text: { type: 'string', description: 'Text to convert' },
    voiceId: { type: 'string', description: 'Voice identifier' },
    modelId: { type: 'string', description: 'Model identifier' },
    apiKey: { type: 'string', description: 'ElevenLabs API key' },
  },

  outputs: {
    audioUrl: { type: 'string', description: 'Generated audio URL' },
  },
}
```

--------------------------------------------------------------------------------

````
