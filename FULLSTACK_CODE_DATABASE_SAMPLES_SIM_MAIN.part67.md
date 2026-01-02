---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 67
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 67 of 933)

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

---[FILE: dropbox.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/dropbox.mdx

```text
---
title: Dropbox
description: Upload, download, share, and manage files in Dropbox
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dropbox"
  color="#0061FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Dropbox](https://dropbox.com/) is a popular cloud storage and collaboration platform that enables individuals and teams to securely store, access, and share files from anywhere. Dropbox is designed for easy file management, syncing, and powerful collaboration, whether you're working solo or with a group.

With Dropbox in Sim, you can:

- **Upload and download files**: Seamlessly upload any file to your Dropbox or retrieve content on demand
- **List folder contents**: Browse the files and folders within any Dropbox directory
- **Create new folders**: Organize your files by programmatically creating new folders in your Dropbox
- **Search files and folders**: Locate documents, images, or other items by name or content
- **Generate shared links**: Quickly create shareable public or private links for files and folders
- **Manage files**: Move, delete, or rename files and folders as part of automated workflows

These capabilities allow your Sim agents to automate Dropbox operations directly within your workflows — from backing up important files to distributing content and maintaining organized folders. Use Dropbox as both a source and destination for files, enabling seamless cloud storage management as part of your business processes.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Dropbox into your workflow for file management, sharing, and collaboration. Upload files, download content, create folders, manage shared links, and more.



## Tools

### `dropbox_upload`

Upload a file to Dropbox

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `path` | string | Yes | The path in Dropbox where the file should be saved \(e.g., /folder/document.pdf\) |
| `fileContent` | string | Yes | The base64 encoded content of the file to upload |
| `fileName` | string | No | Optional filename \(used if path is a folder\) |
| `mode` | string | No | Write mode: add \(default\) or overwrite |
| `autorename` | boolean | No | If true, rename the file if there is a conflict |
| `mute` | boolean | No | If true, don't notify the user about this upload |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `file` | object | The uploaded file metadata |

### `dropbox_download`

Download a file from Dropbox and get a temporary link

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `path` | string | Yes | The path of the file to download \(e.g., /folder/document.pdf\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `file` | object | The file metadata |

### `dropbox_list_folder`

List the contents of a folder in Dropbox

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `path` | string | Yes | The path of the folder to list \(use "" for root\) |
| `recursive` | boolean | No | If true, list contents recursively |
| `includeDeleted` | boolean | No | If true, include deleted files/folders |
| `includeMediaInfo` | boolean | No | If true, include media info for photos/videos |
| `limit` | number | No | Maximum number of results to return \(default: 500\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `entries` | array | List of files and folders in the directory |

### `dropbox_create_folder`

Create a new folder in Dropbox

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `path` | string | Yes | The path where the folder should be created \(e.g., /new-folder\) |
| `autorename` | boolean | No | If true, rename the folder if there is a conflict |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `folder` | object | The created folder metadata |

### `dropbox_delete`

Delete a file or folder in Dropbox (moves to trash)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `path` | string | Yes | The path of the file or folder to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | object | Metadata of the deleted item |

### `dropbox_copy`

Copy a file or folder in Dropbox

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `fromPath` | string | Yes | The source path of the file or folder to copy |
| `toPath` | string | Yes | The destination path for the copied file or folder |
| `autorename` | boolean | No | If true, rename the file if there is a conflict at destination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | object | Metadata of the copied item |

### `dropbox_move`

Move or rename a file or folder in Dropbox

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `fromPath` | string | Yes | The source path of the file or folder to move |
| `toPath` | string | Yes | The destination path for the moved file or folder |
| `autorename` | boolean | No | If true, rename the file if there is a conflict at destination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | object | Metadata of the moved item |

### `dropbox_get_metadata`

Get metadata for a file or folder in Dropbox

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `path` | string | Yes | The path of the file or folder to get metadata for |
| `includeMediaInfo` | boolean | No | If true, include media info for photos/videos |
| `includeDeleted` | boolean | No | If true, include deleted files in results |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | object | Metadata for the file or folder |

### `dropbox_create_shared_link`

Create a shareable link for a file or folder in Dropbox

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `path` | string | Yes | The path of the file or folder to share |
| `requestedVisibility` | string | No | Visibility: public, team_only, or password |
| `linkPassword` | string | No | Password for the shared link \(only if visibility is password\) |
| `expires` | string | No | Expiration date in ISO 8601 format \(e.g., 2025-12-31T23:59:59Z\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `sharedLink` | object | The created shared link |

### `dropbox_search`

Search for files and folders in Dropbox

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | The search query |
| `path` | string | No | Limit search to a specific folder path |
| `fileExtensions` | string | No | Comma-separated list of file extensions to filter by \(e.g., pdf,xlsx\) |
| `maxResults` | number | No | Maximum number of results to return \(default: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `matches` | array | Search results |



## Notes

- Category: `tools`
- Type: `dropbox`
```

--------------------------------------------------------------------------------

---[FILE: duckduckgo.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/duckduckgo.mdx

```text
---
title: DuckDuckGo
description: Search with DuckDuckGo
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="duckduckgo"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DuckDuckGo](https://duckduckgo.com/) is a privacy-focused web search engine that delivers instant answers, abstracts, related topics, and more — without tracking you or your searches. DuckDuckGo makes it easy to find information without any user profiling or targeted ads.

With DuckDuckGo in Sim, you can:

- **Search the web**: Instantly find answers, facts, and overviews for a given search query
- **Get direct answers**: Retrieve specific responses for calculations, conversions, or factual queries
- **Access abstracts**: Receive short summaries or descriptions for your search topics
- **Fetch related topics**: Discover links and references relevant to your search
- **Filter output**: Optionally remove HTML or skip disambiguation for cleaner results

These features enable your Sim agents to automate access to fresh web knowledge — from surfacing facts in a workflow, to enriching documents and analysis with up-to-date information. Because DuckDuckGo’s Instant Answers API is open and does not require an API key, it’s simple and privacy-safe to integrate into your automated business processes.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Search the web using DuckDuckGo Instant Answers API. Returns instant answers, abstracts, related topics, and more. Free to use without an API key.



## Tools

### `duckduckgo_search`

Search the web using DuckDuckGo Instant Answers API. Returns instant answers, abstracts, and related topics for your query. Free to use without an API key.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | The search query to execute |
| `noHtml` | boolean | No | Remove HTML from text in results \(default: true\) |
| `skipDisambig` | boolean | No | Skip disambiguation results \(default: false\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `heading` | string | The heading/title of the instant answer |
| `abstract` | string | A short abstract summary of the topic |
| `abstractText` | string | Plain text version of the abstract |
| `abstractSource` | string | The source of the abstract \(e.g., Wikipedia\) |
| `abstractURL` | string | URL to the source of the abstract |
| `image` | string | URL to an image related to the topic |
| `answer` | string | Direct answer if available \(e.g., for calculations\) |
| `answerType` | string | Type of the answer \(e.g., calc, ip, etc.\) |
| `type` | string | Response type: A \(article\), D \(disambiguation\), C \(category\), N \(name\), E \(exclusive\) |
| `relatedTopics` | array | Array of related topics with URLs and descriptions |



## Notes

- Category: `tools`
- Type: `duckduckgo`
```

--------------------------------------------------------------------------------

---[FILE: dynamodb.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/dynamodb.mdx

```text
---
title: Amazon DynamoDB
description: Connect to Amazon DynamoDB
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dynamodb"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon DynamoDB](https://aws.amazon.com/dynamodb/) is a fully managed NoSQL database service offered by AWS that provides fast and predictable performance with seamless scalability. DynamoDB lets you store and retrieve any amount of data and serves any level of request traffic, without the need for you to manage hardware or infrastructure.

With DynamoDB, you can:

- **Get items**: Look up items in your tables using primary keys
- **Put items**: Add or replace items in your tables
- **Query items**: Retrieve multiple items using queries across indexes
- **Scan tables**: Read all or part of the data in a table
- **Update items**: Modify specific attributes of existing items
- **Delete items**: Remove records from your tables

In Sim, the DynamoDB integration enables your agents to securely access and manipulate DynamoDB tables using AWS credentials. Supported operations include:

- **Get**: Retrieve an item by its key
- **Put**: Insert or overwrite items
- **Query**: Run queries using key conditions and filters
- **Scan**: Read multiple items by scanning the table or index
- **Update**: Change specific attributes of one or more items
- **Delete**: Remove an item from a table

This integration empowers Sim agents to automate data management tasks within your DynamoDB tables programmatically, so you can build workflows that manage, modify, and retrieve scalable NoSQL data without manual effort or server management.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Amazon DynamoDB into workflows. Supports Get, Put, Query, Scan, Update, and Delete operations on DynamoDB tables.



## Tools

### `dynamodb_get`

Get an item from a DynamoDB table by primary key

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `tableName` | string | Yes | DynamoDB table name |
| `key` | object | Yes | Primary key of the item to retrieve |
| `consistentRead` | boolean | No | Use strongly consistent read |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `item` | object | Retrieved item |

### `dynamodb_put`

Put an item into a DynamoDB table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `tableName` | string | Yes | DynamoDB table name |
| `item` | object | Yes | Item to put into the table |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `item` | object | Created item |

### `dynamodb_query`

Query items from a DynamoDB table using key conditions

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `tableName` | string | Yes | DynamoDB table name |
| `keyConditionExpression` | string | Yes | Key condition expression \(e.g., "pk = :pk"\) |
| `filterExpression` | string | No | Filter expression for results |
| `expressionAttributeNames` | object | No | Attribute name mappings for reserved words |
| `expressionAttributeValues` | object | No | Expression attribute values |
| `indexName` | string | No | Secondary index name to query |
| `limit` | number | No | Maximum number of items to return |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `items` | array | Array of items returned |
| `count` | number | Number of items returned |

### `dynamodb_scan`

Scan all items in a DynamoDB table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `tableName` | string | Yes | DynamoDB table name |
| `filterExpression` | string | No | Filter expression for results |
| `projectionExpression` | string | No | Attributes to retrieve |
| `expressionAttributeNames` | object | No | Attribute name mappings for reserved words |
| `expressionAttributeValues` | object | No | Expression attribute values |
| `limit` | number | No | Maximum number of items to return |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `items` | array | Array of items returned |
| `count` | number | Number of items returned |

### `dynamodb_update`

Update an item in a DynamoDB table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `tableName` | string | Yes | DynamoDB table name |
| `key` | object | Yes | Primary key of the item to update |
| `updateExpression` | string | Yes | Update expression \(e.g., "SET #name = :name"\) |
| `expressionAttributeNames` | object | No | Attribute name mappings for reserved words |
| `expressionAttributeValues` | object | No | Expression attribute values |
| `conditionExpression` | string | No | Condition that must be met for the update to succeed |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `item` | object | Updated item |

### `dynamodb_delete`

Delete an item from a DynamoDB table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `tableName` | string | Yes | DynamoDB table name |
| `key` | object | Yes | Primary key of the item to delete |
| `conditionExpression` | string | No | Condition that must be met for the delete to succeed |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |



## Notes

- Category: `tools`
- Type: `dynamodb`
```

--------------------------------------------------------------------------------

---[FILE: elasticsearch.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/elasticsearch.mdx

```text
---
title: Elasticsearch
description: Search, index, and manage data in Elasticsearch
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elasticsearch"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Elasticsearch](https://www.elastic.co/elasticsearch/) is a powerful distributed search and analytics engine that enables you to index, search, and analyze large volumes of data in real time. It’s widely used for powering search features, log and event data analytics, observability, and more.

With Elasticsearch in Sim, you gain programmatic access to core Elasticsearch capabilities, including:

- **Search documents**: Perform advanced searches on structured or unstructured text using Query DSL, with support for sorting, pagination, and field selection.
- **Index documents**: Add new documents or update existing ones in any Elasticsearch index for immediate retrieval and analysis.
- **Get, update, or delete documents**: Retrieve, modify, or remove specific documents by ID.
- **Bulk operations**: Execute multiple indexing or update actions in a single request for high-throughput data processing.
- **Manage indexes**: Create, delete, or get details about indexes as part of your workflow automation.
- **Cluster monitoring**: Check the health and stats of your Elasticsearch deployment.

Sim's Elasticsearch tools work with both self-hosted and Elastic Cloud environments. Integrate Elasticsearch into your agent workflows to automate data ingestion, search across vast datasets, run reporting, or build custom search-powered applications – all without manual intervention.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Elasticsearch into workflows for powerful search, indexing, and data management. Supports document CRUD operations, advanced search queries, bulk operations, index management, and cluster monitoring. Works with both self-hosted and Elastic Cloud deployments.



## Tools

### `elasticsearch_search`

Search documents in Elasticsearch using Query DSL. Returns matching documents with scores and metadata.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `index` | string | Yes | Index name to search |
| `query` | string | No | Query DSL as JSON string |
| `from` | number | No | Starting offset for pagination \(default: 0\) |
| `size` | number | No | Number of results to return \(default: 10\) |
| `sort` | string | No | Sort specification as JSON string |
| `sourceIncludes` | string | No | Comma-separated list of fields to include in _source |
| `sourceExcludes` | string | No | Comma-separated list of fields to exclude from _source |
| `trackTotalHits` | boolean | No | Track accurate total hit count \(default: true\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `took` | number | Time in milliseconds the search took |
| `timed_out` | boolean | Whether the search timed out |
| `hits` | object | Search results with total count and matching documents |
| `aggregations` | json | Aggregation results if any |

### `elasticsearch_index_document`

Index (create or update) a document in Elasticsearch.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `index` | string | Yes | Target index name |
| `documentId` | string | No | Document ID \(auto-generated if not provided\) |
| `document` | string | Yes | Document body as JSON string |
| `refresh` | string | No | Refresh policy: true, false, or wait_for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `_index` | string | Index where the document was stored |
| `_id` | string | Document ID |
| `_version` | number | Document version |
| `result` | string | Operation result \(created or updated\) |

### `elasticsearch_get_document`

Retrieve a document by ID from Elasticsearch.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `index` | string | Yes | Index name |
| `documentId` | string | Yes | Document ID to retrieve |
| `sourceIncludes` | string | No | Comma-separated list of fields to include |
| `sourceExcludes` | string | No | Comma-separated list of fields to exclude |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `_index` | string | Index name |
| `_id` | string | Document ID |
| `_version` | number | Document version |
| `found` | boolean | Whether the document was found |
| `_source` | json | Document content |

### `elasticsearch_update_document`

Partially update a document in Elasticsearch using doc merge.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `index` | string | Yes | Index name |
| `documentId` | string | Yes | Document ID to update |
| `document` | string | Yes | Partial document to merge as JSON string |
| `retryOnConflict` | number | No | Number of retries on version conflict |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `_index` | string | Index name |
| `_id` | string | Document ID |
| `_version` | number | New document version |
| `result` | string | Operation result \(updated or noop\) |

### `elasticsearch_delete_document`

Delete a document from Elasticsearch by ID.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `index` | string | Yes | Index name |
| `documentId` | string | Yes | Document ID to delete |
| `refresh` | string | No | Refresh policy: true, false, or wait_for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `_index` | string | Index name |
| `_id` | string | Document ID |
| `_version` | number | Document version |
| `result` | string | Operation result \(deleted or not_found\) |

### `elasticsearch_bulk`

Perform multiple index, create, delete, or update operations in a single request for high performance.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `index` | string | No | Default index for operations that do not specify one |
| `operations` | string | Yes | Bulk operations as NDJSON string \(newline-delimited JSON\) |
| `refresh` | string | No | Refresh policy: true, false, or wait_for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `took` | number | Time in milliseconds the bulk operation took |
| `errors` | boolean | Whether any operation had an error |
| `items` | array | Results for each operation |

### `elasticsearch_count`

Count documents matching a query in Elasticsearch.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `index` | string | Yes | Index name to count documents in |
| `query` | string | No | Optional query to filter documents \(JSON string\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `count` | number | Number of documents matching the query |
| `_shards` | object | Shard statistics |

### `elasticsearch_create_index`

Create a new index with optional settings and mappings.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `index` | string | Yes | Index name to create |
| `settings` | string | No | Index settings as JSON string |
| `mappings` | string | No | Index mappings as JSON string |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | Whether the request was acknowledged |
| `shards_acknowledged` | boolean | Whether the shards were acknowledged |
| `index` | string | Created index name |

### `elasticsearch_delete_index`

Delete an index and all its documents. This operation is irreversible.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `index` | string | Yes | Index name to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | Whether the deletion was acknowledged |

### `elasticsearch_get_index`

Retrieve index information including settings, mappings, and aliases.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `index` | string | Yes | Index name to retrieve info for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `index` | json | Index information including aliases, mappings, and settings |

### `elasticsearch_cluster_health`

Get the health status of the Elasticsearch cluster.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |
| `waitForStatus` | string | No | Wait until cluster reaches this status: green, yellow, or red |
| `timeout` | string | No | Timeout for the wait operation \(e.g., 30s, 1m\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `cluster_name` | string | Name of the cluster |
| `status` | string | Cluster health status: green, yellow, or red |
| `number_of_nodes` | number | Total number of nodes in the cluster |
| `number_of_data_nodes` | number | Number of data nodes |
| `active_shards` | number | Number of active shards |
| `unassigned_shards` | number | Number of unassigned shards |

### `elasticsearch_cluster_stats`

Get comprehensive statistics about the Elasticsearch cluster.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Yes | Deployment type: self_hosted or cloud |
| `host` | string | No | Elasticsearch host URL \(for self-hosted\) |
| `cloudId` | string | No | Elastic Cloud ID \(for cloud deployments\) |
| `authMethod` | string | Yes | Authentication method: api_key or basic_auth |
| `apiKey` | string | No | Elasticsearch API key |
| `username` | string | No | Username for basic auth |
| `password` | string | No | Password for basic auth |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `cluster_name` | string | Name of the cluster |
| `status` | string | Cluster health status |
| `nodes` | object | Node statistics including count and versions |
| `indices` | object | Index statistics including document count and store size |



## Notes

- Category: `tools`
- Type: `elasticsearch`
```

--------------------------------------------------------------------------------

---[FILE: elevenlabs.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/elevenlabs.mdx

```text
---
title: ElevenLabs
description: Convert TTS using ElevenLabs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elevenlabs"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[ElevenLabs](https://elevenlabs.io/) is a state-of-the-art text-to-speech platform that creates incredibly natural and expressive AI voices. It offers some of the most realistic and emotionally nuanced synthetic voices available today, making it ideal for creating lifelike audio content.

With ElevenLabs, you can:

- **Generate natural-sounding speech**: Create audio that's nearly indistinguishable from human speech
- **Choose from diverse voice options**: Access a library of pre-made voices with different accents, tones, and characteristics
- **Clone voices**: Create custom voices based on audio samples (with proper permissions)
- **Control speech parameters**: Adjust stability, clarity, and emotional tone to fine-tune output
- **Add realistic emotions**: Incorporate natural-sounding emotions like happiness, sadness, or excitement

In Sim, the ElevenLabs integration enables your agents to convert text to lifelike speech, enhancing the interactivity and engagement of your applications. This is particularly valuable for creating voice assistants, generating audio content, developing accessible applications, or building conversational interfaces that feel more human. The integration allows you to seamlessly incorporate ElevenLabs' advanced speech synthesis capabilities into your agent workflows, bridging the gap between text-based AI and natural human communication.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate ElevenLabs into the workflow. Can convert text to speech.



## Tools

### `elevenlabs_tts`

Convert TTS using ElevenLabs voices

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Yes | The text to convert to speech |
| `voiceId` | string | Yes | The ID of the voice to use |
| `modelId` | string | No | The ID of the model to use \(defaults to eleven_monolingual_v1\) |
| `apiKey` | string | Yes | Your ElevenLabs API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | The URL of the generated audio |
| `audioFile` | file | The generated audio file |



## Notes

- Category: `tools`
- Type: `elevenlabs`
```

--------------------------------------------------------------------------------

````
